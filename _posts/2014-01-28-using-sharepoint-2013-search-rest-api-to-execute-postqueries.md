---
title: Using SharePoint 2013 Search REST API to execute PostQueries
layout: post
permalink: using-sharepoint-2013-search-rest-api-to-execute-postqueries
redirect_from: /using-sharepoint-2013-search-rest-api-to-execute-postqueries-b2bf96d6bbb1
published: true
tags: [SharePoint]
excerpt: SharePoint is exposing it's Search service via HTTP. In this article I share some essential tips when using SharePoint's Search Service via HTTP.
image: /learning.jpg
unsplash_user_name: Helloquence
unsplash_user_ref: helloquence
---

Because I’m currently writing my first Add-On for *ShareCoffee* which is going to provide a fluent and easy way to consume SharePoint’s Search Services, I had to dig a little bit deeper into SharePoint Search REST API. 

Executing Search requests as a `GET` request is straight forward, and there is nothing special about them. However, if you hit the URL length limitation of your browser you should consider executing the search query using SharePoint’s `PostQuery` endpoint. (`/_api/search/postQuery`).

When making this `POST` request, it’s essential to provide all! Properties with the correct casing. Internally the request will be serialized into an instance of `Microsoft.Office.Server.Search.REST.SearchRequest` (see [http://msdn.microsoft.com/en-us/library/hh627069(v=office.12).aspx](http://msdn.microsoft.com/en-us/library/hh627069%28v=office.12%29.aspx){:target="_blank"} for documentation).

Unfortunately, the current implementation isn’t able to ignore the casing while transforming the REST request into the `CLR` object. If you provide a wrong casing to any of the properties, you’ll be faced with an error instead of receiving all the suggested results from SharePoint’s search. In the case that you’re not using *ShareCoffee* and it’s upcoming Search add-on for querying the SharePoint Search you should definitively keep this in mind.


