---
title: Frontend Builds 1 - Getting started
layout: post
permalink: frontend-builds-1-getting-started
published: true
tags: [Build, Gulp.js]
excerpt: null
image: /frontend-builds.jpg
unsplash_user_name: Iker Urteaga
unsplash_user_ref: iurte
---

## The Frontend Builds article series

 Welcome to the very first part of this article series. If you didn't read the other parts, check them out now.

- [Introducing the Frontend Builds Article Series]({% post_url 2015-10-08-frontend-build-series-introduction %})
- [Frontend Builds 1: Getting Started ]({% post_url 2015-10-12-frontend-builds-1-getting-started %})
- [Frontend Builds 2: Readable and Pluggable Gulpfiles  ]({% post_url 2015-10-14-frontend-builds-2-readable-and-pluggable-gulp-files %})
- [Frontend Builds 3: Cross-Platform Desktop Builds]({% post_url 2015-10-15-frontend-builds-3-cross-platform-desktop-builds %})
- [Frontend Builds 4: Building Cross-Platform Mobile Apps]({% post_url 2015-10-17-frontend-builds-4-building-cross-platform-mobile-apps %})
- [Frontend Builds 5: Build as a Service (BaaS)]({% post_url 2015-10-21-frontend-builds-5-build-as-a-service-baas %})
- [Frontend Builds 6: Configurable builds]({% post_url 2015-10-22-frontend-builds-6-configurable-builds %})
- [Frontend Builds 7: Conditional Build Tasks]({% post_url 2015-10-24-frontend-builds-7-conditional-build-tasks %})

## Idea

As described during the introduction, here the link to the [sample frontend application](https://github.com/ThorstenHans/x-note){:target="_blank"}. x-note is a small note-taking application which I'll use for this series of posts. I've build the app using [AngularJS](https://angularjs.org/){:target="_blank"} and [angular-material](https://material.angularjs.org/latest/#/){:target="_blank"}.

Go and clone the repo now, all dependencies are managed using bower and npm. To install all development- and runtime-dependencies execute the following commands within the project folder.

```bash
npm install
bower install

```

I highly recommend using a small HTTP-server for development time. During one of the upcoming posts in this series, I'll explain how to integrate such an HTTP-server within our gulpfile. However, for now, it's okay to use a second terminal instance and start the HTTP-server manually. I'm using the npm module `live-server` which can reload websites in chrome once any source file has been changed.

You can install `live-server` using `npm`

```bash
npm install live-server --g

```

At this point, you can use the default build task by executing `gulp build` from within the project folder. This task will build the entire web application to the `dist` sub-folder. Use the second terminal instance to start the live-server by invoking the `live-server dist` command. Chrome will fire up and show **x-note**. Make yourself comfortable with our small demo app.

When browsing the project directory, you'll find the gulpfile, which I'll use as a starting point for this series.

During the series well make continuous improvements to the `gulpfile` to make it more flexible, readable and maintainable. A few things are already part of the base `gulpfile`.

- internal tasks are marked with the `private:` prefix
- well-known tasks such as `default` and `watch` are available
- `run-sequence` is used to keep things in the correct order and make gulpfile more readable

## Angular.JS related build steps

For *Angular.JS* applications a few tasks are explicitly required. First, let's talk about templates, templates can either be consumed by requesting them on demand. Every time a template is required your SPA will issue an HTTP call and load the template from the configured URL. This is okay during development time, but for production environments, you can utilize Angular's template cache (`$templateCache`) for minimizing HTTP calls. You can use `gulp-angular-templatecache` to configure Angular's template cache easily from within the gulpfile. See the following gulp task which takes care of filling the `$templateCache`.

```javascript
gulp.task('private:app:templates', function(){
    return gulp.src('src/app/**/*.html')
        .pipe(ngTemplateCache({
            module: "xnote",
            filename: 'templates.js'
            }))
        .pipe(gulp.dest('.temp'));
});

```

As you can see the `templates.js` file will contain all `.html` files from the `src/app` folder and will be placed within a `.temp` Folder (relative to the project root folder). The generated file will move into our `app.js` which we'll examine now.

The second important thing for Angular code is to be minification-safe. To make your Angular Apps minification-safe, you can either invest more time when developing every Angular building block or you can use `gulp-ng-annotate` to automate this step. Compared to the template-cache related task, `gulp-ng-annotate` is much easier to use, it's just a middleware that can be plugged into the gulp chain. See the following snippet which takes care of all angular-related build tasks.

```javascript
gulp.task('private:app:js', function(){
    return gulp.src([
        'src/app/app.js',
        'src/app/**/*.js',
        '.temp/templates.js'
    ])
    .pipe(ngAnnotate())
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'))
});

```

`gulp-ng-annotate` can, of course, be configured depending on your requirements, but for our sample app default settings will work fine.

These are the only angular-related individual tasks you need to remember when building frontend apps. However, check out the entire file there are several other cool things to explore like `gulp-inject` or concatenating all those vendor-scripts and -styles.

Many of you may ask why I'm not using things like `bower-mainfiles` or other modules to query all those third-party files that need to be concatenated. The answer is short: **simplicity**. Adding app related `html`, `js` or `css` files is the most common scenario during my everyday work. Adding vendor related stuff is not that common and may have a significant impact on your entire app.

That's why I mostly decide to keep those tasks manually. The downside of modules like `bower-mainfiles` is that there are too many exceptions in the huge npm eco-system. Many modules are exposing minified scripts whereas others are exposing regular scripts, once you realize that, it's again your task to take care of all those exceptions. That's why I keep those steps more **manually** and specify all minified 3rd party files in the order I like (or in the order my app needs them).

## What's next

Within the upcoming article, we'll split the `gulpfile` and automate both things, loading and documenting all tasks, which will make the entire build more readable and maintainable.

## Go ahead

.. so read the [next article in the "Frontend Build" article series]({% post_url 2015-10-14-frontend-builds-2-readable-and-pluggable-gulp-files %}).
