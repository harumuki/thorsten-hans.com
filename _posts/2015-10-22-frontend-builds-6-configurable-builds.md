---
title: Frontend Builds 6 - Configurable builds
layout: post
permalink: frontend-builds-6-configurable-builds
published: true
tags: [Build, Gulp.js]
excerpt: In part five of the series you learned about Build as a Service, this post will explain how to make your own BaaS more configurable and flexible.
featured_image: /assets/images/posts/feature_images/frontend-builds.jpg
unsplash_user_name: Iker Urteaga
unsplash_user_ref: iurte
---
## The Frontend Builds article series
 Welcome to the sixth part of this article series. If you didn't read the other parts, check them out now.

 * [Introducing the Frontend Builds Article Series]({{ "/frontend-build-series-introduction" | absolute_url }})
 * [Frontend Builds 1: Getting Started]({{ "/frontend-builds-1-getting-started" | absolute_url}})
 * [Frontend Builds 2: Readable and Pluggable Gulpfiles]({{ "/frontend-builds-2-readable-and-pluggable-gulp-files" | absolute_url}})
 * [Frontend Builds 3: Cross-Platform Desktop Builds]({{ "/frontend-builds-3-cross-platform-desktop-builds" | absolute_url}})
 * [Frontend Builds 4: Building Cross-Platform Mobile Apps]({{ "/frontend-builds-4-building-cross-platform-mobile-apps" | absolute_url}})
 * [Frontend Builds 5: Build as a Service (BaaS)]({{ "/frontend-builds-5-build-as-a-service-baas" | absolute_url}})
 * [Frontend Builds 6: Configurable builds]({{ "/frontend-builds-6-configurable-builds" | absolute_url}})
 * [Frontend Builds 7: Conditional Build Tasks]({{ "/frontend-builds-7-conditional-build-tasks" | absolute_url}})


## Idea

BaaS is fine so far if you’re building your projects on the same structure I did for building [x-note](https://github.com/ThorstenHans/x-note). However, right now, we’re using **Build as a Service**, so it’s time to make everything configurable.

## Dumping all the default config values

BaaS should run successfully without any give user-config. That said, we need some `defaults`. I’ve added a new JavaScript file to `xplatform-build` at `src/defaults.js`. It exposes all default config values as you can see below.

The script below is stripped to increase readability. See the entire file [here in the repo](https://github.com/ThorstenHans/xplatform-build/blob/master/src/defaults.js)

```javascript
(function(module){
  function exportDefaultConfig(){
    var path = require('path');
        
    var cacheDir = path.join(process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE, '.cache'),
        buildDir = path.join(process.cwd(), "desktop-build");
    return {
        folders: {
            mobile: {
                root: 'mobile',
                backlinkToProjectRoot: '..'
            },
            dist:{
                root: 'dist',
                styles: 'dist/styles',
                scripts: 'dist/scripts'
            },
            temp:{
                root: ".temp"
            }
        },
        filenames: {
            appScripts: 'app.js',
            appStyles: 'app.min.css',
            vendorStyles: 'vendor.min.css',
            vendorScripts: 'vendor.min.js',
            injectTargets: ['src/index.html']
        },
        sources: {
            // stripped to increase readability
        },
        options: {
            // stripped to increase readability
        }
    };
}

  module.exports = exportDefaultConfig();

})(module);

```

All defaults where exported using the familiar `module.exports` mechanism.

## Refactor gulp-task-files

Next, I refactored, of course, all `gulp-task-files`, again go and check out all the changes over [here](https://github.com/ThorstenHans/xplatform-build/tree/master/src/gulptasks). In summary, the method signature must accept another parameter and all

```javascript
(function(module) {
    'use strict';
    function RegisterTasks(gulp, tasks, config) {
    
      gulp.task('private:build', function(done) {
        tasks.inSequence(
            'private:clean',
            'private:app:templates', [
                'private:vendor:css',
                'private:vendor:js',
                'private:app:css',
                'private:app:js'
            ],
            'private:app:html',
            done
        );
      });
      
      gulp.task('private:clean', function(done) {
          // replace all strings with config properties
          tasks.del.sync(config.sources.del, config.options.del);
          done();
      });
      
      /*
      * stripped to ensure readability
      */
    }

    module.exports = {
        init: RegisterTasks,
        docs: [
        // stripped to ensure readability
        ]
    };
})(module);

```

## Refactor the gulpfile

Last but not least the `src/gulpfile.js` has to be updated. A few things are going on here.

- add the possibility to pass config to the `gulpfile.js`
- load the default config
- override default config with user-config
- pass merged config to `gulp-task-files`’ `init` method

See the entire `gulpfile.js` here.

```javascript
(function(module){
    
  function XplatformBuild(userConfig){
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
          path: require('path'),
          NwBuilder: require('nw-builder'),
          inSequence: require('run-sequence')
      };

      var override = function(original, uConfig){
          for(var p in uConfig){
              if(typeof(uConfig[p]) !== 'object' || Array.isArray(uConfig[p])){
                  original[p] = uConfig[p]
              }else{
                  override(original[p], uConfig[p]);
              }
          }
          
      };
        
      var config = require('./defaults.js');
      override(config, userConfig);
      
      var customGulpTasks = require('require-dir')('./gulptasks');
      
      for (var gulpTask in customGulpTasks) {
          customGulpTasks[gulpTask].init(gulp, tasks, config);
      }
      
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
  }

module.exports = XplatformBuild;

})(module);

```

## Refactor the usage in x-note

After refactoring your BaaS (here xplatform-build), of course, the application itself has to be refactored. This is the easy part; there is just a small updated for the `gulpfile.js`. See the `()` behind the `require` call

```javascript
require('xplatform-build')();

```

If you’d like to provide a custom `user-config` just pass it as `json` object to the call like shown below.

```javascript
// USE THIS SNIPPET ONLY IF YOU'D LIKE TO OVERRIDE 
// DEFAULT SETTINGS
require('xplatform-build')({
    options: {
        cordova: {
            runCommands: [
               'cordova run ios', 
               'cordova run android', 
               'cordova run windows'
            ]
        }
    }
});
```

Again, see [xplatform-build here](https://github.com/ThorstenHans/xplatform-build) and the [BaaS branch of x-note over here](https://github.com/ThorstenHans/x-note/tree/baas)


## Go ahead ...

.. so read the [next article in the "Frontend Build" article series]({{ "/frontend-builds-7-conditional-build-tasks" | absolute_url}}).


