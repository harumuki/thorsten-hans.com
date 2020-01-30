---
title: ShareCoffee 0.0.11
layout: post
permalink: sharecoffee-0-0-11
published: true
excerpt: Check out what is new in  ShareCoffee 0.0.11
tags: [SharePoint, O365, ShareCoffee]
image: /announcement.jpg
unsplash_user_name: Matt Botsford
unsplash_user_ref: mattbotsford
---

Over the last weeks, I’ve added some new features to ShareCoffee which are now available in the most recent release.

As for all previous versions you can grab a copy using *NuGet* or *Bower.IO*.

## New Shorthand for ShareCoffee

To save even more keystrokes when building Apps for SharePoint, you can access ShareCoffee now by using the $s shorthand.

## Inject custom AppWebUrl

Since the first release of ShareCoffee, you’re able to load AppWebUrl by providing a custom function. With the release of `0.0.11`, you’re also able to load the `AppWebUrl` by yourself and provide the actual string to ShareCoffee.

## Inject custom HostWebUrl

Since the first release of ShareCoffee, you’re able to load HostWebUrl by providing a custom function. With the release of `0.0.11`, you’re also able to load the `HostWebUrl` by yourself and provide the actual string to ShareCoffee.

## Inject FormDigestValue

In SharePoint-Hosted Apps (using the common MasterPage) you’re able to grab the `FormDigestValue` by using the `ShareCoffee.Commons.getFormDigest()` Method. Unfortunately, the underlying hidden field isn’t available in Cloud-Hosted Apps or HTML/ASPX pages within SharePoint-Hosted Apps not using the MasterPage. With `0.0.11` you can also inject either a function for loading the FormDigestValue from SharePoint’s REST endpoint or load it by yourself and provide it to ShareCoffee.

## Using AngluarJS stringify if present

AngularJS provides it’s own `stringify` method for converting JSON objects to a string. The angular implementation takes care about properties prefixed with the `$` sign. *This method will only be used if your app is using AngularJS*.

## Removed getFormDigest call for GET requests

For `GET` requests no `FormDigestValue` is required, because of this I’ve removed the actual call to `ShareCoffee.Commons.getFormDigest()` from the `RESTFactory` which is responsible for building REST request property objects.


