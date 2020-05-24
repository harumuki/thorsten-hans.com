---
title: "Azure Arc enabled Kubernetes: Digital Ocean Kubernetes in Azure"
layout: post
permalink: azure-arc-enabled-kubernetes-digital-ocean
published: true
date: 2020-05-24 08:00:00
tags: 
  - Azure
  - AKS
  - Azure Arc
excerpt: "Use Azure Arc to manage your Digital Ocean Kubernetes cluster in Microsoft Azure. Learn to connect, tag and query Azure Arc enabled Kubernetes."
image: /azure-arc-enabled-kubernetes.jpg
unsplash_user_name: Taylor Vick
unsplash_user_ref: tvick
---

Dugin Microsoft Build Conference 2020, Microsoft demonstrated Azure Arc enabled Kubernetes, which allows you to connect and manage external Kubernetes clusters in Azure.

By attaching your existing Kubernetes clusters to Azure, you can use all the Azure goodness to control external clusters like any other internal Azure resource. Once connected, you can do certain things with the external Kubernetes cluster, like for example:

- Add it to given Resource Groups
- Categorize it using Tags
- Access it via Azure Resource Graph
- Apply Azure Policies to it
- Protect with Azure Security Center
- Collect metrics using Azure Monitor
- Define cluster and application configuration with GitOps

This post explains how to connect a Kubernetes cluster running in Digital Ocean to your Azure Subscription by leveraging Azure Arc. Once connected, we will add some tags to the external cluster and query it using Azure Resource Graph to verify the connection.

**Table of Contents**

