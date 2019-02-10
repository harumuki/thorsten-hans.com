---
title: Building an Office365 development machine using Microsoft Azure VirtualMachines in no time
layout: post
permalink: building-office365-development-machine-using-azure-virtualmachines
redirect_from: /building-an-office365-development-machine-using-microsoft-azure-virtualmachines-in-no-time-aa2f143f689a
published: true
tags: [O365,Azure]
excerpt: Create your very own Office365 developer machine using Azure Virtual Machines
featured_image: /assets/images/posts/feature_images/clouds.jpg
unsplash_user_name: Nacho Rochon
unsplash_user_ref: nacho_rochon
---

Today Microsoft announced the availability of client machines in Microsoft Azure. It turns out to be an excellent deal for Office365 Developers too. By just creating a new Machine (let’s take a Windows 8.1 including Visual Studio 2013 Update 2 for example) you can quickly spin off an Office365 development machine in no time.

When logged in to the Azure Portal, you’ve to navigate to **Virtual Machines** and select **New** and pick an Image from the **Gallery**

After specifying names, URLs and accounts for your new development box, Microsoft Azure is spinning the Virtual Machine, and after a few seconds, you can access your new development box by using a common RDP Connection. If you’re not familiar with Azure Virtual Machines, you can grab the RDP Connection directly from the portal by selecting the Virtual Machine from the list of all Virtual Machines and click the **Connect** button in the Actions Pane on the bottom of the Page.

Once you’ve connected to your new development box, fire up Visual Studio 2013 and type in your Microsoft Account to sync all your settings from your regular development machine.

Once that’s done you should go out to [http://dev.office.com](http://dev.office.com){:target="_blank"} and grab the latest Office 365 API Tools to build your Office365 App using your new DevBox.


