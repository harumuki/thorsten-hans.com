---
title: ACR Unleashed – ACR Up And Running with Geo Replication
layout: post
permalink: azure-container-registry-unleashed-acr-up-and-running
published: true
tags: 
  - Azure
  - Docker
  - Azure Container Registry
excerpt: 'Setup Azure Container Registry according to best practices. Configure ACR geo replication for high availability. The 1st of a 7 part series about ACR'
image: /acr-unleashed.jpg
unsplash_user_name: Thais Morais
unsplash_user_ref: tata_morais
---

Azure Container Registry – or short ACR - is a managed service offered by Microsoft Azure. It is a private Docker Registry based on Docker Registry 2.0 and acts as central service in many containerized application architectures. Compared to other private Docker registries, ACR offers several advantages like ease of administration due to powerful Azure CLI commands, seamless integration with other Azure Services such as Azure Kubernetes Service and frictionless authentication using Azure Active Directory (AAD).

The idea of “Azure Container Registry Unleashed” is to go further, way further than `docker push` and `docker pull`. At the end of this short series, you will be able to use all ACR features currently available and use the full potential offered by the service.

In this introduction part, we will setup a new instance of Azure Container Registry and follow [ACR Best Practices](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-best-practices){:target="_blank"} provided by the Microsoft Azure Team itself. That said, here is what we will cover today:

