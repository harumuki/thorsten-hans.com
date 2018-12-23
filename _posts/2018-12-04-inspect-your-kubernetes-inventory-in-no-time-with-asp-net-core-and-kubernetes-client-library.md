---
title: Inspect your Kubernetes inventory in no time with ASP.NET Core and Kubernetes Client Library
layout: post
permalink: inspect-kubernetes-inventory-with-aspnetcore-kubernetes-client-library
published: true
tags: [Kubernetes, Azure, AKS, NETCore]
excerpt: 'Learn how to use the C# Kubernetes Client library to query Kubernetes inventory and expose it via HTTP using a simple ASP.NET Core WebAPI which will be directly deployed to an AKS cluster as Deployment.'
featured_image: /assets/images/posts/feature_images/2018-12-04-inspect-your-kubernetes-inventory-in-no-time-with-asp-net-core-and-kubernetes-client-library.jpg
---
Running and maintaining complex applications on Kubernetes often requires good monitoring capabilities. Sure, there are plenty of products available which can be deployed easily to an existing cluster to get insights about the current cluster inventory. But why not build your own? 

In this post, I’ll guide you through the process of creating a simple ASP.NET Core Web API to expose your cluster’s inventory  -  such as Pods for example -  to other applications in order to get exactly those insights that are important for you. I used the following example frequently during public talks to explain the core concepts of *Kubernetes* to .NET developers. 

## Requirements
In order to follow this guide, you need to have access to a /Kubernetes/ cluster and the following tools should be installed and configured on your developer machine

 * `docker`
 * `kubectl`
 * `dotnet`
  
If you’re not yet familiar with `docker`, `kubectl` or `dotnet`,  check out one of the great online tutorials on those.

## The .NET Core API project

Although I’ve chosen .NET as a framework, I prefer creating new projects from the command line. So let’s get started with the API itself. The following bash commands create a new ASP.NET Core project with all the required folders and files.

```bash
~ mkdir KubeInspector && cd KubeInspector

dotnet new web -n KubeInspector -o .

dotnet add package KubernetesClient

mkdir Repositories Controllers Models

touch Repositories/KubernetesRepository.cs 
touch Controllers/Kubernetes 
touch Controller.csModels/PodListModel.cs

```

For demonstration purpose, we’ll create a simple model to represent Pods when asking for a list of all pods in a given Namespace. Add the following code to `Models/PodListModel.cs`

```csharp
namespace KubeInspector.Models
{
  public class PodListModel
  {
 
    public string Id { get; set; }
    public string Name { get; set; }
    public string NodeName { get; set; }
  }
}

```

Next, it’s time to query all pods form Kubernetes using the `KubernetesClient` library. This is straightforward, especially if your code will be executed within the cluster. Add the following code to `Repositories/KubernetesRepository.cs`

```csharp
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using k8s;
using KubeInspector.Models;

namespace KubeInspector.Repositories 
{
  public interface IKubernetesRepository 
  {
    Task<IEnumerable> GetPodsAsync(string ns = "default");
  }
    
  public class KubernetesRepository : IKubernetesRepository 
  {
    private readonly Kubernetes _client;
    
    public KubernetesRepository() 
    {
      _client = new Kubernetes(
        KubernetesClientConfiguration.InClusterConfig()
      );
    }
    
    public async Task<IEnumerable> GetPodsAsync(string ns = "default")
    {
      var pods = await _client.ListNamespacedPodAsync(ns);
      return pods
        .Items
        .Select(p => new PodListModel 
          {
            Name = p.Metadata.Name,
            Id = p.Metadata.Uid,
            NodeName = p.Spec.NodeName
    	  });
    }
  }
}

```

As you can see, the `InClusterConfig` method is used, to tell the client library that the code is executed within a Kubernetes cluster. There are alternative ways to load the actual configuration, for example, you can also use `KubernetesClientConfiguration.BuildConfigFromConfigFile` to load the configuration from a file which could be mounted to the controller at runtime using a volume.

The API surface for the single endpoint is also fairly easy, add the following code to `Controllers/KubernetesController.cs`

