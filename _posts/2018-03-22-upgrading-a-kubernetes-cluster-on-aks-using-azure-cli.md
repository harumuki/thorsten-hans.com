---
title: Upgrading a Kubernetes cluster on AKS using Azure CLI
layout: post
permalink: upgrading-a-kubernetes-cluster-on-aks-using-azure-cli
redirect_from: /upgrading-a-kubernetes-cluster-on-aks-using-azure-cli-603c9be7b369
published: true
tags:
  - Kubernetes
  - Azure
  - Azure Container Service
  - AKS
excerpt: The AKS team offers a great set of commands to make administrative operations for Kubernetes clusters very easy. This article demonstrates how to upgrade a AKS cluster.
featured_image: /assets/images/posts/feature_images/2018-03-22-upgrading-a-kubernetes-cluster-on-aks-using-azure-cli.jpg
---
Upgrading an on-premises *Kubernetes* cluster can be very cumbersome and time-consuming task. It's not just a single upgrade command that you can execute and everything happens magically behind the scenes. A single command for upgrading an entire Kubernetes cluster would be awesome 💚 and that's exactly what's provided by the AKS team. A single command to upgrade all your masters and nodes. 

My fellow MVP [Tobias Zimmergren](https://zimmergren.net){:target="_blank"} wrote a [great post on how to upgrade AKS clusters](https://zimmergren.net/azure-container-services-aks-upgrade-kubernetes/){:target="_blank"} a couple of weeks ago. But technology and tools are **changing quickly** these days.

When you follow the instructions described by Tobias, you'll result in some ugly warnings. This is because the `az aks get-versions` command is outdated and will be deprecated in the future.

That said, I just want to dump the commands I use to upgrade my Kubernetes cluster on AKS.

## Examine your cluster

You can get the current Kubernetes version and all available upgrade in a single command.

```bash
az aks get-upgrades 
  --resource-group your-resgroup-name
  --name your-aks-name
  --query "{ current: controlPlaneProfile.kubernetesVersion,upgrades: controlPlaneProfile.upgrades }"

```

The command is using the [JMESPath query language](http://jmespath.org/){:target="_blank"} to extract the essential properties from the response. You should now see a JSON object similar to this one:

```json
{
    "current": "1.7.9",
    "upgrades": [
        "1.7.12",
        "1.8.1",
        "1.8.2",
        "1.8.6",
        "1.8.7"
    ]
}
```

## Upgrade your cluster 
Starting the upgrade is as simple querying for new upgrades, it's just the following command

```bash
az aks upgrade 
  --resource-group your-resgroup-name
  --name your-aks-name
  --kubernetes-version 1.8.7

```

After confirming the operation, you can grep another cup of ☕️ and wait for the upgrade process to finish.

Once finished, you can rerun the `az aks get-upgrades` command and verify the version of your cluster. It will now be `1.8.7`. and you'll see a couple of new upgrades. I'm not 100% sure why a two-stage upgrade is required in order to move from `1.7.9` to `1.9.2` but if you really want to use latest and greatest supported by AKS, repeat the `az aks upgrade` command and move on to `1.9.2`. 🤘
