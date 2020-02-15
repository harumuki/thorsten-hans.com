---
title: The state of Helm 3 - Hands-On!
layout: post
permalink: the-state-of-helm3-hands-on
published: true
tags: [Kubernetes,Azure Kubernetes Service,Helm,CNCF]
excerpt: Helm 3 is approaching fast and comes with some fundamental changes. See what's happening and how those changes feel in Beta 3.
image: /packages-and-contianers.jpg
unsplash_user_name: Elevate
unsplash_user_ref: elevatebeer
---

Helm, is the package manager for Kubernetes. It allows you to install complex applications and maintain the entire application lifecycle using a lightweight and intuitive CLI.  You can think of it as the `npm` or `nuget` for Kubernetes.

Helm is around for quite some time in the Kubernetes community. The project was started by Deis and Google and is an essential part of CNCF.

Since Helm 3 is available as a beta release, it is the right time to look into it. This article summarizes the upcoming changes and illustrates how Helm 3 could be used to build, distribute, and manage applications in Kubernetes.

## What will change with Helm 3

Helm 3 will introduce some fundamental changes. The team has published already a series of articles on upcoming changes. Let's quickly summarize those:

{% include image-caption-external.html imageurl="https://raw.githubusercontent.com/helm/community/master/art/images/helm-3.png" width="300px"
title="Helm 3 - https://github.com/helm/community" caption="Helm 3 - https://github.com/helm/community" %}

**No more Tiller**: Finally, the server-side component of Helm is gone. Tiller was the most significant disadvantage when considering using Helm. Instead, *Helm 3* will rely on existing security patterns applied to the given cluster.

