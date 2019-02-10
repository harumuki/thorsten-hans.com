---
title: What's new in ShareCoffee 0.0.8
layout: post
permalink: whats-new-in-sharecoffee-v0-0-8
redirect_from: /2014-01-16_What-s-new-in-ShareCoffee-v0-0-8-3bc1165457
published: true
excerpt: See what is new in ShareCoffee 0.0.8
tags: [SharePoint, O365, ShareCoffee]
featured_image: /assets/images/posts/feature_images/announcement.jpg
unsplash_user_name: Matt Botsford
unsplash_user_ref: mattbotsford
---

Today I’ve published *ShareCoffee* `0.0.8`. You can download the latest version from [GitHub](https://github.com/ThorstenHans/ShareCoffee){:target="_blank"} or directly include the library into your project by using *NuGet* or *bower.io*.

## What’s new in this release

Version `0.0.8` of ShareCoffee ships with some great new features. I’ve added full API documentation which is hosted directly on GitHub (see the `docs` folder) or have a look at the `.coffee` sources. I’ve also removed the classes `ShareCoffee.REST.angularProperties`, `ShareCoffee.REST.jQueryProperties` and  `ShareCoffee.REST.reqwestProperties`. Instead, a unified, new class called `ShareCoffee.REST.RequestProperties` was added. 

**No matter** if you’re going to create requests for `AngularJS`,  `jQuery` or `reqwest` you can now use instances from this class.

## Road to 1.0.0

I’m currently working on Search integration. It’s, of course, possible to use the plain ShareCoffee.REST API, but with the upcoming Search wrapper you’ll be able to use a fluent JavaScript API for providing all available configuration properties and this across all methods (`query`, `postQuery` and `suggest`).

The integration of *Social* and *UserProfiles* are also pending. However, I’m not sure if I can manage it to implement all these features for version `1.0.0`.


