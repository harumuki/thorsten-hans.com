---
title: Frontend Builds 7 - Conditional Build Tasks
layout: post
permalink: frontend-builds-7-conditional-build-tasks
redirect_from: /frontend-builds-7-conditional-build-tasks-ca34ec59c426
published: true
tags: [Build, Gulp.js]
excerpt: In the seventh and last part of the "Frontend Build" article series, you'll learn how to create conditional tasks for the Build as a Service (BaaS) system.
image: /frontend-builds.jpg
unsplash_user_name: Iker Urteaga
unsplash_user_ref: iurte
---

## The Frontend Builds article series
 Welcome to the seventh and last part of this article series. If you didn't read the other parts, check them out now.

 * [Introducing the Frontend Builds Article Series]({% post_url 2015-10-08-frontend-build-series-introduction %})
 * [Frontend Builds 1: Getting Started ]({% post_url 2015-10-12-frontend-builds-1-getting-started %})
 * [Frontend Builds 2: Readable and Pluggable Gulpfiles  ]({% post_url 2015-10-14-frontend-builds-2-readable-and-pluggable-gulp-files %})
 * [Frontend Builds 3: Cross-Platform Desktop Builds]({% post_url 2015-10-15-frontend-builds-3-cross-platform-desktop-builds %})
 * [Frontend Builds 4: Building Cross-Platform Mobile Apps]({% post_url 2015-10-17-frontend-builds-4-building-cross-platform-mobile-apps %})
 * [Frontend Builds 5: Build as a Service (BaaS)]({% post_url 2015-10-21-frontend-builds-5-build-as-a-service-baas %})
 * [Frontend Builds 6: Configurable builds]({% post_url 2015-10-22-frontend-builds-6-configurable-builds %})
 * [Frontend Builds 7: Conditional Build Tasks]({% post_url 2015-10-24-frontend-builds-7-conditional-build-tasks %})


## Idea

During the last post, we made our BaaS configurable so that you can align the build to work with different folder structures, filenames or module configurations. Now it's time to take our build to another level. Many developers are using things like [less](http://lesscss.org/){:target="_blank"}, [Sass](http://sass-lang.com/){:target="_blank"} to build their stylesheets. Others use [CoffeeScript](http://coffeescript.org/){:target="_blank"}, [BabelJS](https://babeljs.io/){:target="_blank"} or [TypeScript](http://www.typescriptlang.org/){:target="_blank"} to build their JavaScript. Exactly those tasks are missing in our BaaS solution, so let's add them.

However, instead of adding all those tasks simple to our `gulp.pipe` chain, we want to put some more logic in our gulp-tasks to make the entire build more flexible.

----

To demonstrate how such a conditional build may look like, we'll add both CSS and JavaScript transpiling support to [xplatform-build](https://github.com/ThorstenHans/xplatform-build){:target="_blank"} and let the developer choose for every project if she wants to use those tasks or not. If you're already familiar with Gulp.js. `gulp-if` may come into your mind. `gulp-if` works great for some situations but in my case, I don't want to ship possible dependencies like `gulp-sass` to every system no matter if the consumer needs it or not. This leads to a situation where `gulp-if`  doesn't work!

## Refactoring our BaaS

`xplatform-build` needs only some small refactorings to support all those conditional tasks. Let's extend every section of it right now.

## Updating default options

First, we need to provide a new section to our options object, which consumers can override later. To do so, append `addOns: {}` before the `folders` object like shown below

```javascript
return {
 addOns:{},
 folders: { /* stripped */},
 filenames: { /* stripped */},
 sources: { /* stripped */},
 options: { /* stripped */}
}

```

## The new xplatform-build gulpfile

The `gulpfile.js` get some updates. First I've refactored the method for overriding config values a bit to be more powerful and renamed it to `applyUserConfig`. See `applyUserConfig()` below.

```javascript
function applyUserConfig(original, uConfig) {
   for (var p in uConfig) {
     if(typeof(uConfig[p]) === 'object' && !Array.isArray(uConfig[p]) && !original.hasOwnProperty(p)){
       original[p] = {};
     }
     else if (typeof(uConfig[p]) !== 'object' || Array.isArray(uConfig[p])) {
       original[p] = uConfig[p]
       continue;
     } 
     applyUserConfig(original[p], uConfig[p]);
   }
}

```

Another improvement is the possibility to automatically load *Node.js* modules if they were installed in the current scope.

```javascript
function loadCustomAddonIfInstalled(addOnName, tasks) {
 try {
   require.resolve(addOnName);
   tasks[addOnName] = require(addOnName);
 } catch (e) {
   console.error("module " + addOnName + " requested, but not  installed!")
   console.log("run npm i " + addOnName + " --save-dev");
 };
}

```

The `loadCustomAddonIfInstalled` is called for every object in `options.addOns`, which will be configured by `xplatform-build` consumers as you will read later.**

