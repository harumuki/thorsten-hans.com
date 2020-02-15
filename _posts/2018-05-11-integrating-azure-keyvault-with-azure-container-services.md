---
title: Integrating Azure Key Vault with Azure Container Services
layout: post
permalink: integrating-azure-keyvault-with-azure-container-services
published: true
tags: [Kubernetes,Azure Key Vault,Azure Container Service,Docker,Azure Kubernetes Service]
excerpt: 'Learn how to integrate Azure Key Vault and Azure Container Services. This article guides you through everything you need, in order to query Key Vault from an ASP.NET Core App running in a Pod on Kubernetes'
image: /2018-05-11-integrating-azure-keyvault-with-azure-container-services.jpg
---

With *Azure Key Vault*, Microsoft is offering a dedicated and secure service to manage and maintain sensitive data like Connection-Strings, Certificates, or key-value pairs.

We're hoping to see a native *Azure Key Vault* integration for *Azure Container Services* (ACS) in the near future. At least the [official FAQ](https://docs.microsoft.com/en-us/azure/aks/faq){:target="_blank"} mentions the feature on the product's roadmap. Until this features will be shipped and if you're using another *Kubernetes* environment - such as *GCP* or *AWS* offerings -, you've to integrate *Azure Key Vault* manually into your application building blocks to get rid of storing most sensitive data in plain old *Kubernetes Secrets*. 

I wrote "**most**" because `ClientId`, `ClientSecret` and the Key Vault identifiers - which will be used to access the Azure Key Vault instance - still need to be persisted somewhere. **This drawback may be obsolete once we've native support for Azure Key Vault in AKS.**

## Creating an Azure Key Vault instance

Let's get started with creating a new Azure Key Vault instance, it's really straightforward using Azure CLI:

```bash
az keyvault create
  --resource-group demo-rg
  --name demo-kv
  --location westeurope

```

## Store a secret in KeyVault

When the instance has been created, store a secret value for demonstration purpose:

```bash
az keyvault secret set
  --name SampleSecret
  --value SecretValue
  --description "Sample Secret Value"
  --vault-name demo-kv

```

## Create an Azure AD App Registration and Service Principal

In order to access values from Azure Key Vault, an *Azure AD App Registration* and corresponding *Service Principal* are required. First, create a new *Azure AD App Registration* using:

```bash
az ad app create
  --display-name aks-demo-kv-reader
  --identifier-uris https://aks-demo-kv-reader.somedomain.com
  --query objectId

> "68981428-2a09-411b-931a-dd1ae76d8775"

```

Because the command specifies `--query objectId`, only the Object Identifier will be returned. Use the `ObjectId` to create a *Service Principal* for your new App Registration:

```bash
az ad sp create
  --id 68981428-2a09-411b-931a-dd1ae76d8775
  --query appId

> "bc52fe12-ead8-46d3-81d6-05dc258af3a9"

```

Also in this snippet, `--query` is used to pull the only relevant information — the Service Principal's Identifier. This Identifier is required later to define an access-policy for Azure KeyVault. Unfortunately, Azure CLI has no command to create a new key for the App Registration, this step has to be done using the Azure Portal for now.

----

