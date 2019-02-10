---
title: Create a SP2013 VM on Azure using PowerShell
layout: post
permalink: create-a-sp2013-vm-on-azure-using-powershell
redirect_from: /2013-05-23_Create-an-SP2013-VM-on-Azure-using-PowerShell-697b3071bce2
published: true
tags: [Azure, SharePoint]
excerpt: Do you need a SharePoint Development environment? Read this article and learn how to spin it up in Azure using PoSh.
featured_image: /assets/images/posts/feature_images/learning.jpg
unsplash_user_name: Helloquence
unsplash_user_ref: helloquence
---

A few weeks ago Windows Azure IaaS features reached GA. Since then I’m continuously replacing my OnPremise SharePoint development machines by new Azure VMs. To save money, I’m going to remove the virtual machines as soon as I don’t need them. Automating the process of creation and deletion is essential for me because I don’t want to spend a few minutes each day in PowerShell to get my machine up and running.

For my production environment I’ve of course created a VHD by my own, but for this post, I’ll fall back to the SharePoint 2013 Trial Image created by Microsoft and available in the Windows Azure Virtual Machine Gallery.

## Install Windows Azure PowerShell cmdlets

Before you can use the script on your machine, you’ve to install [Windows Azure PowerShell cmdlets](https://www.windowsazure.com/en-us/manage/downloads/){:target="_blank"}.

## Ensure ExecutionPolicy and Admin Privileges

You should start the PowerShell as an Administrator, and you should execute the following command to be able to execute my script `Set-ExecutionPolicy RemoteSigned`.

While playing around with Windows Azure PowerShell cmdlets, I’ve seen many articles describing how to set the AzureSubscription by using these damn PublishingSettings files. Each time I’ve tried to use them I ran into the following issues (perhaps can someone provide any solution? Then *leave a comment*)

1. When I execute the `Get-AzurePublishingSettingsFile` or click the ‘Download Publishing Settings File’ button in VS my browser fires up and tries to download the file. This download ONLY works in IE.
2. Each time I try to download a PublishingSettingsFile new developer certificates are added to my Azure Portal
3. I’ve multiple Azure Subscriptions and each time I download or import a PublishingSettingsFile I’ve to define the default subscription... why can’t I define it once in the portal?

Because of these issues, I decided to authenticate using a valid X509 Certificate created by my own in the opposite of the PublishingSettingsFile. However, for now back to my script.

## My PowerShell Script offers the following features

- Configuring Azure Subscription using X509 Cert
- Selecting or Creating an Azure Affinity Group
- Selecting or Creating an Azure Storage Account
- Select the SharePoint 2013 Trial Image from the Windows Azure Image Gallery
- Create a new Azure VM within the given Affinity Group
- Storing the Azure VM Configuration locally
- Storing the Azure RDP Connection locally

For the last two points, I recommend you to use SkyDrive. By using SkyDrive, I have these critical files on all my devices.

## The Script

```powershell
#I use this script to easily create a new Azure VM based on a Gallery template
# author: Thorsten Hans <thorsten.hans@gmail.com>
Clear-Host Write-Host '# # # Windows Azure VM Automation Script # # #' -ForegroundColor Green
Write-Host "Version:\t0.1" -ForegroundColor Green
Write-Host "Author:\t\tThorsten Hans <thorsten.hans@gmail.com>" -ForegroundColor Green
Write-Host "Blog:\t\thttps://thorsten-hans.com" -ForegroundColor Green

# Load Windows Azure PowerShell cmdlets
if(@(Get-Module | Where-Object { $_.Name -eq 'Azure'}).Count -eq 0){
  Import-Module 'C:\Program Files (x86)\Microsoft SDKs\Windows Azure\PowerShell\Azure\Azure.psd1'
}

## Some functions to reduce code duplication.. DRY 
## Yes I'm a dev... IT Pros don't care about code duplication 
Function EI-Create-AzureAffinityGroup{
  param($name, $location)

  Write-Host 'Creating Affinity Group' -ForegroundColor Green
  New-AzureAffinityGroup -Name $name -Location $location
  Write-Host ("Affinity Group '{0}' has been created" -f $name)

  return Get-AzureAffinityGroup -Name $name
}

Function EI-Create-StorageAccount { 
  param($name, $affinityGroup)

  Write-Host 'Creating Storage Account' -ForegroundColor Green
  New-AzureStorageAccount -StorageAccountName $name -Label $name -Description $name -AffinityGroup $affinityGroup.Name
  Write-Host ("Storate Account '{0}' has been created" -f $name)
  
  return Get-AzureStorageAccount -StorageAccountName $name
}

# Grab contextual information, if you don't have some of this information, leave it blank

$storageName = Read-Host -Prompt 'Storage Name'
$affinityName = Read-Host -Prompt 'Affinity Group Name'

# Try to load the Subscription, if not found, configure subscription by using X.509 Cert`

$subscription = Get-AzureSubscription -Current -ErrorAction SilentlyContinue -ErrorVariable SubscriptionNotConfigured

if($SubscriptionNotConfigured -ne $null){
  $certThumbprint = Read-Host -Prompt "X.509 Thumbprint"
  $subscriptionId = Read-Host -Prompt "Subscription ID "
  $subscriptionName = Read-Host -Prompt "Subscription Name"
  $cert = Get-Item Cert:CurrentUserMy$certThumbprint 
  
  Set-AzureSubscription -SubscriptionName $subscriptionName -SubscriptionId $subscriptionId -Certificate $cert
  $subscription = Get-AzureSubscription -Current
  
}

# Check Affinity Group Name provided by user

if([String]::IsNullOrEmpty($affinityName)){
  $affinityName = Read-Host -Prompt 'Provide a name for the new Affinity Group'
}else{
  # Try to load affinity group
  $affinityGroup = Get-AzureAffinityGroup -Name $affinityName -ErrorAction SilentlyContinue -ErrorVariable AffinityGroupNotFound
}

if(![String]::IsNullOrEmpty($AffinityGroupNotFound)){
  Write-Host 'Affinity Group not found... Creating new one...' -ForegroundColor Yellow
  $location = Read-Host -Prompt 'Provide a location for the new Affinity Group'
  $affinityGroup = EI-Create-AzureAffinityGroup $affinityName $location
}

# Check Storage Account

if([String]::IsNullOrEmpty($storageName)){
  $storageName = Read-Host -Prompt 'Provide a name for the new Storage Account'
}else{
  # Try to load storage account
  $storageAccount = Get-AzureStorageAccount -StorageAccountName $storageName -ErrorAction SilentlyContinue -ErrorVariable StorageNotFound
}

if(![String]::IsNullOrEmpty($StorageNotFound)){
  Write-Host 'Storage Account not found... Creating new one...' -ForegroundColor Yellow
  $storageAccount = EI-Create-StorageAccount $storageName $affinityGroup
}

#Associate Storage Account with current Subscription

Set-AzureSubscription -SubscriptionName 
$subscription.SubscriptionName -CurrentStorageAccount $storageName

#Load SharePoint 2013 Trial Image from Azure Gallery
Write-Host 'Loading SharePoint Image from Azure Gallery...' -ForegroundColor Green
$SharePointImages = Get-AzureVMImage | Where-Object { $_.PublisherName -eq 'Microsoft SharePoint Group'}

#Creating Azure VM from Template 
Write-Host 'Creating Windows Azure Virtual Machine' -ForegroundColor Green $vxName = Read-Host -Prompt 'Enter virtual machine name' 

$adminUserName = Read-Host -Prompt 'Enter Admin UserName'
$password = Read-Host -Prompt 'Enter Password' -AsSecureString

New-AzureQuickVM -Windows -ServiceName $vxName -Name $vxName 
        -ImageName $SharePointImages[0].ImageName -AffinityGroup $affinityGroup.Name 
        -InstanceSize ExtraLarge -AdminUsername $adminUserName -Password $password

# I'm using SkyDrive to keep track of all my RDP Connections and Azure VM Configurations...

Write-Host 'Exporting AzureVM Config and RDP Connection File' -ForegroundColor Green

$azureVMConfigPath = ("C:\Users\th\SkyDrive\Azure\VMs{0}.xml" -f $vxName) 
$azureRDPPath = ("C:\Users\th\SkyDrive\RDPs\{0}.RDP" -f $vxName)

Export-AzureVM -ServiceName $vxName -Name $vxName -Path $azureVMConfigPath 
Get-AzureRemoteDesktopFile -ServiceName $vxName -Name $vxName -LocalPath $azureRDPPath

Write-Host 'Azure VM has been created successfully.

```

That's it, these lines of PowerShell are required to create the virtual SharePoint development environment and log all essential metadata to SkyDrive.