Last but not least if installed and required `gulp-empty` which we'll use in a few minutes.

```javascript
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
   path: require('path'),
   NwBuilder: require('nw-builder'),
   inSequence: require('run-sequence'),
   empty: require('gulp-empty')
};

```

Notice that there is neither `gulp-less` nor any other transpiling module loaded at this point. See the entire `gulpfile.js`[here in the repo](https://github.com/ThorstenHans/xplatform-build/tree/master/src){:target="_blank"}.

## Updating our web build to support transpiling

Next step is, of course, to support transpiling for both, JavaScript and CSS in our web build. See all the following changes to `gulptasks/web.js`.

## Transpiling JavaScript

Let's take care about JavaScript, we'll add support for `gulp-typescript`, `gulp-coffee` and `gulp-babel` to your `private:app:js` gulptask.

For a single project, only one of those three transpilers makes sense. However, gulp is a little bit limited when it comes to skipping things that are not needed in a given context. That's why we added `gulp-empty` – which does nothing to files in the stream – to our project. It acts as a fallback task which will be invoked if the developer won't use any transpiler offered by `xplatform-build`.

See the refactored `private:app:js` task below. The task itself and the corresponding options are evaluated based on already loaded `addOns`.

```javascript
gulp.task('private:app:js', function() {
 
    var preprocessorTask = tasks['gulp-typescript' || 'gulp-coffee' || 'gulp-babel'] || tasks.empty,
      preprocessorOptions = config.addOns['gulp-typescript' || 'gulp-coffee' || 'gulp-babel'] || null;

  return gulp.src(config.sources.appScripts)
    .pipe(preprocessorTask(preprocessorOptions))
    .pipe(tasks.ngAnnotate(config.options.ngAnnotate))
    .pipe(tasks.concat(config.filenames.appScripts))
    .pipe(tasks.uglify(config.options.uglify))
    .pipe(gulp.dest(config.folders.dist.scripts));
});

```

If neither `coffee`, `babel` nor `typescript` is defined, `gulp-empty` will be invoked.

## Transpiling CSS

Let's do the same for CSS. Should be a no-brainer right now. See `private:app:css` below

```javascript
gulp.task('private:app:css', function() {

    var preprocessorTask = tasks['gulp-less' || 'gulp-sass'] || tasks.empty,
        preprocessorOptions = config.addOns['gulp-less' || 'gulp-sass'] || null;
 
  return gulp.src(config.sources.appStyles)
    .pipe(preprocessorTask(preprocessorOptions))
    .pipe(tasks.concat(config.filenames.appStyles))
    .pipe(tasks.cssmin(config.options.cssmin))
    .pipe(gulp.dest(config.folders.dist.styles));
});

```
That's all for `xplatform-build` let's see how our actual project has to be updated.

## Refactoring our x-note project

Now it's time to update x-note. First I've replaced `src/styles/app.css` by `src/styles/app.less` and added some simple `less code` (copied form their website :D)

```less
@base: #f938ab;
.box-shadow(@style, @c) when (iscolor(@c)) {
  -webkit-box-shadow: @style @c;
  box-shadow: @style @c;
}

.box-shadow(@style, @alpha: 50%) when (isnumber(@alpha)) {
  .box-shadow(@style, rgba(0, 0, 0, @alpha));
}

.box {
  color: saturate(@base, 5%);
  border-color: lighten(@base, 30%);
  div { .box-shadow(0 0 5px, 30%) }
}

```

Having some less sources, I as a developer want to add `gulp-less` to my project by executing `npm i gulp-less --save-dev`

Finally, we've to specify how `xplatform-build` should handle our stylesheet. See the updated `gulpfile.js` from x-note.

```javascript
(function(require){
    'use strict';
    var userConfig = {
        addOns: {
            "gulp-less" : {}
        },
        sources: {
            appStyles : ['src/styles/**.less']
        }
    };
    require('xplatform-build')(userConfig);
})(require);

```

## Updating xplatform-build

Either you can pull the recent version of `xplatform-build` from npm using `npm install xplatform-build --save-dev` or you can update it from your disk – if you've made all the changes to your working copy by using `npm install ../path-to-local-xplatform-build`

Give it a try and execute `gulp build` once you've saved all the files. If you've followed all the steps, you'll find the following content in `dist/styles/app.min.css`

```css
.box{color:#fe33ac;border-color:#fdcdea}.box div{-webkit-box-shadow:0 0 5px rgba(0,0,0,.3);box-shadow:0 0 5px rgba(0,0,0,.3)}
```

So our less got transpiled as expected. 🙂

## Checkout the repos

See [master branch of xplatform-build here](https://github.com/ThorstenHans/xplatform-build){:target="_blank"} and the [BaaS branch of x-note over here on GitHub](https://github.com/ThorstenHans/x-note/tree/baas){:target="_blank"}.
