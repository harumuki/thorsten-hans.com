---
title: Azure Key Vault FlexVolume for Kubernetes  —  A journey to integrate Azure Key Vault and AKS
layout: post
permalink: azure-key-vault-flexvolume-for-kubernetes
published: true
tags: [Kubernetes,Azure,Azure Key Vault,AKS]
excerpt: Integrate Azure Key Vault and Azure Kubernetes services without leaking sensitive configuration data such as Service Principal credentials by using Azure AD Pod Identity and Azure Key Vault FlexVolume for Kubernetes
image: /2018-12-10-azure-key-vault-flexvolume-for-kubernetes-e2-80-8a--e2-80-8aa-journey-to-integrate-azure-key-vault-and-aks.jpg
---
This is the second part of the mini-series on Integrating *Azure Key Vault* and *AKS* (Azure Kubernetes Services). If you missed the [first part]({% post_url 2018-12-06-azuread-pod-identity-in-aks-a-journey-to-integrate-azure-key-vault%}), you should definitely read it before digging into this article.

## Introducing Azure Key Vault FlexVolume for Kubernetes

*Azure Key Vault FlexVolume for Kubernetes* is a driver that allows you to consume typed data from *Azure Key Vault* (like secrets, keys or certificates) and attach that data directly to Pods. You can find the project itself [directly on GitHub](https://github.com/Azure/kubernetes-keyvault-flexvol){:target="_blank"}.

> If you're not familiar with Kubernetes FlexVolumes check the following readme on *FlexVolume* here

As a Developer, you'll benefit from using the *Azure Key Vault FlexVolume* in different ways. First, you can read sensitive data at runtime directly from your container's filesystem. This also means you don't have to use any kind of additional client-side library to consume data from the *Azure Key Vault*.

Another quiet important benefit will be, that you don't have to deal with any kind of access-token or *Service Principal* credential manually. *Azure Key Vault FlexVolume driver* can take care of that.

As a cluster administrator, you can choose between two different authentication mechanisms. Either you can use a *Service Principal* (which will be provided through plain old Kubernetes secrets) or you can use the previously introduced *AAD Pod Identity* which will be — as you'll see in a couple of minutes — more flexible and more secure because you don't have to store the unencrypted combination of *Service Principal* Identifier and -Secret somewhere.

## Installing Azure Key Vault FlexVolume

To Install *Azure Key Vault FlexVolume* just create the required resources by applying the deployment from the GitHub repository

```bash
kubectl create -f https://raw.githubusercontent.com/Azure/kubernetes-keyvault-flexvol/master/deployment/kv-flexvol-installer.yaml

```

The deployment will add a new *Namespace* to your *Kubernetes* cluster called `kv`. The driver itself is implemented as _DaemonSet_, so you'll end up having one `keyvault` Pod per physical node in your cluster.

## Configuring Azure Key Vault and Azure Identity

In part one of the series, you've created an *Azure Identity*. That identity needs to have access to an Azure Key Vault instance and -  of course  - that Azure Key Vault should hold some sensitive data. If your Key Vault is already holding sensitive data, you can skip the first snippet and immediately move on and grant your Azure Identity access to the Key Vault and its data.

```bash
az keyvault secret set
  --vault-name demokv
  --name sample1
  --value "1st sensitive value"

az keyvault secret set
  --vault-name demokv
  --name sample2
  --value "2nd sensitive value"

```

The Azure Identity you've created in the previous article requires **GET Secret permission** in order to read the sensitive configuration values at runtime, this could be achieved using the following script

```bash
$PrincipalID = az identity show
  --name demo_pod_identity
  --resource-group demo-resource-group
  --output json
  --query principalId

$ClientID = az identity show
  --name demo_pod_identity
  --resource-group demo-resource-group
  --output json
  --query clientId

$keyVaultID = az keyvault show
  --name demokv
  --resource-group demo-resource-group
  --output json
  --query id

# Grant general KeyVault access to the Azure Identity

az role assignment create
   --role Reader
   --assignee $PrincipalID
   --scope $keyVaultID

# Grant GET Secret access to the Azure Identity

az keyvault set-policy
   --name demokv
   --secret-permissions get
   --spn $ClientID

```

## Create a demo Docker Image

As described during the introduction, the Azure KeyVault FlexVolume will take secrets from Azure Key Vault and make them available inside of containers. The value from every secret is written to an individual file in the specified `volumeMount`. In order to verify the entire setup of *AAD Pod Identity* and *Azure Key Vault FlexVolume for Kubernetes*, we will now create a simple `nginx` Docker Image and use it later to examine the container and read the secret values at runtime.

```dockerfile
FROM alpine/latest
LABEL maintainer="Thorsten Hans <thorsten.hans@gmail.com>"
CMD ["cat", "/kv/mysecret"]

```

> I'll build the image using my repository personal identifier in order to publish it to the public Docker Hub. 

No matter if you want to use public Docker Hub or any private Docker Registry (such as *Azure Container Registry*), just ensure using the proper prefix for your Docker image.

```bash
docker build . -t thorstenhans/aks-keyvault-sample:latest
docker login

docker push thorstenhans/aks-keyvault-sample:latest

```

Hey! You just received a ✅ for the Docker Image. Next on the list is the Kubernetes Pod.

## Creating the Pod definition

First, let's start with a regular Pod definition that takes our Docker Image and adds some essential metadata:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: aks-kv-sample-pod
  labels:
    app: aks-kv-demo
    aadpodidbinding: "demo_app"
spec:
  containers:
    - name: aks-kv-container
      image: thorstenhans/aks-keyvault-sample:latest
      imagePullPolicy: Always

```

Did you recognize the `aadpodidbinding` label? It has to exactly the same as you provided for the Azure Identity Binding in the [first article of this series]({% post_url 2018-12-06-azuread-pod-identity-in-aks-a-journey-to-integrate-azure-key-vault %}). In order to connect the Azure Key Vault FlexVolume, we will use the well-known concept of `volumes` and `volumeMounts` from Kubernetes.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: aks-kv-sample-pod
  labels:
    app: aks-kv-demo
    aadpodidbinding: "backend"
spec:
  containers:
    - name: aks-kv-container
      image: thorstenhans/aks-keyvault-sample:latest
      imagePullPolicy: Always
      volumeMounts:
        - name: kvVolume
          mountPath: /kv
          readOnly: true
  volumes:
    - name: kvVolume
      flexVolume:
        driver: "azure/kv"
        options:
          usepodidentity: "true"
          keyvaultname: "demokv"
          keyvaultobjectnames: "sample1;sample2"
          keyvaultobjecttypes: "secret;secret"
          resourcegroup: "demo-resource-group"
          subscriptionid: "00000000-0000-0000-0000-000000000000"
          tenantid: "00000000-0000-0000-0000-000000000000"

```

Examine the `flexVolume` object in the `volumes` array. A lot of interesting information is defined here:
`usepodidentity` is set to `true`, which will tell the driver to use an Azure AD Pod Identity. You can use Azure KeyVault FlexVolume with a Service Principal (specified as k8s secret) by omitting the `usepodidentity` property or providing `false` as its value.

The Azure Key Vault itself is specified from the combination of four properties:

- `keyvaultname`: Key Vault's custom domain name prefix
- `resourcegroup`: Key Vault's Azure-Resource-Group name
- `subscriptionid`: Key Vault's Azure-Subscription Identifier
- `tenantid`: Key Vault's Azure-Tenant Identifier

You may ask yourself why you've to specify all of those because some of them can easily be inferred from the current context. But driver wants to ensure that you can also pull data from Azure Key Vault instances belonging to different Resource Groups or even Subscriptions.

Since the version `0.0.6` of the Azure Key Vault FlexVolume driver has been released, you can pull multiple secrets, keys or certificates to a single volume by providing them as a semicolon separated list for `keyvaultobjectnames` and `keyvaultobjecttypes`.
However, if you're using an older version of the driver, you can pull only one value per volume. To specify the value, you've to use the singular property names: `keyvaultobjectname` and `keyvaultobjecttype`.

## Verify the Azure Key Vault integration

Finally! 🙌 Everything is in place and you're ready for a test run. Deploy the Kubernetes resources to your cluster with `kubectl create -f Deployment.yaml` and wait for the Pod to report Status: Running.
As soon as the Pod is in the state "running" you can go into the container and examine the local `/kv` folder, which will show a file per Secret holding the corresponding value. 🚀

```bash
kubectl exec -it aks-kv-sample-pod sh

/ # cd /kv

/kv # ls
sample1 sample2

/kv # cat sample1
1st sensitive value

/kv # cat sample2
2nd sensitive value

```

Wow, that was a blast! But if you've followed all the instructions, you should now be able to pull secrets, keys, and certificates from Azure Key Vault using Azure AD Pod Identity and Azure Key Vault FlexVolume for Kubernetes.
I've also published [this sample on GitHub](https://github.com/ThorstenHans/aks-keyvault){:target="_blank"}. If you're having trouble getting this up and running on your AKS instance, either use the comment area below or create an Issue on the sample repository.

## Recap

Both, *Azure AD Pod Identity* and *Azure Key Vault FlexVolume for Kubernetes* are still in an early and very active stage. Things change quickly in both projects. Check the source repositories frequently to see how those projects are maturing.

Having the combination of both projects is finally an idea of how to answer an important question in the Kubernetes space — dealing with sensitive configuration data without using Kubernetes secrets due to their lack of encryption.

The Azure Key Vault FlexVolume [team mentioned that this project is ready for use in production environments](https://github.com/Azure/kubernetes-keyvault-flexvol/issues/30){:target="_blank"}. This may be the truth if you're using a Service Principal, but at least from my point of view, the underlying Azure AD Pod Identity project has to stabilize before I would use it in a production environment. In addition, both projects need some more documentation. There is too much room for speculation right now, so it's a kind of necessary to dive into the code and verify how things are wired up.
