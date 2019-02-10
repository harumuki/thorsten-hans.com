---
title: Wrong MSDN documentation on SharePoint's REST interface
layout: post
permalink: wrong-msdn-documentation-on-sharepoints-rest-interface
redirect_from: /misguiding-msdn-documentation-on-sharepoints-rest-interface-8d72d99cbd97
published: true
tags: [SharePoint]
excerpt: Today I found another bug in MSDN documentation which is worth sharing for SharePoint developers
featured_image: /assets/images/posts/feature_images/learning.jpg
unsplash_user_name: Helloquence
unsplash_user_ref: helloquence
---

Today I stumbled upon a documentation bug in MSDN (once again). When trying to access the list of all available `WebTemplates` on a `SPWeb`, [this article](http://msdn.microsoft.com/en-us/library/sharepoint/jj246878.aspx){:target="_blank"} describes that you can use SharePoint’s REST interface by sending an `HTTP POST` request to `http://yourtenant.sharepoint.com/sites/yoursite/_api/web/getAvailableWebTemplates(1033)`.

I was wondering why I should call a `GET` method using a `HTTP POST` operation. So I gave it a try. Using Chrome’s Postman plugin (which is fantastic for experimenting with REST interfaces), I tried to call the method as described within the MSDN reference.

SharePoint’s response was not surprising. When executing such a request you might receive an error like this.

{% include image-caption.html imageurl="/assets/images/posts/2013/msdn-1.png"
title="Bug verified in Postman" caption="Bug verified in Postman" %}

To get this working, you have to change the request from issuing an `HTTP POST` to issuing an `HTTP GET`and SharePoint will return the expected data.

{% include image-caption.html imageurl="/assets/images/posts/2013/msdn-2.png"
title="Correct results in Postman" caption="Correct results in Postman" %}

I’ve also submitted the documentation bug to Microsoft, perhaps the correct `HTTP` Method will appear on MSDN soon :).

That’s all for now, let’s get back to work.


