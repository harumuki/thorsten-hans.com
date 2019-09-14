---
title: Deploy Azure Functions to Kubernetes and scale them automatically
layout: post
permalink: deploy-azure-functions-to-kubernetes-and-scale-them-automatically
redirect_from: /deploy-azure-functions-to-kubernetes-and-scale-them-automatically-8c9f44209bb
published: true
tags:
  - Kubernetes
  - Azure Functions
  - Docker
  - AKS
excerpt: Learn how to take the official Azure Functions runtime and deploy it as Docker container to a Kubernetes cluster and  by adding horizontal pod autoscaling (HPA) you can handle almost any load automatically.
image: /2018-01-26-deploy-azure-functions-to-kubernetes-and-scale-them-automatically.jpg
---

*Azure Functions* has become my standard framework to build *serverless* backends for *Single Page Applications* (SPAs). It's easy to get started with *Azure Functions*, although the platform itself is really powerful and highly configurable. I really love the cloud hosting capabilities for *Azure Functions*, but from time to time, it's not allowed to use the public cloud as the deployment target.

*Azure Functions* can easily be hosted in different environments. You can download the entire runtime and execute it on-premises (if you have to) or you can use the existing *Docker* image and deploy your serverless backend to *Kubernetes*. And that's exactly what this post will describe, you'll create a sample Azure Function including a docker container, deploy it to a Kubernetes cluster and let it automatically scale based on CPU utilization.

## What do you need

In order to follow the instructions in this article, you need several things installed and configured on your system.

