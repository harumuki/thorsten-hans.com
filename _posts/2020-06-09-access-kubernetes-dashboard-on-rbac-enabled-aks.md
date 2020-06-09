---
title: "How To Access Kubernetes Dashboard On RBAC Enabled Azure Kubernetes"
layout: post
permalink: access-kubernetes-dashboard-on-rbac-enabled-azure-kubernetes
published: true
date: 2020-06-09 09:00:00
tags: 
  - Kubernetes
excerpt: "Get quick access to the Kubernetes Dashboard in Azure Kubernetes Service (AKS) with RBAC enabled by creating a ClusterRoleBinding."
image: /chain.jpg
unsplash_user_name: Kaley Dykstra
unsplash_user_ref: kaleyloved
---

The Kubernetes dashboard is quite useful to drill through existing Kubernetes clusters and inspect things without using `kubectl`. However, starting with version `2.0.40` of Azure CLI, Azure Kubernetes clusters are deployed with Role-Based-Access-Control (RBAC)  enabled by default. Since that point in time, you will be presented with a bunch of errors when trying to access the traditional Kubernetes dashboard using `az aks browse`.

{% include image-caption.html imageurl="/assets/images/posts/2020/kubernetes-dashboard-in-rbac-enabled-aks-1.png"
title="Broken Kubernetes Dashboard in RBAC enabled AKS" caption="Insufficient permissions for Kubernetes dashboard in RBAC enabled AKS" %}

This error occurs because the underlying ServiceAccount used to run the Kubernetes dashboard has insufficient permissions and cannot read all required information using Kubernetes API.

## Inspect The Kubernetes Dashboard Deployment

You can quickly verify which ServiceAccount is used to run the Kubernetes dashboard by looking into the deployment manifest of `kubernetes-dashboard` in the `kube-system` namespace.

```bash
# Get ServiceAccountName that runs the Kubernetes dashboard
kubectl get deploy -n kube-system kubernetes-dashboard -o yaml | grep serviceAccountName:

serviceAccountName: kubernetes-dashboard

# Verify the ServiceAcccount
kubectl get serviceaccount -n kube-system
NAME                                 SECRETS   AGE
...                                  ...       ...
kubernetes-dashboard                 1         19h
...                                  ...       ...

```

Now, we know that we have to grant required permissions to the `kubernetes-dashboard` ServiceAccount in `kube-system` namespace.

For demonstration purposes, we will now create a ClusterRoleBinding and assign the ClusterRole `cluster-admin` to the ServiceAccount. Assigning this role to the kubernetes-dashboard ServiceAccount works but **is a huge risk**. Especially when omitting further authentication configuration for the Kubernetes dashboard.

You should read and consider **using different authentication mechanisms**, as described in [the Access-Control section of the Kubernetes dashboard repository](https://github.com/kubernetes/dashboard/blob/master/docs/user/access-control/README.md){:target="_blank"}.

## Create The ClusterRoleBinding

To create a new ClusterRoleBinding, you use the `kubectl create clusterrolebinding` command. Every ClusterRoleBinding consists of three main parts. In addition to a name, you must specify the desired ClusterRole and the full-qualified name of the ServiceAccount, whom the ClusterRole will be bound to.

```bash
# Create a ClusterRoleBinding
kubectl create clusterrolebinding kubernetes-dashboard \
  --clusterrole=cluster-admin \
  --serviceaccount=kube-system:kubernetes-dashboard

```

## Access The Kubernetes Dashboard

Now having the ClusterRoleBinding deployed, we can again use Azure CLI and browse the Kubernetes dashboard.

```bash
# connect to AKS and configure port forwarding to Kubernetes dashboard
az aks browse -n demo-aks -g my-resource-group

```

The Azure CLI will automatically open the Kubernetes dashboard in your default web-browser. At this point, you can browse through all of your Kubernetes resources.

{% include image-caption.html imageurl="/assets/images/posts/2020/kubernetes-dashboard-in-rbac-enabled-aks-2.png"
title="Kubernetes Dashboard in RBAC enabled AKS" caption="Kubernetes Dashboard in RBAC enabled AKS" %}

## Remove The ClusterRoleBinding

Once you have finished inspecting the Azure Kubernetes cluster, remember to remove the ClusterRoleBinding to eliminate the security-vector. You can use `kubectl delete` to remove it as shown in the following snippet:

```bash
# Remove the custom ClusterRoleBinding
kubectl delete clusterrolebinding kubernetes-dashboard

```

## Conclusion

Inspecting an existing Azure Kubernetes cluster using the Kubernetes dashboard is super useful while explaining artifacts or architectures to others. The intuitive visualization in Kubernetes dashboards is an excellent resource that you can use for discussions about things like cluster utilization, application architectures with people who are not so deep in Kubernetes. Personally, I don't need the Kubernetes dashboard that regularly, so adding and removing the ClusterRoleBinding works for my usage. If you have a different usage pattern, you must take care of the Kubernetes dashboard Access-Control.
