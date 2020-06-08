---
title: Frontend Builds 2 - readable and pluggable Gulp files
layout: post
permalink: frontend-builds-2-readable-and-pluggable-gulp-files
published: true
tags: [Build, Gulp.js]
excerpt: Learn how to build composible Gulpfiles in the second part of the series on frontend builds
image: /frontend-builds.jpg
unsplash_user_name: Iker Urteaga
unsplash_user_ref: iurte
---

## The Frontend Builds article series

 Welcome to the second part of this article series. If you didn't read the other parts, check them out now.

- [Introducing the Frontend Builds Article Series]({% post_url 2015-10-08-frontend-build-series-introduction %})
- [Frontend Builds 1: Getting Started ]({% post_url 2015-10-12-frontend-builds-1-getting-started %})
- [Frontend Builds 2: Readable and Pluggable Gulpfiles  ]({% post_url 2015-10-14-frontend-builds-2-readable-and-pluggable-gulp-files %})
- [Frontend Builds 3: Cross-Platform Desktop Builds]({% post_url 2015-10-15-frontend-builds-3-cross-platform-desktop-builds %})
- [Frontend Builds 4: Building Cross-Platform Mobile Apps]({% post_url 2015-10-17-frontend-builds-4-building-cross-platform-mobile-apps %})
- [Frontend Builds 5: Build as a Service (BaaS)]({% post_url 2015-10-21-frontend-builds-5-build-as-a-service-baas %})
- [Frontend Builds 6: Configurable builds]({% post_url 2015-10-22-frontend-builds-6-configurable-builds %})
- [Frontend Builds 7: Conditional Build Tasks]({% post_url 2015-10-24-frontend-builds-7-conditional-build-tasks %})

## The idea