- [.NET Core 2.0](https://www.microsoft.com/net/){:target="_blank"}
- [Docker](https://www.docker.com/){:target="_blank"}
- An account for a Docker Registry (eg. [Docker Hub](https://hub.docker.com/){:target="_blank"} or [ACR](https://azure.microsoft.com/en-us/services/container-registry/){:target="_blank"})
- Access to a Kubernetes cluster (eg. [AKS](https://azure.microsoft.com/en-us/services/container-service/){:target="_blank"}, [Minikube](https://github.com/kubernetes/minikube){:target="_blank"}, [GCP](https://cloud.google.com/kubernetes-engine/docs/?hl=de){:target="_blank"} , …)
- [Functions Core Tools 2.0](https://github.com/Azure/azure-functions-cli){:target="_blank"} (previously known as Azure Functions CLI)
  
Once you've installed and configured those tools, you're set and it's time to get started.

## Creating the Azure Function Sample

*Functions Core Tools* allow you to spin up new Azure Function projects quickly. The Command Line Interface (CLI) accepts various arguments. For demonstration purpose, we'll just use the `--sample` argument which will create a small Azure Function which receives a name (`string`) from the `QueryString` using an `HTTP` trigger and produces a new `HTTP Response`. As second argument we'll use `--docker` which instructs CLI to generate a `Dockerfile` for our new *Azure Function*.

```bash
mkdir azfunction-on-k8s && cd azfunction-on-k8s

func init --sample --docker

```

That's it. Our new Azure Function has been created, including the required `Dockerfile`.

## Create the Docker image

I'll use public [Docker Hub](https://hub.docker.com/){:target="_blank"} for now, but I'll also work with your ACR service running in Azure. So let's build the docker image by leveraging the generated `Dockerfile`. Remember to tag your image properly – depending on your registry.

```bash
docker build -t <%YOUR_REPOSITORY%>/azfunction-on-k8s .

```

Docker will now instruct the service to pull all required filesystem layers and follow the instructions from the `Dockerfile` to build the image. Once the command has finished, you will find the new image when executing `docker images`, docker automatically assigns the `latest` tag to the image if you don't specify a tag manually.

## Push the Docker image to the registry

In order to push the docker image to your registry, you have to be authenticated. Once authenticated (by following the instructions from `docker login`), you can push the image to the registry.

```bash
docker login
docker push <%YOUR_REPOSITORY%>/azfunction-on-k8s

```

You can visit the website of your registry (eg. https://hub.docker.com) or the Azure Portal to verify the existence of your image.

## Connect to your Kubernetes cluster

First, let's connect to the correct Kubernetes cluster. `kubectl` has a concept of `contexts`, each unique Kubernetes cluster has a context. To examine the contexts known by your `kubectl` installation and set the context to use your favorite cluster.

```bash
kubectl config get-contexts

```

You'll receive a list of registered contexts, where one of those is marked as current context (in the first column).

{% include image-caption.html imageurl="/assets/images/posts/2018/azure-functions-kubernetes-1.png"
title="Contexts for kubectl" caption="Contexts for kubectl" %}

We will be using minikube for this post, so let's ensure minikube is up and running and change the `kubectl` context to `minikube`.

## Preparing minikube to support autoscaling

`Minikube` is a lightweight Kubernetes cluster for usage on your local development machine. That said, by default, not all required features are activated to use autoscaling on minikube. Minikube offers some so-called add-ons. In order to use autoscaling based on metrics, the **heapster** add-on needs to be enabled. You can get a list of all add-ons by executing

```bash
minikube addons list

```

{% include image-caption.html imageurl="/assets/images/posts/2018/azure-functions-kubernetes-2.png"
title="Minikube add-ons with disabled heapster" caption="Minikube add-ons with disabled heapster" %}

As you can see, **heapster** is disabled, let's enable it now.

```bash
minikube addons enable heapster

```

> It's important to enable heapster before deploying our docker image yo the cluster

{% include image-caption.html imageurl="/assets/images/posts/2018/azure-functions-kubernetes-3.png"
title="Minikube add-ons: heapster enabled" caption="Minikube add-ons: heapster enabled" %}

## Deploying to the Kubernetes cluster

Let's deploy our docker image to the k8s cluster. Normally you would create a deployment using a simple `yaml` file, but for demonstration purpose, we'll just use the `kubectl` command for now. For real deployments, you always want to use a proper `yaml` deployment definition.

```bash
kubectl run azure-function-on-kubernetes
  --image=<%YOUR_REPOSITORY%>/azfunction-on-k8s
  --port=80
  --requests=cpu=100m

```

This creates a new *Kubernetes deployment* named `azure-function-on-kubernetes` based on your docker image. It'll expose the port `80`. By specifying `--requests=cpu=100m`, we request *100 millicpu* for our container. So it's *0,1 actual CPU*. (Further [details on resource management for containers and pods can be found here](https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/){:target="_blank"}).

Once your deployment has the desired state (check it by querying `kubectl get deploy`), we need to expose it using a `service`. Normally you would use a service of type `LoadBalancer`, but allocating external IP addresses (that's what the `LoadBalancer` also has to do…) is only implemented by (private and public) cloud vendors. As an alternative, we'll use a service of type `NodePort` and query the `url` manually from *minikube*.

```bash
kubectl expose deployment azure-function-on-kubernetes --type=NodePort

```

Wait for the service to be created using `kubectl get svc -w` (stop watching using `CTRL+C`) and grab the `url`.

```bash
minikube service azure-function-on-kubernetes --url

```

*Minikube* will immediately print the URL where you can access the *Azure Function* at. Give it a try, open a browser and navigate to the url, first you should see the Azure Function welcome page. In order to access the actual function, you've to append the path to the function which is `/api/httpfunction/?name=<%YOUR_NAME%>`. So in my case, the absolute url is `http://192.168.99.100:30518%5D/api/httpfunction/?name=Thorsten`.

{% include image-caption.html imageurl="/assets/images/posts/2018/azure-functions-kubernetes-4.png"
title="The Sample Azure Function has been invoked successfully" caption="The Sample Azure Function has been invoked successfully" %}

## Enable Autoscaling

The funny part of this article is of course autoscaling. We all want to see Kubernetes taking care of our containers and pods and *dynamically scale the application based on actual load*. 🤘🏼🚀

`HorizontalPodAutoscaler` is also a first citizen object in Kubernetes which can also be described in `yaml` for real deployments, you definitely want to create a `yaml` file instead of using the corresponding `kubectl` command.

```bash
kubectl autoscale deploy azure-function-on-kubernetes
  --cpu-percent=30
  --max=30
  --min=1

```

This command tells Kubernetes to scale the number of pods up to `30`. If the *CPU utilization hit's 30%* new pods will automatically be deployed. Since version `1.6.0` of Kubernetes you can also configure delays for down- and upscaling. By default Kubernetes will delay downscaling by **5 minutes** and upscaling by **3 minutes**. To change the default just append `--horizontal-pod-autoscaler-downscale-delay=10m0s` and `--horizontal-pod-autoscaler-upscale-delay=1m0s`.

## Let's generate some load

Now that everything is in place, it's time to generate some load. There are plenty of different ways how to achieve this. The easiest way is to just use a `while` command right inside of the terminal like shown below or you can follow the instruction in the official k8s docs and create a small pod, which will issue HTTP requests as long as the pod is running.

### Option 1: Generate load from the terminal

Open a new instance of your favorite terminal (BTW: I prefer iTerm) and execute the following command (each line committed by `RETURN`)

```bash
while true
do
wget -q -O- http://192.168.99.100:30518]/api/httpfunction/?name=Thorsten
done
```

You can cancel the requests by simply hitting `CTRL+C`

### Option 2: Generate load using a pod

Open a new instance of your favorite terminal. As described in Kubernetes docs, you can use the `busybox` image with interactive `tty` to generate a *Pod* which will put some load on the Azure Function. Spinning up this pod using `kubectl` is straightforward.

```bash
kubectl run -i
  --tty azure-fn-loadgenerator
  --image=busybox /bin/sh

# Hit RETURN for command prompt

while true; do wget -q -O- http://192.168.99.100:30518]/api/httpfunction/?name=Thorsten; done

```

If you want to stop the pod, remember that `kubectl run` will always create a deployment. That said, you've to exit the containers prompt and delete the deployment using `kubectl delete deploy azure-fn-loadgenerator`.

## Inspect the cluster

Keep the load generator running in the background and move to the second terminal instance or tab. If you're using an *Azure Container Services Kubernetes cluster*, you can use `kubectl get horizontalpodautoscalers` or the shortcut `kubectl get hpa` to see the utilization and the ongoing scaling. Unfortunately, this doesn't work – at least with my – *minikube* installation.

But there is another way how to see the autoscaling action. You can have a look at the *Kubernetes dashboard*. Just execute `kubectl proxy` and open the reported URL in the browser. Depending on your *Kubernetes version* you may have to manually add `/ui` to the URL in order to access the dashboard.

Inside the *Kubernetes dashboard* you find all information about your k8s cluster. As you can see in the picture below, Kubernetes already scaled my deployment, I've right now 10 instances of my *Pod* running and dealing with the incoming load. If you pay attention to the Age column, you see that those pods have different ages.

{% include image-caption.html imageurl="/assets/images/posts/2018/azure-functions-kubernetes-5.png"
title="Kubernetes cluster with autoscaled deployment" caption="Kubernetes cluster with autoscaled deployment" %}

## Stop the Load and verify downscaling

Stop the load generation as described above. Depending on your custom downscale delay it'll take some time until Kubernetes will kill some of your pods. Navigate to the k8s Dashboard and see the pods disappearing 😀

{% include image-caption.html imageurl="/assets/images/posts/2018/azure-functions-kubernetes-6.png"
title="Kubernetes cluster with downscaled deployment" caption="Kubernetes cluster with downscaled deployment" %}

## Recap

Kubernetes autoscaling is really powerful and from a developers perspective it makes fun using it. It's just amazing to see *Kubernetes* spinning up a new instance of your pods **to enforce the desired state**. I hope you enjoyed the read and got some new ideas.
