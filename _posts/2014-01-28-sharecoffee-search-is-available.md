---
title: ShareCoffee.Search is available
layout: post
permalink: sharecoffee-search-is-available
redirect_from: /2014-01-28_ShareCoffee-Search-is-available-47d2e2479b4a
published: true
excerpt: ShareCoffee receives an Add-On. Now you can consume SharePoint's Search API directly from ShareCoffee and easily find things located in SharePoint or Office365.
tags: [SharePoint, O365, ShareCoffee]
featured_image: /assets/images/posts/feature_images/announcement.jpg
unsplash_user_name: Matt Botsford
unsplash_user_ref: mattbotsford
---

I’m glad to announce the availability of `ShareCoffee.Search` [GitHub](https://github.com/ThorstenHans/ShareCoffee.Search){:target="_blank"} `0.0.1`.

Today I’ve published the first Add-On for *ShareCoffee*. By using `ShareCoffee.Search` (which is also available on *NuGet*, *bower.io*, and *GitHub*) you can now easily execute Search queries from any SharePoint App. *ShareCoffee.Search* offers a fully configured `PropertyObjects` to support you by writing any search query. Of course, can you use ShareCoffee to execute a `GET` or `POST` request against SharePoint’s Search API but then you’ve to remember all of the property names, which turned out to be very time-consuming. That’s why I decided to publish this Add-On.

After installing the package by using NuGet for example

```powershell
Install-Package ShareCoffee.Search

```

Both *ShareCoffee* and *ShareCoffee.Search* is pulled from the NuGet Repository and installed to your App Project. Next is referencing the files using

## Executing a Query (GET)

Creating a Query using `ShareCoffee.Search` is nothing special. Depending on your environment you either enter by `ShareCoffee.REST` or `ShareCoffee.CrossDomain` namespace and use the typical *ShareCoffee* API. If you’re executing queries using HTTP `GET` there is a URL length limitation which is defined in [RFC 2616](http://www.faqs.org/rfcs/rfc2616.html){:target="_blank"} caused by this, *ShareCoffee* will throw an error if you try to execute a `GET` request using such a long URL. Instead, you should use `PostQuery` (see next paragraph)

```javascript
// either pass querytext, selectproperties, querytemplate to the constructor
var properties = new ShareCoffee.QueryProperties();
// or set the properties you're interested in directly on the properties object
properties.queryText = "SharePoint";
properties.rowLimit = 10;
properties.startRow = 5;
// optional either set on properties Object or pass to angularJS directly
properties.onSuccess = function(data){
  // handle results
};

$http(ShareCoffee.REST.build.read.f.angularJS(properties))
  .success(properties.onSuccess)
  .error(function(error){
    // handle error
  });

```

## Executing a PostQuery (POST)

I’ve written an article earlier today about some wired errors when executing PostQueries using SharePoint’s REST interface. [(You can find it here)]({% post_url 2014-01-28-using-sharepoint-2013-search-rest-api-to-execute-postqueries %}). Because of these problems, there is a dedicated `ShareCoffee.PostQueryProperties` class which has to be used to execute `PostQueries`. See the following sample which executes a `PostQuery` from a CloudHosted App using `SP.RequestExecutor`


```javascript
  // pass querytext, selectproperties, querytemplate to the ctor
  var properties = new ShareCoffee.QueryProperties();

  // or set them directly on the properties object
  properties.queryText = "Office 365";
  properties.rowLimit = 100;
  properties.startRow = 50;

  // either set on properties Object or use jQuery's API chain
  properties.onSuccess = function(data){
      // handle search results
  };

  $.ajax(ShareCoffee.REST.build.read.f.jQuery(properties))
  .done(properties.onSuccess)
  .fail(function(error){
    // handle error
  });

```

## Executing a SuggestQuery (GET)

Last but not least there is also support for suggest queries. Suggest queries are straight forward. Just set all the properties you’re interested in on a new instance of `ShareCoffee.SuggestProperties` and execute the query as expected.

```javascript
// either pass Querytext, SelectProperties or QueryTemplate to the constructor
var properties = new ShareCoffee.SuggestProperties("SharePoint");
// or set the properties you're interested in directly on the object
properties.showpeoplenamesuggestions = true;

$.ajax(ShareCoffee.REST.build.read.f.jQuery(properties))
  .done(function(data){
    // handle data  
  })
  .fail(function(error){
    // handle error
  });

```

## Feedback wanted

It would be great to get some feedback from the community on ShareCoffee and ShareCoffee.Search. Do you have any issues when using my library? Is there something you don’t like about it? Do you like it?  Leave a comment here or create an issue on GitHub and share your findings, feedback or question! 

Thorsten


