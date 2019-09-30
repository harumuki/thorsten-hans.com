---
title: Custom domains in Azure Kubernetes Service (AKS) with NGINX Ingress and Azure CLI
layout: post
permalink: custom-domains-in-azure-kubernetes-with-nginx-ingress-azure-cli
published: true
tags: [Kubernetes, AKS, Azure]
excerpt: See how to link a custom domain to Azure Kubernetes Service (AKS) with Azure CLI and NGINX Ingress 
image: /traffic.jpg
unsplash_user_name: Brendan Church
unsplash_user_ref: bdchu614
---

When running applications in Azure Kubernetes Service (AKS), NGINX Ingress does a great job in routing inbound traffic. The flexible routing engine allows a wide variety of scenarios to expose different parts of cloud-native applications using different URLs. Unfortunately, there is no documentation on how to map such a custom domain to a public IP address without using the Azure Portal. 

This article outlines the process of mapping a custom domain to the public IP address acquired by NGINX Ingress in AKS using Azure CLI. I assume you have already deployed your application and corresponding NGINX Ingress to your AKS.

## Identify Ingress Public IP

Identifying the public IP address, associated with your NGINX Ingress can be achieved using `kubectl`:

```bash
kubectl get svc -l='app=nginx-ingress'

```

{% include image-caption.html imageurl="/assets/images/posts/2019/custom-domains-aks-ingress-ip.png"
title="NGINX Ingress custom IP" caption="NGINX Ingress custom IP" %}

As you can see, the Ingress is exposed to the internet at `104.41.229.6`.

## Query Object Identifier using Azure CLI

This public IP address is also represented in Azure and can be queried using `az`. The snippet below stores the unique resource identifier as an environment variable.

```bash
PUBLIC_IP_ID=$(az network public-ip list --query "[?ipAddress=='104.41.229.6'].id" -o tsv)

```

The dynamically created varibale `PUBLIC_IP_ID` will contain something like `/subscriptions/subid/resourceGroups/mcrgname/providers/Microsoft.Network/publicIPAddresses/ipid`.

## Create the Network Zone

Before you can create and manage DNS records, a *DNS Zone* has to be created. Let's create a DNS zone for the domain `thns.dev`:

```bash
az network dns zone create \
  --resource-group thh-aks \
  --name thns.dev

```

## Create the A Record

Having the DNS zone in place, a temporary `A` record has to be created. A temporary record is required because it is currently not possible to link a new A record immediately to an existing Azure resource.  

The snippet generates a wildcard entry (by setting the `name` attribute to `@`, if you want to point just a subdomain to your public IP, provide the subdomain as `name` eg.: `www`)

```bash
 az network dns record-set a add-record \
   --resource-group thh-aks \
   --record-set-name @ \
   --zone-name thns.dev \
   --ipv4-address 1.1.1.1

```

Having the temporary A record in place, go ahead and issue an update command and point the A record finally to the existing Azure resource.

```bash
az network dns record-set a update --name @ \
  --resource-group thh-aks \
  --zone-name thns.dev \
  --target-resource $PUBLIC_IP_ID

```

## Query DNS Zone Nameservers

The custom domain needs to point to Azures Nameservers. You can query the nameservers from the DNS Zone like this:

```bash
az network dns zone show \
  --resource-group thh-aks \
  --name thns.dev \
  --query nameServers

```

The command will show a result similar to this:

{% include image-caption.html imageurl="/assets/images/posts/2019/azure-nameservers.png"
title="Azure Nameservers" caption="Azure Nameservers" %}

## Update domain settings

Finally, configure your domain settings and point to Azures Nameservers. Once DNS servers have updated their configuration for your domain, you're all set.

HTH
