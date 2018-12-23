---
title: Using Augury inside of Electron Apps
layout: post
permalink: using-augury-inside-of-electron-apps
published: true
tags: [Electron, Angular]
excerpt: Augury by Rangle.IO is currently the best Chrome Extension for debugging Angular apps. Learn how to debug Angular apps inside of Electron using Augury.
featured_image: /assets/images/posts/feature_images/2016-07-02-using-augury-inside-of-electron-apps.jpg
---

Writing apps using *GitHub’s Electron* is a reasonably easy task. The framework and community-driven tools are taking away much pain from you as a developer. Nevertheless, it is essential to have powerful debugging tools working in every environment. [*Augury*](https://augury.rangle.io/) (created by *Rangle.IO*) is currently the most powerful debugging tool for *Angular* developers. It’s a *Chrome Extension* that works perfectly inside of the Browser, in this post, you’ll learn how to use *Augury* inside of your *Electron* apps.

While attending [AngularCamp](http://angularcamp.org) here in Barcelona, I had the chance to attend [Vanessa Yuen](https://twitter.com/vanessayuenn). She’s a full-stack developer at [Rangle.io](http://rangle.io/) and came all the way from Toronto to the beautiful and sunny Barcelona to share key concepts and responsibilities of their latest tool, [*Augury*](https://augury.rangle.io/).

Vanessa did a fantastic job on stage; she explained how *Augury* works and how it enriches every *Angular* developer’s life. Besides displaying the component tree of your application, *Augury* provides insights about the router configuration and a dependency tree visualization. Compared to all other debugging tools for *Angular* I’ve seen so far, *Augury* seems to be the most powerful.

[Lino (@linoman)](https://twitter.com/linoman), another *AngularCamp* attendee asked me if it’s possible to use *Augury* inside of *Electron* apps to have the same, great debugging experience also in *Angular* desktop applications. I spent a couple of minutes to build a short sample from scratch. It should be easy to follow these instructions to get *Augury* also up and running in your *Electron* application.

## Embed Augury in Electron apps

- Install Augury in your local Chrome Browser Installation by pulling it from the Chrome web store
- open another tab and navigate to `chrome://extensions/`
- Locate Augury and copy the `id` from the extension instance. Something like `elgalmkoelokbchhkhacckoklkertfdd`

From this point in time, the following steps depend on **your platform and system configuration**. You need to find the local path of your Augury installation. The future paths may differ depending on your operating system version, but at least those default paths should provide a hint.

### Windows

`%LOCALAPPDATA%GoogleChromeUser DataDefaultExtensions`

### MacOS

`~/Library/Application Support/Google/Chrome/Default/Extensions`

### Linux

Depending on the package you used to install Chrome on your Linux system, you’ll find your extensions in on of those paths.

```bash
~/.config/google-chrome/Default/Extensions/  
~/.config/google-chrome-beta/Default/Extensions/
~/.config/google-chrome-canary/Default/Extensions/
~/.config/chromium/Default/Extensions/

```

Once you found your local `extensions` folder, navigate to the subfolder named your *Augury* extension instance id. *Rangle.IO* is currently packaging the extension in a folder matching *Augury’s* version number. Because you need the path pointing to the manifest, navigate into the version-specific folder and copy the entire path. On *macOS* and *Linux* you can use `pwd | pbcopy` to put the current working directory into your clipboard.

----

Okay, now you’ve all pre-requirements in place, and you can move on to your Electron “instruction file” and use *Electron’s* API to bring *Augury* to your custom application. *Electron* is exposing a method called `addDevToolsExtension` as static member on `BrowserWindow`.

```javascript
BrowserWindow.addDevToolsExtension(auguryPath);

```

To call into the method, you have to pay respect to *Electron's* application lifecycle. It’s not allowed to call this method before the `ready` event fires.

Here a small example of a simple *Electron* “instruction file” using `addDevToolsExtension`:

```javascript

app.on('ready', () => {
    mainWindow = new BrowserWindow({ width: 1000, height: 700 });
    let auguryPath = '/Users/thorsten/Library/Application Support/Google/Chrome/Default/Extensions/abcdefghijklmnopqrs/1.0.3_0';
    
    BrowserWindow.addDevToolsExtension(auguryPath);

    // open devTools on demand
    globalShortcut.register('CmdOrCtrl+Shift+d', () => {
        mainWindow.webContents.toggleDevTools();
    });

    mainWindow.setTitle('Augury Electron Integration');
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

```

## Test the integration

Having the integration finished, it’s time to give it a try. Start your application and open the excellent Chrome Developer Tools (here assigned to the shortcut `CmdOrCtrl+Shift+d`).

{% include image-caption.html imageurl="/assets/images/posts/2016/augury-in-electron.png"
title="Augury Goodness in Electron" caption="Augury Goodness in Electron" %}

As you’ve seen, the trickiest part is finding your local installation of *Augury*. Integration with GitHub’s *Electron* is effortless. Nevertheless, if you encounter any problems or errors while integration *Augury*, ping me.



