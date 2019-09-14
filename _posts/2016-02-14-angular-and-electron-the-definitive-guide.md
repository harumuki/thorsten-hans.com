---
title: Angular and Electron - The definitive guide
layout: post
permalink: angular-and-electron-the-definitive-guide
redirect_from: /angular2-and-electron-the-definitive-guide-b389f36f74d
published: true
tags: [Electron, Angular]
excerpt: This article guides you through the process of creating an cross-platform desktop application using GitHub Electron and Angular as Single Page Application framework.
image: /2016-02-14-angular-and-electron-the-definitive-guide.jpg
---
Building cross-platform apps for desktop operating systems became simple compared to the past. With *GitHub's Electron* is a framework available that takes away the pain for abstracting all common platform APIs from us as web developers.

*Electron* makes it easy to host *Single Page Applications* (short *SPAs*) within a native application container which is available for *macOS*, *Linux*, and *Windows*. When looking at *Electron's* architecture, you will find two main counterparts.

- The **Main Process**, which is responsible for providing platform specific API's and taking care of the application lifecycle. We use Node.js to host custom functionalities and to provide instructions for the main process.
- The **Renderer Process** is responsible for serving the user interface. Electron is using Chromium to achieve this. That said, you've to realize that your SPA will always be hosted inside off a full-fledged Chrome engine. (With all it's advantages such as having rock substantial Chrome Developer Tools available right inside of your desktop app)
  
Of course, there are plenty of cool things built into *Electron*, but right now let's move on and get started with actually building a cross-platform desktop app using *Angular* and *Electron* itself.

## Project Setup

Technically, there are no special requirements when building your first an app. For us (web developers), it's just a regular frontend project. See the following lines of terminal code, which creates a project and initialize it with required files and some of the dependencies.

```bash
mkdir ng2-electron-sample && cd ng2-electron-sample
mkdir -p src/frontend/app/components
mkdir -p src/main
mkdir -p src/assets/
touch ./gulpfile.js ./tsconfig.json ./typings.json
touch src/main/index.js src/assets/package.json
touch src/frontend/index.html
touch src/frontend/app/boot.ts src/frontend/app/components/app.ts
npm init --y
npm install typescript live-server gulp del run-sequence typings --save-dev --no-progress

```

After executing those commands, your project directory should look like shown in the picture.

{% include image-caption.html imageurl="/assets/images/posts/2016/angular-electron-guide-1.png"
title="Angular and Electron folder structure" caption="Angular and Electron folder structure" %}

## Creating the Single Page Application

Open the `ng2-electron-sample` folder in your favorite editor. First, we'll add all required *Angular* related dependencies, and some scripts for later use to the `package.json` file.

```json
// stripped for better readability
"scripts" : {
    "postinstall": "npm run typings install",
    "typings": "typings",
    "tsc": "tsc",
    "build": "npm run frontend && tsc && gulp electron",
    "frontend": "gulp frontend && tsc",
    "serve": "live-server dist/frontend/",
    "apps": "npm run build && gulp apps"
},
"dependencies": {
    "angular2": "2.0.0-beta.6",
    "systemjs": "0.19.20",
    "es6-promise": "^3.0.2",
    "es6-shim": "^0.33.3",
    "reflect-metadata": "0.1.2",
    "rxjs": "5.0.0-beta.0",
    "zone.js": "0.5.14"
}

```

*Angular2 beta6* is using the typings module to pull type-definition files. Before installing all *Angular* stuff, specify the typings for `es6-shim` inside of `typings.json`.

```json
{
  "ambientDependencies": {
    "es6-shim": "github:DefinitelyTyped/DefinitelyTyped/es6-shim/es6-shim.d.ts#6697d6f7dadbf5773cb40ecda35a76027e0783b2"
  }
}

```

Save both `package.json` and `typings.json`. Now you can execute `npm i --no-progress` from the terminal which pulls all *Angular* dependencies and the typings.

Before moving to the *Angular* related things, we've to specify how *TypeScript* has to transpile our code to *JavaScript* by providing all required compiler instructions using `tsconfig.json`.

