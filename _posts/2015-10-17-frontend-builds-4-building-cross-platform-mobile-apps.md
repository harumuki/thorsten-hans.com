---
title: Frontend Builds 4 - Building Cross Platform Mobile Apps
layout: post
permalink: frontend-builds-4-building-cross-platform-mobile-apps
redirect_from: /2015-10-17_Frontend-Builds-4---Building-Cross-Platform-Mobile-Apps-caa632699200
published: true
tags: [Build, Cordova, Gulp.js]
excerpt: null
featured_image: /assets/images/posts/feature_images/frontend-builds.jpg
unsplash_user_name: Iker Urteaga
unsplash_user_ref: iurte
---
## The Frontend Builds article series
 Welcome to the fourth part of this article series. If you didn't read the other parts, check them out now.

 * [Introducing the Frontend Builds Article Series]({{ "/frontend-build-series-introduction" | absolute_url }})
 * [Frontend Builds 1: Getting Started]({{ "/frontend-builds-1-getting-started" | absolute_url}})
 * [Frontend Builds 2: Readable and Pluggable Gulpfiles]({{ "/frontend-builds-2-readable-and-pluggable-gulp-files" | absolute_url}})
 * [Frontend Builds 3: Cross-Platform Desktop Builds]({{ "/frontend-builds-3-cross-platform-desktop-builds" | absolute_url}})
 * [Frontend Builds 4: Building Cross-Platform Mobile Apps]({{ "/frontend-builds-4-building-cross-platform-mobile-apps" | absolute_url}})
 * [Frontend Builds 5: Build as a Service (BaaS)]({{ "/frontend-builds-5-build-as-a-service-baas" | absolute_url}})
 * [Frontend Builds 6: Configurable builds]({{ "/frontend-builds-6-configurable-builds" | absolute_url}})
 * [Frontend Builds 7: Conditional Build Tasks]({{ "/frontend-builds-7-conditional-build-tasks" | absolute_url}})

## The Idea

