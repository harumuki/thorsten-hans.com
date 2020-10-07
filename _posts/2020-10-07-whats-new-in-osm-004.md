---
title: "What is new in Open Service Mesh 0.0.4"
layout: post
permalink: what-is-new-in-open-service-mesh-004
published: true
date: 2020-10-07
tags: 
  - Kubernetes
  - Service Mesh
excerpt: "See what is new and what has changed with release 0.0.4 of Microsoft Open Service Mesh."
image: /mesh.jpg
unsplash_user_name: Adam Valstar
unsplash_user_ref: adamvalstar
---

A couple of days ago, [Open Service Mesh (OSM)](https://openservicemesh.io) version `0.0.4` was released on GitHub. Compared to the previous release, several things have changed. In this post I will walk through the most important changes, which will have an impact on the actual usage of Open Service Mesh.

## Sidecar Injection disabled by default

Open Service Mesh uses Kubernetes' sidecar-container pattern to bring Service Mesh capabilities to your application deployments. With version `0.0.4`, OSM will no longer inject sidecar-containers by default. In contrast, you have to enable it explicitly when onboarding a Namespace. This can be achieved by using `osm` CLI with the new `--enable-sidecar-injection` flag:

```bash
osm namespace add my-namespace --enable-sidecar-injection

```

As an alternative, you can enable sidecar-container injection using Kubernetes annotations. The annotation can be specified either on dedicated Pods or on the level of the Namespace - as shown in the following snippet:

```bash
# annotate on namespace level
kubectl annotate namespace my-namespace-2 openservicemesh.io/sidecar-injection=enabled

# annotate on pod level
kubectl annotate pod my-pod -n my-namespace-3 openservicemesh.io/sidecar-injection=enabled

```

## Grafana and Prometheus are now optionally

OSM injects [Envoy Proxy](https://www.envoyproxy.io/){:target="_blank"} as sidecar-container. These sidecar-containers come with pre-configured [Prometheus](https://prometheus.io/docs/introduction/overview/) annotations. This allows Prometheus scraping detailed metrics from all application components managed by OSM. `osm install` exposes the `--enable-prometheus` flag to control if Open Service Mesh should deploy Prometheus to the Kubernetes cluster, or if it should skip Prometheus deployment to use a pre-existing Prometheus deployment.

If you want to connect OSM to your pre-existing Prometheus deployment, checkout the [detailed configuration instructions on GitHub](https://github.com/openservicemesh/osm/blob/main/docs/patterns/observability.md#byo-bring-your-own){:target="_blank"}.

[Grafana](https://grafana.com/docs/grafana/latest/getting-started/what-is-grafana/){:target="_blank"} is used to visualize metrics scraped by Prometheus from applications managed by OSM. With `0.0.4`, OSM will not install Grafana by default. This behavior can be controlled using the `--enable-grafana` flag of `osm install` command. As for Prometheus, you can bring your own (BYO) Grafana deployment instead of having a dedicated (OSM-)Grafana installation. Consult the [import dashboards to BYO Grafana](https://github.com/openservicemesh/osm/blob/main/docs/patterns/observability.md#importing-dashboards-on-a-byo-grafana-instance){:target="_blank"} section for further details.

## cert-manager integration as certificate provider

Open Service Mesh is now able to use pre-existing [cert-manager](https://cert-manager.io/){:target="_blank"} installations to issue TLS certificates when using mTLS. Again there is an [configuration section on GitHub](https://github.com/openservicemesh/osm/tree/main/docs/patterns#using-cert-manager), which guides you through the process of integrating cert-manager into your OMS installation.

## Tracing moved from Zipkin to Jaeger

OSM switched from [Zipkin](https://zipkin.io/){:target="_blank"} to [Jaeger](https://www.jaegertracing.io/){:target="_blank"} as distributed tracing engine. In contrast to Zipkin, Jaeger has out of the box support for the [OpenTracing standard](https://opentracing.io/){:target="_blank"}.

## Conclusion

Personally, I like the approach of minimizing OSM's default footprint on Kubernetes clusters. Integration with pre-existing installations of Grafana, or Prometheus and cert-manager make OSM deployments more flexible in contrast to the previous releases. Besides the changes mentioned here, you should definitely check out the [Release Notes on GitHub to stay current](https://github.com/openservicemesh/osm/releases){:target="_blank"}.
