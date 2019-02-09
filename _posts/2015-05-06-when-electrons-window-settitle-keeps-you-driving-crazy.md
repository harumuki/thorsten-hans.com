---
title: When Electron’s window.setTitle keeps you driving crazy
layout: post
permalink: when-electrons-window-settitle-keeps-you-driving-crazy
redirect_from: /2015-05-06_When-electron-s-window-setTitle-keeps-you-driving-crazy-d81aaf0d59e1
published: true
tags: [Electron]
excerpt: When you start your Electron App, the title of the main window may flash. Read this article and learn how to prevent title flashing
featured_image: /assets/images/posts/feature_images/2015-05-06-when-electrons-window-settitle-keeps-you-driving-crazy.jpg
unsplash_user_name: Jeff Sheldon
unsplash_user_ref: ugmonk
---

As a reaction on my initial post about Electron, [Ingo Richter](https://github.com/ingorichter) came up with a comment on setting the window's title. He described that he get errors when trying to set the window title to the app’s name.

`browser-window` is exposing the `setTitle` function and `app` is exposing the `getName` function. So my first impression was “well, that should be easy to realize”, but there is on common pitfall that I realized when trying to set the title of the window – which I’d like to share with you.

Take the following HTML as given:

```html
<html>
	<head>
    	<title>bar</title>
    </head>
    <body>
    	<!-- ... -->
    </body>
</html
```

moreover, you’re now trying to set the window’s title from within the **main process** like this

```javascript
let app = require('app'),
    browserWindow = require('browser-window');
    
// .... stripped the unimportant part here
app.on('ready', () => {

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });

  // assume that app.getName() returns foo
  mainWindow.setTitle(app.getName());
  mainWindow.loadUrl('file://' + __dirname + '/../browser/index.html');
```

See the comment in the snippet, so we’re assuming that `app.getName()` returns **foo** so you might expect that the app shows **foo** as title, but when running the sample the title **remains bar**!

After reviewing my initial part of code, I thought “Well let’s call `mainWindow.setTitle(app.getName())` after loading the website… However, changing the order of these two lines didn’t change anything. The MainWindow’s title remained **bar**.

The root cause is that loading a page happens async, so there are two ways how to fix that, a dirty (sync) way and the correct (async) way.

## Get it working for sync code

**HACK** a dirty little hack how to get that working in a few secs is to delete the `<title>bar</title>` from my HTML file. When now title node is present, **foo** will not be replaced after loading the page. See [the dirty implementation here on GitHub](https://github.com/ThorstenHans/electron-angular-es6/commit/00ffc75e4f25bdc94d29dcd5bcc554ed54d8b66a?diff=unified)


## Get it working the right (async) way

`browser-window` isn’t exposing an event when a page has loaded. However, when revisiting the inner `WebContents` instance (exposed by the `webContents` property, you’ll find the `did-finish-load` event which can be used to safely set the window’s title after the page is being loaded.

change the script to the following to get it working

```javascript
// ...
app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });

  mainWindow.loadUrl('file://' + __dirname + '/../browser/index.html');
    
  mainWindow.webContents.on('did-finish-load',() => {
      mainWindow.setTitle(app.getTitle());
  });

});

```

Also, the title of your window will be set to your app’s name. [See the correct (async) implementation right here on GitHub](https://github.com/ThorstenHans/electron-angular-es6/commit/3db7c3ba285b262405be41da2ef0be09746c7142?diff=unified)

I think this post was worth writing because it can save other electron developers a few **WTFs** when building their electron apps. 🙂


