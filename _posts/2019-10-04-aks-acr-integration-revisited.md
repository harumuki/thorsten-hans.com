---
title: AKS and ACR Integration - Revisited
layout: post
permalink: aks-and-acr-integration-revisited
published: true
tags: 
  - Kubernetes
  - Azure Kubernetes Service
  - Azure Container Registry
excerpt: Integrating AKS and ACR to pull images from private Container Registries became easier with recent Azure CLI 2.0 releases. Check out how easy you can connect both excellent services.
image: /containers-on-dock.jpg
unsplash_user_name: Tobias A. Müller
unsplash_user_ref: tobiasamueller
---

Back in 2017, I published [this]({%post_url 2017-08-18-how-to-use-a-private-azure-container-registry-with-kubernetes %}) article on integrating Kubernetes with ACR. Since that time, a lot has changed in the world of containers and orchestrators. Especially Microsoft is pushing hard in the Kubernetes area and keeps on shipping features regularly as part of their managed Kubernetes offering. The integration of ACR and AKs became even more comfortable since Azure CLI `2.0.73` has been released. That said, let's check out how smooth the integration is.

At the end of the article, you will be able to integrate ACR with either new AKS clusters or pre-existing AKS instances.

## Integrate ACR when creating a new AKS cluster

First, let's see how ACR can be integrated with AKS when spinning up a new AKS instance.

```bash
ACR_NAME=<<your-acr-name>>
ACR_RESOURCE_GROUP=<<your-acr-ressource-group>>

az acr create --name $ACR_NAME \
    --resource-group $ACR_RESOURCE_GROUP \
    --sku basic

ACR_ID=$(az acr show --name $ACR_NAME \
     --resource-group $ACR_RESOURCE_GROUP \
     --query "id" --output tsv)

az aks create --name shiny-new-aks \
    --resource-group rg-shiny-new-aks \
    --attach-acr $ACR_ID
```

## Configure ACR integration with existing AKS cluster

Perhaps you have already created an AKS cluster; if that is the case, you can attach an ACR instance using the `az aks update` command.  Before you can issue the `az aks update` command, you have to provide necessary information about your ACR instance:

```bash
ACR_NAME=<<your-acr-name>>
ACR_RESOURCE_GROUP=<<your-acr-ressource-group>>

ACR_ID=$(az acr show --name $ACR_NAME \
     --resource-group $ACR_RESOURCE_GROUP \
     --query "id" --output tsv)

az aks update --name <<your-aks-name>> \
    --resource-group <<your-aks-resource-group-name>> \
    --attach-acr $ACR_ID
```

## Alternatives

Besides Azure tied integration as shown before, you can also use vendor agnostic integration strategies. See my [3 Ways to integrate ACR with AKS]({% post_url 2020-02-12-3-ways-to-integrate-acr-witht-aks %}){:target="_blank} article for further details.
