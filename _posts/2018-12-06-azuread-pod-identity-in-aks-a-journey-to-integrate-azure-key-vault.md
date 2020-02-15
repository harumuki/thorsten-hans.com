---
title: 'AzureAD Pod Identity in AKS: A journey to integrate Azure Key Vault'
layout: post
permalink: azuread-pod-identity-aks-integrate-azure-keyvault
published: true
tags: [Kubernetes,Azure,Azure Key Vault,Azure Kubernetes Service]
excerpt: 'With Azure AD Pod Identity you can finally run any pod in an Azure Kubernetes Service in the context of an external, loosely coupled Azure Identity. This builds the foundation for a seamless integration of Azure Key Vault and AKS'
image: /2018-12-06-azuread-pod-identity-in-aks-a-journey-to-integrate-azure-key-vault.jpg
---
Back in May, I wrote an article on how to integrate Azure Key Vault with ACS. Since that, a lot happened in the Azure and Kubernetes space and I thought an updated version would be worth sharing because dealing correctly with sensitive data is **essential**.

This is the first of two separate articles, that will guide you through the complete setup and configuration process to integrate *Azure Kubernetes Services* and *Azure Key Vault* securely without leaking essential data about your *Service Principal*.

If you don't know *Azure Key Vault* yet, [check out this post]({{" integrating-azure-keyvault-with-azure-container-services" | abbsolute_url }}). There is also a quick Key Vault introduction and some scripts that ensure you're up and running.

At this point, you should have basic knowledge about Azure Key Vault and it's time to look into some new stuff, created by the Azure Team and the community.

## Azure AD Pod Identity

With *AAD Pod Identity*, the team made a huge step towards seamless *Kubernetes* and Azure integration. AAD Pod Identity allows you to execute Pods in the security context of an Azure Identity. That identity will be dynamically assigned to **any pod** that is matching certain requirements.

Integrations with Azure services  - such as *Azure Key Vault * - will become way easier and way more flexible with Azure AD Pod Identity.

Cluster Administrators can easily switch underlying *Azure Identities* to swap Pods from one Identity to another. This can happen at runtime without having a developer doing any changes to application code.

## Enabling AAD Pod Identity on AKS

Okay, time to get some work done. Let's enable Azure AD Pod Identity on an AKS cluster. First, you've to install the AAD Pod Identity infrastructure on your cluster. There are two different deployments available, the default one:

```bash
kubectl create -f https://raw.githubusercontent.com/Azure/aad-pod-identity/master/deploy/infra/deployment.yaml

```

And a slightly different deployment, that should you use if your cluster has RBAC (Role Based Access Control) enabled

```bash
kubectl create -f https://raw.githubusercontent.com/Azure/aad-pod-identity/master/deploy/infra/deployment-rbac.yaml

```

Once deployment is finished, you'll end up in having two new resources deployed on your cluster

- Managed Identity Controller (MIC)
- Node Managed Identity (NMI)
  
*MIC* is responsible for binding Azure Identities to pods. The *NMI* will act like an interceptor which observes incoming requests for your pods and will call back into Azure (by using ADAL) to acquire an access token from Azure AD to communicate with Azure APIs  - such as Azure Key Vault  - in behalf of that Azure Identity.

## Creating a new Azure Identity

Now it's time to create the Azure Identity using Azure CLI

```bash
az identity create
  -g demo-resource-group
  -n demo_pod_identity
  -o json
```

This command will produce a response similar to this

```json
{
  "clientId": "00000000-0000-0000-0000-000000000000",
  "clientSecretUrl": "...",
  "id": "/subscriptions/00000000-0000-0000...",
  "name": "demo_pod_identity",
  "principalId": "00000000-0000-0000-0000-000000000000",
  "resourceGroup": "demo-resource-group",
  "tenantId": "00000000-0000-0000-0000-000000000000",
  "type": "Microsoft.ManagedIdentity/userAssignedIdentities"
}
```