```csharp
using System;
using System.Threading.Tasks;
using KubeInspector.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace KubeInspector.Controllers 
{

  [ApiController]
  [Route("api/kubernetes")]
  public class KubernetesController : ControllerBase 
  {

    private readonly IKubernetesRepository _repository;

    public KubernetesController(IKubernetesRepository repository)
    {
      _repository = repository;
	}

	[HttpGet]
	[Route("pods/{ns:alpha:required}")]
	public async Task GetPodsAsync(string ns = "default") 
	{
	  if (!ModelState.IsValid) 
	  {
		return BadRequest ();
	  }

	  try
	  {
		var pods = await _repository.GetPodsAsync (ns);
		return Ok (pods);
	  }
	  catch(Exception) 
	  {
		return StatusCode (500);
	  }
	}
  }
}

```

The final step in the API project is to change the `Startup.cs`, here several things have to be changed. For example, you’ve to register `KubernetesRepository` for the interface `IKubernetesRepository` in DI and you’ve to set up `MVC` itself.

```csharp
using KubeInspector.Repositories;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;

namespace KubeInspector
{

  public class Startup
  {

    public void ConfigureServices(IServiceCollection services)
    {
	  services.AddMvc();
	  services.AddTransient<IKubernetesRepository, KubernetesRepository>();
    }
     
    public void Configure(IApplicationBuilder app,IHostingEnvironment env)
    {
      if(env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }
      app.UseMvc();
    }
 
  }
}

```

That’s it for the API. If you want to deploy this API to a production cluster, you should consider additional configurations like `compression`, `CORS` or `Authentication` and `Authorization`. For demonstration purpose, we keep it as it is for now.

## Build and publish the Docker image

Next, you’ve to create and publish the docker image. In my guide, I’ll use Azure Container Registry as a target. You can use your own private registry or public docker hub. Make sure, you are authenticated.

Add a `.dockerignore` to the root directory of the project and add the following content

```dockerignore
bin/
obj/

```

Next, add a `Dockerfile` to the root folder and let’s bring up a simple Dockerfile for a .NET Core application as shown below

```dockerfile
FROM microsoft/dotnet:2.1-sdk as builder
WORKDIR /app
ADD . .
RUN dotnet publish -c Release -o ./out

FROM microsoft/dotnet:2.1-aspnetcore-runtime
WORKDIR /app
COPY --from=builder /app/out .
EXPOSE 80

CMD ["dotnet", "KubeInspector.dll"]

```

With both files in place, it’s time to build and publish the image

```bash
docker build . -t yourregistry.azurecr.io/kubeinspector:latest

docker push yourregistry.azurecr.io/kubeinspector:latest

```

## Create a Kubernetes Deployment

Having the image stored in your container registry, we can now focus on the Kubernetes Deployment. Create a `Deployment.yaml` in the root directory and add the following content:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kubeinspector-deployment
spec:
  selector:
    matchLabels:
      component: kubeinspector
  replicas: 1
  template:
    metadata:
      labels:
        component: kubeinspector
    spec:
      containers:
        - name: kubeinspector-container 
          image: yourregistry.azurecr.io/kubeinspector:latest 
          ports:
            - containerPort: 80

```

Deploy it to your cluster with the following `kubectl` command

```bash
kubectl create -f Deployment.yaml

```

It may take a couple of seconds until Kubernetes scheduled the deployment and pulled the image from your container registry. Have a look at the list of pods and wait until the pod (starting with name `kubeinspector-deployment` is in state **Running**).

```bash
kubectl get pods -w

```

`CTRL-C` once the pod is in state **Running**.

## Access the API

Normally, you would deploy a Kubernetes Service to your cluster, which would make the API accessible. For demonstration purpose, let’s just set up a port-forwarding here:

```bash
kubectl port-forward kubeinspector-deployment-some-id 8080:80

```

Now you can use a tool like Postman or just your browser to examine the endpoint. Issue a `GET` request to `http://127.0.0.1:8080/api/kubernetes/pods/default` which will show all the pods in the namespace you’ve selected. For example, see the attached response from my demonstration cluster:

{% include image-caption.html imageurl="/assets/images/posts/2018/inspect-kubernetes-cluster-netcore.png" 
title="Exposed Pods from the default namespace" caption="Exposed Pods from the default namespace" %}

So as you can see, it’s really easy to query an existing Kubernetes cluster using the official client libraries. In addition, I think it’s a great example for .NET developers that explains how to get started with Kubernetes at all. If you want to query more data, you should definitely check out [the official repository](https://github.com/kubernetes-client/csharp).

If you’re more interested in different programming languages check out [all another official Kubernetes Client Libraries here](https://github.com/kubernetes-client).