Within this post, I will explain the steps I used to move from the [initial gulpfile](https://github.com/ThorstenHans/x-note/blob/3969b13344ff5992786fc890893949265727c869/gulpfile.js){:target="_blank"} to a readable and more maintainable version. Before explaining the technical steps, let's talk about the target. Over the past year I've seen so many different styles and approaches for writing and organizing Gulpfiles, but most of them share the same problem. Once you revisit the project and its gulpfile after a few weeks or months, you need much time for reading and understanding what gulp is doing in this particular project when executing `gulp default` or just `gulp`. To reduce this effort, I've outlined my idea of how to align tasks and how things should interact using a small mockup

{% include image-caption.html imageurl="/assets/images/posts/2015/frontend-builds-2-task-architecture.png"
title="Gulp Build Architecture" caption="Gulp Build Architecture" %}

Let me explain all requirements or properties of the main `gulpfile.js` at this point.

## Default tasks

We're developers, so our job is building software, that's why default gulp tasks should automate all the things you need frequently. For me, it's building frontend apps and starting a watcher who will automatically trigger the entire build as soon as I change a single bit inside of my development folder (usually named `src`).

## Load / init gulptask files automatically

Nothing is more frustrating than a semi-automated system. One of the critical requirements for a good gulpfile is the possibility to dynamically load gulptask-files for a well-known folder (`gulptasks` in our case). Think about CoC (Convention over Configuration) for your builds. Our `gulpfile.js` had to load and initialized all potential `gulptask-files` from the `gulptasks` subfolder without requesting any user interaction.

## The help task

Documentation is essential! I don't want to mess 20 minutes browsing a huge or ten small gulpfiles to find all the gulp tasks fitting my needs. I want to execute `gulp help` and it should print **all public tasks**. Public tasks? Let me explain that term quickly

*Encapsulating things is essential in our business. However, nobody cares about build tasks. Why are people not separating internal (or as I call them ****private tasks****) from those gulp tasks that can be called (or should be called) from anyone?*

## Implementing default tasks

First, let's take care of the default task. When browsing the web for regular `watch` implementations, you'll find many guides that watch on changes and build once a file has changed. That's cool, but for me, it's important to have an up-front build followed by the watch. Let's refactor the existing `gulpfile` to achieve our requirements

```javascript
gulp.task('default', function(done) {
    inSequence('private:build', function() {
        return gulp.watch('src/**/*', ['private:build']);
    });
});

```

`inSequence` is just an instance of the `run-sequence` node module, which is responsible for executing the up-front build before it starts watching for changes in my `src` subdirectory.

## Refactoring load mechanism of 3rd party modules

Before we can continue with either building dedicated `gulp-task-files` we've to refactor how 3rd party modules were loaded. The current state looks like this.

```javascript
var gulp = require('gulp'),
    del = require('del'),
    concat = require('gulp-concat'),
    inject = require('gulp-inject'),
    cssmin = require('gulp-cssmin'),
    ngAnnotate = require('gulp-ng-annotate'),
    ngTemplateCache = require('gulp-angular-templatecache'),
    rename = require('gulp-rename'),
    shelljs = require('shelljs'),
    uglify = require('gulp-uglify'),
    inSequence = require('run-sequence');

```

However, we want to pass all required 3rd party modules to those dedicated `gulp-task-files`, so we've to bundle all those tasks like shown below.

```javascript
var gulp = require('gulp');
var tasks = {
    del: require('del'),
    concat: require('gulp-concat'),
    inject: require('gulp-inject'),
    cssmin: require('gulp-cssmin'),
    ngAnnotate: require('gulp-ng-annotate'),
    ngTemplateCache: require('gulp-angular-templatecache'),
    rename: require('gulp-rename'),
    shelljs: require('shelljs'),
    uglify: require('gulp-uglify'),
    inSequence: require('run-sequence')
};

```

## Building gulp-task-files

To have dedicated `gulp-task-files` which are responsible for specific scenarios like

- Desktop
- Web
- Model

Moreover, a fourth one who is responsible for everyday tasks, we need to define something like a contract. Because `gulp` is based on Node.js, we can easily utilize the `module` approach to achieve this.

Each `gulp-task-file` have to provide its documentation, and of course, it has to register a set of new `gulp tasks`. I ended up with defining a contract like this.

```javascript
(function(module) {
    'use strict';
    function RegisterTasks(gulp, tasks) {

      gulp.task('build:matrix', function(done) {
          console.log("just a demo");
      });
    }
  
    module.exports = {
        init: RegisterTasks,
        docs: [{
            task: 'build:matrix',
            description: 'just to demonstrate'
        }]
    };

})(module);

```

Go and check the latest version of x-note in the [repository on GitHub](https://github.com/thorstenhans/x-note){:target="_blank"}, you can find the `gulp-task-files` in the subfolder `gulptasks`.

## Dynamically loading all gulp-task-files

Before we can care about printing all the `docs` provided by our `gulp-task-files` from within the `help` task, we've to build a dynamic loader system. We can easily utilize `require-dir` to build such a dynamic loader.

The main gulpfile has to be refactored like this.

```javascript
var customGulpTasks = require('require-dir')('./gulptasks');
for (var gulpTask in customGulpTasks) {
    customGulpTasks[gulpTask].init(gulp, tasks);
}

```

Remarkable is the last line of code here, where we call `init` on any found `gulp-task-file` and pass in `gulp` and all loaded submodules which are properties of the `tasks` property.

## Building gulp help

Finally let's build the `gulp help` task, which will iterate over all `gulp-task-files` and print their documentation. So the developer will directly see which gulp tasks he/she can call and what they're doing.

```javascript
gulp.task('help', function() {
    console.log('Execute one of the following commands\n');
    for (var gulpTask in customGulpTasks) {
        if (!customGulpTasks[gulpTask].hasOwnProperty('docs')) {
            continue;
        }
        customGulpTasks[gulpTask].docs.map(function(doc) {
            console.log("gulp " + doc.task + " - (" + doc.description + ")");
        });
    }
    console.log('\n');
});

```

## Go ahead

.. so read the [next article in the "Frontend Build" article series]({% post_url 2015-10-15-frontend-builds-3-cross-platform-desktop-builds %}).