During this post, I’ll explain how to bring x-note to various mobile platforms using [Apache Cordova](http://cordova.apache.org). x-note has been built using Angular Material, so it can easily fit on any resolution no matter if customers are using a 27” Cinema Display or a 5” cellphone. We’ll extend our build process to build and run mobile apps automatically.

I’ll cover *iOS* and *Android* in this post, Cordova is, of course, supporting more platforms, but most customers only care about those popular platforms, so let’s start with them. You can easily extend the build scripts to target other platforms like *Firefox OS*, *Ubuntu OS* or *Windows Phone*.

## Installing Cordova

First, you need to install Cordova on your system; this can be done quickly by using `npm` like shown below

```bash
npm install cordova -g

```

For *iOS* and *Android* are different platform guides available online. Follow [these guides](http://cordova.apache.org/docs/en/5.1.1/guide/platforms/index.html) to turn your machine into an App Developer Machine now 🙂

The *Android* guide tells you to use *Google’s Android emulator* for testing apps. The *stock Android emulator* is good, but you should check out [Genymotion](https://www.genymotion.com/#!/), compared to the regular emulator it’s freaking fast.

## Create the x-note cordova project

When reading the official Cordova documentation, you’ll see the command `cordova create hello com.example.hello HelloWorld` which is responsible for creating a new Cordova project within the subfolder `hello`.

The second parameter `com.example.hello` is a reverse domain name identifier for your app.

Third and last parameter of the command is `HelloWorld` which will become the app’s display name.

When you execute the following command, Cordova will automatically create a new subfolder `hello/www` and add a sample website to it, but that’s not what we want here. We want to point the new Cordova app to our existing frontend app. We want Cordova to point to our `dist` folder where the compiled frontend-app will be placed.

To achieve this, you can utilize Cordova’s `--link-to` parameter which will create a symbolic link to the path you provide as an argument.

Move to the **root folder of the x-note project** and execute the following command.

```bash
cordova create mobile rocks.xplatform.xnote "x-note" --link-to dist

```

Once the command has finished, you’ll find a new subfolder named `mobile` which will have the following content.

{% include image-caption.html imageurl="/assets/images/posts/2015/frontend-builds-4-cordova-output.png"
title="The mobile folder created by Cordova CLI" caption="The mobile folder created by Cordova CLI" %}

## Let’s add some platforms

Cordova can track installed platforms and plugins using its own `config.xml` file. (see blog post [here](invalid#zSoyz)). Therefore it’s important to append the `--save` argument when you’re installing platforms. Let’s add iOS and Android using the following two commands.

```bash
cordova platform add ios --save
cordova platform add android --save

```

What has happened? Go and examine `mobile/config.xml` Cordova downloaded the ios and android bits to compile your HTML app to native projects and it added two `platform` nodes to `config.xml`. These nodes are taken into place when another dev of your team clones the project and executes `cordova prepare`.

There will also be an XCode project for x-note on iOS and another Java project for x-note on Android. You can find those projects after building the app for the first time directly within the `mobile/platforms/` folder.

Once you’ve added the platforms, you can quickly execute `cordova emulate ios` to compile and run the app using the iOS Emulator on your mac. When using the stock android emulator, you can start the app using `cordova emulate android` but if you’re using Genymotion, you’ve to execute `cordova run android` because Cordova identifies Genymotion as a real android device.

## Integrating Cordova in the build

So far so good, but now it’s time to extend our gulp build because we’d like to automate the compilation process and — depending on the task you execute — starting the app inside of all emulators at once.

Because our gulpfile is automatically loading new gulp-task-files form the `gulptasks` subfolder, you can drop new files into that folder. Remember the `module.exports` The syntax we’ve used in part two of this series. If you do so, you can easily access `gulp` and `tasks` as we did before.

Let’s start with the documentation, so you’ll see which gulp tasks are required and see the responsibilities of each task. `gulptasks/mobile.js` should now look like this.

```javascript
(function(module) {
    'use strict';
    function RegisterTasks(gulp, tasks) {
    }

    module.exports = {
        init: RegisterTasks,
        docs: [{
            task: 'build:mobile',
            description: 'builds the mobile app for all platforms'
        }, {
            task: 'run:mobile',
            description: 'runs all mobile apps (iOS and genymotion in this case)'
        }]
    };

})(module);

```

Because our mobile app has a dependency on `dist/`, we’ve to ensure that the entire app has been built before we compile the mobile apps. When executing `run:mobile` on the other side, we’ve to ensure that all mobile platforms have been built. To do so, add two private tasks called `private:run:mobile` and `private:build:mobile`. That said, register those four tasks using the common gulp API. Your `RegisterTasks` method should look like this.

```javascript
function RegisterTasks(gulp, tasks) {
    gulp.task('build:mobile', function(done){

    });

    gulp.task('run:mobile', function(done){

    });

    gulp.task('private:build:mobile', function(done){

    });

    gulp.task('private:run:mobile', function(done){

    });

}

```

Let’s start with `private:build:mobile` first. When revisiting `gulpfile.js`, you will recognize that `shelljs` is already loaded and exposed through `tasks` to all gulp-task-files.

> There are thousands of Node.js modules available to use Cordova in Gulp.js. 

Don’t get me wrong, all contributors did a great job and abstracted all those command line interfaces and built JavaScript API’s for commonly used Cordova commands. However, in the end, I found myself using `shelljs` because it’s easier, more readable and maintainable when you use that simple module and line up all commands you would execute within a terminal instance. Building the mobile app using Cordova CLI is straight forward. Just move into the `mobile` subfolder and execute `cordova build ios` and `cordova build android`. When using `shelljs`, your `build:mobile` task should now look like this.

```javascript
gulp.task('private:build:mobile', function(done){
    tasks.shelljs.cd('mobile');
    // 'cordova build' is short for 
    // 'cordova build ios && cordova build android'
    tasks.shelljs.exec('cordova build');
    tasks.shelljs.cd('..');
    done();
});

```

We’ve used `run-sequence` which is available as `tasks.inSequence` a few times before. Update the `build:mobile` task like shown below.

```javascript
gulp.task('build:mobile', function(done){
	return tasks.inSequence(
		'private:build', 
		'private:build:mobile', 
		done);
});

```

It’s time for a test drive. Save all files and move to your terminal. Test the documentation integration first by executing `gulp help`. Gulp should print all tasks as shown in figure two.

{% include image-caption.html imageurl="/assets/images/posts/2015/frontend-builds-4-gulp-help.png"
title="the gulp help output" caption="the gulp help output" %}

Let’s build the entire app by executing `gulp build:mobile`. Last but not least is executing the mobile apps directly from the gulpfile.

```javascript
gulp.task('private:run:mobile', function(done){
    tasks.shelljs.cd('mobile');
    tasks.shelljs.exec('cordova emulate ios');
    // use run android for genymotion
    // use emulate android for stock emulator
    tasks.shelljs.exec('cordova run android');
    tasks.shelljs.cd('..');
    done();
});

```

moreover, finally the public gulp task `run:mobile` here we will again use the `tasks.inSequence` to ensure that mobile apps are built before we start our app on iOS and Android.

```javascript
gulp.task('run:mobile', function(done){
	return tasks.inSequence(
		'private:build:mobile', 
		'private:run:mobile', 
		done);
});

```


Before testing the `run:mobile` tasks, you’ve to start your android emulator. Cordova will automatically start ios emulator. Test the mobile build using `gulp run:mobile`. After a few seconds, x-note should be started in both emulators as shown in figure three.

{% include image-caption.html imageurl="/assets/images/posts/2015/frontend-builds-4-app-on-ios-and-android.png"
title="Mobile Apps running on Android and iOS" caption="Mobile Apps running on Android and iOS" %}

## Go ahead ...

.. so read the [next article in the "Frontend Build" article series]({{ "/frontend-builds-5-build-as-a-service-baas" | absolute_url}}).


