---
title: Azure Container Registry Unleashed – Tasks
layout: post
permalink: azure-container-registry-unleashed-tasks
published: true
tags: [Azure, Docker, ACR]
excerpt: "The fifth part of ACR Unleashed will cover Tasks and Container Build - an easy way to offload Docker Image related tasks"
image: /acr-unleashed.jpg
unsplash_user_name: Thais Morais
unsplash_user_ref: tata_morais
---

## Azure Container Registry Unleashed

- [Part 1 - Introduction and Geo Replication]({%post_url 2019-11-19-azure-container-registry-unleashed-acr-up-and-running %}){:target="_blank"}
- [Part 2 - Authentication, IAM and Content Trust]({%post_url 2019-11-21-azure-container-registry-unleashed-authentication-iam-and-contenttrust %}){:target="_blank"}
- [Part 3 - Integrate ACR and Azure Monitor]({%post_url 2019-11-26-azure-container-registry-unleashed-integrate-acr-and-azure-monitor %}){:target="_blank"}
- [Part 4 - Webhooks]({%post_url 2019-12-04-azure-container-registry-unleashed-webhooks %}){:target="_blank"}
- [Part 5 - Tasks]({%post_url 2020-02-05-azure-container-registry-unleashed-tasks %}){:target="_blank"}

The fifth part of _Azure Container Registry Unleashed_ is all about automating things in the context of Docker Images and ACR. Starting from scratch with simple, yet useful ACR Quick Tasks, over regular ACR Tasks to full-fledged ACR Multi-Step Tasks, this article covers everything you need to know about Tasks in ACR.

