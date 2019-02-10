---
title: ShareCoffee is available
layout: post
permalink: sharecoffee-is-available
redirect_from: /sharecoffee-is-available-7fcf0eac3dc4
published: true
excerpt: I'm proud to release the first version of ShareCoffee. A small but powerful library which unifies consumption of SharePoint's HTTP based APIs. In addition a bunch of helpers are included for the SharePoint App framework.
tags: [SharePoint, O365, ShareCoffee]
featured_image: /assets/images/posts/feature_images/announcement.jpg
unsplash_user_name: Matt Botsford
unsplash_user_ref: mattbotsford
---

I’ve published ShareCoffee today [on GitHub](http://github.com/ThorstenHans/ShareCoffee){:target="_blank"}. ShareCoffee is a small library containing cool stuff for SharePoint App developers. ShareCoffee is entirely written in CoffeeScript using the test-driven-design approach with (Mocha, ChaiJS, and SinonJS). Since the SharePoint App model is available, I thought about writing this library, but within the last four days I sat down and created it! 🙂

ShareCoffee is offering all the stuff I was faced with since I started App development for SharePoint. The goal was for me to create a library which provides a single programming interface for any SharePoint App. What is ShareCoffee offering ShareCoffee is offering various functionality which I’ve grouped into the following `namespaces`:

- ShareCoffee.Commons
- ShareCoffee.UI
- ShareCoffee.REST
- ShareCoffee.CSOM
- ShareCoffee.CrossDomain

In this post I’m explaining how to install ShareCoffee in your project and the functionality offered by `ShareCoffee.Commons` and `ShareCoffee.UI`

## Wiki and Samples on GitHub

There are also a bunch of samples on GitHub in [a dedicated repository](https://github.com/ThorstenHans/ShareCoffee.Samples){:target="_blank"}, And the entire API is documented within the [WIKI on GitHub](https://github.com/ThorstenHans/ShareCoffee/wiki){:target="_blank"}

## Installing ShareCoffee

You can install ShareCoffee by copying the JavaScript library from the repository to your project, which will work but it’s quite dirty. It’s a better approach to install ShareCoffee from `NuGet` or `bower.io` using the following commands

### NuGet

```powershell
Install-Package ShareCoffee

```

### Bower.IO

```bash

bower install ShareCoffe

```

After the sources have been included in your project, you have to add a script reference to your SharePoint App WebSite, and you’re ready to go. When writing JavaScripts, you can enable basic IntelliSense using the reference syntax in VisualStudio by adding the following line to your JavaScript file

```javascript
/// <reference path="sharecoffee/sharecoffee.js" />

```

### ShareCoffee.Commons

The commons are everyday helpers such as

- `ShareCoffee.Commons.getQueryString()`
- `ShareCoffee.Commons.getQueryStringParameter(parameterName)`
- `ShareCoffee.Commons.getFormDigest()`
- `ShareCoffee.Commons.getAppWebUrl()`
- `ShareCoffee.Commons.getHostWebUrl()`
- `ShareCoffee.Commons.getApiRootUrl()`

Most of the methods should be self-explaining, but `getAppWebUrl()` and `getHostWebUrl()` offer some great functionality. For both methods you can define custom load methods, which will be invoked to load this data from your custom storage (Database, Cookie, …)  `getAppWebUrl` looks for `_spPageContextInfo`, if `_spPageContextInfo` is not present, it checks the URL for the `SPAppWebUrl` parameter. For both methods, the custom load functions have the highest priority, which means that if you pass a custom load function, `getAppWebUrl` and `getHostWebUrl` will only call these. You can set the custom load function for `getAppWebUrl` as shown here:


```javascript
var appWebUrl = ShareCoffee.Commons.getAppWebUrl();
// looks within _spPageContext if present
// looks within the QueryString for SPAppWebUrl

ShareCoffee.Commons.loadAppWebUrlFrom = function(){
  return "https://my-appweb-url/";
};

appWebUrl = ShareCoffee.Commons.getAppWebUrl();
// will only invoke ShareCoffee.Commons.loadAppWebUrlFrom()

```

### ShareCoffee.UI

`ShareCoffee.UI` is offering various functions for interacting with SharePoint’s UI. The most powerful method is of course `ShareCoffee.UI.loadAppChrome(chrome settings);` which does the whole SharePoint-App-Chome loading stuff for you! The following Sample shows how `loadAppChrome` is configured.

```javascript
  var chromeSettings = new ShareCoffee.ChromeSettings("", "My AutoHosted SharePoint App",
    new ShareCoffee.SettingsLink("foo.html", "Foo", true),
    new ShareCoffee.SettingsLink("bar.html", "Bar", true)
  );
  
  var onAppChromeLoaded = function () {
    console.log("chrome should be loaded now!");
  };
  
  ShareCoffee.UI.loadAppChrome("chrome-placeholder-id", chromeSettings, onAppChromeLoaded);

```

#### Other methods in ShareCoffee.UI

- `ShareCoffee.UI.showNotification()`
- `ShareCoffee.UI.removeNotification()`
- `ShareCoffee.UI.showStatus()`
- `ShareCoffee.UI.setStatusColor()`
- `ShareCoffee.UI.removeStatus()`
- `ShareCoffee.UI.removeAllStatus()`

See notification samples here.

```javascript
// showNotification(message, isSticky = false)
// isSticky defaults to false
ShareCoffee.UI.showNotification("My notification");

var stickyNotificationId = ShareCoffee.UI.showNotification("My sticky notification", true);

ShareCoffee.UI.removeNotification(stickyNotificationId);

```

Moreover, status samples here.

```javascript
var lastStatusId = null;
 
// showStatus(title, contentAsHtml, showOnTop = false, color = 'blue');
//use defaults for showOnTop (false) and color (blue)
lastStatusId = ShareCoffee.UI.showStatus("Status Title", "ShareCoffee <b>Status</b>"); 

// show status on top
lastStatusId = ShareCoffee.UI.showStatus("Status Title", "ShareCoffee <b>Status</b> displayed on top", true);
 
ShareCoffee.UI.setStatusColor(lastStatusId, 'red');
ShareCoffee.UI.setStatusColor(lastStatusId, 'yellow');
ShareCoffee.UI.setStatusColor(lastStatusId, 'blue');
 
// removeStatus will not be forwarded to SharePoint is statusId is null or undefined
ShareCoffee.UI.removeStatus(lastStatusId);
ShareCoffee.UI.removeAllStatus();
 
```

### What’s next

Within the next post on ShareCoffee, I’ll explain how to work with the `ShareCoffe.REST` namespace!

Happy Scripting.