- [Requirements](#requirements)
  - [Cluster Networking Requirements](#cluster-networking-requirements)
  - [Azure CLI Requirements For Azure Arc Enabled Kubernetes](#azure-cli-requirements-for-azure-arc-enabled-kubernetes)
- [Connect the external Kubernetes cluster using Azure Arc](#connect-the-external-kubernetes-cluster-using-azure-arc)
- [Verify cluster connection](#verify-cluster-connection)
- [Assign Azure Tags to the external cluster](#assign-azure-tags-to-the-external-cluster)
- [Query Azure Arc Enabled Kubernetes With Azure Resource Graph](#query-azure-arc-enabled-kubernetes-with-azure-resource-graph)
- [Delete Resources](#delete-resources)
- [Conclusion](#conclusion)

---

## Requirements

I assume that you already have an existing Kubernetes cluster on Digital Ocean. Also, verify that `kubectl` points to it. You can ask for the current context using `kubectl`.

```bash
# list all contexts for kubectl
kubectl config get-contexts

# modify current kubectl context
kubectl config set-context <NAME>

```

### Cluster Networking Requirements

Azure Arc agents (which will be deployed to your Kubernetes) must be able to communicate to Azure's service endpoints. Verify that your network policies allow outgoing traffic for the following ports:

- TCP port `443` for `https`
- TCP port `9418` for `git`

If you want more fine granular control, you can limit outgoing connections using custom Network Policies for the Azure Arc agents, that will be deployed to the `azure-arc` namespace in your cluster.

- `https://management.azure.com`: Required for the agents to connect to Azure and register the cluster
- `https://eastus.dp.kubernetesconfiguration.azure.com` and `https://westeurope.dp.kubernetesconfiguration.azure.com`:  The endpoint for the agents to push status and fetch configuration information (depends on choosen location)
- `https://login.microsoftonline.com`: Required to fetch and update Azure Resource Manager tokens
- `https://azurearcfork8s.azurecr.io`: Required to pull Docker images for Azure Arc agents
- `https://gcr.io`: Required to pull Kube RBAC Docker image

### Azure CLI Requirements For Azure Arc Enabled Kubernetes

Azure Arc is still in preview. You have to install several providers and preview extensions in Azure CLI, to get access to all the required commands. Provider registration in Azure CLI is asynchronous. Execute the registration and wait for them to finish.

```bash
# register the Azure CLI providers
az provider register --namespace Microsoft.Kubernetes
az provider register --namespace Microsoft.KubernetesConfiguration

```

As mentioned in the output of each registration, you can check the status of the registrations using  `az provider show`.

```bash
# verify Azure CLI provider registration
az provider show -n Microsoft.Kubernetes
az provider show -n Microsoft.KubernetesConfiguration

```

Wait for both registrations to be in state `Registered`. Once all providers are registered in Azure CLI, you can install the required extensions in Azure CLI.

```bash
# install required extensions
az extension add --name connectedk8s
az extension add --name k8sconfiguration

```

If you have already installed the required extensions, you should verify that you're using the latest version by updating both extensions.

```bash
# update Azure CLI extensions
az extension update --name connectedk8s
az extension update --name k8sconfiguration

```

## Connect the external Kubernetes cluster using Azure Arc

To attach an external Kubernetes cluster, you have to use the `az connectedk8s connect` command. The command not only provisions a Connected Cluster to the desired Azure Resource Group but also deploys required artifacts to your existing Kubernetes instances. The command deploys all necessary parts into a dedicated Namespace called `azure-arc`. However, let's first create a new Azure Resource Group, where we will place our external Kubernetes cluster.

```bash
# create Azure Resource Groupe (currently West Europe and East US only)
az group create -n rg-arc-enabled-kubernetes -l westeurope

```

Once the Resource Group is provisioned, we can connect the Kubernetes cluster using Azure Arc. Again, remember that the following command will deploy artifacts to the currently configured context of `kubectl`.

```bash
# connect Kubernetes from Digital ocean
az connectedk8s connect --name digital-ocean-k8s -g rg-arc-enabled-kubernetes

```

The `connectedk8s connect` command can take several minutes to finish. Behind the scenes, it deploys all necessary artifacts to the Kubernetes cluster running in Digital Ocean.

We can use `kubectl` to inspect our Kubernetes cluster:

```bash
# list namespaces
kubectl get ns

# list deployments in the namespace
kubectl get deploy -n azure-arc

# list pods in the namespace
kubectl get po -n azure-arc

```

## Verify cluster connection

To verify the connection of the external cluster, we can use `az connectedk8s list`. Scope it to the Resource Group, to get a list of all external Kubernetes clusters within that context.

```bash
# list all resources from the Resource Group
az connectedk8s list -g rg-arc-enabled-kubernetes

```

At this point - may be due to the preview status of Azure Arc - we are not able to access the Overview Blade in Azure Portal. Azure Portal presents an error message, explaining that tags are missing on the external resource.

{% include image-caption.html imageurl="/assets/images/posts/2020/azure-arc-kubernetes-digital-ocean-1.png"
title="Azure Arc Kubernetes on Digital Ocean - Azure Portal" caption="Azure Portal errors because of missing tags" %}

Let's fix this next, to access the external cluster also in Azure Portal.

## Assign Azure Tags to the external cluster

Assigning tags to an external Kubernetes cluster is not different from assigning tags to any other Azure resource. You can either use the Azure Portal, Azure PowerShell or Azure CLI to do so.

```bash
# get ARC enabled Kubernetes Id
ARC_K8S_ID=$(az connectedk8s show --name digital-ocean-k8s -g rg-arc-enabled-kubernetes -o tsv --query id)

# assign tags to the external cluster
az resource tag --tags 'responsible=Thorsten Hans' 'cloud-vendor=Digital Ocean' --ids $ARC_K8S_ID

```

Having tags assigned, Azure Portal can display the cluster overview, where you will get the necessary information about the cluster like the Kubernetes version it is running on.

{% include image-caption.html imageurl="/assets/images/posts/2020/azure-arc-kubernetes-digital-ocean-2.png"
title="Azure Arc Kubernetes on Digital Ocean - Azure Portal" caption="Azure Portal shows metadata from Kubernetes on Digital Ocean" %}

## Query Azure Arc Enabled Kubernetes With Azure Resource Graph

You are also able to query Azure Arc enabled Kubernetes cluster with Azure Resource Graph. It is excellent for integration scenarios with - for example - existing inventory systems.

To use Azure Resource Graph in Azure CLI, you have to install the corresponding extension. Execute `az extension add --name resource-graph`. Once the extension is installed, go ahead, and query for all your Azure Arc enabled Kubernetes clusters:

```bash
# create a KQL Query
QUERY="Resources | project name, location, type,
  kubernetes=properties.kubernetesVersion, responsible=tags.responsible
  | where type =~ 'microsoft.kubernetes/connectedclusters'"

# Execute Query using az graph
az graph query -q $QUERY

Kubernetes    Location    Name               Responsible
------------  ----------  -----------------  -------------
1.17.5        westeurope  digital-ocean-k8s  Thorsten Hans

```

## Delete Resources

Removing an Azure Arc enabled Kubernetes from your Azure subscription is straightforward. You use the `connectedk8s delete` command, which will also retract all resources from the Kubernetes cluster in Digital Ocean.

```bash
# delete Azure Arc enabled Kubernetes from Azure
az connectedk8s delete --name digital-ocean-k8s -g rg-arc-enabled-kubernetes

```

Inspect your Kubernetes cluster and see the `azure-arc` namespace being deleted using `kubectl get ns`.

## Conclusion

Azure Arc enabled Kubernetes cluster is a massive step towards managing multi-cloud environments. Microsoft Azure provides first-class management capabilities. Your organization can benefit from well-known governance and inventory capabilities offered by Azure. I think Azure Arc enabled Kubernetes is beneficial for companies with existing on-premises environments because they can still use already paid servers and start moving their infrastructure management into the public cloud.
