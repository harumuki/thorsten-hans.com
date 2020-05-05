---
title: Azure CLI Tips & Tricks 1 – Get samples with az find 
layout: post
permalink: azure-cli-tips-and-tricks-1-get-samples-with-az-find
published: true
tags: 
  - Azure
  - Azure CLI
excerpt: "Azure CLI Tips & Tricks 1 - Get contextual samples directly in the Azure CLI for every (sub-)command."
image: /azure-cli-tips-and-tricks.jpg
unsplash_user_name: Markus Spiske
unsplash_user_ref: markusspiske
---
Azure CLI Tips & Tricks is a collection of small, yet powerful things, that will boost your productivity when working with Microsoft Azure CLI.

---

`az find` is a useful command for every Azure CLI user. It is the go-to command, if you want to get scenario-based examples for Azure CLI commands. You can provide any command as positional argument to `az find`, and it will scan the official Azure documentation for examples.

```bash
# get samples for top-level commands
az find "az aks"

# get samples for nested commands
az find "az aks update"
az find "az network front-door backend-pool update"

```

See the following animation, demonstrating `az find` and its usage:

{% include image-caption.html imageurl="/assets/images/posts/2020/az-tips-and-tricks-az-find.gif"
title="Azure CLI - az find in Action" caption="Azure CLI - az find in Action" %}

You can save some additional keystrokes here. Just skip the second `az`:

```bash
# for the lazy ones :D
az find "aks"
az find "aks update"
# ...

```

In contrast to browsing the help of every sub-command - by appending `--help` or `-h` - `az find` is more focused! It shows you a bunch of sample commands based on typical day-to-day scenarios.
