---
title: How to use a private Azure Container Registry with Kubernetes
layout: post
permalink: how-to-use-private-azure-container-registry-with-kubernetes
redirect_from: /how-to-use-a-private-azure-container-registry-with-kubernetes-9b86e67b93b6
published: true
tags: [Kubernetes,Azure,Docker,ACR,AKS]
excerpt: 'Pulling docker images from private registries is an essential, basic task that you need to do almost every day. This article guides you through the process of integrating Azure Container Registry and Azure Kubernetes Services.'
image: /containers-on-dock.jpg
unsplash_user_name: Tobias A. Müller
unsplash_user_ref: tobiasamueller
---

Besides using the goodness of Azure Container Services (ACS). Different Azure services like Azure Container Registry (ACR) and Azure Container Instances (ACI) can be used and connected from independent container orchestrators like kubernetes (k8s). This post will explain how to set up a custom ACR and connect it to an existing k8s cluster to ensure images will be pulled from the private container registry instead of the public docker hub.

{% capture note_url %}
  {% post_url 2019-10-04-aks-acr-integration-revisited %}
{% endcapture %}
{% include note.html title="Updated Article available" content="This article was initially published in August 2017. Both AKS and ACR are growing fast since that time. With recent releases of Azure CLI, integrating AKS and ACR became easier. That said, I've published a new article on AKS and ACR integration." link=note_url linkTitle="Read \"AKS and ACR Integration - Revisited\" now" %}

## Setting up the Azure Container Registry

Although the recent Azure portal is providing a rich user experience, all Azure related stuff in this post will be scripted using the latest Azure CLI 2.0. If you haven't installed Azure CLI 2.0 yet, you can find [detailed instructions here](https://docs.microsoft.com/en-us/cli/azure/overview){:target="_blank"}.

First, you need to login in order to get access to all your Azure subscriptions.

```bash
az login

```

Once logged in, you can select any of your subscriptions. You can list all subscriptions using

```bash
az account list

```

Select the suggested subscription by invoking the following script (replace `<SUBSCRIPTION_ID>` with the id of your subscription).

```bash
az account set --subscription <SUBSCRIPTION_ID>

```

## Creating an Azure Resource Group

Either you can use an existing *Azure Resource Group* or create a new using:

```bash
az group create --location northeurope --name <RESOURCE_GROUP_NAME>

```

You can list all available locations by using `az account list-locations`.

## Provisioning an Azure Container Registry

An *Azure Container Registry* (*ACR*) can also be created using the new Azure CLI.

```bash
az acr create
  --name <REGISTRY_NAME>
  --resource-group <RESOURCE_GROUP_NAME>
  --sku Basic

```

Once the ACR has been provisioned, you can either enable administrative access (which is okay for testing and described later) or you create a *Service Principal* (sp) which will provide a `client_id`  and a `client_secret`.

```bash
az ad sp create-for-rbac
  --scopes /subscriptions/<SUBSCRIPTION_ID>/resourcegroups/<RG_NAME>/providers/Microsoft.ContainerRegistry/registries/<REGISTRY_NAME>
  --role Contributor
  --name <SERVICE_PRINCIPAL_NAME>

```

Before executing this script ensure that you replace all tokens being used in the script above. You need to provide the subscription id, the resource group name, the ACR name and a meaningful name for your service principal. You may have noticed the *role* parameter which is set to `Contributor`. *ACR* supports three different roles:

- `Owner`: (pull, push, and assign roles to other users)
- `Contributor`: (pull and push)
- `Reader`: (pull only access)
  
Once the service principal has been created, copy the `client_id` (named `appId` in the response) and the `client_secret` (named `password` in the response). You'll need those in a few seconds.

{% include image-caption.html imageurl="/assets/images/posts/2017/acr-kubernetes-1.png"
title="Create Service Principal Response" caption="Create Service Principal Response" %}

