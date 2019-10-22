---
title: Query FormDigestValue from SharePoint using ShareCoffee
layout: post
permalink: query-formdigestvalue-from-sharepoint-using-sharecoffee
redirect_from: /query-formdigestvalue-from-sharepoint-using-sharecoffee-83c044f2323d
published: true
tags: [ShareCoffee, SharePoint, O365]
excerpt: Do you know ShareCoffee? It's an API abstraction for SharePoint APIs and it makes daily tasks - such as querying the FormDigestValue - really easy.
image: /learning.jpg
unsplash_user_name: Tim Mossholder
unsplash_user_ref: timmossholder
---

When running in a SharePoint-Hosted App, you can easily receive the `FormDigestValue` by executing `ShareCoffee.Commons.getFormDigest()` which is very easy.

However, if you’re executing queries from a plain HTML page sitting in your SharePoint-Hosted App  - or in the case, you’re running in an Office Add-In -  you can ask for a `FormDigestValue` using ShareCoffee’s REST interface. The following sample code shows how to receive the `FormDigestValue` from within a plain HTML Page using AngularJS.

```javascript
$http(ShareCoffee.REST.build.create.for.angularJS({ url: 'contextinfo'}))
 .success(function(data){
   // access FormDigestValue
   // this is good for single time use. 
   var formDigestValue = data.d.GetContextWebInformation.FormDigestValue;
   // if you need the form-digest-value for more than a single call,
   // go and store it in ShareCoffee.Commons.formDigestValue like shown here:
   ShareCoffee.Commons.formDigestValue = data.d.GetContextWebInformation.FormDigestValue;
 })
 .error(function(error){
   console.log("Error loading Context Info");
 });
 
 ```

In the case, you’re writing your App in *CoffeeScript* (which is awesome :D) the code looks like the following.

```coffeescript
$http(ShareCoffee.REST.build.create.for.angularJS {url: 'contextinfo'})
.success((data)->
  # great for single time use
  formDigestValue = data.d.GetContextWebInformation.FormDigestValue
  # use this for page instace wide usages
  ShareCoffee.Commons.formDigestValue = data.d.GetContextWebInformation.FormDigestValue
).error((error)->
  console.log "error while loading contextinfo"
)

```
