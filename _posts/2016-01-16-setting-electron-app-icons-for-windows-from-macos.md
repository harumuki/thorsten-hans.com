---
title: Setting electron app icons for Windows from macOS
layout: post
permalink: setting-electron-app-icons-for-windows-from-macos
published: true
tags: [Electron]
excerpt: null
featured_image: /assets/images/posts/feature_images/2016-01-16-setting-electron-app-icons-for-windows-from-macos.jpg
---

When building cross-platform apps using *GitHub Electron*, you may run into the same issue I did a few days ago. I wanted to build an *Electron* app for *Windows* and *macOS* directly from my host-system (also *macOS*). The build-process failed because setting the *Windows App* Icon didn’t work for me when building it from the *Mac*.

I was using `gulp-atom-electron` to build the apps automatically. It has a dependency on `rcedit` which is a small Windows executable that is responsible for updating either *Windows Assemblies or Windows Executables* to make resource changes from outside. *GitHub* itself has published a corresponding npm module which uses `wine` to execute `wine rcedit app-name.exe --set-icon app-icon.ico` if you’re executing the code on a *macOS* or *Linux* system.

"Sounds great, should work?!". However, there is a platform switch in `gulp-atom-electron` that prevents `rcedit` from being invoked. That’s why I’ve ended up with a public fork of `gulp-atom-electron` called [**gulp-awesome-electron**](https://github.com/ThorstenHans/gulp-awesome-electron) that doesn’t prevent the execution of `rcedit`.

> The package isn’t available on npm-js! For installation instructions, continue reading.

## Installing the dependencies

As mentioned, `wine` is required to get this working on *macOS* or *Linux*. `wine` can easily be installed on *macOS* using *Homebrew* (aka `brew`). *Wine* has a dependency on `xquartz`, so you’ve to execute the following commands to install both:

```bash
# ensure that brew is up to date
brew update
brew install wine

```

`brew install wine` may fail if you haven’t installed `xquartz` yet. If so, follow the instructions to install `xquartz` and try the `wine` installation again.

## Installing required npm packages for Gulp.JS

My `Gulpfile` is a bit bigger. Therefore I stripped it to focus only on *Electron* stuff right here. To get the *Electron* build working, I’ve installed the following dependencies.

```bash
npm install gulp del --save-dev
npm install https://github.com/ThorstenHans/gulp-awesome-electron --save-dev

```

## The Gulpfile

Configuration for `gulp-awesome-electron` is the same as for `gulp-atom-electron`. If you haven’t used it yet, go and [read the plugin's docs](https://github.com/joaomoreno/gulp-atom-electron) first.

```javascript
const gulp = require('gulp'),
  electron = require('gulp-awesome-electron'),
  symdest = require('gulp-symdest'),
  del = require('del');

gulp.task('clean', function(done){
  del.sync('build/**/*', { force: true});
  done();
});

gulp.task('default', ['clean'], function(){
  return gulp.src([
    './electron-assets/package.json',
    './bundled-app/**/*'])
  .pipe(electron({
    version: '0.36.1',
    platform: 'win32',
    winIcon: './electron-assets/app-icon.ico',
    companyName: 'Thinktecture AG'
  }))
  .pipe(symdest('build/win32'));
});

```
Align the paths to match those of your project and start the *Gulp.js* script using `gulp`. Once the build has finished, go and copy your *Windows App* to a *Windows machine*. *macOS* **isn’t able to display** the App Icon for Windows Executables.

## Recap

Cross-platform developers want to build and ship for all platforms. However, they want to use their favorite operating system. No one want's to jump from OS to OS to ensure an app is working and looking as expected. With `gulp-awesome-electron`, you can embed app icons for all platforms. No matter which platform your development environment is running on. 


