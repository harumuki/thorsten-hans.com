---
title: Angular goes cross platform with GitHub Electron
layout: post
permalink: angular-goes-cross-platform-with-github-electron
published: true
tags: [Electron, Angular]
excerpt: This post introduces a small technical demo application which has been built using Angular, ES2015 and Electron. The entire build in this new sample has been created using Gulp.js
featured_image: /assets/images/posts/feature_images/2015-11-16-angular-goes-cross-platform-with-github-electron.jpg
unsplash_user_name: Tim Bennett
unsplash_user_ref: timbennettcreative
---
A while ago I’ve posted a [sample on how to write an electron app using Angular 1.x with ES2015 and JSPM](https://github.com/ThorstenHans/electron-angular-es6).

Now having more than 100 stars on *GitHub*, it seems to be quiet important for the community. That’s why I’ve decided to take this sample to another level.

Angular2 is becoming more severe with each day. That’s why I’ve decided to publish another electron sample targeting Angular2. [Go and visit the repo right here on *GitHub*](https://github.com/ThorstenHans/electron-es2015-ng2)

Again, this is just a tech-demo. The app isn’t offering any functionality. Instead, it uses [Gulp.js](https://gulpjs.com/), [Babel](https://babeljs.io/) and [Angular](https://angular.io) to build an entire app from scratch. The app itself is packaged using [gulp-atom-electron](https://www.npmjs.com/package/gulp-atom-electron) and automatically creates binaries for all three major platforms (Windows, Linux, and macOS)

To clone the repo, install all required dependencies and start the build process use the following script

```bash
git clone git@github.com:ThorstenHans/electron-es2015-ng2.git
cd electron-es20150ng2
npm install
npx gulp

```

