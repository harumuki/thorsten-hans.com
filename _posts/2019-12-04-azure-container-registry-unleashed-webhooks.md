---
title: Azure Container Registry Unleashed – Webhooks
layout: post
permalink: azure-container-registry-unleashed-webhooks
published: true
tags: 
  - Azure
  - Docker
  - Azure Container Registry
excerpt: 'In part four of Azure Container Registry Unleashed you will learn how to integrate ACR with custom apps and services using webhooks.'
image: /acr-unleashed.jpg
unsplash_user_name: Thais Morais
unsplash_user_ref: tata_morais
---

In the fourth part of Azure Container Registry Unleashed, we will dive into webhooks offered by ACR and learn how to use them to build simple, yet powerful automations based on ACR interactions such as pushing new tags of an image.

- [What is a webhook](#what-is-a-webhook)
- [ACR webhooks](#acr-webhooks)
- [ACR SKU based webhook limits](#acr-sku-based-webhook-limits)
- [Azure Integrations using ACR webhooks](#azure-integrations-using-acr-webhooks)
- [The Demo Project](#the-demo-project)
  - [The Azure Functions Project](#the-azure-functions-project)
  - [Create ACR webhook](#create-acr-webhook)
  - [Testing the webhook](#testing-the-webhook)
  - [Pushing new tags to ACR](#pushing-new-tags-to-acr)
  - [Check results in CosmosDB](#check-results-in-cosmosdb)
- [The Azure Container Registry Unleashed series](#the-azure-container-registry-unleashed-series)
- [What is next](#what-is-next)

## What is a webhook

Before we dive into ACR webhooks, let us do a quick refresher on webhooks. However, if you are familiar with webhooks, skip this paragraph and move on to (ACR webhooks).

A webhook is an API concept, that has become popular in the past decade. It allows applications from different sources to interact with each other over HTTP.  Sometimes webhooks are also referred to as web callbacks or HTTP Push API; which may sound a bit more familiar to you, based on your technical background and preferred programming languages.

By using webhooks, you can communicate between different applications or services in real-time and transfer a payload (structural data) from one to another. In contrast to traditional integrations - where an external system is polled continuously -, webhooks will push information for certain events to external consumers. If you want to dive deeper into webhooks from conceptual point of view, consider reading the following articles

- [https://en.wikipedia.org/wiki/Webhook](https://en.wikipedia.org/wiki/Webhook){:target="_blank"}
- [https://docs.microsoft.com/en-us/aspnet/webhooks/#webhooks-overview](https://docs.microsoft.com/en-us/aspnet/webhooks/#webhooks-overview){:target="_blank"}
- [https://buttercms.com/blog/webhook-vs-api-whats-the-difference](https://buttercms.com/blog/webhook-vs-api-whats-the-difference){:target="_blank"}

## ACR webhooks

Like many other Azure Services, Azure Container Registry offers different kinds of webhooks, that you can consume to integrate or automate things. Currently, ACR offers the following webhooks:

- **push** – Invoked when a Docker Image has been pushed
- **delete** – Invoked when a Docker Image has been deleted
- **quarantine** – Invoked when a Docker image has been pushed and requires Quarantine classification
- **chart_push** – Invoked when an Helm Chart has been pushed
- **chart_delete** – Invoked when a Helm Chart has been deleted

Conceptionally, all webhooks work the same way. However, based on the type of webhook, different information will be sent to webhook consumers as payload.

`chart_push` and `chart_delete` are webhooks dedicated to Helm charts. Don’t worry, I have scheduled a dedicated post on Helm charts in the context of ARC.

`quarantine` is another webhook that I want to offload, for now. We will cover image scanning in another, upcoming post. However, you can subscribe to the `quarantine` event now. The webhook is currently invoked by ACR when you push a new Docker Image.

## ACR SKU based webhook limits

You have a limited number of webhooks that could be registered per ACR instance. Those limits are hard limits. As far as I know, it is not possible to “buy” more webhooks to exceed that ACR SKU limit. See the following table displaying the hard ACR webhook limitations, based on chosen SKU.

{% include image-caption.html imageurl="/assets/images/posts/2019/acr-unleashed-webhooks-sku.png" width="800px" title="ACR webhook limits" caption="ACR webhook limits" %}

## Azure Integrations using ACR webhooks

There are some Azure Services available that use ACR webhooks to integrate with ACR and react on new tags being pushed to ACR. You can configure an Azure WebApp for Containers to run a specific Docker Image from ACR. Based on the ACR push webhook, you can enable continuous deployment (CD) on your WebApp. The Host will react on the webhook execution by spinning up a new Docker container based on the pushed Docker Image. This is easy to achieve using Azure Portal and well documented on [docs.microsoft.com](https://docs.microsoft.com){:target="_blank"} and that is why I skip that part here.

Azure DevOps is also able to use ACR webhooks. The ACR webhooks can act as trigger for Release Pipelines. It is a common pattern, to implement continuous deployment using the ACR push webhook. Every time you push a new tag of and Docker Image to ACR, an new instance of your Release Pipeline is created and invoked in the context of the latest Image version.

ACR webhook integrations with other Azure Services like these - mentioned above - are not shown in ACR and do not count towards your ACR webhook limits.

So, what will we cover here? You read a bunch of stuff about webhooks in general and seamless integration with other Azure services like Web Apps and Azure DevOps. However, webhooks will become interesting once you integrate it into your custom application or service and that is what we will focus on right now.

## The Demo Project

The story for the demo project is told quickly. We will stick with good old NGINX Docker Image. We will utilize an ACR webhook, to call into a custom Azure Function (AzFN). The Azure Function will extract some metadata about the Docker Image from the actual `push` request and persist it - as a new document - in Azure CosmosDB using the CosmosDB bindings for Azure Functions.

### The Azure Functions Project

The Azure Functions project [is open sourced on GitHub](https://github.com/ThorstenHans/acr-unleashed-webhooks){:target="_blank"}. At the heart of the Azure Function, they payload from the webhook is extracted and stored in CosmosDB using an `IAsyncCollector`.

```csharp
string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
log.LogInformation(requestBody);
dynamic data = JsonConvert.DeserializeObject(requestBody);
if (data != null && "ping".Equals(data.action.ToString(), StringComparison.InvariantCultureIgnoreCase))
{
    return new StatusCodeResult(204);
}
if (data != null && data.request != null && data.target != null)
{
    await items.AddAsync(new ImagePush
    {
        Id = data.request.id,
        LoginServer = data.request.host,
        Action = data.action,
        TimeStamp = DateTime.UtcNow,
        Image = data.target.repository,
        Tag = data.target.tag
    });
    return new OkResult();
}
return new BadRequestObjectResult("Invalid payload received");

```

You can quickly spin up a new CosmosDB instance, the required storage account and a new Azure FunctionApp using the following Azure CLI snippet. It will also connect the Function App to the master branch of the mentioned GitHub repository:

```bash
# store a single random number used for all resources
rnd=$RANDOM

# construct Azure Functions and Storage Account Name
azFnName=fnacrunleashed$rnd
storageAccountName=safnacrunleashed$rnd

# Collect information about GitHub repo
gitrepo=https://github.com/ThorstenHans/acr-unleashed-webhooks.git
gitbranch=master

# Create Storage Account for AzFN
az storage account create -n $storageAccountName -g $rg \
  -l westeurope --sku Standard_LRS \
  --kind StorageV2

# Create CosmosDB
az cosmosdb create -n $azFnName -g $rg

# Create CosmosDB Database
az cosmosdb database create -g $rg \
  --name $azFnName \
  --db-name acr

# Create CosmosDB Collection
az cosmosdb collection create -g $rg \
  --name $azFnName \
  --db-name acr \
  --collection-name pushes \
  --partition-key-path /id

# Create Function App
az functionapp create --name $azFnName -g $rg \
  --consumption-plan-location westeurope \
  --os-type Linux --runtime dotnet \
  --disable-app-insights true \
  -s $storageAccountName \
  --deployment-source-url $gitrepo \
  --deployment-source-branch $gitbranch

# Get primary connection string from cosmosdb
connectionString=$(az cosmosdb keys list --name $azFnName -g $rg \
   --type connection-strings \
   -o tsv \
   --query "connectionStrings[0].connectionString")

# Link CosmosDB to Azure Functions
az functionapp config appsettings set --name $azFnApp -g $rg \
  --settings "CosmosDbConStr=$connectionString"
```

### Create ACR webhook

To create our webhook in ACR, we need a couple of information from our invocation target (the previously deployed Azure Functions). Obviously, we need the URI of our endpoint. We can acquire this with the following command

```bash
# Get Azure Functions HostName
azFnHost=$(az functionapp show --name $azFnName -g $rg \
  -o tsv --query hostNames[0])

# Construct Function URL
azFnUrl="https://$azFnHost/images/push"

```

Having the URI, we need to grab the Function Key which ACR must either append as `code` query string parameter or as `x-functions-key` HTTP header to every request. If you review the sample Azure Functions project on GitHub, you will find the `AuthorizationLevel` attribute being specified on the *Function* itself. You can grab the function key with the following command:

```bash
# Grab AzFn resource id
zFnId=$(az functionapp show -n $azFnName -g $rg \
  -o tsv --query id)

# Grab function key from Azure Functions and store it
functionKey=$(az rest --method post \
  --uri "$azFnId/host/default/listKeys?api-version=2018-11-01" \
  -o tsv --query "functionKeys.default")

```

Now that we have everything in place, lets go ahead and create the webhook in ACR.

```bash
# create a new webhook in ACR
acrName=unleashed

az acr webhook create -n ImagePushDemo -r $acrName \
  --uri $azFnUrl\?code\=$functionKey \
  --actions push

```

Having the webhook being provisioned, you should see it in the list of all webhooks for your ACR instance:

```bash
# Get list of all ACR webhooks
az acr webhook list -r  $acrName

```

### Testing the webhook

You can test any webhook without changing something in ACR. There is the dedicated `ping` sub-command, which we will use to test our custom webhook:

```bash
# Test ACR webhook
az acr webhook ping -g $rg -n ImagePushDemo -r $acrName

# List past events
az acr webhook list-events -r $acrName -n ImagePushDemo -o table

```

### Pushing new tags to ACR

We will create a bunch of new tags for our NGINX image and push them over to Azure Container Registry to add some load on our webhook. To do so, create a small shell script - similar to the script we created in part three of the series. The script below will create 10 new tags for the demo image and push all of them to ACR. However, because all tags point to the same docker layer, pushing all those should be finished quickly.

```bash
#!/bin/bash

# create 10 new NGINX Images and push them to ACR
mkdir webhooks
cd webhooks
echo 'FROM nginx:alpine' > Dockerfile

docker build . -t unleashed.azurecr.io/azwebhooks:latest

tags=( 1 2 3 4 5 6 7 8 9 10 )
for i in "${tags[@]}"
do
  tag=unleashed.azurecr.io/azwebhooks:${i}
  docker tag unleashed.azurecr.io/azwebhooks:latest ${tag}
  docker push ${tag}
  echo "pushed ${tag}"
done

```

### Check results in CosmosDB

Finally, it is the right time to go back to CosmosDB Data-Explorer and check all tags being persisted in Azure CosmosDB. Depending on other activities being executed on your ACR instance, the represented list of documents may contain a lot more items than mine.

{% include image-caption.html imageurl="/assets/images/posts/2019/acr-unleashed-cosmosdb.png" width="800px" title="ACR metadata in CosmosDB" caption="ACR metadata in CosmosDB" %}

## The Azure Container Registry Unleashed series

- [Part 1 - Introduction and Geo Replication]({%post_url 2019-11-19-azure-container-registry-unleashed-acr-up-and-running %}){:target="_blank"}
- [Part 2 - Authentication, IAM and Content Trust]({%post_url 2019-11-21-azure-container-registry-unleashed-authentication-iam-and-contenttrust %}){:target="_blank"}
- [Part 3 - Integrate ACR and Azure Monitor]({%post_url 2019-11-26-azure-container-registry-unleashed-integrate-acr-and-azure-monitor %}){:target="_blank"}
- [Part 4 - Webhooks]({%post_url 2019-12-04-azure-container-registry-unleashed-webhooks %}){:target="_blank"}
- [Part 5 - Tasks]({%post_url 2020-02-05-azure-container-registry-unleashed-tasks %}){:target="_blank"}
- [Part 6 - Image scanning with Azure Security Center]({%post_url 2020-04-20-azure-container-registry-unleashed-image-scanning-with-security-center %}){:target="_blank"}
- [Part 7 - Use ACR as Registry for Helm charts]({%post_url 2020-04-29-azure-container-registry-unleashed-use-acr-as-regisrty-for-helm-charts %}){:target="_blank"}
  
## What is next

We have seen, it is easy and straight forward to integration ACR with your products / services using webhooks to react on critical events such as Images being pushed or deleted.

The next post will guide you through ACR tasks. You will learn how to get even more from the monthly fee you pay for your ACR instances. We will look at different types of tasks available in ACR and make our way through day-to-day scenarios.