**Chart Registries**: Chart Registries will be implemented based on the Docker Distribution Project (aka Docker Registry v2). Helm will benefit from this move dramatically. Users can leverage existing Docker Registry v2 implementations such as Azure Container Registry (ACR) or the Docker Hub to distribute and consume their charts.  Hosting Helm Charts in a Docker Registry is possible due to the [Open Container Initiative (aka OCI)](https://www.opencontainers.org/){:target="_blank"} efforts. Docker Registries can store, maintain, and distribute any data - not just Docker Images. See the [ORCAS project for example](https://github.com/deislabs/oras){:target="_blank"}.

**Library Charts**: Helm 3 will introduce a new type of Charts. Library Charts are small application parts that are used to composite an overall application. Library Charts will be the reusable components of Charts in Helm 3. They don't contain templates, so they can't be deployed directly. They will become essential building blocks for developers to craft Application Charts and keep following the Don't Repeat Yourself principle (DRY).

**Release Management**: In Helm 3, releases will be managed inside of Kubernetes using Release Objects and Kubernetes Secrets. All modifications such as installing, upgrading, downgrading releases will end in having a new version of that Kubernetes Secret. The Release Object acts as a pointer, pointing to the correct Secret for the current Release. Having both (the Release Object and the Secret) in the same Kubernetes Namespace as the actual Deployment allows us to deploy the same Release (with the same name) multiple times to a Kubernetes cluster.  

**Requirements**: In 3, dependencies will no longer be maintained using the dedicated `requirements.yaml` file. Instead, the dependencies are directly listed inside of the `Chart.yaml` file, which means we as users have to care about fewer files.

## Hands on Helm 3

First you've to install Helm 3. You can grab a precompiled binary from the [releases page on GitHub](https://github.com/helm/helm/releases){:target="_blank"}. Once downloaded and extracted, you can either move the binary into your PATH, or create a symlink pointing to the executable. I've created a symlink called `helm3` which will I use during the upcoming snippets.

```bash
cd ~/Downloads
# Download Helm3 Beta3
wget https://get.helm.sh/helm-v3.0.0-beta.3-darwin-amd64.tar.gz

# verify checksum
shasum -a 256 -c <<< "88ef4da17524d427b4725f528036bb91aaed1e3a5c4952427163c3d881e24d77 *helm-v3.0.0-beta.3-darwin-amd64.tar.gz"

# extract into ~/Downloads/helm3
mkdir helm3
tar -xzf helm-v3.0.0-beta.3-darwin-amd64.tar.gz --directory helm3

# create a symlink
ln -s ~/Downloads/helm3/darwin-amd64/helm /usr/bin/helm3
```

### Verify Helm 3 installation

Because Tiller is gone, all you have to verify is the local installation using:

```bash
helm3 version

version.BuildInfo
{
  Version:"v3.0.0-beta.3",
  GitCommit:"5cb923eecbe80d1ad76399aee234717c11931d9a",
  GitTreeState:"clean",
  GoVersion:"go1.12.9"
}

```

### Create a Chart and deploy it to Kubernetes

First let's use the `create` sub command to create a new *Application Chart*. 

```bash
cd ~/dev
helm3 create hello-helm3

```

Take a close look at the generated `Chart.yaml` it explicitly specifies the `type` as `Application`. If you want to create a reusable *Library Chart*, you have to change the `type` setting to `library` and remove the templates.

For the sake of this article, let's stick with the simple *Application Chart* and bring our application to Kubernetes.

Helm3 allows multiple releases having the same name. For separation we will use regular Kubernetes namespaces.

```bash
# create two sample namespace
kubectl create namspace helm3-ns1
kubectl create namespace helm3-ns2

kubectl get ns | grep helm3
helm3-ns1         Active   3s
helm3-ns2         Active   2s

```

Having the namspaces in place, use `helm3 install` to install the previously created Chart to both namespaces.

```bash
cd ~/dev

helm3 install sample-deployment hello-helm3 -n helm3-ns1
helm3 install sample-deployment hello-helm3 -n helm3-ns2

```

Helm will provide some basic information about the deployment job for every deployment.

{% include image-caption.html imageurl="/assets/images/posts/2019/helm3-same-name-releases.png"
title="Helm Releases deployed to Kubernetes" caption="Helm Releases deployed to Kubernetes" %}

Verify the releases using `helm3 list`:

```bash
helm3 list --all-namespaces

```

{% include image-caption.html imageurl="/assets/images/posts/2019/helm3-list-same-name-releases.png"
title="List all currently deployed releases with Helm 3" caption="List all currently deployed releases with Helm 3" %}

Every deployment is tracked using a *Kubernetes Secret* in the same Namespace.

```bash
kubectl get secret -n helm3-ns1

NAME                   TYPE                                  DATA   AGE
sample-deployment.v1   helm.sh/release                       1      1m26s

```

### Modify the Chart and perform an upgrade

For demonstration purpose, udate the `hello-helm3` Chart and set `replicaCount: 2` in `values.yaml`. Remember to bump the `version` in `Chart.yaml`

```bash
helm3 upgrade sample-deployment hello-helm3 -n helm3-ns1

```

Helm will now upgrade the `sample-deployment` in Kubernetes Namespace `helm3-ns1`. As part of the upgrade process, a new *Secret* (`sample-deployment.v2`) will be deployed to the Namespace. In fact, Helm3 secrets contain the entire release in encrypted form. Once again, you can verify the overall state using `helm3 list --all-namespaces`

{% include image-caption.html imageurl="/assets/images/posts/2019/helm3-different-revisions-with-same-name-releases.png"
title="Helm 3 Listing different release revisions" caption="Helm 3 Listing different release revisions" %}

### Clean up the Kubernetes Cluster

You can clean up your Kubernetes cluster usign `helm3 uninstall`, which will remove **all** Helm 3 artifacts from the currrent namespace.

```bash
helm3 uninstall sample-deployment -n helm3-ns1
helm3 uninstall sample-deployment -n helm3-ns2

kubectl delete ns helm3-ns1
kubectl delete ns helm3-ns2
```

## Playground: Docker Image

If you want to play around with Helm 3 today, you can either install on of the pre-compiled beta binaries on your system, or you can use a tiny Docker Image. I have created and published it to the public Docker Hub at [thorstenhans/helm3](https://hub.docker.com/r/thorstenhans/helm3).

You can pull it directly via `docker pull thorstenhans/helm3`; further instructions are available in the [Readme](https://github.com/ThorstenHans/helm3-docker/blob/master/README.md){:target="_blank"}.

## Recap

I am looking forward to the final Helm 3 release. Tiller was always the reason why I avoid using Helm in real-world environments. I can imagine many Kubernetes customers will jump on the Helm track with the upcoming release.

HTH