Grab the `principalId` and assign the `Reader` role for the targeting Resource Group (the resource group where you've placed your Azure Key Vault instance) to that identity

```bash
az role assignment create
  --role Reader
  --assignee <your_principal_id_goes_here>
  --scope /subscriptions/<subscriptionid>/resourcegroups/demo-resource-group

```

Next, the underlying *Service Principal* of your *AKS* instance needs permissions to act as *Managed Identity Operator*. That's required because *MIC* will try to acquire the access token for that *Azure Identity*. This “authentication” call will be issued in the security context of the AKS cluster, so you've to create another role assignment to get that working. In this case, the scope is the unique identifier from the Azure Identity you've created a minute ago.

```bash
az role assignment create
  --role "Managed Identity Operator"
  --assignee <aks_service_principal_id_here>
  --scope <azure_identitys_id>

```

## Deploying an Azure Identity to AKS

Everything is in place now, so it's time to deploy some Kubernetes resources and bring the *AAD Pod Identity* to *AKS*.

```yaml
apiVersion: "aadpodidentity.k8s.io/v1"
kind: AzureIdentity
metadata:
  name: demo_aks_pod_id
spec:
  type: 0
  ResourceID: /subscriptions//reso.../demo_pod_identity
  ClientID: 00000000-0000-0000-0000-000000000000

```

There are a couple of interesting things in this small yaml file, that I want to explain quickly

 1. Obviously, `name` is used later on to identify the instance of `AzureIdentity`
 2. `spec.type` is set to `0` which represents a *Managed Service Identity* (MSI). `spec.type` could also be set to `1`, which tells the *AAD Pod Identity* infrastructure that you want to use a *Service Principal* instead of an *Azure Identity*.
 3. `ResourceId` is the `id` value, taken from your *Azure Identity*.
 4. `ClientId` is the `clientId` value, taken from your *Azure Identity*.

Deploy the yaml file to your AKS by executing

```bash
kubectl create -f aad_identity.yaml

```

## Adding an AAD Identity binding to AKS

Once the identity is in place, it's time to create a *binding* for it. The binding will be used to assign the identity to a range of Pods.

```yaml
apiVersion: "aadpodidentity.k8s.io/v1"
kind: AzureIdentityBinding
metadata:
  name: demo_aad_identity_binding
spec:
  AzureIdentity: demo_aks_pod_id
  Selector: demo_app
```

In this `yaml` file, the `Selector` property is the most important one. It is used to identify which Pods should run in the context of the linked `AzureIdentity`. The binding needs also to be deployed to AKS using `kubectl create`.

```bash
kubectl create -f aad_identity_binding.yaml

```

## Updating Pod definitions

Instructing Pods to use your custom Azure Identity is fairly easy. The `Selector` property from the Azure Identity Binding is used for the dynamic linking. Take an existing Pod specification and add a new label. Set its name to `aadpodidbinding` and the value to `demo_app`.

> At the point of writing this article, Azure Identity Binding is unfortunately not using regular Kubernetes label selection mechanism at this point. But there are already discussions about that on GitHub.

Consider a simple *Hello World* image that should be executed in the security context of the Azure Identity previously created:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: sample-pod
  labels:
    aadpodidbinding: demo_app
spec:
  restartPolicy: Never
  containers:
    - name: auditlog-cleaner 
      image: microsoft/dotnet:2.1-aspnetcoreruntime

```

Deploy the Pod to AKS using `kubectl create -f pod.yaml`

## Verify Azure Identity Binding

The setup and configuration can be verified by consulting the logs from the *NMI* and *MIC* pods that were deployed to your cluster's `default` namespace. As mentioned during the article, the *MIC* is responsible for attaching Azure Identities to Pods. So that's the first resource you should look at.

In the case of misspelling something, you'll find errors in the *MIC's log*. However, if you configured everything correctly, logs will show messages similar to


`'binding applied' Binding demo_aad_identity_binding applied on node aks-default-00000000-2 for pod sample-pod-000000000-0000`

## Azure AD Pod Identity pitfalls and glitches

*Azure AD Pod Identity* is an open source project that is really active and moving forward quickly, there are a lot of active discussions on the GitHub issue tracker and there are several things you've to keep in mind when implementing Azure AD Pod Identity today. I want to share my top three glitches here.

- Azure AD Pod Identity is currently bound to the default namespace. Deploying an Azure Identity and it's binding to other namespaces, will not work!
- Pods from all namespaces can be executed in the context of an Azure Identity deployed to the default namespace (related to point 1)
- Every Pod Developer can add the `aadpodidbinding` label to his/her pod and use your Azure Identity
- Azure Identity Binding is not using default Kubernetes label selection mechanism
  
You should definitely keep those glitches in mind when implementing it on your cluster!

## Recap

Azure AD Pod Identity allows you to bind Pods to an Azure Identity that is managed outside of your cluster. The concept looks really promising, but there is still some work that needs to be done to make it rock solid. Although it's not yet production ready — from my point of view — you should definitely watch the project and read the second part of the mini-series to see how a potential Azure Key Vault integration in AKS can look like.
