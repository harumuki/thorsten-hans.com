---
title: Limit resources for containers using LimitRanges in Kubernetes
layout: post
permalink: limit-resources-for-containers-using-limitranges-in-kubernetes
published: true
tags:
  - Kubernetes
excerpt: Managing resources and resource limits is essential to optimize utilization of Kubernetes clusters. This post demonstrates how to limit resources for Pods in K8s
featured_image: /assets/images/posts/feature_images/2018-03-22-limit-resources-for-containers-using-limitranges-in-kubernetes.jpg
---

When deploying applications to *Kubernetes* one of the most important things to specify are *resource-requests* and *-limits*. Having proper limits defined per Container makes it easier to optimize the hardware utilization for all worker nodes in a Kubernetes cluster.

When creating deployments, you can set resource-requests and -limits by using the `resources` property on each container as part of the `podspec`. See the [official documentation for further information](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.9/#container-v1-core).

Unfortunately, those properties are not mandatory, so every developer has to remember providing requests and limits for both **memory** and **cpu**.

## Introducing Limit Ranges
You can address the potential issue by defining so-called *LimitRanges* on *Namespaces*. The main purpose of a *LimitRange* is to ensure, requests and/or limits are automatically associated with containers based on its specification.
For demonstrating purpose, let’s create two independent *namespaces* on a Kubernetes cluster.

```yaml
# namespaces.yaml

apiVersion: v1
kind: Namespace
metadata:
  name: restricted
---
apiVersion: v1
kind: Namespace
  metadata:
    name: unrestricted

```

Deploy the namespaces using

```bash
$ kubectl create -f namespaces.yaml

```

Let’s move on and create a new `yaml` file called `limitrange.yaml`. Provide the following content:

```yaml
# limitrange.yaml

apiVersion: v1
kind: LimitRange
metadata:
  name: custom-limit-range
spec:
  limits:
  -
    default:
      memory: 512Mi
      cpu: "1"
    defaultRequest:
      memory: 256Mi
      cpu: "0.5"
    type: Container

```

The *LimitRange spec* is pretty self-explaining. Limits are specified using `spec.limits[0].default` and Requests are defined in `spec.limits[0].defaultRequest`.
In this sample, every container will request *0.5 CPU* cores and *256 MB* memory by default. The absolute usage limit per container will be set to *1 CPU* core and *512 MB* memory.

Deploy the **LimitRange** to the previously created *Namespace* restricted by executing:

```bash
kubectl create -f limitrange.yaml --namespace=restricted

```

## Deploy Pods to verify LimitRanges

To verify the new LimitRange the same Pod will be deployed twice. First, it will be deployed to the `unrestricted` namespace, followed by the `restricted` namespace.

```yaml

# pod.yaml

apiVersion: v1
kind: Pod
metadata:
  name: demo-nginx
  labels:
    purpose: demo
spec:
  containers:
  - name: webapp
    image: nginx:alpine
    ports:
    - containerPort: 80

```

The Pod spec above doesn’t provide any resource-requests or -limits. It’s perhaps the most simple Pod you can define.

Deploy the Pod to both namespaces by invoking

```bash
kubectl create -f pod.yaml --namespace=unrestricted

kubectl create -f pod.yaml --namespace=restricted

```

Examine each pod now using

```bash
kubectl describe pod demo-nginx --namespace=unrestricted

kubectl describe pod demo-nginx --namespace=restricted

```

The requests should only be applied to the Pod running in namespace restricted

{% include image-caption.html imageurl="/assets/images/posts/2018/kubernetes-limitranges.png" 
title="Resource-Limits and -Requests automatically applied to all Containers in a dedicated namespace" caption="Resource-Limits and -Requests automatically applied to all Containers in a dedicated namespace" %}


## Recap
As you can see, defining default `resource-requests` and `-limits` is quite easy using *LimitRanges*. If you don’t specify resource-requests or -limits for the containers you deploy, Kubernetes will automatically assign the pre-defined values from the LimitRange. That said, it’s only **a default value**.

Your custom requests and limits will always overrule the LimitRanges.
