---
title: 3 Ways to integrate ACR with AKS
layout: post
permalink: 3-ways-to-integrate-acr-with-aks
published: true
tags: 
  - Azure Kubernetes Service
  - Azure Container Registry
  - Kubernetes
  - Azure
excerpt: Learn 3 different ways how to integrate Aure Container Registry (ACR) with Azure Kubernetes Service (AKS) to pull Docker images from your protected Docker Registry.
image: /three.jpg
unsplash_user_name: Tara Evans
unsplash_user_ref: taradee
---

To integrate Azure Container Registry (ACR) with Azure Kubernetes Service (AKS), operators and developers currently have three different options. At the end of the article, you can integrate the protected implementation of Docker Registry 2.0 with your Kubernetes cluster using your preferred strategy.

## 1. Kubernetes Secret

First and perhaps the easiest integration strategy is to create a Kubernetes Secret of type `docker-registry`. You can create such a `Secret` either using `yaml` or using the `kubectl create` command:

When integrating ACR and AKS using a `Secret`, you can either use the ACR Admin Account (which is suitable for development, however not recommended for production workloads) or create and authorize a dedicated Service Principal. Depending on your choice, the following script may use Service Principal `ClientId` and `ClientSecret` (also named `AppId` and `Password` in Azure) as `ACR_UNAME` and `ACR_PASSWD`:

```bash
ACR_NAME=youruniquename.azurecr.io

# assumes ACR Admin Account is enabled

ACR_UNAME=$(az acr credential show -n $ACR_NAME --query="username" -o tsv)
ACR_PASSWD=$(az acr credential show -n $ACR_NAME --query="passwords[0].value" -o tsv)

kubectl create secret docker-registry acr-secret \
  --docker-server=$ACR_NAME \
  --docker-username=$ACR_UNAME \
  --docker-password=$ACR_PASSWD \
  --docker-email=ignorethis@email.com

```

The secret contains all required information to authenticate against ACR during Pod initialization. Developers have to reference the `secret` as part of their `PodSpec`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: sample-pod
spec:
  containers:
  - name: sample-pod-container
    image: youruniquename.azurecr.io/sample-container:0.0.1
  imagePullSecrets:
  - name: acr-secret

```

Although integration is fairly easy, developers have to specify the `imagePullSecret` property **explicitly**.

## 2. Service Account

The second strategy of how to integrate ACR with AKS is to use a so-called `ServiceAccount`. A `ServiceAccount` in Kubernetes can provide custom configuration for pulling images.

Again we have the underlying `Secret` created using `kubectl create secret`.

```bash
ACR_NAME=youracrname.azurecr.io
ACR_UNAME=$()
ACR_PASSWD=$()

kubectl create secret docker-registry acr-secret \
  --docker-server=$ACR_NAME \
  --docker-username=$ACR_UNAME \
  --docker-password=$ACR_PASSWD \
  --docker-email=ignorethis@email.com
```

The `ServiceAccount` references the `Secret` by its name:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: SampleAccount
  namespace: default
imagePullSecrets:
- name: acr-secret

```

Developers specify their `Pod` to run in the context of the previously generated `ServiceAccount`. Kubernetes will read `imagePullSecret` configuration from the underlying `ServiceAccountSpec`.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: sample-pod
spec:
  containers:
  - name: sample-pod-container
    image: youracrname.azurecr.io/sample-container:0.0.1
  serviceAccountName: SampleAccount

```

At this point, developers have to remember setting `podspec.serviceAccountName`.

However, you can also edit the default `ServiceAccount` and attach the `imagePullSecrets`. Having that in place, every `Pod` in the targeting `Namespace` can pull images from ACR and will still be executed using the `default` ServiceAccount.

```bash
kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name": "acr-secret"}]}'

```

## 3. Azure Active Directory Service Principal

Last but not least, you can leverage the Azure Active Directory to integrate both services. When using this strategy, integration happens outside of Kubernetes itself. Azure will assign required access policies to the underlying Service Principal (SP) to pull images from the specified instance of Azure Container Registry.

Although this is the easiest strategy (because no modifications inside of Kubernetes are required), any artifact deployed to the cluster can pull images from your ACR instance.

You can configure the integration for existing AKS instances using:

```bash
AKS_NAME=youraksname
ACR_NAME=youracrname
RG_NAME=your_resource_group_name

az aks update -n $AKS_NAME -g $RG_NAME \
   --attach-acr $(az acr show -n $ACR_NAME --query "id" -o tsv)

```

You can also attach a given ACR instance to a new AKS cluster using the `--attach-acr` argument:

```bash
AKS_NAME=youraksname
ACR_NAME=youracrname
RG_NAME=your_resource_group_name

az aks create -n $AKS_NAME -g $RG_NAME \
   --generate-ssh-keys \
   --attach-acr $(az acr show -n $ACR_NAME --query "id" -o tsv)

```

## Summary

As you can see, Azure offers three different, flexible ways for integrating ACR with AKS. If your Kubernetes cluster is running outside of Azure, you can still choose between either using a Kubernetes Secrets or using a dedicated Service Account.