```json
{
  "compilerOptions": {
    "target": "es5",
    "outDir": "dist/frontend/app",
    "module": "system",
    "moduleResolution": "node",
    "sourceMap": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "removeComments": false,
    "noImplicitAny": false
  },
  "exclude": [
    "node_modules",
    "typings/main",
    "typings/main.d.ts"
  ]
}

```

The *SPA* is simple in our case; it will only act as a technical demonstration for this post. So both, our `app.ts` and our `boot.ts` are straightforward:

```typescript
// app.ts
import { Component } from 'angular2/core';
@Component({
  selector: 'ng2-electron-app',
  template: `<h3></h3>`
})

export class AppComponent{
  private caption: string = "Hello from ng2.";
}

```

```typescript
// boot.ts
import { enableProdMode } from 'angular2/core';
import { bootstrap } from 'angular2/platform/browser';
import { AppComponent } from './components/app';

enableProdMode();

bootstrap(AppComponent, []);

```

Last but not least there is the `index.html` file which is responsible for displaying our app to the user.

```html
<html>
  <head>
    <title>ng2 on electron</title>
  </head>
  <body>
    <ng2-electron-app>Loading Angular sample app...</ng2-electron-app>
    <script src="scripts/vendor/es6-shim.min.js"></script>
    <script src="scripts/vendor/system-polyfills.js"></script>
    <script src="scripts/vendor/angular2-polyfills.js"></script>
    <script src="scripts/vendor/system.src.js"></script>
    <script src="scripts/vendor/Rx.js"></script>
    <script src="scripts/vendor/angular2.dev.js"></script>
    <script>
        System.config({
            packages: {
                'app': {
                    format: 'register',
                    defaultExtension: 'js'
                }
            }
        });
        System.import('app/boot')
            .then(null, console.error.bind(console));
    </script>
  </body>
</html>

```

Because we want to execute our SPA later in the context of an Electron container, it 's essential to provide all script paths **relative to the current document**. Ensure that there is **no leading slash** for your script references.

## Building the Single Page Application

Okay, having all those things written down, it's time to care about the build. We'll use Gulp to transform our TypeScript code into JavaScript and copy all those assets required by our app. (See my [series on Gulp right here for more detailed guides]({% post_url 2015-10-08-frontend-build-series-introduction %}))

```javascript
// gulpfile.js
const gulp = require('gulp'),
    del = require('del'),
    runSeq = require('run-sequence');

gulp.task('clean', function(){
    return del('dist/frontend/**/*', {force:true});
});

gulp.task('copy:vendor', function(){
    return gulp.src([
            "node_modules/es6-shim/es6-shim.min.js",
            "node_modules/systemjs/dist/system-polyfills.js",
            "node_modules/angular2/bundles/angular2-polyfills.js",
            "node_modules/systemjs/dist/system.src.js",
            "node_modules/rxjs/bundles/Rx.js",
            "node_modules/angular2/bundles/angular2.dev.js"
        ])
        .pipe(gulp.dest('./dist/frontend/scripts/vendor'))
})

gulp.task('copy:index', function(){
    return gulp.src('./src/frontend/index.html')
        .pipe(gulp.dest('./dist/frontend'));
});

gulp.task('frontend', function(done){
    return runSeq('clean', ['copy:vendor', 'copy:index'], done);
});

```

Now it's time to give it a try, save all the files and move over to your *terminal*. By invoking the frontend script, our *Angular* app will be compiled, and we'll use live-server by executing serve to `serve` it from the `dist` folder.

```bash
npm run frontend
npm run serve

```

## Instructing Electron

Having the *SPA* finished, it is time to tell *Electron* how to behave when users start our App. Open `src/main/index.js` in your editor and use the following code:

```javascript
// main/index.js
const electron = require('electron'),
  app = electron.app,
  BrowserWindow = electron.BrowserWindow;

var mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.webContents.openDevTools();

mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

```

By default, we enable Chrome's Developer Tools within the `index.js` as shown above. If you want to hide the DevTools by default, go and remove the `mainWindow.webContents.openDevTools()` call from our instruction script.

Besides our `index.js` there is another required artifact to get everything working as expected. We've to provide a `package.json` for out *Electron* app.

----

You can, of course, re-use the existing `package.json` from our projects `root` directory, to keep things simple here we've created a dedicated `package.json` inside `src/assets` with our initial script.

----

