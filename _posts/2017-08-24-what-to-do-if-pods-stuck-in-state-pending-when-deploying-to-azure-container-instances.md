---
title: What to do if Pods stuck in state Pending while deploying to Azure Container Instances
layout: post
permalink: fix-pods-stuck-in-pending-on-azure-container-instances
redirect_from: /2017-08-24_What-to-do-if-pods-stuck-in-state-Pending-when-deploying-to-Azure-Container-Instances-50660e3c4b42
published: true
tags:
  - Kubernetes
  - Azure
  - Kubernetes
  - ACI
excerpt: Learn how to examine and fix issues when Pods stuck in state Pending while deploying them to Azure Container Instances
featured_image: /assets/images/posts/feature_images/2017-08-24-what-to-do-if-pods-stuck-in-state-pending-when-deploying-to-azure-container-instances.jpg
---

*Azure Container Instances* (*ACI*) allows you to spin up containers in the cloud without creating or managing any kind of infrastructure. It’s really bringing container as a service to you. That said, *ACI* is no replacement for Container Orchestration Systems like *Kubernetes*. It’s more an underlying infrastructure for hosting/running containers itself.

*ACI* integrates seamlessly with orchestrators like *Kubernetes*. You can use the *ACI connector for Kubernetes* to create an *ACI* node on your Kubernetes cluster. See [this repo for more details](https://github.com/Azure/aci-connector-k8s){:target="_blank"}. 

When you deploy *Pods* to *ACI* through *Kubernetes*, you may recognize that all Pods stuck in state **Pending** when they’re meant to be deployed to the `aci-connector` node (aci-connector is the default name for the ACI node). You may ask why all pods stuck at this stage. To get more insights let us examine the cluster a bit

First, let’s display all the Pods in the `default` namespace using

```bash
kubectl get pods

```

There should be one pod named `aci-connector-<SOME_ID>` That’s the Pod which connects Kubernetes to *ACI*. Yes, a *Pod*. The Pod is mimicking the `kubelet` interface and registers itself as a unlimited node on your cluster. Giving this background, let's get some insights from the `aci-connector-<SOME_ID>` Pod by executing:

```bash
kubectl logs aci-connector-<SOME_ID>

```

You may see a message like *“The subscription is not registered to use namespace ‘Microsoft.ContainerInstance”*.

I had the same issue with one of my Azure subscriptions, for others it just worked as expected.

As the error message indicates, namespaces are associated with Azure Subscriptions. Azure CLI allows you to manage namespaces using `az providers`. Ensure you’ve selected the proper Azure subscription by invoking `az account set --subscription <SUBSCRIPTION_ID>`. Now let’s review the registration state of the particular namespace.

```bash
az provider show -n Microsoft.ContainerInstance

```

It should return a status `NotRegistrered`. Because we want to use ACI, we’ve to register the namespace in the current subscription by executing:

```bash
az provider register -n Microsoft.ContainerInstance

```

After a couple of seconds, `az provider show -n Microsoft.ContainerInstance` should return with status `Registered`.

Move over to your *Kubernetes* cluster, delete and re-create the *Pod*. Now it should spin up the *Pod* as expected. Use `kubectl get po -o wide` to verify if your *Pod* is deployed to the `aci-connector` node.
