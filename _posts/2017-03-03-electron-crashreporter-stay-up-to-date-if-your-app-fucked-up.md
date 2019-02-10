---
title: Electron CrashReporter - stay up to date if your app fucked up!
layout: post
permalink: electron-crashreporter-stay-up-to-date-if-your-app-fucked-up
redirect_from: /electron-crashreporter-stay-up-to-date-if-your-app-fucked-up-3e9a989cd0a0
published: true
tags: [Electron, Angular]
excerpt: Learn how to deal with the unexpected. How can you deal with errors once you've shipped your Electron application. This post explains how to setup and use CrashPad on all platforms
featured_image: /assets/images/posts/feature_images/2017-03-03-electron-crashreporter-stay-up-to-date-if-your-app-fucked-up.jpg
---
Every one of us knows about those situations. You ship your app to production and you're instantly losing 10 pounds of weight 💪🏼 if nothing bad happens in the first 24 hours. You're finally able to get some sleep, customers are happy, the manager is happy, *you are happy*!

But at some point in time your app will crash! It will definitely crash. No matter how professional you are, there are bugs! Customers will find them! And that's **okay**.

We've tools and technologies to patch our software easily. We can deliver updates through stores or using plain `HTTP` in combination with third-party libraries to instantly update an app which is already installed on a customers device.

It's **not okay** to trust in your strength and the robustness of your app for 100% without expecting that some bugs may happen. *Don't be that naive*. Use proper mechanisms to measure what's going on. Mechanisms like Microsoft's AppInsight and of course Electron's built-in *CrashReporter*.

## Electron  -  CrashReporter

*CrashReporter* will send unexpected, occurred at runtime to a remote Server using either `HTTP` or `HTTPS`.

Electron's *CrashReporter* is an implementation of [Crashpad](https://chromium.googlesource.com/crashpad/crashpad/+/master/README.md){:target="_blank"}, a powerful crash-reporting engine. Crashpad has been integrated into Google Chromium for macOS back in March 2015 and replaced the previous library called Breakpad. **Breakpad, on the other hand, is still being used for Electron on Windows and Linux**. That's important as you'll notice in a few seconds.

----

Setting up *CrashReporter* inside of an Electron app is frictionless. It's just a simple function call with some metadata that belongs to the **main process**. You should initialize *CrashReporter* **as early as possible** in your app's lifecycle.

```javascript
const { app, BrowserWindow, crashReporter } = require('electron');

crashReporter.start({
  productName: 'TaskApp',
  companyName: 'Thorsten Hans',
  submitURL: 'http://localhost:3000/api/app-crashes',
  uploadToServer: true
});

```

That's all for Windows and Linux!

## macOS additions
As already mentioned is Electron using *Crashpad* instead of *Breakpad* as the foundation when executing an app on macOS. That said, you've to start the *CrashReporter* explicitly in both process (*main* and *renderer*).

So you should add the following snippet to the *renderer process*.

```javascript
const crashReporter = require('electron').crashReporter;

crashReporter.start({
  productName: 'TaskApp',
  companyName: 'Thorsten Hans',
  submitURL: 'http://localhost:3000/api/app-crashes',
  uploadToServer: true
});

```

> This code is for demonstration purpose, in your real implementation you'll, of course, get rid of the duplicated code.

## Hint for Angular developers

If you're writing your web app based on *Angular*, you should [check out ngx-electron](https://www.npmjs.com/package/ngx-electron){:target="_blank"}, a small library which makes consuming *Electron APIs* in *TypeScript* and *Angular* frictionless.

## The server-side
There are already two open source projects that you can use to get the server-side API up and running:

 * [mini-breakpad-server](https://github.com/electron/mini-breakpad-server){:target="_blank"}
 * [socorro](https://github.com/mozilla/socorro){:target="_blank"}

If you want to get it up and running in no time, go and take one of these. Personally, I prefer integrating the server-side logic into the project's API over having a second, dedicated API.

The following sample demonstrates how to implement the server-side API using Node.js and Express.

### Setup the API

If you've already a working express API, you can skip these steps, but ensure that you've installed `multer` package in addition to `express` itself.

```bash
mkdir node-api

yarn init

yarn add express — save
yarn add multer — save

touch index.js

```

### The express API implementation
The implementation is pretty much, straight forward. *CrashReporter* will send any crash as `POST` request to the defined API endpoint (here `http://localhost:3000/api/app-crashes`). It's a `multipart/form-data` message, containing a dump file and the following metadata:

```json
{ 
  _companyName: 'Thorsten Hans',
  _productName: 'TaskApp',
  _version: '0.1.1',
  guid: 'e47569a7-da27–4632–9bf8–1cef7f8b44b9',
  platform: 'darwin',
  process_type: 'renderer',
  prod: 'Electron',
  ver: '1.4.15'
}

```

You can also add custom metadata, according to the official docs, only string properties are sent successfully to the API endpoint.

```javascript
const express = require('express'),
  multer = require('multer'),
  bodyParser = require('body-parser'),
  path = require('path'),
  fs = require('fs'),
  http = require('http'),
  miniDumpsPath = path.join(__dirname, 'app-crashes');

const app = express(),
  server = http.createServer(app);

let upload = multer({
  dest: miniDumpsPath
}).single('upload_file_minidump');

app.post('/api/app-crash', upload, (req, res) => {
  req.body.filename = req.file.filename
  const crashData = JSON.stringify(req.body);
  fs.writeFile(req.file.path + '.json', crashData, (e) => {
    if (e){
      return console.error('Cant write: ' +  e.message);
    }
    console.info('crash written to file:\n\t' + crashData);
  })
  res.end();
});

server.listen(3000, () => {
  console.log('running on port 3000');
});

```

The `multer` package does a great job in dealing with `multipart/form-data` requests. Everything else is pretty self-explaining. 

This API is just taking all the metadata and writes it to a dedicated file. The created file will have the same name as the `minidump`, but it'll have the `.json` extension. Both files were written to the subfolder `app-crashes`.

Start the API from the terminal using `node index.js`.

## Testing CrashReporter

You can easily test your CrashReporter setup using `process.crash()` from both processes like shown in the following figure.

{% include image-caption.html imageurl="/assets/images/posts/2017/electron-crashreporter-1.png" 
title="Electron CrashReporter in Action!" caption="Electron CrashReporter in Action!" %}

From this point in time you'll receive important information about unexpected app crashes 💣 from all your electron app instances. In combination with the dump file, it's easier to reproduce what happened and less time consuming to find and eliminate bugs 🚀. 
