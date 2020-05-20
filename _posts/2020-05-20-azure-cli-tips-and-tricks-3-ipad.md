---
title: Azure CLI on the iPad - Azure CLI Tips & Tricks 3 
layout: post
permalink: azure-cli-ipad--azure-cli-tips-tricks
published: true
tags:
  - Azure CLI
  - Azure
excerpt: Azure CLI on the iPad. See what you can do with Cloud Shell and the offical Azure App for iPadOS
image: /azure-cli-tips-and-tricks.jpg
unsplash_user_name: Markus Spiske
unsplash_user_ref: markusspiske
---
*Azure CLI Tips & Tricks* is a collection of small, yet powerful things, that will boost your productivity when working with Microsoft Azure CLI.

---

I love my iPad Pro and the possibility to work from almost everywhere. Using the official [Azure app](https://apps.apple.com/de/app/microsoft-azure/id1219013620#?platform=ipad){:target="_blank"} from the Apple App Store, I can browse through my cloud resources and get essential information about cloud-based workloads.

- Check metrics and resource status from anywhere
- Start or Stop resources like VMs or Azure App Services at anytime
- Receive notifications and alerts about service health issues

Additionally, the app comes with an integrated _Cloud Shell_, which gives me direct access to Azure CLI.

{% include image-caption.html imageurl="/assets/images/posts/2020/azure-cli-tips-azure-ipad.jpg"
title="Azure CLI Tips & Tricks - Azure CLI on the iPad" caption="Azure CLI Tips & Tricks - Azure CLI on the iPad" %}

The Cloud Shell provides a bunch of tools pre-installed, not just Azure CLI. See the following list of my top 5 commands used in Cloud Shell:

1. Azure CLI (`az`)
2. Kubernetes CLI (`kubectl`)
3. Terraform CLI (`terraform`)
4. Git CLI (`git`)
5. AzCopy CLI (`azcopy`)

To get the list of your top commands, you can use `history |  cut -c7- | sort  | uniq -c | sort -nr | head -n 5`. I removed standard Linux commands like `cd`, `touch` from the list above, to come up with the important once.

Being able to access all those commands directly from my iPad is priceless. It allows me to get some work done from anywhere, anytime. If you have an iPad, the Azure app is a must-have.
