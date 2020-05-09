---
title: Azure CLI Tips & Tricks 2 – Output Formats
layout: post
permalink: azure-cli-tips-and-tricks-2-output-formats
published: true
tags: 
  - Azure
  - Azure CLI
excerpt: "Azure CLI Tips & Tricks 2 - Become more efficient by altering the Azure CLI output format based on the current scenario"
image: /azure-cli-tips-and-tricks.jpg
unsplash_user_name: Markus Spiske
unsplash_user_ref: markusspiske
---
Azure CLI Tips & Tricks is a collection of small, yet powerful things, that will boost your productivity when working with Microsoft Azure CLI.

---

`az find` is a useful command for every Azure CLI user. It is the go-to command if you want to get scenario-based examples for Azure CLI commands. You provide any Azure CLI command as positional argument to `az find` and it will scan the official Azure documentation for examples.

You want to see examples of 1st level sub-commands like `aks`? Just type `az find "az aks"`.
You want to see more specific samples? Go ahead and execute `az find "az aks update"`.

{% include image-caption.html imageurl="/assets/images/posts/2020/az-tips-and-tricks-az-find.gif"
title="Azure CLI - az find in Action" caption="Azure CLI - az find in Action" %}

Although you can look at the full help of any command by appending `--help` or just `-h`, `as find` is more focused and presents you a bunch of sample commands based on typical day-to-day scenarios.