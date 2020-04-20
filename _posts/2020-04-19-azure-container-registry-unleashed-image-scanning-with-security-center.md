---
title: Azure Container Registry Unleashed – Image Scanning with Azure Security Center
layout: post
permalink: azure-container-registry-unleashed-image-scanning-with-azure-security-center
published: true
tags: 
  - Azure
  - Docker
  - Azure Container Registry
excerpt: "The sixth part of ACR Unleashed will cover integration with Azure Security Center to get your Docker images scanned for vulnerabilities"
image: /acr-unleashed.jpg
unsplash_user_name: Thais Morais
unsplash_user_ref: tata_morais
---

The sixth part of _Azure Container Registry Unleashed_ is about scannig Docker images in ACR using [Azure Security Center](https://azure.microsoft.com/en-us/services/security-center/){:target="_blank"}. This post explains, what you get from Azure Security Center in the context of ACR and how to configure the integration of both Azure services. Before we dive into the article, I want to reach out and say thank you to my fellow MVP and well-known Azure security expert [Tom Janetscheck](https://blog.azureandbeyond.com/){:target="_blank"} for contributing to this article.

---

- [What is Azure Security Center](#what-is-azure-security-center)
- [Why should you use Azure Security Center](#why-should-you-use-azure-security-center)
  - [Azure Security Center in the context of ACR](#azure-security-center-in-the-context-of-acr)
- [Monitor ACR with Azure Security Center](#monitor-acr-with-azure-security-center)
  - [Get insights about vulnerabilities in Docker images](#get-insights-about-vulnerabilities-in-docker-images)
- [How Qualys scans your Docker images](#how-qualys-scans-your-docker-images)
- [Windows Image scanning](#windows-image-scanning)
- [Preview Features worth checking out](#preview-features-worth-checking-out)
- [Recap](#recap)
- [The Azure Container Registry Unleashed series](#the-azure-container-registry-unleashed-series)
- [What is next](#what-is-next)

---

## What is Azure Security Center

Azure Security Center (ACS) offers two main solutions. As a Cloud Security Posture Management (CSPM) solution, ASC constantly monitors the current configuration status of all your cloud resources and provides information to avoid misconfiguration regarding security. As a Cloud Workload Protection Platform (CWPP), ASC provides protection against cyber threats aimed at servers, no matter whether they are running in Azure, on premises, or in another cloud platform. It also offers protection against cyber threats aimed at your cloud-native workloads in Azure, such as Azure Key Vaults, Storage Accounts, AKS, SQL databases, and many more.

## Why should you use Azure Security Center

First of all: because there is a free tier of Azure Security Center which offers the CSPM solution for your Azure-based workloads. By constantly determining the current configuration status and by reflecting the status in recommendations, you are informed if there are any misconfigurations to remediate.

{% include image-caption.html imageurl="/assets/images/posts/2020/asc-1.png"
title="Azure Security Center - Resource security hygiene" caption="Azure Security Center - Resource security hygiene" %}

In the standard tier, ASC offers even more capabilities such as monitoring cloud environments for regulatory compliance, or the threat protection capabilities, which make ASC the one stop shop for administrators who are responsible for deploying, administrating, and protecting (hybrid) cloud workloads.

---

### Azure Security Center in the context of ACR

ASC is also able to protect container-related Azure resources like Azure Container Registry. For ACR, every pushed image will be scanned for vulnerabilities and provide security recommendations using an external Docker image scanner offered by [Qualys](https://www.qualys.com/){:target="_blank"}. Both vulnerabilities and security recommendations will be aggregated and classified directly in Azure Security Center UI. After a Docker image has been uploaded, it usually takes around 10 minutes to get scanning results back in ASC for your latest image.

Integrating with Azure Container Registry requires using the ASC *Standard* tier. Additionally, you will be charged per image scanning operation. 

## Monitor ACR with Azure Security Center

To enable the integration of ASC and ACR, you have to upgrade Security Center to the *Standard* tier. Go to *Azure Security Center*; you can change the tier using the *Settings - Pricing Tier* blade. 

{% include image-caption.html imageurl="/assets/images/posts/2020/acr_asc_enable_standard_tier.png"
title="Azure Security Center - Tier Selection" caption="Azure Security Center - Tier Selection" %}

Once you have selected the *Standard* tier, you can enable the plan for the different resource types. Find *Container Registries* and enable it. Now, all your ACR instances will scan Docker images and report vulnerabilities and security recommendations to ASC. (Don't forget to hit *Save*, if you made some changes here).

### Get insights about vulnerabilities in Docker images

Once you have enabled the integration of ACR and ASC, you can push images to ACR. Qualys will scan your Docker images now and report back into ASC. Use the Security Center UI to drill down through all findings of your Azure Subscription or Workspace to find ACR related recommendations. Security Center UI provides several dashboards that help you find the desired information in a manner of seconds. For example, go to *Security Center* - *Resource Security Hygiene* - *Compute & apps*, here you can filter all findings by resource category, set the filter to *Containers* and see all outcomes for services like ACR and AKS.

{% include image-caption.html imageurl="/assets/images/posts/2020/acr-asc-findings-1.png" title="Azure Security Center - Container findings" caption="Azure Security Center - Container findings" %}

You can dive deeper from here, click the ACR instance you are interested in.

{% include image-caption.html imageurl="/assets/images/posts/2020/acr-asc-findings-2.png" title="Azure Security Center - Findings per ACR instance" caption="Azure Security Center - Findings per ACR instance" %}

Did you notice the **Take Action** button below the list of findings? Following the button, you can get results per Image.

{% include image-caption.html imageurl="/assets/images/posts/2020/acr-asc-findings-3.png" title="Azure Security Center - Findings per Docker Image" caption="Azure Security Center - Findings per Docker Image" %}

It doesn't stop here; by clicking the image name, you will get a list of findings per Docker image tag, and finally, you get helpful information about the vulnerabilities/security recommendations and learn how to fix those. 

{% include image-caption.html imageurl="/assets/images/posts/2020/acr-asc-findings-4.png" title="Azure Security Center - Actual findings on a Docker Image" caption="Azure Security Center - Actual finding on a Docker image" %}

ASC provides a bunch of insights for containerized applications, and the possibility to drill through the data from different perspectives makes it powerful and assists you in the process of hardening your containers.

---

## How Qualys scans your Docker images

Every time you push a Docker image, it will be pulled and seamlessly executed with Qualys image scanner in a sandbox environment. The image scanner checks the current image for known vulnerabilities and security recommendations. If there are findings or recommendations, ASC will classify those and generate alerts for problems in the context of the image. If your image is safe and clean, ASC will not create alerts to minimize disruptions.

## Windows Image scanning

ASC is relying on an external Docker image scanner offered by Qualys. At this point, Qualys’ scanner does not provide any Windows Container image scanning capabilities. That means you currently have no chance to get your Windows Docker images scanned with ASC. Personally, this is just an additional reason why developers should migrate their Windows-based workloads to Linux containers using technologies like .NET Core instead of trying to stick with Windows for containerized application architectures.

## Preview Features worth checking out

Currently, ASC scans images once they are pushed to ACR. This is a great starting point. However, images with vulnerabilities or pending security recommendations can still be pulled and executed, which is still a risk. The ACR team is actively working on the **Quarantine** feature for ACR, which puts all new Docker images into Quarantine. Although it is still in preview, you can already **enable Quarantine for ACR** manually. See [quarantine docs in the ACR repository](https://github.com/Azure/acr/tree/master/docs/preview/quarantine){:target="_blank"} for further details. Once the Quarantine is generally available, the chances are good that we see seamless integration with ASC also on this level. 

So you should watch the progress of ACR Quarantine.

## Recap

You should use Azure Security Center to continuously monitor your entire Azure Subscription and all its resources to get detailed information about potential security vectors and threats. 

Especially in the context of containerized application architectures, you should use ASC and get your Docker images scanned once uploaded to ACR. Although you currently have to revisit the Security Center to get scanning results, it is still worth having this information at a know, central place. 

The integration will shine once ACR Quarantine features are fully integrated into the workflow, which will prevent malicious images from being distributed. 

Additionally, I would love to be able to select the actual image scanning service because we have seen different scanners finding different vulnerabilities. Perhaps we will be able to choose between services like Qualys and [Aqua](https://www.aquasec.com/){:target="_blank"} at some point in time.

## The Azure Container Registry Unleashed series

- [Part 1 - Introduction and Geo Replication]({%post_url 2019-11-19-azure-container-registry-unleashed-acr-up-and-running %}){:target="_blank"}
- [Part 2 - Authentication, IAM and Content Trust]({%post_url 2019-11-21-azure-container-registry-unleashed-authentication-iam-and-contenttrust %}){:target="_blank"}
- [Part 3 - Integrate ACR and Azure Monitor]({%post_url 2019-11-26-azure-container-registry-unleashed-integrate-acr-and-azure-monitor %}){:target="_blank"}
- [Part 4 - Webhooks]({%post_url 2019-12-04-azure-container-registry-unleashed-webhooks %}){:target="_blank"}
- [Part 5 - Tasks]({%post_url 2020-02-05-azure-container-registry-unleashed-tasks %}){:target="_blank"}
- [Part 6 - Image scanning with Azure Security Center]({%post_url 2020-04-19-azure-container-registry-unleashed-image-scanning-with-security-center %}){:target="_blank"}

## What is next

In the seventh and last part of ACR Unleashed, we will look into Helm chart support offered by Azure Container Registry.

You can also subscribe to my newsletter and get automatically notified when I publish articles here. That is the best way to stay current and never miss an article.
