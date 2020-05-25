---
title: AKS cluster auto-scaler inside out
layout: post
permalink: aks-cluster-auto-scaler-inside-out
published: true
date: 2020-05-11 16:10:00
tags: 
  - Azure
  - AKS
  - Kubernetes
excerpt: "Learn how to build elastic AKS clusters using the cluster auto-scaler. Enable, configure, and optimize the auto-scaler in Azure Kubernetes Service to get an excellent scaling experience."
image: /aks-autoscaler.jpg
unsplash_user_name: Axel Ahoi
unsplash_user_ref: axelahoi
---

Cluster auto-scaling for [Azure Kubernetes Service (AKS)](https://azure.microsoft.com/en-us/services/kubernetes-service/){:target="_blank"} is available for quite some time now. I have been using it in several projects so far.This post explains all details about the AKS cluster auto-scaler, shows how to enable it for both - new and existing AKS clusters - and gives you an example of how to use custom auto-scaler profile settings.

---

- [What is the AKS cluster auto-scaler](#what-is-the-aks-cluster-auto-scaler)
- [Why should you use cluster auto-scaler](#why-should-you-use-cluster-auto-scaler)
- [Enable Azure Kubernetes cluster auto-scaler](#enable-azure-kubernetes-cluster-auto-scaler)
- [Modify auto-scaler boundaries](#modify-auto-scaler-boundaries)
- [Disable cluster auto-scaler](#disable-cluster-auto-scaler)
- [Verify AKS cluster auto-scaling](#verify-aks-cluster-auto-scaling)
  - [Deploy the sample application](#deploy-the-sample-application)
  - [Retract the sample application](#retract-the-sample-application)
- [Custom cluster scaling behavior](#custom-cluster-scaling-behavior)
  - [Specify custom sclaing profile settings](#specify-custom-sclaing-profile-settings)
- [Cluster auto-scaler in combination with multiple AKS node-pools](#cluster-auto-scaler-in-combination-with-multiple-aks-node-pools)
- [Recap](#recap)

## What is the AKS cluster auto-scaler

With cluster auto-scaling, the actual load of your worker-nodes will be monitored actively. By adding and removing worker-nodes from the cluster, it ensures that enough resources are available to keep your application healthy and responsive. In contrast, it removes worker-nodes from the AKS cluster, to optimize resource utilization and be as cost-effective as possible.

The AKS cluster auto-scaler component checks if there are _Pods_ prevented from being deployed to the cluster due to resource limitations. If this happens, the cluster auto-scaler scales out (it adds worker-nodes to the AKS cluster).

If the overall resource utilization drops and worker-nodes are facing a lower load over some time, the cluster will be scaled-in (worker-nodes will be removed from AKS).

Perhaps you are familiar with [Kubernetes Horizontal Pod Autoscaling (HPA)](https://kubernetes.io/de/docs/tasks/run-application/horizontal-pod-autoscale/){:target="_blank"}, which allows us to scale-in and -out_Pods_ based on their actual resource utilization. Conceptually, it is pretty much the same thing, but on another architectural layer. You can also combine HPA and cluster auto-scaler, to create a genuinely elastic Kubernetes cluster in Microsoft Azure.

## Why should you use cluster auto-scaler

Creating a rock-solid forecast for cloud-native applications or SaaS projects could be challenging. The unexpected load could happen at any time. Just imagine your solution being featured in one of the most significant online communities, or think about the opposite. Your current product - already running in AKS - helps teams to stay connected while working from home. During weekends, the overall usage of your application drops by 90%.  

There are hundreds of scenarios and aspects that affect the load of your infrastructure dramatically within hours, minutes, or even seconds. (Weather, time of the day, public vacation, ...).

The AKS cluster auto-scaler allows you to keep your application _responsive_ and _healthy_, by minimizing the risk of resource shortages. Additionally, the cluster auto-scaler will minimize your operational expenditures (OpEx) by scaling-in the AKS  when the cluster has to deal with less load.

Automated scaling behavior of the entire cluster makes the AKS cluster auto-scaler a mandatory and essential feature, which every AKS customer should know about.

## Enable Azure Kubernetes cluster auto-scaler

To enable AKS cluster auto-scaling while creating a new AKS cluster with [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/?view=azure-cli-latest){:target="_blank"}, just append the `--enable-cluster-autoscaler` in combination with `--min-count` and `--max-count` which specify the outer boundaries for the auto-scaler.

```bash
AKS_NAME=aks-scaling-demo
RESOURCE_GROUP_NAME=aks-scaling-demo

#create a Resource Group
az group create -n $RESOURCE_GROUP_NAME -l westeurope

# Create an AKS cluster with auto-scaler enabled
az aks create -g $RESOURCE_GROUP_NAME \
  -n $AKS_NAME \
  --node-count 1 \
  --enable-cluster-autoscaler \
  --min-count 1 \
  --max-count 4

```

Azure will provision a new AKS instance and enable cluster auto-scaling. It can take a few minutes to bring everything up and enable cluster auto-scaling. So this may be the right time for a nice cup of coffee ☕️.

If you already have an existing Azure Kubernetes cluster, you can enable the cluster auto-scaler using `az aks nodepool update`. I am always defensive when enabling cluster auto-scaler on existing AKS clusters. That said, I check the actual worker-node count before enabling it and use the number of currently assigned worker-nodes as `min-count`, to set the lower boundary of the auto-scaler.

```bash
AKS_NAME=aks-scaling-demo
RESOURCE_GROUP_NAME=aks-scaling-demo

# get current node count
kubectl get nodes --no-headers | wc -l
# 1

# get desired node-pool name
az aks nodepool list -g $RESOURCE_GROUP_NAME --cluster-name $AKS_NAME \
  -o table --query [].name

# store node-pool name in temporary variable (AKS_NODE_POOL_NAME)

# enable cluster auto-scaler on existing AKS cluster
az aks nodepool update -n $AKS_NODE_POOL_NAME --cluster-name $AKS_NAME \
  -g $RESOURCE_GROUP_NAME \
  --enable-cluster-autoscaler \
  --min-count 1 \
  --max-count 3

```

## Modify auto-scaler boundaries

Perhaps you have also been a bit defensive while specifying the initial auto-scaler boundaries. Seeing your application growing and becoming more popular, you may want to modify the outer boundaries later on. Again, we use `az aks update` to achieve this:

```bash
# modify AKS cluster auto-scaler boundaries
az aks update -g $RESOURCE_GROUP_NAME \
  -n $AKS_NAME \
  --update-cluster-autoscaler \
  --min-count 1 \
  --max-count 10

```

## Disable cluster auto-scaler

Obviously, you can also disable the cluster auto-scaler using `az aks update` :

```bash
# disable AKS cluster auto-scaler
az aks update -g $RESOURCE_GROUP_NAME \
  -n $AKS_NAME \
  --disable-cluster-autoscaler

```

Once disabled, we use the good, old `az aks scale` command, to manually control the number of worker-nodes in the cluster:

```bash
# scale AKS cluster manually
az aks scale -g $RESOURCE_GROUP_NAME \
  -n $AKS_NAME --node-count 4

```

## Verify AKS cluster auto-scaling

To verify auto-scaling, we will use a sample deployment with explicitly defined resource-requests and -limits. Once deployed to the cluster, we will continuously scale the deployment to increase the overall resource utilization. Once the utilization exceeds the threshold and AKS prevents spinning up new Pods, Azure starts adding new nodes to the AKS cluster.

On the other hand, the AKS cluster will scale-in, as soon as we reduce the number of deployment replicas again. (With some expected delay - more about that later). I have created a new cluster for this sample using the following configuration:

```bash
# Create the resource group
az group create -n aks-scaling-demo -l westeurope

# create the AKS cluster
az aks create -g aks-scaling-demo -n aks-scaling-demo \
  --node-count 1 \
  --node-vm-size Standard_B2s \
  --enable-cluster-autoscaler \
  --min-count 1 \
  --max-count 4

# download credentials and switch kubectl context
az aks get-credentials -n aks-scaling-demo -g aks-scaling-demo

# verify current kubectl context
kubectl config get-contexts

```

### Deploy the sample application

The demonstration application is published on Docker Hub. It’s an API written in .NET Core, that just exposes two simple endpoints:

- `GET: status/health` - Used for Kubernetes Health Probe
- `GET: status/ready` - Used for Kubernetes Readiness Probe

The code for the API is located in [this repository on GitHub](https://github.com/ThorstenHans/aks-cluster-scaling-demo){:target="_blank"}. It also contains the corresponding `YAML` definition-files that we use for the deployment to Kubernetes.

```bash
# Create a dedicated namespace
kubectl create namespace scaling-demo

# Deploy the application to AKS
kubectl apply -f https://raw.githubusercontent.com/ThorstenHans/aks-cluster-scaling-demo/master/kubernetes/scaling-demo.yaml -n scaling-demo

```

Before we start scaling the deployment, let’s check how many worker-nodes our AKS cluster currently consists of:

```bash
# check AKS cluster nodes count
kubectl get nodes --no-headers | wc -l
1

```

Initially, the deployment `demo` in the `scaling-demo` namespace will create `2` replicas. We can verify this using `kubectl get pods -n scaling-demo` or using `kubectl get deploy -n scaling-demo`.

Let’s scale the deployment to `40` replications using:

```bash
# scale demo deployment to 40 replicas
kubectl scale deploy/demo -n scaling-demo --replicas 40

# verify Pods being created
kubectl get po -n scaling-demo -w

```

Fire up a new terminal instance, and start watching your cluster worker-nodes:

```bash
# watch AKS worker-nodes
kubectl get nodes -w
NAME                                STATUS       ROLES     AGE.            VERSION
aks-nodepool1-11111111-vmss000000   Ready        agent     35m             v1.15.10

```

After a couple of seconds or minutes, you will see new worker-nodes appearing. To see the resource utilization per worker-node, use the  `kubectl top nodes` command.

```bash
# get AKS worker-nodes
kubectl get nodes
NAME                                STATUS   ROLES   AGE     VERSION
aks-nodepool1-11111111-vmss000000   Ready    agent   7h46m   v1.15.10
aks-nodepool1-11111111-vmss000001   Ready    agent   2m22s   v1.15.10

# get AKS worker-node utilization
kubectl top nodes
NAME                                CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%
aks-nodepool1-11111111-vmss000000   257m         13%    1796Mi          83%
aks-nodepool1-11111111-vmss000001   98m          5%     883Mi           41%

```

We can scale-in the Kubernetes deployment again using `kubectl scale deploy/demo -n scaling-demo --replicas 2`. Kubernetes will start terminating Pods immediately. However, scaling in worker-nodes takes some time. It takes some time, due to the default cluster auto-scaling profile and its settings, which we will look at in a few.

### Retract the sample application

To retract the sample application, we can simply delete the entire namespace using the  `kubectl delete namespace` command.

```bash
#delete the entire sample namespace
kubectl delete ns aks-scaling-demo

```

## Custom cluster scaling behavior

The previously demonstrated scaling behavior is based on a default configuration provided by Microsoft. This behavior is excellent and works for common scenarios. However, from time to time, you may want more control. I prefer the auto-scaler to scale-in more aggressively. Or, perhaps you want to scale-out earlier. You achieve this, by providing a custom AKS cluster auto-scaler profile settings.

Currently, Microsoft **exposes nine (9) different settings** that can be customized to tailor the auto-scaler experience. To make scale-in behavior more aggressive, we have to alter the values of two settings.

Both `scale-down-unneeded-time` and `scale-down-after-add` have a default value of `10 minutes`, which we will decrease, to get our cluster scaled-in earlier.

Check out the official documentation to get the full list of [available settings to customize the auto-scaler](https://docs.microsoft.com/en-us/azure/aks/cluster-autoscaler#using-the-autoscaler-profile){:traget="_blank"} experience.

**Custom auto-scaler profiles affect all node-pools in an AKS cluster.**

There is no chance to provide individual auto-scaler settings per node-pool at this point in time. To customize the auto-scaler profile settings, we have to install the AKS Preview extension for Azure CLI.

```bash
# Install the extension
az extension add -n aks-preview

# Update the extension to ensure the latest version is installed
az extension update -n aks-preview

```

### Specify custom sclaing profile settings

Once the AKS preview extension is installed, we can use `az aks update` to modify the auto-scaler profile.

```bash
# set desiered profile settings to 3 minutes
az aks update -g $RESOURCE_GROUP_NAME \
  -n $AKS_NAME \
  --cluster-autoscaler-profile scale-down-after-add=3m scale-down-unneeded-time=3m

```

With those customizations being applied to the cluster, we can cycle through the demo process once again and see a more aggressive scale-in behavior.

## Cluster auto-scaler in combination with multiple AKS node-pools

If your AKS cluster is running with different node pools, you can configure cluster auto-scaler independently for every node pool using the `az aks nodepool` commands.

For example, you can enable cluster auto-scaling for a given node pool using the following command:

```bash
# enable auto-scaler for node-pool
az aks nodepool update -g $RESOURCE_GROUP_NAME
  --cluster-name aks-scaling-demo \
  -n gpunodepool \
  --enable-cluster-autoscaler \
  --min-count 1 \
  --max-count 5

```

You can update the boundaries or disable cluster auto-scaling correspondingly:

```bash
# update auto-scaler boundaries on node pool
az aks nodepool update -g $RESOURCE_GROUP_NAME
  --cluster-name aks-scaling-demo \
  -n gpunodepool \
  --update-cluster-autoscaler \
  --min-count 1 \
  --max-count 5

# disable cluster auto-scaler on node pool
az aks nodepool update -g $RESOURCE_GROUP_NAME
  --cluster-name aks-scaling-demo \
  -n gpunodepool \
  --disable-cluster-autoscaler

```

## Recap

From my point of view, cluster auto-scaler in AKS is mission-critical and one of the features I was looking for since AKS was released. Worker-nodes will finally scale-in and -out depending on actual load. The cluster auto-scaler plays well in combination with *Horizontal Pod Auto Scaling (HPA)*.  

By using both, you can make your applications run efficiently, no matter if you are facing unexpected high or low usage. Additionally, the optimization of hardware utilization will have a direct impact on your monthly Azure bill.

Are you using Azure Kubernetes Service and facing problems while implementing proper cluster auto-scaler behavior? Reach out and let me know.
