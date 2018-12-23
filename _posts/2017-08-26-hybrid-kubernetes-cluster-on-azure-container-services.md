---
title: Hybrid Kubernetes Cluster on Azure Container Services
layout: post
permalink: hybrid-kubernetes-cluster-on-azure-container-services
published: true
tags:
  - Kubernetes
  - Azure
  - Azure Container Service
excerpt: 'In this article, I describe how to spin up a hybrid Kubernetes Cluster using acs-engine. You''ll deploy a Linux and a Windows Pod to the same Kubernetes cluster and expose them to the public.'
featured_image: /assets/images/posts/feature_images/2017-08-26-hybrid-kubernetes-cluster-on-azure-container-services.jpg
---
Using Azure Container Services (ACS) you can easily build hybrid kubernetes clusters. In this context, hybrid means that you’ll end up having a kubernetes cluster with both, Linux Nodes and Windows Nodes.

In this article I’ll guide you through the process of creating a new hybrid kubernetes cluster on Azure Container Services. 

## Prerequisites
When starting from scratch, you need only a few things:

 * a Microsoft Azure Account
 * a Text Editor
 * a local installation of `kubectl`
 * [Azure CLI 2.0](https://docs.microsoft.com/en-us/cli/azure/overview) installed on your machine

## Configuring Azure CLI

Once you’ve all the prerequisites in place, it’s time to care a bit about our Azure Subscription.

```bash
# Login (browser will open to authorise your Azure CLI installation)
az login

# Print available subscriptions
az account list -o table

# set the subscription of your choice
az account set --subscription <SUBSCRIPTION_ID>
    
# create a new resource group for the hybrid k8s cluster
az group create --location westeurope --name hybrid-k8s

```

Okay, so now you’ve configured `az` (the Azure CLI) to interact with the subscription of your choice and created a new *Azure Resource Group* in that subscription.

You can deploy the resource group to any other location supporting ACS deployments. You can get a list of all locations using

```bash
az account list-locations -o table

```

Azure offers [a website showing all types of resources and the regions](https://azure.microsoft.com/en-us/regions/services/) they’re available at.

## Configure your Kubernetes cluster using acs-engine
ACS provides default configurations for various container orchestrators like *Kubernetes*. Those default configurations are deploying regular Linux Nodes if considering a *Kubernetes* cluster. It’s definitely a good starting point, but currently, there are no default configurations for hybrid clusters.

Fortunately, you can [use acs-engine to create your own cluster configurations](https://github.com/Azure/acs-engine).*acs-engine* is a small binary used to translate cluster configurations to Azure Resource Manager Templates. acs-engine is available for all platforms. 

 > You can either install [the pre-compiled binaries](https://github.com/Azure/acs-engine/releases) Or build it directly from source following [these instructions](https://github.com/Azure/acs-engine/blob/master/docs/acsengine.md#build-acs-engine-from-source). 
 
Verify the installation by executing `acs-engine version`. Depending on the chosen version you should get a similar result like

{% include image-caption.html imageurl="/assets/images/posts/2017/acs-engine-hybrid-1.png" 
title="Verify acs-engine Installation" caption="Verify acs-engine Installation" %}

## Building a cluster configuration file 

As mentioned above, `acs-engine` takes a configuration file an produces an *Azure Resource Manager Template* which will be used later on to deploy the *Kubernetes* cluster.

The `acs-engine` repository provides some example configuration files which could be used as a starting point. They’re also providing a hybrid cluster configuration that we’ll use now to configure our new cluster.

```bash
# create a new working directory
mkdir hybrid-k8s
cd hybrid-k8s

# Download the configuration template and it's env. file
wget https://raw.githubusercontent.com/Azure/acs-engine/master/examples/windows/kubernetes-hybrid.json .

wget https://raw.githubusercontent.com/Azure/acs-engine/master/examples/windows/kubernetes-hybrid.json.env .

# if you don't have wget installed, browse those two urls 
# and download the files manually to the project folder

```

The `env.` file specifies the expected number of nodes. So you can leave it as it is. But the configuration file itself, `kubernetes-hybrid.json`, needs some further contextual information. First and most important you need a *Service Principal* which *ACS* will use to configure the cluster directly in Azure.

## Create a Service Principal

A *Service Principal* can either be created using the Azure Portal at https://portal.azure.com or by using the Azure CLI.

```bash
az ad sp create-for-rbac 
  --role Contributor 
  --scopes="/subscriptions/<SUBSCRIPTION_ID>"

```

Replace `<SUBSCRIPTION_ID>` with the id of your Azure Subscription (selected at the beginning of this article). `az` will print important metadata about the newly generated *Service Principal*.

{% include image-caption.html imageurl="/assets/images/posts/2017/acs-engine-hybrid-2.png" 
title="A new Azure Service Principal has been created" caption="A new Azure Service Principal has been created" %}

## Updating the configuration file

Open the `kubernetes-hybrid.json` file in the editor of your choice. If you’re using Visual Studio Code, you can launch it immediately from the terminal using

```bash
# Assuming you're still in the project folder ~/hybrid-k8s/
code kubernetes-hybrid.json

```


While writing this article, the example configuration has two issues which needs to be fixed in order to generate the *Azure Resource Manager Template* successfully. Both fixes are related to the `servicePrincipalProfile` object located at the end of the configuration file. Verify that you’ve two properties on that object. One called `servicePrincipalClientID` and the second called `servicePrincipalClientSecret`. Also, verify the proper casing of those property names.

Take the `appId` from your *Service Principal* and use it as value for `servicePrincipalClientID` and take the `password` from your *Service Principal* and use it as value for `servicePrincipalClientSecret`.

Finally, you’ve to specify the `dnsPrefix`, the `usernames` and `passwords` for the different machines and for accessing the Linux node using ssh you’ve to provide your `publicKey`.
The configuration file should look similar to this.

{% include image-caption.html imageurl="/assets/images/posts/2017/acs-engine-hybrid-3.png" 
title="The hybrid Kubernetes cluster configuration" caption="The hybrid Kubernetes cluster configuration" %}

## Build and deploy the ARM Template 

Build *Azure Resource Manager Template* using the following command:

```bash
acs-engine generate ./kubernetes-hybrid.json

```

`acs-engine` will create a new `_output` directory, which contains another directory named like the `dnsPrefix` specified in your configuration file. Move to that directory using `cd _output/hybridk8s`.

Azure CLI is used to deploy the template to the Resource Group created at the beginning of the article.

```bash
az group deployment create 
  --name "k8s-hybrid-deployment" 
  --resource-group "hybrid-k8s" 
  --template-file ./azuredeploy.json 
  --parameters ./azuredeploy.parameters.json

```

While *Azure Resource Manager* is deploying your cluster, it’s the perfect time to grab a cup of ☕️, because spinning up all those resources will take a while.

## Connect to the cluster and deploy some pods

Once your cluster is up and running, it’s time to play a bit with it. Deploy some *Pods* and see *Kubernetes* in action. Let’s connect `kubectl` to your hybrid cluster. Go to the Azure Portal and copy the `FQDN` from the *Kubernetes* master virtual machine.

```bash
# Copy kubernetes remote config from the master using scp
# again assuming that your in ~/hybrid-k8s/
scp azureuser@<MASTER_FQDN>:.kube/config .
    
# Configure kubectl
export KUBECONFIG=`pwd`/config

```

Now you can examine your new cluster using well known `kubectl` commands like

```bash
# list all nodes
kubectl get nodes

# get cluster info
kubectl cluster-info

# access the dashboard (once running open http://127.0.0.1:8001/ui)
kubectl proxy

```

Using the *Kubernetes dashboard* you can visually navigate through your hybrid *Kubernetes* cluster

{% include image-caption.html imageurl="/assets/images/posts/2017/acs-engine-hybrid-4.png" 
title="The Kubernetes Dashboard" caption="The Kubernetes Dashboard" %}

## Spinning up a Windows Pod 
For demonstration purpose let’s create a simple *IIS Pod* on our new cluster. Save the following `yaml` to your project folder as `iis-pod.yaml`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: iis
  labels:
    app: sample-iis
spec:
  containers:
    - name: sample-iis
      image: microsoft/iis
      ports:
        - containerPort: 8000
  nodeSelector:
    beta.kubernetes.io/os: windows

```


Important is the `nodeSelector` at the end of the Pod definition. By specifying the `beta.kubernetes.io/os` selector and pointing it to `windows`, you tell *Kubernetes* to deploy the *Pod* only to nodes having the matching tag. Now deploy the *Pod* using:

```bash
kubectl create -f ./iis-pod.yaml
```

Deploying this pod may also take a while, the base image `microsoft/iis` is around 5 GB in size. So pulling the image to the Windows Node from the public docker hub will take a couple of minutes.

You can either use `kubectl describe pod iis` or the dashboard to get detailed information about the status of the *Pod*.

Once the Pod has been created, a *Kubernetes Service* is required to expose the Pod to the public world. Again you can either use `yaml` or `json` to create and deploy the service, or you use the handy `kubectl` command.

```bash
kubectl expose pods iis --name iis-service --port 80 --type=LoadBalancer

```


> Don’t use `kubectl expose` for creating services in production environments. Always use `yaml` or `json` configuration files.

To determine the public IP address created by the service (which is internally creating an *Azure Load Balancer*), use

```bash
kubectl get service

```

Which will return basic information about all existing services on the cluster. Browsing to the EXTERNAL-IP of the `iis-service` and you’ll see the beautiful welcome page from IIS. 🚀

{% include image-caption.html imageurl="/assets/images/posts/2017/acs-engine-hybrid-5.png" 
title="IIS running on our hybrid Kubernetes cluster" caption="IIS running on our hybrid Kubernetes cluster" %}

## Spinning up a Linux pod 

Let’s also verify a Linux Node, by deploying a basic *NGINX Pod* to our *Kubernetes* cluster. Again save the following `yaml` to your project folder and name the file `nginx-pod.yaml`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    app: sample-nginx
spec:
  containers:
    - name: sample-nginx
      image: nginx
      ports:
        - containerPort: 8000
  nodeSelector:
    beta.kubernetes.io/os: linux

```

This time, we specify `linux` as value for the tag `beta.kubernetes.io/os` to enforce our *Pod* being scheduled to a Linux Node. Again examine the state of the pod using `kubectl describe pod nginx`. This *Pod* should be up and running quickly because the *NGINX* image is just 107 MB in size.

Once the Pod is in state **Running**, expose it by creating another Service of type *LoadBalancer*.

```bash
kubectl expose pods nginx --name nginx-service --port 80 --type=LoadBalancer

```

As soon as Azure has allocated the public IP address and created the Load Balancer, you can use `kubectl get service` to get the external IP address. Finally, open it using your browser and enjoy the pretty *NGINX *welcome page. 🚀

{% include image-caption.html imageurl="/assets/images/posts/2017/acs-engine-hybrid-6.png" 
title="NGINX running on a Linux node in our Kubernetes cluster" caption="NGINX running on a Linux node in our Kubernetes cluster" %}

## Recap 

Hybrid *Kubernetes* clusters are the best runtime for complex applications. Different developer teams can use their favorite frameworks, languages, and tools to build and ship their applications. *Kubernetes* will allow them to scale and manage deployments easily. Because of the seamless integration, *Kubernetes* and Azure are taking containers to another level.

If you want to use *Kubernetes* in production or for development you should also consider using a private *Azure Container Registry* (ACR) and connect it to your cluster. I’ve published [an article on how to connect those over here]({{"/how-to-use-private-azure-container-registry-with-kubernetes" | absolute_url}}).

I hope you enjoyed the read and got some insights into ACS and hybrid *Kubernetes* clusters. Share this article on Facebook and Twitter and help other developers with their first steps on *Kubernetes* and Azure Container services.
