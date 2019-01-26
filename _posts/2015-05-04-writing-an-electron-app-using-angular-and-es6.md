---
title: Writing an Electron app using Angular and ES6
layout: post
permalink: writing-an-electron-app-using-angular-and-es6
published: true
tags: [Electron, Angular]
excerpt: Learn how to create a cross-platform desktop application for Windows, Linux and macOS based on GitHub Electron, Angular.JS and JavaScript. In this tutorial, the JS code will be transpiled using Babel and dynamic module loading is implemented with SystemJS.
featured_image: /assets/images/posts/feature_images/2015-05-04-writing-an-electron-app-using-angular-and-es6.jpg
unsplash_user_name: Anastasia Yılmaz
unsplash_user_ref: anastasiayilmaz
---

If you haven’t heard of _Electron_ (formerly known as _Atom Shell_) you should check out it's official website [here](https://github.com/atom/electron).

In this post, I will not provide an introduction for all the different tools and frameworks. It’s more a walkthrough that should give you some hints on how to get things up and to run with the following stack.

- [Electron](https://github.com/atom/electron)
- [AngularJS](http://angularjs.org)
- ES6 using [Babel](https://babeljs.io) as transpiler
- [SystemJS](https://github.com/systemjs/systemjs) as module-loader

## Getting started

First of all, you’ve to ensure that all dependencies are installed on your system and a simple folder structure has been created for the sample project.

I’ve created a small shell script which will care about those tasks.

You can download the script from [here](https://github.com/ThorstenHans/electron-angular-es6/blob/master/init.sh).

The script will install the following global node modules:

- JSPM
- Gulp.js
- electron-prebuilt

After installing those global node modules, the folder structure for our project with some empty files will be created in the current directory. (More about the folders and their responsibility later in this post)

Besides global dependencies, there are also some dependencies for the actual project. All npm packages are installed locally using the `save-dev` option because they’re only used during development time. Those packages are

- `gulp-babel`
- `gulp-run`
- `gulp-rename`

### Downloading and Executing init.sh

```bash
cd ~/dev

# Install wget if not existing using brew\
brew install wget

# Download the init script
wget https://raw.githubusercontent.com/ThorstenHans/electron-angular-es6/master/init.sh

# Make it executable
chmod +x init.sh

# Execute it
./init.sh

```

init.sh will internal execute `npm init` in order to generate a `package.json` file. Ensure that you provide a proper **name** and **version string** and provide `app/index.js` as entry point.

{% include image-caption.html imageurl="/assets/images/posts/2015/electron-es6-babel-1.png"
title="A new package.json by npm init" caption="A new package.json by npm init" %}

### Electron App Folder Structure

As mentioned earlier, some folders and files will be created by the `init.sh` script.

{% include image-caption.html imageurl="/assets/images/posts/2015/electron-es6-babel-1.png"
title="Generated folder structure by init.hs" caption="Generated folder structure by init.hs" %}

The `app` folder is responsible for holding ES6 scripts for our main process. The `index.es6.js` file is responsible for bootstrapping our electron app.

The `browser` folder holds all the assets, scripts, styles … for our render process. This is where your app belongs to, here a bunch of empty files has been created for you.

## Writing the Gulpfile

The gulpfile for this sample is also pretty simple. Because we also want to write our App bootstrap file using ES6, we’ve to transpile this file to ES5 and in addition to this `task` there should also be a simple run task which will kick the `electron` executable and bypass the path to our app.

```javascript
const gulp = require('gulp'),
  babel = require('gulp-babel'),
  run = require('gulp-run'),
  rename = require('gulp-rename');

gulp.task('transpile-app', () => {
  return gulp
    .src('app/index.es6.js')
    .pipe(babel())
    .pipe(rename('index.js'))
    .pipe(gulp.dest('app'));
});

gulp.task('run', ['default'], () => {
  return run('electron .').exec();
});

gulp.task('default', ['transpile-app']);

```

## JSPM setup

As mentioned during the introduction, `jspm` is used to deal with all the client-side dependencies and bootstrap the module loader in conjunction with `babel`. Go to the root directory of the app and execute

`$ jspm install`

Answer the wizard questions with the following answers

- prefix config values in package.json **YES**
- server baseURL **./browser**
- jspm package folder **RETURN** (confirms browser/jspm_packages)
- config file path **RETURN** (confirms browser/config.js)
- create config.js **YES**
- client base url **RETURN**
- ES6 transpiler **BABEL**

{% include image-caption.html imageurl="/assets/images/posts/2015/electron-es6-babel-3.png"
title="The JSPM wizard" caption="The JSPM wizard" %}

Verify the configuration by executing `jspm install angular` After the script execution has finished, invoke `jspm inspect` here `github:angular/bower-angular` should be listed.

### Fix config.js

There is one small fix you’ve to accomplish to get dynamic-module-loading up and running for Electron with our folder structure. Open `browser/config.js` and change the second line (baseURL) to

```json
{
  "baseURL": __dirname + "/"
}

```

## The Simple markup

Add the following code to `index.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Electron / Angular / ES6 Sample</title>
    <script src="http://jspm_packages/system.js"></script>
    <script src="config.js"></script>
    <script type="text/javascript">
      System.import('./scripts/splash/app');
    </script>
  </head>
  <body>
    <h1>Electron / Angular / ES6 Sample</h1>
    <div ng-app="sampleApp">
      <div ng-controller="splashCtrl as splash">
        <p>You're running Electron version <span ng-bind="splash.electronVersion"></span></p>
      </div>
    </div>
  </body>
</html>

```

## Writing our angular Sample App

The sample app is simple, and it will just expose the currently used electron version to the view.

Add the following code to `browser/scripts/splash/controller.js`:

```javascript
'use strict';
class SplashCtrl {
  constructor() {
    this.electronVersion = process.versions['electron'];
  }
}

export { SplashCtrl };

```

Insert this code in `browser/scripts/splash/app.js`:

```javascript
import angular from 'angular';
import { SplashCtrl } from './controller';

angular.module('sampleApp', []).controller('splashCtrl', SplashCtrl);

```

## The electron bootstrap script

The only piece of code that is missing to get our sample working is the `app/index.es6.js` file. The following code is pretty much the same as shown in [Electron's Getting Started guide on GitHub](https://github.com/atom/electron/blob/master/docs/tutorial/quick-start.md). There are only two things specific to our sample app

1. It’s using ES6 language features
2. It’s providing the `browser/index.html` for the main window

```javascript
let app = require('app');
let BrowserWindow = require('browser-window');
require('crash-reporter').start();

var mainWindow = null;

app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  mainWindow.loadUrl('file://' + __dirname + '/../browser/index.html');
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

```

## Let’s try it

During this post, you’ve written the `gulp run` task; now it’s time to invoke it.

Open the terminal and move to your apps’ root directory and execute `gulp run`. Your app should look like the following and display the locally installed `electron-prebuilt` version which is `0.25.2` on my system.

{% include image-caption.html imageurl="/assets/images/posts/2015/electron-es6-babel-4.png"
title="The sample application on macOS" caption="The sample application on macOS" %}

## What’s next

I’m currently working on a yeoman generator for exactly this combination, and hopefully, it will be available by the end of the week. A yeoman generator can do all those basic things. Which means you as a dev can focus on actually building your app.

The entire sample is [available on GitHub](https://github.com/ThorstenHans/electron-angular-es6).
