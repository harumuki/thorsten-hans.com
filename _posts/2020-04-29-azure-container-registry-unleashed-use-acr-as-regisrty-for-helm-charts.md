---
title: Azure Container Registry Unleashed – Use ACR as Registry for Helm charts
layout: post
permalink: azure-container-registry-unleashed-use-acr-as-registry-for-helm-charts
published: true
tags: 
  - Azure
  - Docker
  - Azure Container Registry
  - Helm
excerpt: "The seventh part of ACR Unleashed teaches how to manage and distribute Helm charts using Azure Container Registry"
image: /acr-unleashed.jpg
unsplash_user_name: Thais Morais
unsplash_user_ref: tata_morais
---

The seventh and last part of _Azure Container Registry Unleashed_ is about housing [Helm](https://helm.sh){:target="_blank"} charts in ACR. This post explains how to use ACR as a protected Registry for Helm charts. We walk through the process of creating, publishing, and consuming a sample chart from ACR. However, if you have not used or seen Helm 3 before, consider reading my "[Getting started with Helm 3]({% post_url 2020-04-22-getting-started-with-helm3 %}){:target="_blank"}" article first.

---

- [What are OCI and OCI artifacts](#what-are-oci-and-oci-artifacts)
- [Prerequisites](#prerequisites)
- [Authenticate Helm CLI against ACR](#authenticate-helm-cli-against-acr)
- [Enable OCI support in Helm CLI](#enable-oci-support-in-helm-cli)
- [Prepare Helm charts for publishing to ACR](#prepare-helm-charts-for-publishing-to-acr)
- [Push a Helm chart to ACR](#push-a-helm-chart-to-acr)
- [Pull a Helm chart from ACR](#pull-a-helm-chart-from-acr)
- [Export Helm chart once pulled](#export-helm-chart-once-pulled)
- [Deploy the Helm chart to AKS](#deploy-the-helm-chart-to-aks)
- [Azure CLI Commands for Helm charts](#azure-cli-commands-for-helm-charts)
- [Recap](#recap)
- [The Azure Container Registry Unleashed series](#the-azure-container-registry-unleashed-series)

---

## What are OCI and OCI artifacts

On top of Docker Registry 2.0, Azure Container Registry supports OCI artifacts. The [OCI specification](https://github.com/opencontainers/image-spec){:target="_blank"} defines a general format for interchanging various artifacts like Docker Images or application bundles such as Helm charts. The official definition of OCI's responsibility is

---

*Established in June 2015 by Docker and other leaders in the container industry, the OCI currently contains two specifications: the Runtime Specification (runtime-spec) and the Image Specification (image-spec). The Runtime Specification outlines how to run a “filesystem bundle” that is unpacked on disk. At a high-level an OCI implementation would download an OCI Image then unpack that image into an OCI Runtime filesystem bundle. At this point the OCI Runtime Bundle would be run by an OCI Runtime.*

*source: https://www.opencontainers.org/*

---

If you want to dive deeper into OCI integration into Azure Container Registry, check out the [ORAS (OCI Registry as Storage) project on GitHub](https://github.com/deislabs/oras){:target="_blank"}.

## Prerequisites

Several tools and services have to be installed/provisioned and configured. Your Azure subscription should have the following services provisioned:

- An instance of *Azure Container Registry (ACR)*
- An instance of *Azure Kubernetes Service (AKS)*
  - The *ACR* instance should be attached to the *AKS* instance (read my previously published post, explaining [3 ways to attach ACR to AKS]({% post_url 2020-02-12-3-ways-to-integrate-acr-witht-aks %}){:target="_blank"} for further details on how to achieve that)

On your local development system, you should have installed and configured the following:

- The *Helm 3 CLI* version `3.1.0` or later
- The *Azure CLI* version `2.0.71` or later
- The *Kubernetes CLI* `kubectl` with a proper context configuration pointing to the previously mentioned AKS instance

## Authenticate Helm CLI against ACR

To publish or `push` Helm charts to ACR, your local installation of `helm` has to establish an authenticated connection to ACR. In contrast to other Command-Line Interfaces, `helm` is not able to re-use the existing authentication token from Azure CLI. That said, you have to create a dedicated *Service Principal* and assign the role  `AcrPush` to it. (Learn more about RBAC in the context of ACR by reading [this part of the series]({% post_url 2019-11-21-azure-container-registry-unleashed-authentication-iam-and-contenttrust %}){:target="_blank"}).

```bash
# Create the Service Principal
az ad so create-for-rbac --name "acr-unleashed-helm" -o json
{
  "appId": "11111111-1111-1111-1111-111111111111",
  "displayName": "acr-unleashed-helm",
  "name": "http://acr-unleashed-helm",
  "password": "22222222-2222-2222-2222-222222222222",
  "tenant": "33333333-3333-3333-3333-333333333333"
}

# Grab the ACR Id
ACR_ID=$(az acr show -n unleashed --query id -o tsv)
# Create role assignment
az role assignment create --assignee $AZ_SP_ID --role AcrPush --scope $ACR_ID

```

Again, it is the Service Principal we just created, which is used to authenticate `helm`, to access ACR as a dedicated, protected chart registry. Assume that the password of the Service Principal is stored in the `AZ_SP_PASSWD`  environment variable and the identifier in `AZ_SP_ID`.

```bash
# Add ACR (unique service name unleashed) as registry and
# provide the id and password from the Service Principal
echo $AZ_SP_PASSWD | helm registry login unleashed.azurecr.io \
  -u $AZ_SP_ID --password-stdin

```

## Enable OCI support in Helm CLI

To enable OCI support in Helm 3, you have to set the `HELM_EXPERIMENTAL_OCI` environment variable to `1`:

```bash
# Enable OCI Support in Helm 3
export HELM_EXPERIMENTAL_OCI=1

```

OCI support is currently flagged as **experimental**. Perhaps, this has changed in the meantime. Consult the  [official Helm documentation](https://helm.sh/docs/topics/registries/#enabling-oci-support){:target="_blank"} to verify.

## Prepare Helm charts for publishing to ACR

For demonstration purposes, let's create a simple *Hello World* Helm chart, which we can use throughout this article to verify ACR can deal with custom Helm charts.

```bash
cd dev
helm create hello-acr

```

Before we can push the chart to ACR, we have to store it with a fully qualified name in Helm's local registry cache. We can do so using the `helm chart save` command.

```bash
cd hello-acr
helm chart save . unleashed.azurecr.io/hello-acr:1.0.0

```

At any point, you can use `helm chart list` to get a list of Helm charts stored in your local registry cache. (No worries we will delete the local version later)

## Push a Helm chart to ACR

Pushing a Helm chart to ACR is similar to pushing Docker images to ACR. We have logged in previously to access our custom registry, so all correctly qualified charts (those, starting with `youracrname.azurecr.io`) will automatically be routed to the corresponding registry by Helm CLI. Let's give it a try.

```bash
helm chart push unleashed.azurecr.io/hello-acr:1.0.0

The push refers to repository [unleashed.azurecr.io/hello-acr]
ref:     unleashed.azurecr.io/hello-acr:1.0.0
digest:  33c87247a4153cba103d7b965c1e08358205191ce9b6a68129e3005f84ab7541
size:    3.2 KiB
name:    hello-acr
version: 0.1.0
1.0.0: pushed to remote (1 layer, 3.2 KiB total)

```

Although Helm CLI confirms the push operation, you can also use the Azure Portal to verify. Just inspect the *Repositories* blade within your ACR instance.

{% include image-caption.html imageurl="/assets/images/posts/2020/acr-helm-1.png"
title="Azure Container Registry - Our Helm chart in ACR" caption="Azure Container Registry - Our Helm chart in ACR" %}

## Pull a Helm chart from ACR

We still have our Helm chart stored in the local registry cache. Delete it now using `helm chart remove`, because otherwise, Helm would not try to download it from ACR.

```bash
helm chart remove unleashed.azurecr.io/hello-acr:1.0.0

1.0.0: removed

# verify chart is gone locally
helm chart list

REF	NAME	VERSION	DIGEST	SIZE	CREATED
```

Now we can pull it explicitly from ACR using the `helm chart pull` command.

```bash
helm chart pull unleashed.azurecr.io/hello-acr:1.0.0

1.0.0: Pulling from unleashed.azurecr.io/hello-acr
ref:     unleashed.azurecr.io/hello-acr:1.0.0
digest:  33c87247a4153cba103d7b965c1e08358205191ce9b6a68129e3005f84ab7541
size:    3.2 KiB
name:    hello-acr
version: 0.1.0
Status: Downloaded newer chart for unleashed.azurecr.io/hello-acr:1.0.0

# verify the chart is locally available again
helm chart list

REF                                 	NAME     	VERSION	DIGEST 	SIZE   	CREATED
unleashed.azurecr.io/hello-acr:1.0.0	hello-acr	0.1.0  	33c8724	3.2 KiB	26 minutes

```

## Export Helm chart once pulled

Since we pushed and now pulled the Helm chart as OCI artifact, we have to extract or `export` it for further usage. To export a chart, use `helm chart export` command as shown here:

```bash
helm chart export unleashed.azurecr.io/hello-acr:1.0.0 --destination ./chart-export

```

## Deploy the Helm chart to AKS

Once you have successfully pulled a Helm chart from ACR, you can interact with it like with any other chart. Let's quickly install the chart to kubernetes, verify it has been installed correctly, and then retract the chart again.

```bash
# get AKS credentials if you havent
az aks get-credentials -n aks-unleashed -g acr-unleahsed

# verify correct Kubernetes context
kubectl config set-context aks-unleashed

# create a namespace for demonstration purpose

kubectl create namespace acr-helm-demo

# navigate into the export folder of the chart
cd chart-export

# install the chart to the namespace
helm install acr-helm-demo-1 ./hell-acr -n acr-helm-demo

# verify release using Helm CLI
helm list -n acr-helm-demo -o yaml
- app_version: 1.16.0
  chart: hello-acr-0.1.0
  name: acr-helm-demo-1
  namespace: acr-helm-demo
  revision: "1"
  status: deployed
  updated: 2020-04-27 22:00:48.421724 +0200 CEST

# uninstall the release again
helm uninstall acr-helm-demo-1 -n acr-hello-demo

# delete namespace
kubectl delete ns acr-hello-demo

```

If you encounter an error while trying to install the Helm chart into Kubernetes, verify if your ACR instance is attached to AKS. If not, you can do so using the `az aks update --attach-acr` command.

## Azure CLI Commands for Helm charts

The Azure CLI ships several commands to interact with Helm charts in the context of ACR. However, all sub-comamnds of `az acr helm` are **targetting Helm 2**.

To manage OCI artifacts in ACR using Azure CLI, you can use the regular commands such as `az acr repository list` or orthers.

## Recap

I enjoy using Helm since they have removed the server-side component (Tiller). Being able to push and pull my Helm charts to and from Azure Container Registry is fantastic. Finally, ACR becomes the go-to resource for all my container-related distributable packages. If you have not looked into Helm as package-manager for your Kubernetes workloads, this is an additional argument why you should do so.

## The Azure Container Registry Unleashed series

- [Part 1 - Introduction and Geo Replication]({%post_url 2019-11-19-azure-container-registry-unleashed-acr-up-and-running %}){:target="_blank"}
- [Part 2 - Authentication, IAM and Content Trust]({%post_url 2019-11-21-azure-container-registry-unleashed-authentication-iam-and-contenttrust %}){:target="_blank"}
- [Part 3 - Integrate ACR and Azure Monitor]({%post_url 2019-11-26-azure-container-registry-unleashed-integrate-acr-and-azure-monitor %}){:target="_blank"}
- [Part 4 - Webhooks]({%post_url 2019-12-04-azure-container-registry-unleashed-webhooks %}){:target="_blank"}
- [Part 5 - Tasks]({%post_url 2020-02-05-azure-container-registry-unleashed-tasks %}){:target="_blank"}
- [Part 6 - Image scanning with Azure Security Center]({%post_url 2020-04-20-azure-container-registry-unleashed-image-scanning-with-security-center %}){:target="_blank"}
- [Part 7 - Use ACR as Registry for Helm charts]({%post_url 2020-04-29-azure-container-registry-unleashed-use-acr-as-regisrty-for-helm-charts %}){:target="_blank"}