- [Azure Container Registry Unleashed](#azure-container-registry-unleashed)
- [ARC Tasks introduction](#arc-tasks-introduction)
  - [ACR Task pricing](#acr-task-pricing)
  - [Source Code Context](#source-code-context)
- [ACR Quick Tasks](#acr-quick-tasks)
  - [ACR Quick Tasks with remote contexts](#acr-quick-tasks-with-remote-contexts)
- [Automatically triggered ACR Tasks](#automatically-triggered-acr-tasks)
- [Multi-Step ACR Tasks](#multi-step-acr-tasks)
  - [Building a blog search with Azure Cognitive Search](#building-a-blog-search-with-azure-cognitive-search)
  - [Spinning up required Azure Resources](#spinning-up-required-azure-resources)
  - [Extracting ACR Tasks from requirements](#extracting-acr-tasks-from-requirements)
    - [The build-index ACR Task](#the-build-index-acr-task)
    - [The feed-index ACR Task](#the-feed-index-acr-task)
- [Recap](#recap)
- [What is next](#what-is-next)

## ARC Tasks introduction

With Azure Container Registry (ACR), customers can use so-called tasks to offload several workloads from local machines, and services such as GitHub or Azure DevOps to Azure Container Registry. With ACR Tasks, customers can build, push, and run Docker Images for different platforms, including Linux, Windows, and ARM. As of today, there are three different types of Tasks available in ACR:

- Quick Tasks
- Automatically triggered Tasks
- Multi-Step Tasks

At the end of the article, you will be able to choose the correct kind of Task depending on the given requirements and know how to configure it properly.

### ACR Task pricing

ACR Tasks are charged per second. At the point of writing this article (Feb 2020), 1 second costs 0,00009 Euro when running ACR in West Europe. The costs for task executions are added to the monthly ACR fee. Keep in mind that you will be charged per second for every ACR Task you and your teammates execute. The total cost is driven by different factors such as

- number of team members
- number of task executions per month
- kind of Docker Image (windows is significantly slower than Linux)
- duration of the task
- number of different images

ACR Tasks are priced independently from the chose ACR SKU. Customers pay the same per second, no matter if they are using ACR Basic, Standard, or Premium. See the [official pricing page](https://azure.microsoft.com/en-us/pricing/details/container-registry/){:target="_blank"} for further details.

### Source Code Context

Every ACR Task is executed within a dedicated context. While creating a task, a context has to be specified. The context defines which files and folders should be taken into consideration to perform the task. Currently, the following contexts are available in ACR:

- Local Filesystem
- Git Repository (Branches and Subfolders) from
  - GitHub
  - Azure DevOps
- Remote Tarballs

During this article, you will configure ACR Tasks using the local filesystem and the Git repository contexts.

## ACR Quick Tasks

ACR Quick Tasks are great for the inner-loop development cycle. A Quick Task can easily unveil problems in your local-codebase, that affect building Docker Images before pushing the code to a Git remote. By default, an ACR Quick Task tries to build the specified Docker Image and pushes it to the associated ACR instance. To illustrate the simplest ACR Quick Task, let’s start from scratch. Create a new folder along with a `Dockerfile` using the following command:

```bash
mkdir acr-quick-task
cd acr-quick-task

echo "FROM nginx:latest" > Dockerfile

```

Having everything in place, we can start our first ACR Quick Task with the `az acr build` command. If you know `docker` CLI, most arguments and switches from `az acr build` will be familiar for you.

{% raw %}

```bash
az acr build -t unleashed.azurecr.io/simplest-acr-quick-task:{{.Run.ID}} -r unleashed .

```

{% endraw %}

This command will upload everything from within the current context to ACR and build the Image immediately. By default, ACR uses the `Dockerfile` from the given context. According to the output, you can see ACR processing all instructions from the `Dockerfile` before pushing the Image to the registry.

{% include image-caption.html imageurl="/assets/images/posts/2020/acr-tasks-quick-task-1.png"
title="ACR Quick Task" caption="ACR Quick Task" width="850px" %}

Have you recognized the `.` at the end of the `az acr build` command? It specifies the context for the ACR Quick Task. When setting the context to the local folder (`.`), all files in the current folder (and all sub-folders) will be transferred to ACR, to build the Docker Image. `az acr build` respects the `.dockerignore` file, which could be used to explicitly exclude files and folders from being transferred to Azure Container Registry.

You can prevent ACR Quick Tasks from pushing the resulting Docker Image to ACR by adding the optional `--no-push` argument to the command. If you want to build the Docker image using a different platform (eg. Windows), you can specify the desired platform with the `--platform=Windows` argument.

If you just want to verify syntactical correctness, and the actual process of building the Docker Image, you can skip tagging the Docker Image (which will automatically skip pushing the image too). That said, the simplest ACR Quick Task is issued using the `az acr build -r unleashed .` command.

{% include image-caption.html imageurl="/assets/images/posts/2020/acr-tasks-quick-task-2.png"
title="Fire and Forget: ACR Quick Task" caption="Fire and Forget: ACR Quick Task" width="850px" %}

ACR Quick Tasks are a great way to check if your spike or local changes result in the desired Docker Image or if further investigation is required. On top of that, ACR Quick Tasks allow you to build Docker Images without relying on a local installation of Docker at all.

### ACR Quick Tasks with remote contexts

We can take the previous example one step further by leveraging a remote context. Instead of uploading the source code from the local filesystem, we will consult an existing GitHub repository. ACR Tasks are flexible when it comes to Git repository contexts. ACR Tasks can either be executed in the scope of:

- the entire repository
- a branch in the repository
- a subfolder in the repository

For better illustration, we will execute an ACR Quick Task to build a Docker Image from a `Dockerfile` sitting in a subfolder of the `master` branch. The repository is open-sourced on GitHub.

```bash
az acr build -r unleashed https://github.com/ThorstenHans/acr-tasks.git#master:acr-quick-task-1

```

Again, ACR will go ahead and verify if the Docker image could be created successfully, without publishing the resulting Docker Image on ACR.

{% include image-caption.html imageurl="/assets/images/posts/2020/acr-tasks-quick-task-3.png"
title="ACR Quick Task with remote context" caption="ACR Quick Task with remote context" width="850px" %}

## Automatically triggered ACR Tasks

Having Quick Tasks covered now is the time to create our first, full-fledged ACR Task. Regular ACR Tasks consist of two different kinds of objects. They always have a task definition (managed by `az acr task`), and every execution is represented as a "run". (You can see both of them in Azure Portal too.)

On top of the properties we have learned previously, regular ACR Tasks have a bunch of properties to configure external triggers. Currently, ACR supports four different kinds of triggers:

- Push triggers (git)
- PullRequest triggers (git)
- Docker Base-Image update triggers
- Schedule triggers

You can assoicate multiple triggers to the same ACR Task at the same time. Additionally, a task can always be triggered manually using `az acr task run`.

Let's take the example from the previous section and create a regular ACR Task which triggers automatically, everytime someone pushes new commits to the `master` branch. To communicate with GitHub, ACR requires an access token. You can create a new personal access token (PAT). You can create a new PAT on GitHub at [https://github.com/settings/tokens/new](https://github.com/settings/tokens/new){:target="_blank"}. Provide a name for the PAT and select `repo:status` and `public_repo` scopes.

{% include image-caption.html imageurl="/assets/images/posts/2020/acr-tasks-github-pat.png"
title="Create a GitHub PAT" caption="Create a GitHub PAT" width="500px" %}

Confirm the personal access token creation and copy the PAT. It will be set as `GITHUB_PAT` environment at the beginning of the following script:

{% raw %}

```bash

GITHUB_PAT=YOUR_PERSONAL_ACCESS_TOKEN

az acr task create --name first-regular-task \
  --registry unleashed \
  --file Dockerfile \
  --image first-regular-task:{{.Run.ID}} \
  --no-push \
  --base-image-trigger-enabled false \
  --commit-trigger-enabled true \
  --pull-request-trigger-enabled false \
  --context https://github.com/ThorstenHans/acr-tasks.git#master:acr-quick-task-1 \
  --git-access-token $GITHUB_PAT

```

{% endraw %}

Once the task has been created, go ahead and run it manually to verify if it works as expected using `az acr task run -n first-regular-task -r unleashed`. Azure CLI will print all logs from the task execution to your terminal.

The list of all ACR Taks could be received from ACR using `az acr taks list -r unleashed`. To get the list of task executions, use:

```bash
az acr task list-runs -n first-regular-task -r unleashed -o table

```

Once the underlying GitHub repository receives a new push on the `master` branch, the registred trigger will kick-in and we can see another task execution in Azure Portal.

{% include image-caption.html imageurl="/assets/images/posts/2020/acr-tasks-runs.png"
title="ACR Task - automatically created run" caption="ACR Task - automatically created run" %}

Regular ACR tasks are really flexible and have a lot of configuration settings. Make yourself comfortable with those properties (check `az acr task create --help`).

## Multi-Step ACR Tasks

Multi-Step ACR Tasks can do a wide variety of things. It is the most powerful kind of task available in Azure Container Registry. They allow customers to execute mini-workflows to `build`, `push`, and even `run` Docker Images on demand. A Multi-Step ACR Task requires a dedicated configuration file (typically written in `yaml`) that describes the entire execution workflow.

Take this task configuration for example

```yaml
version: v1.1.0
steps:
  - build: -t $Registry/hello-world:$ID -f hello-world.dockerfile .
  - push:
      - $Registry/hello-world:$ID
  - cmd: $Registry/hello-world:$ID
```

It specifies three major steps `build`, `push` and `cmd`. First, a new Docker Image will be created (`build`). If the build succeeded, the new Image will be published to ACR (`push`); Finally, the Image will be executed (`cmd`). ACR Task engine inejcts a bunch of variables, that we can use to make our Tasks more flexible. (like `$Registry` and `$ID`, representing the URL of the current ACR instance and the unique identifier associated with the ACR Task execution.)

{% include ext-note.html title="ACR Tasks reference: YAML" content="The ACR Task configuration right here looks straight forward and smoth. However, I found the configuration not that intuitive. I'm afraid I have to disagree with the naming schema in many points. Read through the reference."  link="https://docs.microsoft.com/en-us/azure/container-registry/container-registry-tasks-reference-yaml" linkTitle="Read \"ACR Tasks refernce: YAML\" now" %}

Instead of explaining the concepts theoretically, I want to share a real-world example, the upcoming serach for my blog.

### Building a blog search with Azure Cognitive Search

Let's consider adding search capabilities to a blog like mine. I use [Jekyll](https://jekyllrb.com/){:target="_blank"}, a static site generator, to run my blog. Instead of implementing search capabilities on my own, I want to utilize [Azure Cognitive Search](https://azure.microsoft.com/en-us/services/search/){:target="_blank"} and forward user's search queries to the managed search service.

When working with Azure Cognitive Search, you may want to re-create the index to make changes to the underlying schema. Azure Cognitive Search exposes an API for that. A dedicated ACR Multi-Step Task should be created, which can be manually triggered to re-create the entire index.

The content of the search index should be updated every time someone pushes code to the dedicated search repository, and every night at 3 am.

A simple Node.JS application is responsible for loading all markdown files, transforming necessary metadata into the document format specified by Azure Cognitive Search. Finally, all metadata should be published to the search index.

During Docker Image build time, the latest code from the blog repository will be pulled into the Image.

All sensitive configuration data (such as the instance name of Azure Cognitive Search and the Admin API Key) should be pulled during Docker container initialization and attached to the container as environment variables. Communication between the ACR Task and Azure KeyVault should happen on behalf of a dedicated Managed Service Identity (MSI). (I prefer a dedicated, pre-provisioned MSI to have full control over Access-Policies.)

### Spinning up required Azure Resources

You can use the following script to spin-up all required Azure resources (besides ACR).

```bash
#!/bin/bash

echo "Provide the name of your Resource Group followed by [ENTER]"
read rgName

echo "Provide the name of your ACR instance followed by [ENTER]"
read acrName
# set location to West Europe
location=westeurope
# Name of the Azure KeyVault instance
kvName=acr-unleashed-sample
# Name of the Azure Cognitive Search instance
searchServiceName=acr-unleashed-search-3453

# Create the Azure Cognitive Search
az search service create -n $searchServiceName \
    -g $rgName --sku Basic -l $location

# Grab Admin API Key
searchServiceAdminApiKey=$(az search admin-key show --service-name $searchServiceName -g $rgName --query "primaryKey" -o tsv)

# Create Azure KeyVault
az keyvault create -n $kvName -g $rgName -l $location

# Store sensitive data in KeyVault
az keyvault secret set -n SearchServiceName --value $searchServiceName --vault-name $kvName
az keyvault secret set -n SearchServiceApiKey --value $searchServiceAdminApiKey --vault-name $kvName

# Create the Managed Service Identity
az identity create -n acr-unleashed-msi -g $rgName -l $location
MSI_ID=$(az identity show -n acr-unleashed-msi -g $rgName --query "id" -o tsv)
MSI_SPN=$(az identity show -n acr-unleashed-msi -g $rgName --query "clientId" -o tsv)

# Create an access policy for the MSI
az keyvault set-policy -n $kvName -g $rgName --spn $MSI_SPN --secret-permissions get list

echo "Managed Service Identity ID " $MSI_ID

```

### Extracting ACR Tasks from requirements

Once all resources are created and available in your Azure subscription, we can dive into the ACR Task configuration. Extracting all requirements from the sentences above, we may end up with two independent ACR Tasks.

#### The build-index ACR Task

- Establish a connection to Azure KeyVault (`secrets` node)
- Build the Docker Image according to `build-index.Dockerfile`
- Push the Docker Image to ACR
- Run the previously create Image
  - prevent ACR from changing the workdir by setting `disableWorkingDirectoryOverride`
  - Attach sensitive configuration data to the container by using `.Secrets.` variables

Written in YAML, the ACR Multi-Task definition looks like this:

{% raw %}

```yaml
version: v1.1.0
secrets:
  - id: searchServiceName
    keyvault: https://unleashed.vault.azure.net/secrets/SearchServiceName
  - id: searchApiKey
    keyvault: https://unleashed.vault.azure.net/secrets/SearchServiceApiKey
steps:
  - build: -t $Registry/build-index:$ID -f build-index.Dockerfile .
  - push:
      - $Registry/build-index:$ID
  - cmd: $Registry/build-index:$ID
    disableWorkingDirectoryOverride: true
    env:
      - THNS__AZ_SEARCH_ADMIN_KEY='{{.Secrets.searchApiKey}}'
      - THNS__AZ_SEARCH_SERVICE_NAME='{{.Secrets.searchServiceName}}'
```

{% endraw %}

As you can see, the configuration file uses prepopulated variables like `$Registry` and `$ID`. The local `.Secrets` variable provides all data pulled from Azure KeyVault within the `secrets` section.

The `build-index` Task should be invoked manually. That said, the ACR Task definition is created without providing an PAT for GitHub. The `--assign-identity $MSI_ID` argument instructs ACR to run the Task in behalf of the Managed Service Identity.

```bash
az acr task create --name build-index \
  --registry unleashed \
  --commit-trigger-enabled false \
  --pull-request-trigger-enabled false \
  --base-image-trigger-enabled false \
  --context https://github.com/ThorstenHans/search.thorsten-hans.com.git \
  --assign-identity $MSI_ID \
  --file build-index-task.yaml

```

Run the `build-task` now using `az acr task run -n build-index -r unleashed`. Once finished, we can move on and take care about feeding the recently created index.

#### The feed-index ACR Task

- Establish a connection to Azure KeyVault (`secrets` node)
- Build the Docker Image according to `feed-index.Dockerfile`
- Push the Docker Image to ACR registry
- Run the previously Image
  - prevent ACR from changing the workdir by setting `disableWorkingDirectoryOverride`
  - Attach sensitive configuration data to the container by using `.Secrets.` variables

Written in YAML, the ACR Multi-Task definition looks like this:

{% raw %}

```yaml
version: v1.1.0
secrets:
  - id: searchServiceName
    keyvault: https://unleashed.vault.azure.net/secrets/SearchServiceName
  - id: searchApiKey
    keyvault: https://unleashed.vault.azure.net/secrets/SearchServiceApiKey
steps:
  - build: -t $Registry/feed-index:$ID -f feed-index.Dockerfile .
  - push:
      - $Registry/feed-index:$ID
  - cmd: $Registry/feed-index:$ID
    disableWorkingDirectoryOverride: true
    env:
      - THNS__AZ_SEARCH_ADMIN_KEY='{{.Secrets.searchApiKey}}'
      - THNS__AZ_SEARCH_SERVICE_NAME='{{.Secrets.searchServiceName}}'
```

{% endraw %}

The `feed-index.yaml` looks quite similar to the one seen before, only the name of the Docker Image differs. Remember, the `feed-index` task is invoked automatically when code is pushed to the search repository and every night at 3 am. Because it should run automatically based on an action happening in GitHub, the GitHub PAT has to be provided using the `--git-access-token` argument.

```bash
az acr task create --name feed-index \
  --registry unleashed \
  --commit-trigger-enabled true \
  --pull-request-trigger-enabled false \
  --base-image-trigger-enabled false \
  --context https://github.com/ThorstenHans/search.thorsten-hans.com.git \
  --assign-identity $MSI_ID \
  --file feed-index-task.yaml \
  --git-access-token $GITHUB_PAT \
  --schedule "0 3 * * *"

```

Instead of pushing code to the repository, go ahead and trigger the `feed-index` task manually right now with `az acr task run -n feed-index -r unleashed`.

You can utilize Azure Cognitive Search Explorer to test individual queries against your index, as shown in the picture below.

{% include image-caption.html imageurl="/assets/images/posts/2020/acr-tasks-search-explorer.png"
title="Azure Cognitive Search Explorer" caption="Azure Cognitive Search Explorer" %}

The nitty and gritty part of ACR Multi-Step tasks is, of course, the `yaml` definition. I stumbled upon unclear documentation and got frustrated when using ACR Multi-Step tasks for the first time. Sometimes property naming feels wrong and inconsistent (take `disableWorkingDirectoryOverride` for example - it controls the working directory INSIDE of the Docker container).

However, the ACR team keeps on improving the `yaml` schema and is continuously working on the official documentation.

## Recap

ACR Tasks offer a great utility to verify Docker Image creation in the inner-loop. I use them often to offload building and pushing new Docker Images directly to ACR. Creating Docker Images from the local filesystem maybe interesting while having limited local computing power.

However, I found multi-step ACR Tasks being a bit tricky. Especially in real-world scenarios that go beyond “Hello World”. The underlying service (ACR) is rock-solid, however I struggled a lot with argument naming conventions and quality of documentation. Docs are showing minimal examples and - at least from my understanding - they miss the big picture.

Once you made it through the combination of nitty, gritty arguments, ACR Tasks could be the vehicle to build, push and run Docker Images for one time tasks. Personally, I would offload execution of the Docker Image to other services such as Azure Functions, Azure AppServices, Azure Container Instances or Azure Kubernetes Service.

## What is next

In the sixth part of ACR Unleashed, we will look into Scanning Docker Images in ACR with Azure Security Center to prevent distribution of malicious Docker Images.

You can also subscribe to my newsletter and get automatically notified when I publish articles here. That is the best way to stay current and never miss an article.