Open the [Azure Portal](https://portal.azure.com/){:target="_blank"} in your Browser and Navigate to the AD App Registration you created a minute ago. From the Azure *DASHBOARD* go to *AZURE ACTIVE DIRECTORY* and open the *APP REGISTRATIONS* blade. Here, select the Registration named: `aks-demo-kv-reader` from the list of all registrations.
Click on *SETTINGS* (purple square), *KEYS* (green square), provide a new description and set an expiration date for the *Key* (yellow square).

{% include image-caption.html imageurl="/assets/images/posts/2018/azure-key-vault-acs.png"
title="Create a new Key for the App Registration" caption="Create a new Key for the App Registration" %}

Once finished press *SAVE*, now the portal will show the value *copy the value, it won't be displayed anymore*. It represents our `ClientSecret`, the `ClientId` can be found directly on the App Registration and it's labeled as `Application ID` (starting with `ffd…` in the image above).

## Connecting the Service Principal with Azure Key Vault

In order to integrate the new *Azure Service Principal* with Azure Key Vault, an *Access Policy* has to be defined. For demonstrating purpose, we'll assign `GET` and `LIST` permissions to the *Service Principal* and limit it to `Secrets`. (Using both, CLI and Portal you can specify permissions for `Secrets`, `Certificates` and `Keys`).

```bash
az keyvault set-policy
  --name demo-kv
  --spn bc52fe12-ead8-46d3-81d6-05dc258af3a9
  --secret-permissions get list

```

## Access Key Vault from a .NET Core API

As an example, I'll take a simple .NET Core Web API which will read the previously persisted value of `SampleSecret` and expose it over HTTP. Starting from a new .NET Core Web API project, several changes have to be made in `Program.cs`. .NET Core ships with built-in support for Azure Key Vault. That said, you need to use `ConfigurationBuilder` to instruct your app in order to read configuration values from Azure Key Vault.

```csharp
public class Program
{
    public static void Main(string[] args)
    {
        BuildWebHost(args).Run();
    }

    public static IWebHost BuildWebHost(string[] args)
    {
        var configBuilder = new ConfigurationBuilder()
            .AddEnvironmentVariables();

        var stageOneConfig = configBuilder.Build();
        var clientId = stageOneConfig.GetValue<string>("clientid");
        var clientSecret = stageOneConfig.GetValue<string>("clientsecret");
        var keyVaultIdentifier = stageOneConfig.GetValue<string>("keyvaultidentifier");
        var keyVaultUri = $"https://{keyVaultIdentifier}.vault.azure.net/";

        configBuilder
            .AddAzureKeyVault(keyVaultUri, clientId, clientSecret);

        return WebHost.CreateDefaultBuilder(args)
            .UseConfiguration(configBuilder.Build())
            .UseStartup<Startup>()
            .Build();
    }
}

```

As you can see, the implementation is still straightforward.  The Azure Key Vault configuration - three values (`ClientId`, `ClientSecret` and `KeyVault-Identifier`) - are read from environment variables.

Now it's time to read the `SampleSecret` we previously stored in Azure Key Vault and expose its value via HTTP by changing the default `ValuesController` as shown in the following snippet:

```csharp
[Route("api/[controller]")]
public class ValuesController : Controller
{
    private IConfiguration Configuration { get; }
    public ValuesController(IConfiguration config)
    {
        Configuration = config;
    }

    [HttpGet]
    public IActionResult Get()
    {
        var secret = Configuration.GetValue<string>("SampleSecret");
        return Ok(secret);
    }
}

```

In order to deploy the .NET Core Web API to Kubernetes, we need a Docker Image which could be instantiated by Kubernetes and executed within a *POD*. Writing Dockerfiles for .NET Core apps is straightforward. You can use a two-stage-Dockerfile to ensure a small, handy Docker Image.

```dockerfile
FROM microsoft/aspnetcore-build:latest AS builder

WORKDIR /app
COPY src/AzureKeyVaultDemoApi.csproj ./
RUN dotnet restore
COPY src/. ./
RUN dotnet publish -c Release -o out

FROM microsoft/aspnetcore:latest

WORKDIR /app
COPY --from=builder /app/out .

ENTRYPOINT ["dotnet", "AzureKeyVaultDemoApi.dll"]

```

I'm using Azure Container Registry (ACR) instead of public Docker Hub to store and consume Docker Images in Kubernetes. For my setup, the `docker build` command looks like this:

```bash
docker build -t demoacr.azurecr.io/azkv-demo:0.0.1 .

```

Once the image has been built, you need to login to your private docker registry (here ACR):

```bash
az acr login --name demoacr

```

Finally, the image needs to be pushed using:

```bash
docker push demoacr.azurecr.io/azkv-demo:0.0.1

```

## Deploying Secrets to Kubernetes

In order to bring the three essential configuration values to Kubernetes, a regular *Kubernetes Secret* will be used. You can generate the `base64` representations of `ClientId`, `ClientSecret` and `KeyVaultIdentifier` as shown below:

```bash
echo -n "YourClientId" | base64
echo -n "YourClientSecret" | base64
echo -n "YourKeyVaultIdentifier" | base64

```

Once you have the encoded values, create a `secret.yaml` and specify the secret.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: azkv-demo-secret
  type: Opaque
data:
  clientId: TmljZSwgeW91IGRlY29kZWQgaXQ=
  clientSecret: UGxlYXNlIGNsYXAgZm9yIHRoZSBzdG9yeSA6RA==
  keyVaultIdentifier: TGVhdmUgYSBjb21tZW50IGlmIHlvdSBkZWNvZGVkIGl0

```

Deploy it to Kubernetes using `kubctl create -f secret.yaml`.

## Deploying the Application to Kubernetes

A simple pod is enough to verify the integration of Azure Key Vault. If you read through the following `pod.yaml`, linking the Environment Variables to the Kubernetes secret is essential.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: azkv-demo-pod
spec:
  containers:
  - name: azkv-demo-container
    image: demoacr.azurecr.io/azkv-demo:0.0.1
    ports:
      - containerPort: 8080
    env:
      - name: ASPNETCORE_URLS
        value: http://*:8080
      - name: clientid
        valueFrom:
          secretKeyRef:
            name: azkv-demo-secret
            key: clientId
      - name: clientsecret
        valueFrom:
          secretKeyRef:
            name: azkv-demo-secret
            key: clientSecret
      - name: keyvaultidentifier
        valueFrom:
          secretKeyRef:
            name: azkv-demo-secret
            key: keyVaultIdentifier

```

Deploy the pod to Kubernetes using `kubectl create -f pod.yaml`.

## Testing the Integration

Once the pod has been created, copy the name of the pod and use it to do a port forwarding for testing the Azure Key Vault integration

```bash
kubectl port-forward azkv-demo-pod 8080:8080

```

Now, issue an `HTTP GET` request to `http://localhost:8080/api/values` and you should receive the value you've persisted in Azure Key Vault previously. If you've installed `curl` on your machine, you can issue the request using the terminal, just invoke:

```bash
curl http://localhost:8080/api/values

> SecretValue

```

According to the snippet, you should see the `SecretValue` from Azure Key Vault.

## Recap

Using *Azure Key Vault* is definitely the best solution to manage secure data for cloud-native applications. Integrating *Azure Key Vault* with *Azure Container Services* is fairly easy. Hopefully, the integration will become even easier once the *AKS* team ships native Key Vault support.
