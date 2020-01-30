---
title: Using Azure Files in Kubernetes Deployments with ASP.NET Core
layout: post
permalink: using-azure-files-in-kubernetes-deployments-with-asp-net-core
published: true
tags:
  - Kubernetes
  - Azure
  - Docker
excerpt: Learn how to use Azure Files in Kubernetes Deployments from an ASP.NET Core Application
image: /2017-08-21-using-azure-files-in-kubernetes-deployments-with-asp-net-core.jpg
---
*Azure Container Services* (*ACS*) makes it incredibly easy to spin up and manage *Kubernetes* clusters in the cloud. There are plenty of other Azure resources which you can use to build daily scenarios on a native cloud stack.
Common scenarios are serving files from and writing important information to persisted locations. Azure offers many different storage capabilities. In this post, I'll explain how to use an Azure File Share to serve content by using a .NET Core Web API.

## Azure Files

Using Azure Files you can create SMB 3.0 file shares and access them from all over the world. No matter if you're running a cloud-native application or working in a hybrid scenario, Azure Files can be accessed from everywhere. It's easy to set up and reliable solution to deal with files from multiple places. Also if you build highly scalable applications in *Kubernetes*, Azure File Shares can easily be mounted using k8s volumes.

See the following [link to get more detailed information about Azure Files and Azure File Shares](https://azure.microsoft.com/en-us/services/storage/files/){:target="_blank"}.

## Creating a Managed Azure File Share

For demonstration purpose, we'll create a simple Azure File Share. Before actually creating the network share itself, a Storage Account (located in the same Azure location as your k8s cluster) is required.

### Create the Azure Storage Account

Creating the Storage Account is pretty easy. For demonstration purpose, I'll go with the cheapest configuration which means *Standard_LRS*. Depending on your scenario and requirements you may choose one of the advances and more reliable configurations.

```bash
# check if the storage account name of your choice is available
az storage check-name --name <STORAGE_ACCOUNT_NAME>

# if you found an available name, go create the storage account
az storage account create
    --name <STORAGE_ACCOUNT_NAME>
    --resource-group <RESOURCE_GROUP_NAME>
    --sku Standard_LRS

```

### Create the Azure File Share

In order to create our Azure File Share, the connection string from our Storage Account is required. Using Azure CLI, we can simply ask for the connection string using:

```bash
az storage account show-connection-string
  --resource-group <RESOURCE_GROUP_NAME>
  --name <STORAGE_ACCOUNT_NAME>
  --output tsv

```

Azure CLI will print just the connection string itself, without any metadata. Copy that connection string. Now it's time to create the share itself.

```bash
az storage share create
  --name <SHARE_NAME>
  --connection-string <STORAGE_ACCOUNT_CONNECTION_STRING>
  --account-name <STORAGE_ACCOUNT_NAME>

```

The command `az storage share create` will simply respond with a `{ created: true }` JSON if the operation is finished. You can either mount the share on your operating system, use the Azure Portal or you can download and use [the *Azure Storage Explorer*](https://azure.microsoft.com/en-us/features/storage-explorer/){:target="_blank"} to upload files to your new *Azure File Share*.

Take the following image, save it as `docker.jpg` and upload it to the root of your Azure File Share.

{% include image-caption.html imageurl="/assets/images/posts/2017/docker.jpg" 
title="Sample Docker Image" caption="Sample image - place it in your Azure File Share as docker.jpg" %}

## Create a simple Web API

We'll create a simple .NET Core Web API to serve a jpeg from the Azure File Share. Again there are plenty of choices about how to create the new .NET Core Web API project.
I'll use JetBrains Rider here. Use Rider's *New Project wizard* to create the ASP.NET Core WebAPI project as shown in the following image.

{% include image-caption.html imageurl="/assets/images/posts/2017/azure-files-in-kubernetes-1.png"
title="Create a new ASP.NET Core WebAPI using Rider" caption="Create a new ASP.NET Core WebAPI using Rider" %}

Once Rider has created the Project and pulled all the required NuGet packages, go and add a new Controller named `ImageController` and add the following source code.

```csharp
using System.IO;
using System.Net.Mime;
using Microsoft.AspNetCore.Mvc;

namespace Probe.Api.Controllers
{
    [Route("api/[controller]")]
    public class ImageController : Controller
    {
        [HttpGet]
        public IActionResult Get()
        {
            var image = System.IO.File.OpenRead(Path.Combine("mnt","azure","docker.jpg"));
            return File(image, "image/jpeg");
        }
    }
}

```

As you can see, it's a simple `GET` endpoint which will return the entire contents of a file located at `./mnt/azure/docker.jpg`. Let's create a `Dockerfile` to build an image for our API.

```dockerfile
FROM microsoft/dotnet:2.0.0-sdk AS build-environment

LABEL maintainer="Thorsten Hans<thorsten.hans@gmail.com>"

WORKDIR /app
COPY ./src/*.csproj ./
RUN dotnet restore
COPY ./src ./
RUN dotnet publish -c Release -o out

FROM microsoft/aspnetcore:2.0.0

WORKDIR /app
COPY --from=build-environment /app/out .

ENTRYPOINT ["dotnet", "AzureFileShareDemo.API.dll"]

```

First, we restore all NuGet packages and `publish` the project using the `microsoft/dotnet:2.0.0-sdk` image, once publish as succeeded, a way smaller image `microsoft/aspnetcore:2.0.0` (which is just providing the runtime for ASP.NET Core) is used to build our final docker image. Use `docker build -t azure-file-share-sample .` to build the docker image.

Once you've successfully built the docker image, you've to publish it either to the public *docker hub* or to a private container registry. If you want to keep the image private, go and read [my article on how to use *Azure Container Registry* (*ACR*) with an existing *Kubernetes* cluster]({% post_url 2017-08-18-how-to-use-a-private-azure-container-registry-with-kubernetes %}).

## Create a Kubernetes deployment

A *Kubernetes deployment* configuration is just a simple yaml or json file which describes how our deployment should look like. In the following snippet we're creating the *Pod* (it's responsible for executing our docker container) and a Secret (it will contain all sensitive information about how the *Pod* should connect to *Azure File Share*).

### Creating a Secret for Azure File Share connection settings

*Secrets* in *Kubernetes* can be created either using kubectl or by specifying it in a configuration file using `yaml` or `json`. If you want to describe your secret using a configuration file, you've to encode values manually as `base64` upfront.

On macOS or Linux this can be done using:

```bash
echo -n "Any value that you want to encode" | base64

> QW55IHZhbHVlIHRoYXQgeW91IHdhbnQgdG8gZW5jb2Rl

```

Take the name of your storage account and the storage account connection string and encode them.
Now create a new file, call it `azure-file-share-deployment.yaml` and open it in your favorite editor. Add the following code to define the secret.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: azure-file-share-secret
type: Opaque
data:
  azurestorageaccountname: Rm9sbG93IHRoZSB3aGl0ZSByYWJiaXQ=
  azurestorageaccountkey: ZGV2ZWxvcGVycyBsb3ZlIGJhY29ucyBhbmQgbGFzZXJzLCBkb250IHlvdT8gTGVhdmUgYSBjb21tZW50IGlmIHlvdSBkZWNvZGVkIHRoaXMgOkQ=

```

## Creating the actual Kubernetes deployment

The deployment can also be expressed using `yaml`. We'll use the official Volumes API from *Kubernetes* to connect our *Pod* to *Azure File Share* and mount the file share to `/app/mnt/azure`
Edit the `azure-file-share-deployment.yaml` to look similar to this

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: azure-file-share-secret
type: Opaque
data:
  azurestorageaccountname: Rm9sbG93IHRoZSB3aGl0ZSByYWJiaXQ=
  azurestorageaccountkey: ZGV2ZWxvcGVycyBsb3ZlIGJhY29ucyBhbmQgbGFzZXJzLCBkb250IHlvdT8gTGVhdmUgYSBjb21tZW50IGlmIHlvdSBkZWNvZGVkIHRoaXMgOkQ=
---
apiVersion: apps/v1beta1
kind: Deployment
metadata:
  name: azure-file-share-deployment
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: azure-file-share-sample
    spec:
      containers:
      - name: azure-file-share-sample
        image: <YOUR_ACR_NAME>.azurecr.io/azure-file-share-sample
        ports:
        - containerPort: 80
        imagePullPolicy: Always
        volumeMounts:
        - name: azure-fs
          mountPath: /app/mnt/azure
      imagePullSecrets:
      - name: <ACR_SECRET> # if you want to use ACR
      volumes:
      - name: azure-fs
        azureFile:
          secretName: azure-file-share-secret
          shareName: acs-file-share
          readOnly: true

```

So that's a lot. But let's look at the essential things. Most important is the *volume* definition underneath volumes. That's where we provide a name for our volume and forward the configuration values from our *secret*(referenced by name). We also specify the volume to be read-only because our API is only allowed to serve files from there.

The second thing is inside of the container definition. we *mount* the `volume` to a local directory at `/app/mnt/azure` and again the `volume` that should be mounted if referenced by its name `azure-fs` in our example.

## Deploying to Kubernetes

Deploying to *Kubernetes* is fairly simple. Just navigate to the folder where your `azure-file-share-deployment.yaml` is located and execute:

```bash
kubectl create -f azure-file-share-deployment.yaml

```

Check the pod deployment by executing `kubectl get pods` after a couple of seconds your *Pod* should be there and print `status` as `running`.
Normally you've to create a *Service* in *Kubernetes*, which will automatically deploy *Azure Load Balancer* 🚀 to expose your service to the public world. But for **demonstration purpose or development** you can also use the handy `kubectl port-forward` command.

```bash
kubectl port-forward <POD_NAME> 5000:80

```

This command will block the terminal and forward all requests to your local port `5000` to port `80` of the Pod.
Open your browser and navigate to `http://localhost:5000/api/image` and it should return this beautiful image.

{% include image-caption.html imageurl="/assets/images/posts/2017/azure-files-in-kubernetes-2.png" 
title="Our docker image delivered by ASP.NET Core from an Azure File Share" caption="Our docker image delivered by ASP.NET Core from an Azure File Share" %}

## Recap

As you can see it's fairly easy to use powerful services offered by Azure and use them to build your cloud-native applications based on *Docker* and *Kubernetes*.
