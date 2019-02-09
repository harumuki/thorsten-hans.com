---
title: Windows Azure IaaS reaches GA
layout: post
permalink: windows-azure-iaas-reaches-ga
redirect_from: /2013-04-16_Windows-Azure-IaaS-reaches-GA-5a7eeed910cf
published: true
tags: [Azure, SharePoint]
excerpt: Microsoft Azure IaaS components just hit GA, so it's the right time to spin up a SharePoint farm on Azure. Read what you need and how much you've to pay for it.
featured_image: /assets/images/posts/feature_images/celebration.jpg
unsplash_user_name: Danny Howe
unsplash_user_ref: dannyhowe
---

Windows Azure's IaaS components have just reached GA (General Availability) status. There is also a SharePoint Template existing which can be used to host SharePoint 2013 Farms on Windows Azure IaaS. Microsoft is also providing a whitepaper describing how to scale and create a SharePoint Farm on Windows Azure using all the great features offered by the Windows Azure Cloud. You can find the whitepaper here ([http://go.microsoft.com/fwlink/?LinkID=288782&clcid=0x409](http://go.microsoft.com/fwlink/?LinkID=288782&clcid=0x409){:target="_blank"})

{% include image-caption.html imageurl="/assets/images/posts/2013/azure-iaas-ga-1.png"
title="Azure IaaS Catalog with SharePoint machines" caption="Azure IaaS Catalog with SharePoint machines" %}

Within the whitepaper they're describing the minimal requirements for a complete OnDemand SharePoint 2013 Farm containing

- Domain Controller (Active Directory)
- Microsoft SQL Server
- SharePoint 2013 Application Services
- SharePoint 2013 WFE

As we're here talking about IaaS, you've to create Windows Azure Virtual Machines for each of these roles in the farm. The whitepaper recommends the following sizes per role:

| Role                        | Size        | Hardware              |
| --------------------------- | ----------- | --------------------- |
| Domain Controller           | small       | 1 Core 1.75 GB Memory |
| SQL Server                  | extra large | 8 Cores 14 GB Memory  |
| SP 2013 Application Server  | large       | 4 Cores 7 GB Memory   |
| SP 2013 Web Frontend Server | large       | 4 Cores 7 GB Memory   |
 
Bigger configurations are also available 

| Configuration Name | Hardware             |
| ------------------ | -------------------- |
| A6                 | 4 Cores 28 GB Memory |
| A7                 | 8 Cores 56 GB Memory |

However, what will my SharePoint Farm cost when I run it on Windows Azure Iaas? The Calculation is straightforward and based on the current costs for Windows VMs. I assume that each machine is available for the same amount of time.

{% include image-caption.html imageurl="/assets/images/posts/2013/azure-iaas-sharepoint-price-calculation.png"
title="Azure IaaS - Calculating SP Fram Price" caption="Azure IaaS - Calculating SP Fram Price" %}

In my opinion, this is a large step in direction cloud computing and definitively an option when you are looking forward to hosting a new SharePoint environment. Combined to the costs for the metal, internet connection, power, and maintenance `$1000` for a SharePoint 2013 isn't that expensive (IMO).


