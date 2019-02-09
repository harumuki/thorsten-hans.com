---
title: Frontend Builds 3 - Cross Platform Desktop Builds
layout: post
permalink: frontend-builds-3-cross-platform-desktop-builds
redirect_from: /2015-10-15_Frontend-Builds-3---Cross-Platform-Desktop-Builds-712a2d6148da
published: true
tags: [Build, Electron, Gulp.js]
excerpt: null
featured_image: /assets/images/posts/feature_images/frontend-builds.jpg
unsplash_user_name: Iker Urteaga
unsplash_user_ref: iurte
---
## The Frontend Builds article series
 Welcome to the third part of this article series. If you didn't read the other parts, check them out now.

 * [Introducing the Frontend Builds Article Series]({% post_url 2015-10-08-frontend-build-series-introduction %})
 * [Frontend Builds 1: Getting Started ]({% post_url 2015-10-12-frontend-builds-1-getting-started %})
 * [Frontend Builds 2: Readable and Pluggable Gulpfiles  ]({% post_url 2015-10-14-frontend-builds-2-readable-and-pluggable-gulp-files %})
 * [Frontend Builds 3: Cross-Platform Desktop Builds]({% post_url 2015-10-15-frontend-builds-3-cross-platform-desktop-builds %})
 * [Frontend Builds 4: Building Cross-Platform Mobile Apps]({% post_url 2015-10-17-frontend-builds-4-building-cross-platform-mobile-apps %})
 * [Frontend Builds 5: Build as a Service (BaaS)]({% post_url 2015-10-21-frontend-builds-5-build-as-a-service-baas %})
 * [Frontend Builds 6: Configurable builds]({% post_url 2015-10-22-frontend-builds-6-configurable-builds %})
 * [Frontend Builds 7: Conditional Build Tasks]({% post_url 2015-10-24-frontend-builds-7-conditional-build-tasks %})

## The idea

Frontend Apps can quickly be built for a various range of platforms. You can use [Apache Crodova](http://cordova.apache.org){:target="_blank"} for building cross-platform mobile apps. For building cross-platform desktop apps, you can either use Electron or [NW.js](http://nwjs.io){:target="_blank"}.

No matter which one you're using (NW.js / Cordova / electron), all of them will utilize our Frontend App (x-note) and package it for distribution to the requested platforms. During this post I'd like to address desktop builds using NW.js, Cordova builds will be addressed within the upcoming post.

## NW.js desktop builds

The build already contained a sample implementation for the NW.js build (see `gulptasks/desktop.js`).

```javascript
gulp.task('private:build:nw', function(done) {
    var nw = new tasks.NwBuilder({
        files: 'dist/**/*',
        version: '0.12.3',
        platforms: ['osx64']
    });
    nw.build();
    done();
});

```

The underlying npm module `nw-builder` (see `package.json`'s devDependencies) is offering way more options and settings that you can – and we will do so in a minute – use to configure desktop builds concerning all ordinary requirements.

## Adding / Compiling for more platforms

Use the `platforms` property to specify which platforms you're app should be compiled for. You can choose from five different platforms (`osx64`, `linux32`, `linux64`, `win32` and `win64`).

Let's change our `private:build:nw` task to build for all available platforms now.

```javascript
// ...
{
    platforms: ['win32', 'win64', 'osx64', 'linux32', 'linux64']
}
// ...

```

`nw-builder` documentation says that there is an `osx32` platform which is true, but the support for `osx32` has been dropped with `0.13.0-alpha`.

If you're using a Mac for development, you're okay with those settings. OS-X can build apps for all platforms. I've never tried to execute such a task on Windows. If you've problems when executing this task on windows, post a comment, and I'll look into that.

## Dealing with cacheDir and buildDir

By default, the `cacheDir` will be placed within your project's directory. This is fine for some developers, but not for me. I've multiple projects that are compiling to all platforms using NW.js, so each project/app would have its downloads of NW.js' executables. Using a dead simple trick, you can minimize the required downloads and stop wasting your hard disk with the same files for every project.

First, update `gulpfile.js` and add the node `path` module to the `tasks` object using.

```javascript
path: require('path'),

```

That said, add the following line of code inside of the `private:build:nw` right before instantiating `NwBuilder`.

```javascript
var homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

```

Finally set the `cacheDir` property like shown below.

```javascript
cacheDir: tasks.path.join(homeDir, '.cache'),

```

The `buildDir` property specifies where the compiled apps will be placed. By default, all compiled apps go to the `build` sub-folder. If you want to change that location, specify a directory. You can either specify a relative or an absolute path. For demonstrating purpose let's change the default `buildDir` to a subfolder called `desktop-builds` by adding the following line of code

```javascript
buildDir: tasks.path.join(process.cwd(), "desktop-build"),

```

## Specifying Icons

Many people asked me how to specify custom icons for desktop executables. For the Mac App, it's pretty easy, specify the `macIcns` property and point it to your `.icns` file. `nw-builder` will automatically set the `icns` file as the application icon.

If you're building NW.js apps on Windows, you can specify the `winIco` and point to a `.ico` File. The build pipeline will take care of everything else. If you're running on **OS-X or Linux**, follow this [Guide](https://github.com/nwjs/nw.js/wiki/Icons){:target="_blank"} to set up all required tools for including the `.ico` file into the executables from OS-X or Linux.

In our x-note app, we specify the icon paths like this.

```javascript
macIcns: 'assets/x-note.icns',
// winIco: 'assets/x-note.ico'
// uncomment the line above only if you've finished the the guide above

```

## Zip app contents for Mac App

When building the app for the OS-X platform, you can set the `macZip` to `true`. However, be aware when setting this property to `true`, the startup time on OS-X will increase because NW.js has to decompress your app for each start on-the-fly.

This property defaults to `false`.

## More properties for desktop builds

There are plenty more properties available for `nw-builder` go and check out the [following documentation on github](https://github.com/nwjs/nw-builder){:target="_blank"}.

## Go ahead ...

.. so read the [next article in the "Frontend Build" article series]({% post_url 2015-10-17-frontend-builds-4-building-cross-platform-mobile-apps %}).


