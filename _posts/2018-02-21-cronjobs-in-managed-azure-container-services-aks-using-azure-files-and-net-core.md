---
title: CronJobs on AKS using Azure Files and .NET Core
layout: post
permalink: cronjobs-in-managed-azure-container-services-aks-using-azure-files-and-net-core
redirect_from: /cronjobs-in-managed-azure-container-services-aks-using-azure-files-and-net-core-72c01599d011
published: true
tags:
  - Kubernetes
  - Azure
  - AKS
excerpt: 'CronJobs build an essential part of many applications. Often, you''ve to persist some kind of data from application artifacts like CronJobs. This article demonstrates how to build such a CronJob with Azure Files and run it on a Kubernetes cluster. '
image: /2018-02-21-cronjobs-in-managed-azure-container-services-aks-using-azure-files-and-net-core.jpg
---

Tasks need to be executed repeatedly in almost every application. We all know requirements like these. Perhaps you have to clean up some tables in the database or you've to delete temporary files, no matter which requirement you've exactly, but *CronJobs* in *Kubernetes* are exactly designed for scenarios like these.
*Kubernetes* offers *CronJobs* as first-class citizen objects. In the scope of *Kubernetes*, a *CronJob* should be used if you want to execute a piece of software either at a specified point in time or repeatedly at specified points in time.
Technically it's just a regular Pod with a schedule definition. You've to provide your schedule using the good old [cron format](https://en.wikipedia.org/wiki/Cron){:target="_blank"}.

If you want some nice cron string generator, go and check [crontab.guru](https://crontab.guru/){:target="_blank"}.

For demonstration purpose, we'll use a simple .NET Core Console Application. Each time you execute the app, a new text file with a unique name will be written to an output folder. In this case, the output folder is an *Azure File Share* created and powered by a simple *Azure Storage Account*. If you follow the instructions, you'll end up - as shown in the picture below -  with a new unique file on your *Azure File Share* every minute.

{% include image-caption.html imageurl="/assets/images/posts/2018/kubernetes-cronjob-azure-file-share.png"
title="Files create by the CronJob on Azure Files" caption="Files create by the CronJob on Azure Files" %}

## Kubernetes prerequisites

In order to use *CronJobs*, the *Kubernetes* cluster needs to be at least on version `1.8.0`. For earlier versions of Kubernetes, you have to enable `batch/v2alpha1` explicitly by sending `--runtime-config=batch/v2alpha1=true` to the *Kubernetes API server*. If you need further assistance on that task, [see the official docs here](https://kubernetes.io/docs/admin/cluster-management/#turn-on-or-off-an-api-version-for-your-cluster){:target="_blank"}.

You can easily check the version by executing `kubectl version` which will print both client and server version.

## Azure prerequisites

Obviously, you need an Azure subscription. Once you've access to an Azure subscription, an *Azure Storage Account* is the only additional requirement here. If you're using AKS, ensure the *Storage Account* is created in the same *Resource Group*.

```bash
# Login to Azure
az login

# Follow the instructions to authenticate

# create a new storage account
az storage account create
  --resource-group sampleresgroup
  --name mysamplestorageaccount
  --location westeurope
  --sku Standard_LRS

# read connection string for storage account and store it
CONNECTIONSTRING=$(az storage account show-connection-string
  --name mysamplestorageaccount
  --resource-group sampleresgroup
  --query 'connectionString' --output tsv)

# create a file share
az storage share create
  --name aks-cron
  --quota 2048
  --connection-string $CONNECTIONSTRING

```

@@ The .NET Core Application
The .NET Core Console application is very simple. It's just *File->New Project->Console Application*. All application code belongs to the `Main` method within `Program.cs`.

```csharp
# Program.cs

static void Main(string[] args)
{
    try
    {
        var folder = Environment.GetEnvironmentVariable("CronJobOutputFolder");
        var target = Path.Combine(folder, $"{DateTime.Now.Hour}-  
            {DateTime.Now.Minute}-{DateTime.Now.Second}.txt");

        File.WriteAllText(target, "42");
        Environment.Exit(0);
    } catch(Exception)
    {
        Environment.Exit(1);
    }
}

```

As you can see, the folder path for the files is read from an environment variable called `CronJobOutputFolder` at runtime.

## The Dockerfile

For building the image, I use a standard .NET Core two-step *Dockerfile*. The first stage is responsible for building and second stage for running the application.

```dockerfile
#Dockerfile
FROM microsoft/dotnet:sdk AS build-env
LABEL maintainer="Thorsten Hans<thorsten.hans@gmail.com>

WORKDIR /app
COPY *.csproj ./
RUN dotnet restore
COPY . ./
RUN dotnet publish -c Release -o out

FROM microsoft/dotnet:runtime
WORKDIR /app
COPY --from=build-env /app/out ./

ENTRYPOINT ["dotnet", "CronSample.dll"]

```

Because we're using `microsoft/dotnet:runtime` as the base image, the final docker image will be way smaller than sticking with the SDK image. It's about 1.8GB compared to 220MB.
Use `docker build` to create the image.

```bash
docker build -t somenamespace/cron-sample:latest .

```

Don't forget to push the image to a container registry. For demonstration purpose, I'll just push it to the public docker hub.

```bash
docker login
docker push somenamespace/cron-sample:latest

```

## Kubernetes resources

Let's get started with *Kubernetes*. Before we can concentrate on the *CronJob*, we've to ensure a proper integration of Azure Files. In order to do so, you need to provide Kubernetes with fundamental information required to connect to the Storage Account.

### Secret

First, we need to create a *Secret*, the secret will be responsible for providing the *Azure Storage Account Name* and the required *Key* in order to access to the *Azure File Share*.

```yaml
# azure-secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: azure-files-secret
type: Opaque
data:
  azurestorageaccountkey: BASE_64_ENCODED_STORAGE_ACCOUNT_KEY
  azurestorageaccountname: BASE_64_ENCODED_STORAGE_ACCOUNT_NAME

```

It is essential to keep the property names as mentioned in the script above. You can encode the required strings to `base64` using:

```bash
echo -n "mysamplestorageaccount" | base64

```

Deploy the secret to Kubernetes using `kubectl apply -f azure-secret.yaml`

### Persistent Volume

*Persistent Volumes* (*PV*) are cluster-wide storages, normally managed and attached by administrators. *PVs* are top-level kubernetes resources, that said, they're not associated with the LiveCycle of other resources like *Pods* or *Deployments*. Once created, they are available until someone removes them from the cluster.

```yaml
# persistent-volume.yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: azurefiles
spec:
  accessModes:
    - ReadWriteOnce
  capacity:
    storage: 1Gi
  azureFile:
    secretName: azure-files-secret
    shareName: aks-cron
    readOnly: false
  claimRef:
    namespace: default
    name: azure-fileshare

```

As you can see, sensible information is pulled from the `azure-files-secret`, the share `aks-cron` is referenced with `readOnly` set to `false`. `claimRef` represents the binding between the *PV* and the *Persistent Volume Claim* (*PVC*) which we'll create in a minute.

### Persistent Volume Claim

In Kubernetes, a *Persistent Volume Claim* (*PVC*) is a request for storage. You can compare it to a regular *Pod*, Pods are requesting CPU and Memory whereas PVC request storage. Let's create another `yaml` and request the previously created PV.

```yaml
# persistent-volume-claim.yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: azure-fileshare
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi

```

Deploy both artifacts, the PV followed by the PVC

```bash
kubectl create -f persistent-volume.yaml
kubectl create -f persistent-volume-claim.yaml

```

## CronJob

Now it's time to describe and deploy the most important thing, our *CronJob*. The CronJob will reuse the `podspec` you may already be familiar with.

```yaml
# cronjob.yaml
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: hello
spec:
  schedule: "* * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: samplecron
              image: somenamespace/cronjob-sample:latest
              env:
              - name: CronJobOutputFolder
                value: "/var/cron-logs"
              volumeMounts:
                - mountPath: "/var/cron-logs"
                  name: volume
          volumes:
            - name: volume
              persistentVolumeClaim:
                claimName: azurefile

```

As you can see within the `podspec`, we mount the `volume` to `/var/cron-logsand` provide this path as environment variable (`CronJobOutputFolder`) which we've used in our .NET Core app previously.
The second important aspect is, of course, the cron string at `spec.schedule`. Form demonstrating purpose I want the CronJob to be executed every minute. Deploy the CronJob to your cluster by executing

```bash
kubectl apply -f cronjob.yaml

```

Now it's the perfect time to grab a cup of coffee. Let the CronJob do its work for a couple of times.

----

Once back. You can either mount the share to your host using *Windows Explorer* and *Finder* or you can just use the *Azure Portal*. You should immediately find some logs in the file share and every minute a new one should appear.

Integrating *Azure Files* is fairly easy, but depending on your use-case and the number of write operations you may consider other storage options. You can also use *Azure Disks* in the same way, the PC specification can deal with tons of different storage services. A complete list of all currently supported storage services is available [in the official kubernetes documentation](https://kubernetes.io/docs/admin/cluster-management/#turn-on-or-off-an-api-version-for-your-cluster){:target="_blank"}.

The entire sample is also [available on GitHub, go, download the code and play around](https://github.com/ThorstenHans/kubernetes-samples/tree/master/CronJob-with-Azure-Files){:target="_blank"}.

Using external storage services is essential when building cloud-native applications. Containers can and will fail. Saving important, persistent files to the filesystem of a container should not happen in your application. That said, you should definitely be familiar with integrating services like Azure Files or Azure Disks.
