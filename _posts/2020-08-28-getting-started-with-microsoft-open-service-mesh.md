---
title: "Getting Started With Microsoft Open Service Mesh"
layout: post
permalink: getting-started-with-microsoft-open-service-mesh
published: true
date: 2020-08-28 06:56:00
tags: 
  - Kubernetes
  - Service Mesh
excerpt: "Dive into Microsoft's Open Service Mesh, a SMI spec-compliant, lightweight service mesh to run applications in Kubernetes like a pro."
image: /mesh.jpg
unsplash_user_name: Adam Valstar
unsplash_user_ref: adamvalstar
---

A couple of weeks ago, Microsoft announced the first public release of [Open Service Mesh (OSM)](https://openservicemesh.io){:target="_blank"} an open-source, lightweight, and extensible service mesh implementation, based on the Service Mesh Interface (SMI) specification. This article explains the core concepts of a service mesh, provides an Open Service Mesh introduction, and demonstrates some common service mesh use-cases.

## Table of contents

- [Table of contents](#table-of-contents)
- [What is a Service Mesh](#what-is-a-service-mesh)
- [What is the Service Mesh Interface specification](#what-is-the-service-mesh-interface-specification)
- [Should you consider using a Service Mesh](#should-you-consider-using-a-service-mesh)
- [Introducing Microsoft Open Service Mesh](#introducing-microsoft-open-service-mesh)
  - [Install the Open Service Mesh CLI](#install-the-open-service-mesh-cli)
  - [Install Open Service Mesh on Kubernetes](#install-open-service-mesh-on-kubernetes)
- [Traffic Access Control sor simple Applications](#traffic-access-control-sor-simple-applications)
  - [Create snd Onboard the Kubernetes Namespace](#create-snd-onboard-the-kubernetes-namespace)
  - [Deploy the Sample Application](#deploy-the-sample-application)
  - [Deploy Traffic Access Control](#deploy-traffic-access-control)
- [Canary Deployments with Open Service Mesh](#canary-deployments-with-open-service-mesh)
  - [Create and Onboard the Canary Deployment Namespace](#create-and-onboard-the-canary-deployment-namespace)
  - [Deploy the Canary Deployment Sample Application](#deploy-the-canary-deployment-sample-application)
  - [Deploy Traffic Access Control and Traffic Split](#deploy-traffic-access-control-and-traffic-split)
  - [Verify Canary Deployment](#verify-canary-deployment)
- [The Open Service Mesh Dashboard](#the-open-service-mesh-dashboard)
- [Sample Code](#sample-code)
- [Conclusion](#conclusion)

## What is a Service Mesh

A service mesh helps to manage service-to-service network communication in Kubernetes environments. Several features related to communication between individual application components are offloaded from the application code to the service mesh. Typically, service mesh implementations add those capabilities to an application by using Kubernetes' sidecar-container pattern.

{% include image-caption.html imageurl="/assets/images/posts/2020/osm-service-mesh-svc-to-svc.png"
title="Service Mesh - service to service communication pattern" caption="Service Mesh - service to service communication pattern" %}

When using a service mesh, communication between two artifacts (containers in independent Kubernetes pods) is routed through a service mesh proxy running in each Pod next to the application container itself. That said, every service mesh comes with a certain proxy, which is responsible for controlling network traffic. [Istio](https://istio.io/){:target="_blank"} - currently the most popular service mesh - and Microsoft’s Open Service Mesh use [Envoy](https://www.envoyproxy.io/){:target="_blank"} as proxy in the sidecar-container. Other service meshes use their own proxies like [Linkerd](https://linkerd.io/){:target="_blank"} for example, again others use [nginx](https://www.nginx.com/){:target="_blank"} or [HAProxy](https://www.haproxy.org/){:target="_blank"} to provide service mesh features.

Service meshes offer great features to control service-to-service communication, like, for example:

- Traffic Access Control
- Traffic Metrics
- Traffic Routing
- Mutual TLS (mTLS)
  
Besides those, many services meshes offer unique features in areas like security and resilience. As an example, I want to explain the service mesh concept by looking at traffic splitting. Traffic splitting allows you to route requests between different versions of a particular service. Traffic splitting is typically used to implement features like canary deployments. Instead of backing those routing capabilities into application code, you specify the traffic split by using Kubernetes resources. It is the proxy's responsibility to determine where each request should be routed to match the desired split configuration.

Although service meshes are around for some years, they are still very new, compared to technologies like Kubernetes. Every service mesh implementation comes with a unique feature-set and has its advantages and disadvantages. Every service mesh had individual patterns and configuration practices, especially in the early days of service meshes. Luckily, Microsoft started the Service Mesh Interface (SMI) specification project to streamline the service mesh configuration experience.

## What is the Service Mesh Interface specification

{% include image-caption.html imageurl="/assets/images/posts/2020/smi.svg" width="200" caption="Service Mesh Interface (SMI) specification" title="Service Mesh Interface (SMI) specification" %}

The [Service Mesh Interface (SMI) specification](https://smi-spec.io/){:target="_blank"} provides a set of contracts for most common service mesh features like traffic access control, traffic metrics and traffic split. SMI compliant service meshes implement corresponding features based on those SMI contracts.

Users benefit from using SMI spec-compliant service meshes because they are configured using the same set of configuration objects. Those configuration objects exist in Kubernetes as Custom Resource Definitions (CRDs). That said, all features specified in the SMI spec are configured in the same way, if the service mesh is SMI spec-compliant.

The SMI specification was initially created by Microsoft back in May 2019 and donated to the [Cloud Native Computing Foundation (CNCF)](https://cncf.io){:target="_blank"} in April 2020. The project is currently in the sandbox tier of CNCF. As of today, several service meshes implement the SMI spec including:

- [Istio](https://istio.io){:target="_blank"} with [corresponding adapter](https://github.com/servicemeshinterface/smi-adapter-istio){:target="_blank"}
- [Linkerd](https://linkerd.io/){:target="_blank"}
- [Maesh](https://mae.sh/){:target="_blank"}
- [Consul Connect](https://consul.io/docs/connect){:target="_blank"}
- [Microsoft Open Service Mesh](https://openservicemesh.io){:target="_blank"}

## Should you consider using a Service Mesh

Adding a service mesh to your Kubernetes clusters makes overall application architecture and orchestration requirements more complex. On the flip side, you get a great set of features that are especially important when running complex applications at scale. Running a service mesh in a Kubernetes cluster will, of course, consume resources like CPU and memory. Additionally, you need someone who maintains the service mesh and ensures that all service mesh components operate correctly.

You should consider adding a service mesh only if you require - at least - one of the features specified in the SMI specification. I would not recommend using a service mesh by default or without requiring any of the features provided by the service mesh.
  
## Introducing Microsoft Open Service Mesh

{% include image-caption.html imageurl="/assets/images/posts/2020/osm.svg" width="600" caption="Microsoft Open Service Mesh" title="Microsoft Open Service Mesh" %}

In August 2020, Microsoft announced the availability of [Open Service Mesh (OSM)](https://openservicemesh.io){:target="_blank"}. A lightweight yet extensible service mesh implementation based on the SMI specification. The currently available version provides a great feature-set, as the official website promotes the following:

- Support for implementing **mutual TLS (mTLS)** which means that communication between components can be encrypted using certificates on both sides (source and destination)
- Simplified **application onboarding** by injecting **side-car containers** automatically
- Configure and apply fine granular **access control policies** for onboarded services
- Integration with different **external certificate management services** and solutions
- Increase **observability** and provide **insights** using application **metrics** to simplify **debugging and monitoring**
- Provide an easy and transparent way to implement **traffic shifting** between several deployments
- Suitable for simple and complex scenarios through **SMI and Envoy XDS APIs**

Open Service Mesh is implemented and managed in the public, using the [OSM repository on GitHub](https://github.com/openservicemesh/osm){:target="_blank"}. To simplify OSM management, Open Service Mesh comes with a small command-line interface (CLI), which operators use to:

- Install OSM in the context of a Kubernetes cluster
- Onboard Kubernetes namespaces
- Quickly access the OSM dashboard (Grafana)
- Remove Kubernetes namespaces from OSM
- Uninstall OSM from a certain Kubernetes cluster

Having some fundamental understanding of Open Service Mesh and service meshes in general, we can move on and give OSM a try.

### Install the Open Service Mesh CLI

Open Service Mesh can be installed by downloading the pre-compiled OSM binary from the [release page on GitHub](https://github.com/openservicemesh/osm/releases){:target="_blank"}. However, a couple of days ago, I recognized that OSM can also be installed using [Homebrew](https://brew.sh/){:target="_blank"} - the popular package manager for macOS.

```bash
brew install osm

```

You can verify the OSM CLI installation on your local machine, by invoking:

```bash
osm version
# Version: dev; Commit: ; Date: 2020-08-17-08:07

```

### Install Open Service Mesh on Kubernetes

The `osm` CLI reuses the context of `kubectl`. That said, verify that `kubectl` points to the desired Kubernetes cluster.

```bash
# list contexts
kubectl config get-contexts
# prints a list of all installed kubernetes contexts...

# pick desired one
kubectl config use-context <CONTEXT_NAME>

```

Now that `kubectl` points to the correct Kubernetes cluster, you can install it. By default, OSM is deployed to the `osm-system` namespace using the OSM Helm chart. The default OSM instance will be called `osm`. You can customize both, the targeting namespace and the OSM instance name by specifying corresponding arguments when invoking `osm install`

```bash
# install OSM with the default configuration
osm install

# Alternatively!
# install OSM with custom instance name and into a custom namespace
osm install --namespace my-osm-namespace --mesh-name my-osm

```

## Traffic Access Control sor simple Applications

The first sample application we will use in this article is a two-tier application. It consists of an API and a fronted. The API exposes data via HTTP, that will be presented to the end-user by the frontend.

{% include image-caption.html imageurl="/assets/images/posts/2020/osm-sample-architecture-1.png"
title="OSM sample application architecture" caption="OSM sample application architecture" %}

### Create snd Onboard the Kubernetes Namespace

First, let us create a new Kubernetes namespace and onboard it using the `osm` CLI:

```bash
# create a namespace
kubectl create namespace osm-simple-app

# onboard new namespace
osm namespace add osm-simple-app

```

### Deploy the Sample Application

You can deploy all application artifacts using the following `kubectl` command:

```bash
# deploy application components
kubectl apply -f https://github.com/ThorstenHans/osm-sample-application/tree/master/kubernetes/simple/app

```

This command will deploy all necessary components to the `osm-simple-app` namespace. You can inspect all of them with `kubectl`:

```bash
# list all application resources
kubectl get cm,deploy,sa,svc -n osm-simple-app

```

We can test the application by accessing the frontend. However, the backend communication **will not work** due to OSM default behavior, which does not allow service-to-service communication. Let’s test this, by using `kubectl port-forward`:

```bash
# setup port-forwarding to the frontend
# actual name of the frontend Pod will differ
kubectl port-forward -n osm-simple-app frontend-6bc66b65b8-hwfx5 8080:80

# Forwarding from 127.0.0.1:8080 -> 80
# Forwarding from [::1]:8080 -> 80

```

Browse [http://localhost:8080](http://localhost:8080){:target="_blank"}, and you will see the following site, indicating that there was an issue while fetching data from the API.

{% include image-caption.html imageurl="/assets/images/posts/2020/osm-prevent-network-traffic.png"
title="Open Service Mesh prevents service to service communication" caption="Open Service Mesh prevents service to service communication" %}

### Deploy Traffic Access Control

Now that OSM prevents service-to-service communication, we have to whitelist network traffic to go from the `frontend` service to the `api` service. According to the SMI specification, we can achieve this by defining a `TrafficTarget` and allow traffic for specific routes and HTTP methods using an `HTTPRouteGroup`.

```yaml
kind: TrafficTarget
apiVersion: access.smi-spec.io/v1alpha2
metadata:
  name: api
  namespace: osm-simple-app
spec:
  destination:
    kind: ServiceAccount
    name: api-service-account
    namespace: osm-simple-app
  rules:
    - kind: HTTPRouteGroup
      name: api-service-routes
      matches:
        - api
  sources:
    - kind: ServiceAccount
      name: frontend-service-account
      namespace: osm-simple-app
---
apiVersion: specs.smi-spec.io/v1alpha3
kind: HTTPRouteGroup
metadata:
  name: api-service-routes
  namespace: osm-simple-app
spec:
  matches:
    - name: api
      pathRegex: "/api/values"
      methods: ["*"]

```

The `TrafficTarget` uses selectors to link a `sources` (the frontend in our case) with a `destination` (here, the api). You can deploy the `TrafficTarget` using `kubectl` as shown here:

```bash
# deploy TrafficTarget to the sample application
kubectl apply -f https://github.com/ThorstenHans/osm-sample-application/tree/master/kubernetes/simple/smi

```

Having the `TrafficTarget` deployed, we can use `kubectl port-forward` again, to test our application and verify that API requests are successful.

```bash
# enable port forwarding to the frontend
# actual name of the frontend Pod will differ
kubectl port-forward -n osm-simple-app frontend-6bc66b65b8-hwfx5 8080:80

# Forwarding from 127.0.0.1:8080 -> 80
# Forwarding from [::1]:8080 -> 80

```

Open [http://localhost:8080](http://localhost:8080) in the browser. You will now see the values retrieved from the API in the frontend, as shown in the following figure:

{% include image-caption.html imageurl="/assets/images/posts/2020/osm-working-network-traffic.png" caption="Open Service Mesh - Traffic routed from the Frontend to the API" title="Open Service Mesh - Traffic routed from the Frontend to the API" %}

Now that regular network traffic finds its way to the API; we can move on and take a closer look at canary deployments.

## Canary Deployments with Open Service Mesh

Canary deployments are mission-critical when shipping new features to a vast user-basis. With canary deployments, you can route a subset of requests to a more recent service version. Whereas the maturity of requests still hits the default service.

According to SMI, we configure canary deployments using a `TrafficSplit`. The `TrafficSplit` specification requires a `root` service acting as a proxy in front of actual Kubernetes services tied to Pods.

{% include image-caption.html imageurl="/assets/images/posts/2020/osm-sample-architecture-2.png" caption="Open Service Mesh - Architecture for canary deployment" title="Open Service Mesh - Architecture for canary deployment" %}

### Create and Onboard the Canary Deployment Namespace

Again, let us start with creating a dedicated namespace for the canary deployment sample:

```bash
# create a kubernetes namespace
kubectl create namespace osm-canary-deployment-sample-app

# onboard the namespace to OSM
osm namespace add osm-canary-deployment-sample-app
```

### Deploy the Canary Deployment Sample Application

You can deploy all application artifacts for the canary deployment sample using `kubectl`:

```bash
# deploy application components
kubectl apply -f https://github.com/ThorstenHans/osm-sample-application/tree/master/kubernetes/canary-deployment/app

```

This command will deploy all necessary components to the `osm-canary-deployment-sample-app` namespace. Again, you can take a look at all the resources using `kubectl get`:

```bash
# list all application resources
kubectl get cm,deploy,sa,svc -n osm-simple-app

```

Once all Pods are in state `Running`, we can move on and take care about OSM related artifacts.

### Deploy Traffic Access Control and Traffic Split

We have to define how traffic split should behave on top of allowing network traffic to flow from the front end to `api-v1` and `api-v2`. Because you've seen a sample of `TrafficTarget` already in the first sample, let's focus on `TrafficSplit` for now.

The `TrafficSplit` spec supports multiple backends. Each backend receives a relative `weight` as an integer value. The service mesh is responsible for routing traffic to the corresponding backends with respecting their `weight`. The `spec.service` property is also quite interesting. It points to the previously mentioned `root` service, which is also specified in the frontend as the origin for the API request (see [this line in the ConfigMap](https://github.com/ThorstenHans/osm-sample-application/blob/f613a18a5bc82e3234f9f2688aaa5b2ee3c88afd/kubernetes/canary-deployment/app/config-maps.yml){:target="_blank"}).

```yaml
apiVersion: split.smi-spec.io/v1alpha2
kind: TrafficSplit
metadata:
  name: canary-deployment
  namespace: osm-canary-deployment-sample-app
spec:
  service: api.osm-canary-deployment-sample-app
  backends:
    - service: api-v1
      weight: 90
    - service: api-v2
      weight: 10

```

You can deploy both the `TrafficTarget` and the `TrafficSplit` to the `osm-canary-deployment-sample-app` namespace using:

```bash
kubectl apply -f https://github.com/ThorstenHans/osm-sample-application/tree/master/kubernetes/canary-deployment/smi

```

### Verify Canary Deployment

To verify the canary deployment, we will again activate port-forwarding to the desired frontend:

```bash
# enable port forwarding to the frontend
# actual name of the frontend Pod will differ
kubectl port-forward -n osm-canary-deployment-sample-app frontend-6bdfcfd878-42x8v 8080:80

# Forwarding from 127.0.0.1:8080 -> 80
# Forwarding from [::1]:8080 -> 80

```

Open [http://localhost:8080](http://localhost:8080) in the browser. Refresh the site a couple of times, and you will recognize `["Value 4", "Value 5", "Value 6"]` being returned in between all the responses from `api-v1` as shown in the following animation

{% include image-caption.html imageurl="/assets/images/posts/2020/osm-canary-deployment.gif" caption="Open Service Mesh - Canary Deployment" title="Open Service Mesh - Canary Deployment" %}

## The Open Service Mesh Dashboard

Open Service Mesh also comes with a dashboard (powered by [Grafana](https://grafana.com/){:target="_blank"}, [Prometheus](https://prometheus.io/){:target="_blank"}, and [Zipkin](https://zipkin.io/){:target="_blank"}) which you can use to analyze applications managed by OSM. You can access the dashboard via `osm dashboard` (default credentials are `admin/admin`).

{% include image-caption.html imageurl="/assets/images/posts/2020/osm-dashboard.png" caption="Open Service Mesh - OSM Dashboard" title="Open Service Mesh - OSM Dashboard" %}

This image shows the OSM dashboard visualizing the previously created canary deployment. See the *success count to other services* chart showing the 90/10 ratio between `api-v1` and `api-v2`.

Although the pre-provisioned dashboards show a vast amount of insights, such as request latency, active connections, and connection errors, you can configure custom dashboards according to your requirements.

## Sample Code

The sample applications are published on GitHub at [https://github.com/thorstenhans/osm-sample-application/](https://github.com/thorstenhans/osm-sample-application/) including:

- a terraform project to provision an Azure Kubernetes Service instance
- the source-code for all parts of the application
- Dockerfiles and Kubernetes manifests used throughout this article-series

Feel free to [file a new issue](https://github.com/ThorstenHans/osm-sample-application/issues/new) if you stuck while following this article series. I would love to assist.

## Conclusion

I like the simplicity and frictionless of Microsoft Open Service Mesh. Installing and onboarding applications is straight forward, and by relying on the SMI specification, fundamental tasks can be implemented quickly. However, Open Service Mesh has to catch up with the average feature-set of its competitors. Especially when it comes to overall SMI compliance, resilience features like a circuit breaker, fault injection, etc.

Luckily, the team at Microsoft is aware of this. I recognized some interesting features while looking at the [public roadmap](https://github.com/openservicemesh/osm/projects){:target="_blank"}. So it is worth checking the latest OSM releases regularly.
