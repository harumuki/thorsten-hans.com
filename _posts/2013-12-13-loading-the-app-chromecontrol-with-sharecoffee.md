---
title: Loading the App ChromeControl with ShareCoffee
layout: post
permalink: loading-the-app-chromecontrol-with-sharecoffee
redirect_from: /loading-the-app-chromecontrol-with-sharecoffee-7e5327a376db
published: true
tags: [SharePoint, O365, ShareCoffee]
excerpt: When building SharePoint Apps, you've to load the so-called App chrome. This post explains how to make this integration smoother with ShareCoffee
image: /learning.jpg
unsplash_user_name: Helloquence
unsplash_user_ref: helloquence
---

[ShareCoffee](https://github.com/ThorstenHans/ShareCoffee){:target="_blank"} assists you as a SharePoint App Developer in various situations. Of course is the most significant benefit the unified REST layer across all different kinds of SharePoint Apps and query targets (AppWeb / HostWeb).

But there are some other nice features backed into ShareCoffee. Within this post I’ll explain how to load SharePoint’s `ChromeControl` and CSS within Cloud-Hosted-Apps. First, it’s important to mention that ShareCoffee does not require any other JavaScript library. It’s no problem if you’re using jQuery or similar libraries, but you don’t have to. Instead of following the MSDN and writing about **40 lines of JavaScript** code to get the ChromeControl into your app, **ShareCoffee exposes a single function** which has to be called to achieve the goal. First, you’ve to install ShareCoffee within your App. ShareCoffee can be installed in various ways.

- Install ShareCoffee by using NuGet
- Install ShareCoffee by using bower.io
- Install ShareCoffee by cloning the GitHub repository

Let’s assume that you’re using Visual Studio to build your App. So the first step is to include *ShareCoffee* by using the NuGet Package Manager Console. Execute

```powershell
Install-Package ShareCoffee

```

Now, all required files are included in your web-project. Next, you need to reference the script within your website by using the regular `script` tag.

{% raw %}
```html
<html>
  <head>
    <!-- removed to increase readability -->
    <script type="text/javascript" src="/Scripts/ShareCoffee/ShareCoffee.min.js"></script>
    <script type="text/javascript" src="/Scripts/ChromeSample.js"></script>
  </head>
</html>

```
{% endraw %}

As you may have noticed there is a second `script` tag which points to my custom JavaScript. 

```javascript
var iconUrl = 'https://www.example.com/myappicon.png';
var appChromeSettings = new ShareCoffee.ChromeSettings(iconUrl, 'SharePoint ChromeControl Sample',
    // Settings links are displayed within the AppChrome.
    // 1. Parameter = 'TargetURL'
    // 2. Parameter = 'Title'
    // 3. Parameter = AppendCurrentQueryString (true|false)
    new ShareCoffee.SettingsLink('foo.html', 'Foo', true),
    new ShareCoffee.SettingsLink('bar.html', 'Bar', true));
var onSuccess = function(){
  console.log('SharePoint App Chrome and CSS loaded');
};
ShareCoffee.UI.loadAppChrome('sharepoint-chrome-control', appChromeSettings, onSuccess);

```

The second JavaScript file is responsible for loading the Chrome-Control.Here are only a few configuration properties required `IconUrl`, `App Title` and some custom links that appear in the Chrome-Control. That’s all you need to do to load both, SharePoint’s ChromeControl and the SharePoint CSS into your SharePoint App.

To instruct *ShareCoffee* where it should put the Chrome-Control, you've to add a simple `div` container to your *HTML*

{% raw %}
```html
<html>
  <head>
    <!-- removed to increase readability -->
    <script type="text/javascript" src="/Scripts/ShareCoffee/ShareCoffee.min.js"></script>
    <script type="text/javascript" src="/Scripts/ChromeSample.js"></script>
  </head>
  <body>
    <div id="sharepoint-chrome-control"></div>
  </body>
</html>

```
{% endraw %}


That's all more is not required to render SharePoint's App Chrome-Control using *ShareCoffee*.
