---
title: Frontend Builds 5 - Build as a Service (BaaS)
layout: post
permalink: frontend-builds-5-build-as-a-service-baas
redirect_from: /2015-10-21_Frontend-Builds-5---Build-as-a-Service--BaaS--58716e90d28a
published: true
tags: [Build, Gulp.js]
excerpt: null
featured_image: /assets/images/posts/feature_images/frontend-builds.jpg
unsplash_user_name: Iker Urteaga
unsplash_user_ref: iurte
---
## The Frontend Builds article series
 Welcome to the fifth part of this article series. If you didn't read the other parts, check them out now.

 * [Introducing the Frontend Builds Article Series]({{ "/frontend-build-series-introduction" | absolute_url }})
 * [Frontend Builds 1: Getting Started]({{ "/frontend-builds-1-getting-started" | absolute_url}})
 * [Frontend Builds 2: Readable and Pluggable Gulpfiles]({{ "/frontend-builds-2-readable-and-pluggable-gulp-files" | absolute_url}})
 * [Frontend Builds 3: Cross-Platform Desktop Builds]({{ "/frontend-builds-3-cross-platform-desktop-builds" | absolute_url}})
 * [Frontend Builds 4: Building Cross-Platform Mobile Apps]({{ "/frontend-builds-4-building-cross-platform-mobile-apps" | absolute_url}})
 * [Frontend Builds 5: Build as a Service (BaaS)]({{ "/frontend-builds-5-build-as-a-service-baas" | absolute_url}})
 * [Frontend Builds 6: Configurable builds]({{ "/frontend-builds-6-configurable-builds" | absolute_url}})
 * [Frontend Builds 7: Conditional Build Tasks]({{ "/frontend-builds-7-conditional-build-tasks" | absolute_url}})


## The idea

Most developers frequently create new projects, either for work or for just trying something new. This is also true for me. I found myself using yeoman to create new projects almost every day automatically. There are plenty of great generators available in the wild. Just visit the [yeoman website](http://yeoman.io) and discover the generator repository, it’s fantastic.

I’ve also built several public and internal generators to generate `gulpfiles` for every new project. However, if you rely on (almost) the same stack for many projects, it makes no sense to maintain all those `gulpfiles` for every project. This makes just no sense!

At that point I started thinking about **Build as a Dependency** or you may also call it **Build as a Service (BaaS)**.

Technically we will package our existing build into an npm package and publish it on [NPM](http://www.npmjs.com), so we can quickly consume the full-fledged build directly from there and don’t have to repeat yourself for every project.

## Implement the BaaS

To keep things clean, I’ve created a new repo which will only host our build scripts. You can find the new repo [here](https://github.com/ThorstenHans/xplatform-build).

When discovering the project, you may realize that there is no additional code in that repo. It’s just the gulpfile, and all the contents from the `gulptasks` directory also with its own `package.json`. When building this an npm package, it’s important to set `main` within `package.json` to `src/gulpfile.js`.

The entire build is publicly available on NPM with the name `xplatform-build`.

## Refactoring x-note

Integrating **xplatform-build** in x-note is pretty simple.

First, refactor the package.json file to look like shown below.

```json
{
  "name": "x-note",
  "version": "1.0.0",
  "description": "",
  "main": "gulpfile.js",
  "author": "Thorsten Hans <thorsten.hans@gmail.com> (https://thorsten-hans.com)",
  "license": "MIT",
  "devDependencies": {
    "gulp": "^3.9.0",
    "xplatform-build": "^1.0.1"
  }
}

```

After doing so, move to the terminal and execute

```bash
# clean all installed local modules first  (optional)
rm -rf node_modules

npm install xplatform-build --save-dev

```

## Modify x-note

**Delete** the entire `gulptasks` directory. Then open `gulpfile.js` and replace the **entire content** with the following line of code.

```javascript
require('xplatform-build');
```

## Give it a try

Move to the terminal and try our gulp tasks as shown below.

```bash
gulp
# which will automatically execute gulp help

gulp build
gulp build:mobile
gulp build:desktop

```
That’s awesome. 😀

## Updated x-note on github

You can find the version of x-note on GitHub within a [**dedicated BaaS branch** over here](https://github.com/ThorstenHans/x-note/tree/baas).

## Go ahead ...

.. so read the [next article in the "Frontend Build" article series]({{ "/frontend-builds-6-configurable-builds" | absolute_url}}).


