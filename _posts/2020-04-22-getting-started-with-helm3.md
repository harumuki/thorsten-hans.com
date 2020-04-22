---
title: Getting started with Helm 3
layout: post
permalink: getting-started-with-helm3
published: true
tags: 
  - Kubernetes
  - Helm
excerpt: This Helm 3 tutorial helps you to get started with the latest version of the famous Kubernetes package manager. Grow fast and master Helm 3.
image: /cubes.jpg
unsplash_user_name: Christian Fregnan
unsplash_user_ref: christianfregnan
---

[Helm 3](https://helm.sh){:target="_blank"} is around for a couple of months now. During that time, I recognized more and more customers willing to use Helm 3 to package, distribute, and construct their cloud-native application bundles. Perhaps you have already heard of Helm, but don't know where to start with Helm exactly? Or you want to learn the differences between Helm 2 and Helm 3. Again others, prefer having all essential information compiled into a single article. Then this is the right one for you! See this post as an introduction to Helm 3; it explains all the major building-blocks and provides - just - enough background information to get started with Helm 3.

---

- [What is Helm](#what-is-helm)
  - [Why is Helm 3 way better than Helm 2](#why-is-helm-3-way-better-than-helm-2)
- [Helm 3 Building Blocks](#helm-3-building-blocks)
  - [What are Helm Charts](#what-are-helm-charts)
  - [Release](#release)
  - [Chart Metadata](#chart-metadata)
  - [Helm Templates](#helm-templates)
  - [Values in Helm](#values-in-helm)
- [The Helm 3 CLI](#the-helm-3-cli)
  - [Installing Helm 3 CLI](#installing-helm-3-cli)
  - [8 noticeable sub-commands of Helm 3 CLI](#8-noticeable-sub-commands-of-helm-3-cli)
  - [Helm CLI autocompletion for Bash & ZSH](#helm-cli-autocompletion-for-bash--zsh)
- [Creating Helm Charts](#creating-helm-charts)
  - [Create a Helm chart manually](#create-a-helm-chart-manually)
- [Helm Release Lifecycle](#helm-release-lifecycle)
  - [Packaging Helm charts](#packaging-helm-charts)
  - [Creating a Release (install a chart)](#creating-a-release-install-a-chart)
  - [Verifying a Release](#verifying-a-release)
  - [Upgrading a Release](#upgrading-a-release)
  - [Retracting a release (uninstall a chart)](#retracting-a-release-uninstall-a-chart)
- [Helm Repositories](#helm-repositories)
  - [Adding the official repository to Helm 3](#adding-the-official-repository-to-helm-3)
  - [Installing Helm Charts from repositories](#installing-helm-charts-from-repositories)
- [The Helm Hub](#the-helm-hub)
  - [Searching for Charts using the Helm Hub](#searching-for-charts-using-the-helm-hub)
- [Useful Helm Resources](#useful-helm-resources)

## What is Helm

Helm is a package manager for [Kubernetes](https://kubernetes.io){:target="_blank"}. You may think:

**What? Yet another package manager? We already have [npm](https://npmjs.com){:target="_blank"}, [NuGet](https://www.nuget.org){:target="_blank"}, [Homebrew](https://brew.sh){:target="_blank"}, [Apt](https://wiki.debian.org/Apt){:target="_blank"}, [Yum](http://yum.baseurl.org/){:target="_blank"} and others. Do we really need yet another one?**

And the answer is: **Yes**.

We need a dedicated package manager for Kubernetes to simplify things. Although all Kubernetes artifacts are deployed using `YAML` files, IT departments require a defined and unified way, how different applications find their way into Kubernetes clusters using atomic, distributable packages. Development teams have to establish a standardized way of packaging and distributing their products. On top of that, we as developers want a simple, yet flexible approach to distribute and consume 3rd party dependencies, required by our applications or application building blocks.

Helm can fix those issues and provides robust workflows for these day-to-day tasks.

### Why is Helm 3 way better than Helm 2

Helm itself is around for quite some time now. When Helm was initially developed, RBAC was not yet a thing in Kubernetes. With Helm 2, a server-side component (Tiller) was introduced to address team development workflows. On top of automating deployments in Kubernetes, Tiller had to track "**who**" installed a deployment, to allow or prevent users from upgrading or removing specific applications from the cluster that were initially deployed from co-workers or other cluster administrators.

Since RBAC found its way into Kubernetes, Tiller is no longer required. That said, The Helm team removed the server-side component (Tiller) from Helm 3.Because it was highly privileged, Tiller was the main reason why many teams and organizations stepped back from implementing Helm as their Kubernetes package manager. With Tiller being history, it is the right time for individuals, teams, and organizations to re-evaluate Helm 3.

---

## Helm 3 Building Blocks

Helm provides a small number of building blocks. We use them to craft our distributable application packages. The following sections introduce those building blocks and explain their characteristics and roles in Helm.

### What are Helm Charts

Helm defines a packaging format called **charts**. Charts are the things (packages) that we create, distribute, and consume. The `chart` is the top-level and most prominent building block in Helm. For now, you can think of charts as a wrapper for a set of Kubernetes deployment manifests (you know, all those good, old `yaml` files).

Upon distribution, charts are packaged as `tgz` archives to simplify exchange.

### Release

A **Release** is an instance of a chart, deployed to a Kubernetes cluster. You can create numerous releases from a single chart. A release has its own lifecycle and is managed using dedicated sub-commands of the Helm CLI.

### Chart Metadata

Every chart comes with a set of metadata attached to it. Metadata is used to expose essential information about the chart to its consumers. Metadata is located in `Chart.yaml` and can only be specified by the author of the chart. Good examples of chart-metadata-properties are:

- `name`: The name of the chart
- `version`: The version of the chart
- `description`: A short description of the chart
- `kubeVersion`: A [SemVer](https://semver.org/){:target="_blank"} range of compatible Kubernetes versions

See the [official Chart.yaml schema](https://helm.sh/docs/topics/charts/#the-chart-yaml-file){:target="_blank"} to spot all metadata properties.

### Helm Templates

Helm compiles templates into Kubernetes definitions (`YAML` files). They are written using the [Go template language](https://golang.org/pkg/text/template/){:target="_blank"}. As chart author, you can use several things to build powerful templates: 

- pre-defined variables
- custom variables
- template functions

More than 60 template functions are available in Helm 3. Some of them are rooted from the [Go Template Language](https://godoc.org/text/template){:target="_blank"}, but most powerful template functions are part of [Sprig](https://masterminds.github.io/sprig/){:target="_blank"}.

As a chart author, you provide default values for variables using the `values.yaml` file.

### Values in Helm

Before deploying charts to a cluster, consumers can specify custom values to override variable default-values. Single values can be applied using the `--set` argument when executing `helm install`. Alternatively, consumers can put all their values in a `.yaml` file and call `helm install --values=myvalues.yaml`.

Helm specifies a bunch of pre-defined values like `Release.Name` (the unique name of the release) or `Release.Namespace` (name of the Kubernetes namespace the chart was deployed to). For a full list of predefined values, consult the [official list of predefined values](https://helm.sh/docs/topics/charts/#predefined-values){:target="_blank"}.

---

## The Helm 3 CLI

Now that you know the most important building blocks to author charts, it is time to take a look at the Helm Command Line Interface. The Helm CLI is a self-contained application written in [Go](https://golang.org/){:target="_blank"}. It is currently available for `macOS`, `Linux` and `Windows`.

### Installing Helm 3 CLI

Helm can be installed either from source or from pre-built binaries. It is also available for popular package managers such as [Homebrew](https://brew.sh/){:target="_blank"} or [Chocolatey](https://chocolatey.org/){:target="_blank"}. For example, you can install Helm on `macOS` with Homebrew using:

```bash
brew install helm

```

Consult the [official documentation](https://helm.sh/docs/intro/install/){:target="_blank"}, to get detailed installation instructions.

Once finished, you can verify the installation by invoking `helm version --short`.

{% include image-caption.html imageurl="/assets/images/posts/2020/helm3-getting-started-version.png"
title="Helm 3 - Verify CLI installation" caption="Helm 3 - Verify CLI installation" %}

### 8 noticeable sub-commands of Helm 3 CLI

Helm 3 CLI offers a bunch of sub-commands that you will be using regularly. See the following list which contains *eight* sub-commands you will use quite often:

- `helm search` - Search for charts in Helm Hub and Helm Repositories
- `helm install` - Install charts into Kubernetes
- `helm list` - List all releases of a given Kubernetes Namespace
- `helm show` - Show information about a chart
- `helm upgrade` - Upgrade a release to a new version of the underlying chart
- `helm pull` - Download and extract a chart from Helm hub or a Helm repository
- `helm repo` - Add, update, index, list, or remove chart repositories
- `helm package` - Create an `tgz` archive for the chart in the current folder

There are more sub-commands available in Helm 3 CLI. You can see the list of all sub-commands by just invoking `helm` on your machine or by inspecting the [list of commands in the documentation](https://helm.sh/docs/helm/helm/){:target="_blank"}.

### Helm CLI autocompletion for Bash & ZSH

Seamless integration into shell-systems such as `bash` or `zsh` is a must-have for every good CLI. Helm 3 is no exception here. Helm 3 CLI provides the `completion` sub-command. It is used to enable auto-completion for different, popular shells. To enable auto completion, add the following to your `.bashrc` / `.zshrc`

```bash
# bash
## in .bashrc
source <(helm completion bash)

# zsh
## in .zshrc
source <(helm completion zsh)>

```

I use [oh-my-zsh](https://github.com/ohmyzsh/ohmyzsh){:target="_blank"} for decades now, it comes with a bunch of plugins to easily enable things like auto-completion. There is also a plugin for `helm`. To enable it, just add `helm` to the list of your plugins:

```bash
# in .zshrc
plugins=(... helm)

```

Once you have sourced your shell configuration, you can verify auto-completion by typing `helm` followed by a `[SPACE]` and hitting the `[TAB]` key. Your shell will present all available sub-commands. Auto completion works for all nested commands, arguments, and flags. So you should be good to go.

{% include image-caption.html imageurl="/assets/images/posts/2020/helm3-getting-started-completion.png"
title="Helm 3 CLI - Auto completion" caption="Helm 3 CLI - Auto completion" %}

## Creating Helm Charts

Although Helm 3 provides a command to create new charts (`helm create <chart-name>`), you can create charts also manually. Creating a chart manually is the best way to identify what it takes to author charts and an excellent way to get started. So, let's give it a spin.

### Create a Helm chart manually

Every Helm chart is isolated in the scope of a directory and consists of at least three files. The `Chart.yaml` file, a `vaules.yaml` file and a template file, which belongs to the `templates` sub-folder. The following script generates all files and folders underneath the `firsT-chart` folder.

```bash
mkdir -p first-chart/templates
cd first-chart
touch Chart.yaml values.yaml templates/serviceaccount.yaml

```

First, let's provide a set of minimal metadata in `Chart.yaml`.

```yaml
apiVersion: v2
name: firstchart
description: A simple Helm chart for k8s
type: application
version: 0.0.1

```

Having all metadata in place, we can move on and create a simple Kubernetes object. For demonstration purposes, we will create a ServiceAccount. If you want to see which properties and attributes can be specified on a ServiceAccount, check out the [Kubernetes ServiceAccount specification](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/#serviceaccount-v1-core){:target="_blank"}. Add the following to `templates/serviceaccount.yaml`

{% raw %}

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: {{ .Values.serviceAccount.name }}

```

{% endraw %}

As you can see, the template uses a variable called `firstChart.serviceAccountName` to have a configurable name, associated at deployment time. Let's extend the template a bit by adding a custom `environment` label to the template.

Consumers should be able to customize the value of the label. To make the template robust, we should also deal with empty values and replace them with a fallback value of `development`. Last but not least, we have to ensure that our template generates valid `YAML`. Considering those new requirements, the `templates/serviceaccount.yaml` will look like this:

{% raw %}

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: {{ .Values.serviceAccount.name }}
  labels:
    environment: {{ .Values.environment | default "development" | quote }}

```

{% endraw %}

With those changes, all requirements are addressed. `.Values.environment` has an implicit fallback value of `development` which is directly specified in the template. Additionally, the actual value will be wrapped into quotes to generate proper `YAML`.

Technically, two template functions are chained to produce a robust value for the `environment` label.

The last part of the chart is the `values.yaml`. Chart authors can use this file to provide default values for chart consumers. You can also think about `values.yaml` as the API documentation of your chart.

```yaml
# environment defaults internally to development
# however, consumers can override it using a custom values file.
environment:
serviceAccount:
  name: sample-sa

```

That's it; you have finished authoring your first chart. Having version `0.0.1` of the chart finished, we can move on and look at the *Release Lifecycle*.

## Helm Release Lifecycle

Once a Helm chart finds its way into a Kubernetes cluster, we refer to it as *Release*. A release is an instance of a Helm chart, deployed to a given Kubernetes cluster. Helm addresses all requirements of the application lifecycle. Things like installing, upgrading, downgrading (`rollback`), or uninstalling applications (releases) are done with Helm CLI.

### Packaging Helm charts

When you are done with authoring your chart, it is time to prepare for distribution. Helm charts are packaged using the `helm package` sub-command:

```bash
# ensure you are in the folder of your chart
cd firstchart

helm package .

```

You will now find a `firstchart-0.0.1.tgz` in the project folder. If you prefer a different output folder, you can specify it using the `--destination` argument. Also, notice the `.` as the first argument of `helm package`, it specifies the context for the packaging operation (and should point to your charts root directory).

### Creating a Release (install a chart)

To install our `firstchart` in version `0.0.1` into a cluster, make sure that your local `kubectl` is pointing to the correct one.

```bash
helm install firstchart-0.0.1.tgz --namespace app-one --generate-name

```

To install a chart, you have to specify a name for the release. Alternatively, you can use the `--generate-name` argument to get a random name assigned by Helm itself. The command above specified the targetting namespace explicitly. However, if you target the `default` namespace, you don't have to specify the `--namespace` argument.

### Verifying a Release

There are several ways to verify a release.

First, you can use the `helm list` and `helm get` commands. Those are great to get an overview or detailed information about a given release in a cluster.

{% include image-caption.html imageurl="/assets/images/posts/2020/helm3-getting-started-verify-releases.png"
title="Helm 3 - Verify Releases" caption="Helm 3 - Verify Releases" %}

The alternative way is to use regular `kubectl` commands to inspect the contents of the desired namespace.

{% include image-caption.html imageurl="/assets/images/posts/2020/helm3-getting-started-verify-releases-kubectl.png"
title="Helm 3 - Verify Releases with kubectl" caption="Helm 3 - Verify Releases with kubectl" %}

### Upgrading a Release

Before we look at CLI commands to upgrade an existing release, letäs create a new version of our chart. For demonstration purpose, we will modify the template of our ServiceAccount and add another custom tag.

{% raw %}

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: {{ .Values.serviceAccount.name }}
  labels:
    environment: {{ .Values.environment | default "development" | quote }}
    app: foo

```

{% endraw %}

We have added `app: foo`, nothing more. Finally let's increate the `version` in `Chart.yaml` from `0.0.1` to `0.0.2` and package the chart again by invoking `helm package .`. Now you will find a `firstchart-0.0.2.tgz` in the root folder of your chart.

To upgrade an existing release, two things are required. First, we need the name of the release you want to update. Second, we need a new chart archive, which contains the updated chart. We use both with `helm upgrade`

```bash
helm upgrade my-release firstchart-0.0.2.tgz

```

{% include image-caption.html imageurl="/assets/images/posts/2020/helm3-getting-started-upgrade-release.png"
title="Helm 3 - Upgrade a release" caption="Helm 3 - Upgrade a release" %}

### Retracting a release (uninstall a chart)

To remove or `uninstall` a release from a Kubernetes cluster, we use the `helm uninstall` command in combination with the unique release name. Helm will quickly confirm the removal of all release artifacts.

{% include image-caption.html imageurl="/assets/images/posts/2020/helm3-getting-started-uninstall-release.png"
title="Helm 3 - Uninstall a release" caption="Helm 3 - Uninstall a release" %}

---

Now, that we have done a bunch of stuff in the context of chart authoring, let's move on and see how we can consume other charts using both Helm Repositories and the Helm Hub.

---

## Helm Repositories

In Helm, a `repository` (or `repo`) is a simple HTTP server that is responsible for serving `charts`. Users can use the Helm CLI to consume `charts` from `repositories`, or to publish their own `charts` to `repositories` for distribution.

Helm CLI can interact with multiple repositories. We manage repositories using the `helm repo` command.

### Adding the official repository to Helm 3

By default, Helm CLI has no repositories configured. Execute `helm repo list` and verify that no repository is configured.

To add the official, stable repository, execute:

```bash
helm repo add stable https://kubernetes-charts.storage.googleapis.com/

```

### Installing Helm Charts from repositories

You can use Helm CLI to search for `charts` and install them using `helm install`. See the following snippet looking for `mssql` charts and installing the stable `mssql-linux` chart on your Kubernetes cluster in the `thns` namespace.

```bash

# search for Microsoft SQL Server
helm search repo mssql-linux
NAME                CHART VERSION  APP VERSION  DESCRIPTION
stable/mssql-linux  0.11.1         14.0.3023.8  SQL Server 2017 Linux Helm Chart

# create dedicated kubernetes namespace
kubectl create namespace thns

# install mssql
helm install mssqlserver stable/mssql-linux --namespace thns

# list all releases in a kubernetes namespace
helm list --namespace thns -o yaml
- app_version: 14.0.3023.8
  chart: mssql-linux-0.11.1
  name: mssqlserver
  namespace: thns
  revision: "1"
  status: deployed
  updated: 2020-04-20 21:21:41.864785 +0100 CET

```

You can also leverage regular Kubernetes commands to inspect the `thns` namespace. Execute `kubectl get all -n thns` to see all resources from the namespace. Once you are done with inspecting all resources, you can uninstall the release using `helm uninstall mssqlserver -n thns`.

---

## The Helm Hub

The Helm Hub is a curated meta-repository, managed by the Helm team itself. It contains a waste amount of charts from different repositories. You can use the Helm Hub to find new charts and see which repositories are hosting them.

I like the approach of having a curated list of charts. However, I see potential problems with using charts from repositories that are not whitelisted in your current organization. Although we will use Helm Hub to find a chart, in this article, we will grab only charts from the stable Helm repository.

### Searching for Charts using the Helm Hub

We can use the hub to look for charts across multiple repositories.

```bash
helm search hub nginx
# truncated and re-formatted results
- app_version: ""
  description: NGINX is a free and open-source web server which can also be used as
    a reverse proxy, load balancer and HTTP cache.
  url: https://hub.helm.sh/charts/ibm-charts/ibm-nginx-dev
  version: 1.0.1
- app_version: ""
  description: A Helm chart for nginx-default-backend to be used by nginx-ingress
    controller
  url: https://hub.helm.sh/charts/cloudposse/nginx-default-backend
  version: 0.4.0
- app_version: ""
  description: A Helm chart for Nginx Ingress
  url: https://hub.helm.sh/charts/cloudposse/nginx-ingress
  version: 0.1.8
- app_version: ""
  description: A Helm chart that provides a maintenance backend to be used by nginx-ingress
    controller
  url: https://hub.helm.sh/charts/cloudposse/fail-whale
  version: 0.1.1

```

From your terminal you can now navigate directly to the chart page on [https://hub.helm.sh](https://hub.helm.sh){:target="_blank"}. On the chart page, you find a bunch of information about the chart, and you can grab the repository URL to connect your CLI to the Helm repo.

**Before adding a new repository** to your Helm CLI, you should **verify with** your team and **IT** department if your organization **trusts this repository**.

At the point of writing this article, `helm search hub <term>` does not expose the repository URL. However, there is already a discussion on the corresponding GitHub repository [helm/hub](https://github.com/helm/hub){:target="_blank"} about exposing that information directly via CLI to make this workflow smoother.

---

## Useful Helm Resources

Where to go from here? Although we have covered a lot in this getting started with Helm 3 article, it was just the tip of the iceberg. Helm has so many small, yet powerful features and tricks; it is impressive.

However, the goal of this article to explain how to get started with Helm 3. From here, you can research in different directions in *Helm space*. For example, consider these links to dive deeper:

- [Official Chart Template Developer Guide](https://helm.sh/docs/chart_template_guide/){:target="_blank"}
- [Chart Development Tips and Tricks](https://helm.sh/docs/howto/charts_tips_and_tricks/){:target="_blank"}
- [Helm Hub](https://hub.helm.sh/){:target="_blank"}
- [Official Helm Blog](https://helm.sh/blog/){:target="_blank"}

---

I hope you enjoyed the read and learned something new. So please go ahead and share this article with teammates and fellow cloud-headz. You can also subscribe to my newsletter and get automatically notified once the next article is published. That’s the best way to stay current and never miss an article.
