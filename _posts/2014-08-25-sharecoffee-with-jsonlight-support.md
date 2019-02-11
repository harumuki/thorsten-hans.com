---
title: ShareCoffee with JsonLight support
layout: post
permalink: sharecoffee-with-jsonlight-support
redirect_from: /sharecoffee-with-jsonlight-support-c32d0a32a750
published: true
tags: [SharePoint, O365, ShareCoffee]
excerpt: ShareCoffee receives support for JSONLight. Opt-in and make your Apps faster and more efficient
image: /announcement.jpg
unsplash_user_name: Matt Botsford
unsplash_user_ref: mattbotsford
---

A few minutes ago, I published the version 0.1.1 of ShareCoffee.

It’s available on *NuGet* and *bower.io* for downloading and upgrading if you’re already using it. New in the current release is *JsonLight* support for Office365. If you’re running on demand, your tenant can produce different results when calling SharePoint’s REST services.

On August 13th, Microsoft announced the availability of JSON Light responses for Office 365 on its [Office blog right here](http://blogs.office.com/2014/08/13/json-light-support-rest-sharepoint-api-released/){:target="_blank"}.

When you’re running on Demand, you can now also specify which level of metadata you’re interested in by using a single property.

```javascript
ShareCoffee.jsonRequestBehavior

```

By default, it’s using the regular `application/json;odata=verbose` setting (which is supported by onPremise environments). You can assign any of the following properties to this setting to change this

```javascript
ShareCoffee.jsonRequestBehavior = ShareCoffee.JsonRequstBehaviors.minimal;
// all requests will send odata=minimalmetadata as Accept header

ShareCoffee.jsonRequestBehavior = ShareCoffee.JsonRequstBehaviors.nometadata;
// all requests will send odata=nometadata as Accept header

ShareCoffee.jsonRequestBehavior = ShareCoffee.JsonRequstBehaviors.verbose;
// all requests will send odata=verbose as Accept header

ShareCoffee.jsonRequestBehavior = ShareCoffee.JsonRequstBehaviors.default;
// all requests will send odata=verbose as Accept header

```

After setting the property explicitly, all *REST* requests will use the metadata behavior you’ve selected right here.