- [A Dedicated Azure Resource Group For ACR](#a-dedicated-azure-resource-group-for-acr)
- [Which ACR SKU Should You Use](#which-acr-sku-should-you-use)
- [Create ACR And Necessary Azure Building Blocks](#create-acr-and-necessary-azure-building-blocks)
  - [Why You Should Disable ACR Administrator Account](#why-you-should-disable-acr-administrator-account)
- [Setup ACR Geo Replication](#setup-acr-geo-replication)
- [The ACR Unleashed series](#the-acr-unleashed-series)
- [Conclusion](#conclusion)

## A Dedicated Azure Resource Group For ACR

If you have looked at the ACR best practices, chances are good that you stumbled upon the recommendation to host ACR in a dedicated Azure Resource Group. The reason why the team suggests this, is to prevent you from accidentally deleting your mission critical ACR instance. Within the upcoming articles we will add a couple of surrounding services to our ACR instance, so it is generally a good idea to group those artefacts using an Azure Resource Group.

On top of that, you can use the dedicated Resource Group to lock down administrative access to all ACR related services at once.

## Which ACR SKU Should You Use

Azure Container Registry is currently available in three different editions: Basic, Standard and Premium. So how should you decide which edition you should go for. Good news first, no matter which edition you choose, you get an SLA of 99.9% and you can switch to another edition at any point in time (scale up and scale down).

The three available editions have the same programmatic capabilities (such as AAD integration, webhooks and so on). However, the differ when it comes to storage and bandwidth. Although Basic edition is great to get started from both storage and bandwidth point of view, you may recognize a difference when images were pulled from other Azure services in the same region.

A more important aspect for finding the correct edition are features such as geo replication and Content-Trust and repository-scoped permissions (currently in preview). Those features are dedicated to the Premium edition of ACR.

Geo replication is a feature you should consider if your ACR is going to be used from services hosted in different Azure regions and if your ACR is mission critical. When using ACR from within different Azure regions, you can minimize latency and Image-Pull times by configuring corresponding geo replication.

Content-Trust is a feature optionally offered implemented in Docker and Docker Registry 2.0 responsible for signing Docker images that are transferred over through the network. With Content-Trust, you can verify the source of a Docker Image and its integrity. On top of that, you and your organization can configure Docker clients to accept only signed Docker Images and prevent your team from consuming potentially malicious Docker images.

On top of that, each edition has a limited number of webhooks that you can use to build custom integrations based on ACR. Basic comes with 2 (two) webhooks, Standard with 10 (ten) and Premium Edition offers up to 100 (hundred) webhooks being configured.

## Create ACR And Necessary Azure Building Blocks

To get started with ACR at this point, we will create several Azure resources. Obviously, we create a new Azure Resource Group and an instance of Azure Container Registry. To do so, you can either use the Azure Portal, Azure CLI, the Azure PowerShell Modules or one of the available SDKs / APIs. I will use Azure CLI exclusively in my posts and bring up the portal just to visualize results at some point.

```bash
az group create -n acr-unleashed -l westeurope
az acr create -n unleashed -g acr-unleashed -l westeurope \
  --sku Premium --admin-enabled false

```

### Why You Should Disable ACR Administrator Account

Did you pay close attention to the az acr create command? You may have noticed that I specified “—admin-enabled false” explicitly although it is the default value. I specified it explicitly to ensure, we will talk about it. The administrative Account is a great mechanism to get started with ACR. However, you should definitely disable the administrative account in ACR and rely on Azure Active Directory authentication and authorization.

If a user is involved in communication with ACR, you should rely on AAD authentication. Users can login directly using the `az acr login` command. If no user is directly involved (perhaps in your build pipeline running in Azure DevOps, you should use a dedicated Service Principal to authenticate against ACR). We will talk about identity access management (IAM) in one of the upcoming posts of this series in more detail. At this point you should realize that enabling administrative Account is a bad practice when it comes to production ready ACR instance.  

## Setup ACR Geo Replication

Geo replication does not only act as hot backup of your ACR instance, it also eliminates the potential fees for egress network traffic when consuming Docker Images from within other Azure regions. Additionally, your Azure services such as AKS (again, running in another Azure region) will pull images quicker due to lower network latency because the ACR replication could be setup in the same Azure region.
Before configuring ACR geo replication, you should sit down and examine your Azure environment and development requirements. You can do so, by answering the following questions:

- In which Azure regions do you want to consume Docker Images from ACR?
- Where are your team members located?

Questions like those lead you to a list of potential replication targets. We created our ACR instance in the West Europe region. For demonstration purpose, we will setup geo replication to East US and Canada Central. To setup geo replication we will use the `az acr replication create` command.

```bash
# create a replication in East US region
az acr replication create -r unleashed -l eastus

# create a replication in Central Canada region
az acr replication create -r unleashed -l canadacentral

```

Having our geo replication configured, we can ask for a list of all replications using the `az acr replication list` command. Obviously, we can remove a replication by utilizing the `az acr replication delete` command.

Our ACR is still empty, lets change this now. Instead of building a Docker Image from scratch, we will rename an existing, official image and push it to our ACR.

```bash
# pull latest NGINX from public Docker Hub
docker pull nginx:latest
# tag NGINX Image to match ACR naming scheme
docker tag nginx:latest unleashed.azurecr.io/nginx:1
# login to our ACR instance
az acr login -n unleashed
# push the unleashed.azurecr.io/nginx image
docker push unleashed.azurecr.io/nginx:1

```

We can check the replication status anytime using the `az acr replication list -r unleashed` command. However, at this point you may want to check replication status in Azure Portal. Open the portal, navigate to the ACR instance and open the Replication blade. You should see all three regions reporting status as Ready, which means that ACR is syncing images between those regions.

{% include image-caption.html imageurl="/assets/images/posts/2019/acr-unleashed-geo-replication.png"
title="ACR Unleashed - Geo Replications" caption="ACR Unleashed - Geo Replications" %}

When working with geo replications, it is important to know that you will pay the ACR Premium fee per replication. That said, with our current setup, we will pay the monthly ACR Premium fee three times.

## The ACR Unleashed series

- [Part 1 - Introduction and Geo Replication]({%post_url 2019-11-19-azure-container-registry-unleashed-acr-up-and-running %}){:target="_blank"}
- [Part 2 - Authentication, IAM and Content Trust]({%post_url 2019-11-21-azure-container-registry-unleashed-authentication-iam-and-contenttrust %}){:target="_blank"}
- [Part 3 - Integrate ACR and Azure Monitor]({%post_url 2019-11-26-azure-container-registry-unleashed-integrate-acr-and-azure-monitor %}){:target="_blank"}
- [Part 4 - Webhooks]({%post_url 2019-12-04-azure-container-registry-unleashed-webhooks %}){:target="_blank"}
- [Part 5 - Tasks]({%post_url 2020-02-05-azure-container-registry-unleashed-tasks %}){:target="_blank"}
- [Part 6 - Image scanning with Azure Security Center]({%post_url 2020-04-20-azure-container-registry-unleashed-image-scanning-with-security-center %}){:target="_blank"}
- [Part 7 - Use ACR as Registry for Helm charts]({%post_url 2020-04-29-azure-container-registry-unleashed-use-acr-as-regisrty-for-helm-charts %}){:target="_blank"}
  
## Conclusion

We have covered a bunch of stuff in this introduction post, we went beyond setting up an ACR and configured Geo replication in this post. [In the next post of “Azure Container Registry"]({%post_url 2019-11-21-azure-container-registry-unleashed-authentication-iam-and-contenttrust %}){:target="_blank"}, we will configure Content-Trust for our ACR instance(s) to ensure origin and integrity of our Docker Images.

You can subscribe to my blog newsletter and get automatically notified once the next article has been published. That’s the best way to stay current and never miss an article.
