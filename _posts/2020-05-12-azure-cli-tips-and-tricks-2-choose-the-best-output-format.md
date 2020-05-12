---
title: Azure CLI Tips & Tricks 2 – Choose the best output format
layout: post
permalink: azure-cli-tips-and-tricks-2-choose-the-best-output-format
published: true
tags: 
  - Azure
  - Azure CLI
excerpt: "In Azure CLI, you can choose from different output formats. This tip explains how to get results in a particular format and shows how to set your preferred format as default output format for all Azure CLI commands."
image: /azure-cli-tips-and-tricks.jpg
unsplash_user_name: Markus Spiske
unsplash_user_ref: markusspiske
---
Azure CLI Tips & Tricks is a collection of small, yet powerful things, that will boost your productivity when working with Microsoft Azure CLI.

---

[Azure CLI](https://docs.microsoft.com/en-us/cli/azure/?view=azure-cli-latest){:target="_blank"} provides a bunch of different output formats. By default, it generates output using the `json` format. Although the default output format is both human-readable and descriptive, it is not the optimal format for every situation. Sometimes you need more focused responses, or you just **want** a good old [ASCII](https://en.wikipedia.org/wiki/ASCII){:target="_blank"}-style table.

As a user, you can choose from the following formats `json`, `jsonc`, `none`, `table`, `tsv`, `yaml` and `yamlc`.

## Use different output formats

You can specify the desired output format for every command using the `--output` argument, or you use one of the shorter variations like `--out` and `-o`.

{% include image-caption.html imageurl="/assets/images/posts/2020/az-tips-and-tricks-output-formats-1.png"
title="Azure CLI - Specify the output format explicitly" caption="Azure CLI - Specify the output format explicitly" %}

As an alternative, you can use `jsonc` or `yamlc` to get corresponding output with basic colorization, which is helpful when talking about Azure stuff during conference talks, or while explaining things to customers or co-workers.

{% include image-caption.html imageurl="/assets/images/posts/2020/az-tips-and-tricks-output-formats-2.png"
title="Azure CLI - Colored YAML output" caption="Azure CLI - Colored YAML output" %}

Another great and typical scenario for overwriting the default output format is when you have a query a unique cloud-resource identifier, which you want to use in constitutive commands. In situations like this, you should consider using the `tsv` format.

```bash
# store the unique Id of an ACR instance for later usage
ACR_ID=$(az acr show -n myacrinstance --query id -o tsv)

echo $ACR_ID
# /subscriptions/111111111111-1111-1111-1111-111111111111/resourceGroups/...

```

## Set the default output format

I use `table` as my default output format. The default output format can be set by either using the interactivce configuration command `az configure`, or by editing the Azure CLI configuration file (on unix based systems located at `~/.azure/config`) manually, as shown in this quick animation:

{% include image-caption.html imageurl="/assets/images/posts/2020/az-tips-and-tricks-output-formats-3.gif"
title="Azure CLI - Overwrite the default output format" caption="Azure CLI - Overwrite the default output format" %}

No matter which format you prefer, make sure to set it as default output format and add the configuration file (`~/.azure/config` ) to your dotfiles repository.
