---
title: SharePoint.Jasmine — Test your JavaScript directly inside your App
layout: post
permalink: sharepoint-jasmine-test-your-javascript-directly-inside-your-app
redirect_from: /sharepoint-jasmine-test-your-javascript-directly-inside-your-app-7ce60c25ff12
published: true
tags: [Frontend]
excerpt: I've published a new NuGet package which makes testing SharePoint Apps painless.
image: /testing.jpg
unsplash_user_name: David Travis
unsplash_user_ref: dtravisphd
---

Today I’ve published SharePoint.Jasmine on [GitHub](https://github.com/ThorstenHans/SharePoint.Jasmine){:target="_blank"} and [NuGet](https://www.nuget.org/packages/SharePoint.Jasmine/){:target="_blank"} which allows you to test your JavaScript code directly inside of a SharePoint App. By installing SharePoint.Jasmine into your project using

`Install-Package SharePoint.Jasmine`

All required artifacts for executing JavaScript UnitTests using [Jasmine](http://jasmine.github.io/){:target="_blank"} are automatically integrated into your App project. The updated App structure will look like the following

{% include image-caption.html imageurl="/assets/images/posts/2014/jasmine-1.png"
title="SharePoint App structure" width="300" caption="SharePoint App structure" %}

Most important is the actual test page located in `Pages/tests`

The `index.aspx` file is responsible for loading the Jasmine Test-Runner, the specs and all the JavaScript source files you’re interested in. By default, I’ve added the Jasmine-Sample folder which gives you a rough introduction in how to write JavaScript unit tests using Jasmine. When installing the App and navigating to the Test-Runner-Site, you’ll receive the test results embedded in the default SharePoint MasterPage.

{% include image-caption.html imageurl="/assets/images/posts/2014/jasmine-2.png"
title="Jasmine's test results directly in your App" caption="Jasmine's test results directly in your App" %}

Keep on testing your code 🙂