Let's provide the required properties to `src/assets/package.json`:

```json
{
  "main" : "index.js",
  "version" : "0.0.1",
  "name": "ng2-electron sample"
}

```

## Generating the final output

Now it's time to add some new tasks to our build script:

```javascript
// gulpfile.js
gulp.task('clean-electron', function(){
    return del('dist/electron-package/**/*', {force: true});
});

gulp.task('copy:electron-manifest', function(){
   return gulp.src('./src/assets/package.json')
       .pipe(gulp.dest('./dist/electron-package'))
});

gulp.task('copy:electron-scripts', function(){
    return gulp.src('./src/main/index.js')
        .pipe(gulp.dest('./dist/electron-package'));
});

gulp.task('copy:spa-for-electron', function(){
    return gulp.src("./dist/frontend/**/*")
        .pipe(gulp.dest('dist/electron-package'));
});

gulp.task('electron', function(done){
    return runSeq('clean-electron',
      [
        'copy:electron-manifest',
        'copy:electron-scripts',
        'copy:spa-for-electron'
      ], done);
});

```

Try out the gulp tasks by invoking:

```bash
npm run build

```

Now all required files should be created within the `dist/electron-package` folder. Let's give it a try!

## Execute the app

There are two different ways how you can start the cross-platform app. The first and most straightforward way is to use `electron-prebuilt` which is good for development time. Install `electron-prebuilt` using npm:

```bash
npm install electron-prebuilt --save-dev --no-progress

```

From this point, you can either execute the app manually or add another `npm script` for that. Let's keep it simple and start the electron app directly from the terminal by executing:

```bash
./node_modules/.bin/electron dist/electron-package

```

Your app should now start and render our Angular sample app as shown below.

{% include image-caption.html imageurl="/assets/images/posts/2016/angular-electron-guide-2.png"
title="An Angular app in GitHub Electron" caption="An Angular app in GitHub Electron" %}

Having this mechanism for dev time is good, but not good enough when thinking about your development workflow or handing out the app in this state to the user. Users want to have an executable, and we as developers want to automate the creation of those executables of course. 

## Automate app packaging

You can use `gulp-atom-electron` to build the app automatically. I've written [another article on packaging Windows Apps from the macOS including a custom app icon]({% post_url 2016-01-16-setting-electron-app-icons-for-windows-from-macos %}).

However, for now, let's keep the default icons and get everything up and running.
Install `gulp-atom-electron`, and it's dependency symdest using npm:

```bash
npm i gulp-atom-electron gulp-symdest --save-dev --no-progress

```

Once installed, some more gulp tasks are required to automatically build the app for all three major platforms (*macOS*, *Linux* and *Windows*).

```javascript
// gulpfile.js
// load req plugins
// change the beginning of your gulpfile to match
const gulp = require('gulp'),
  electron = require('gulp-atom-electron'),
  symdest = require('gulp-symdest'),
  del = require('del'),
  runSeq = require('run-sequence');

gulp.task('build-app-for-macos', function(){
    gulp.src(['dist/electron-package/**/*'])
        .pipe(electron({
            version: '0.36.7',
            platform: 'darwin' }))
        .pipe(symdest('packages/macos'));
});

gulp.task('build-app-for-linux', function(){
    gulp.src(['dist/electron-package/**/*'])
        .pipe(electron({
            version: '0.36.7',
            platform: 'linux' }))
        .pipe(symdest('packages/linux'));
});

gulp.task('build-app-for-win', function(){
    gulp.src(['dist/electron-package/**/*'])
        .pipe(electron({
            version: '0.36.7',
            platform: 'win32' }))
        .pipe(symdest('packages/win'));
});

gulp.task('apps', function(done){
    return runSeq(
      [
        'build-app-for-win',
        'build-app-for-linux',
        'build-app-for-MacOS'
      ], done);
});

```

When you start the build using `npm run apps`, you can find all the executables in the `packages` subdirectory.

## Summary

Congratulations, you've just created a functional *Angular* app for all major desktop platforms using *GitHub Electron*. It's still a rocky road, because of the early *Angular* state. Once *Angular* has stabilized a bit more, building real cross-platform applications with *Electron* will become easier, and perhaps some *Gulp.js* code could be ignored.