To keep things simple, we'll create a single service principal for now. For real-world scenarios, you may create multiple service principals with different roles. As a developer, you want to push new images to the registry. (So you become a `Contributor`). Your container cluster, on the other hand, may only pull images from the registry. So you should create a second service principal with the `Reader` assigned. 

Once you made it through the previous steps, it's time to take care of *Docker* and *Kubernetes*. Without any further configuration, both docker and kubernetes will push and pull images from the public docker hub. So let's change this now and bring in the *ACR* goodness.

## Login from Docker CLI

In order to push images to the newly created *ACR* instance, you need to login to *ACR* form the *Docker CLI*.

```bash
docker login <REGISTRY_NAME> -u <CLIENT_ID>

```

You can also pass the `client_secret` directly to the `docker login` command, but keep in mind that both `client_id` and `client_secret` will be visible in your bash history. `docker login` will prompt for the `client_secret` (`password`) when you execute the command as shown above.

## Pushing a Docker image to ACR

Once logged in, you can push any existing docker image to your *ACR* instance. Before you can push the image to a private registry, you've to ensure a proper image name. This can be achieved using the `docker tag` command. For demonstration purpose, we'll use [Docker's hello world image](https://store.docker.com/images/hello-world){:target="_blank"}, rename it and push it to ACR.

```bash
# pulls hello-world from the public docker hub
docker pull hello-world

# tag the image in order to be able to push it to a private registry
docker tag hello-word <REGISTRY_NAME>/hello-world

# push the image
docker push <REGISTRY_NAME>/hello-world

```

## Configure Kubernetes to use your ACR

When creating *deployments*, *Replica Sets* or *Pods*, *Kubernetes* will try to use docker images already stored locally or pull them from the public docker hub. To change this, you need to specify the custom docker registry as part of your *Kubernetes* object configuration (`yaml` or `json`).

Instead of specifying this directly in your configuration, we'll use the concept of *Kubernetes Secrets*. You decouple the k8s object from the registry configuration by just referencing the secret by its name. But first, let's create a new *Kubernetes Secret*.

```bash
kubectl create secret docker-registry <SECRET_NAME>
  --docker-server <REGISTRY_NAME>.azurecr.io
  --docker-email <YOUR_MAIL>
  --docker-username=<SERVICE_PRINCIPAL_ID>
  --docker-password <YOUR_PASSWORD>

```

If you want to prevent your `client_secret` from being stored in bash history, you can for example use `read -s DOCKER_PASSWORD` and provide `$DOCKER_PASSWORD` as value for the `--docker-password` parameter.

## Create Pods, Replica Sets, and Deployments using the Secret

No matter which *Kubernetes* object you're going to create, you can easily bring *Secrets* into consideration using the `spec.imagePullSecrets` configuration value. As an example see the following `yaml` file describing a simple pod which will pull the `hello-world` image from the *ACR* instance to your *Kubernetes* nodes and uses that image to create the containers.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: private-hello-world
spec:
  containers:
  - name: private-hello-container
    image: <REGISTRY_NAME>.azurecr.io/hello-world
  imagePullSecrets:
  - name: <SECRET_NAME>

```

You can save the pod configuration to as a local file like `pod-sample.yaml` and deploy it using `kubectl` by invoking:

```bash
kubectl create -f pod-sample.yaml

```

Once your pod has been provisioned, you can see detailed information about the pod and the docker image, which has been pulled from ACR using `kubectl describe pod <POD_NAME>`.

{% include image-caption.html imageurl="/assets/images/posts/2017/acr-kubernetes-2.png"
title="Pod Events listed by using kubectl describe pod" caption="Pod Events listed by using kubectl describe pod" %}

That's it. You've successfully deployed an *ACR*, configured it with a *docker* installation and hooked it up in *Kubernetes*. 🤘 🚀

{% include note.html title="Updated Article available" content="This article was initially published in August 2017. Both AKS and ACR are growing fast since that time. With recent releases of Azure CLI, integrating AKS and ACR became easier. That said, I've published a new article on AKS and ACR integration." link=note_url linkTitle="Read \"AKS and ACR Integration - Revisited\" now" %}
