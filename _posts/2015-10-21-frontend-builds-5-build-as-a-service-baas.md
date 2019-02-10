---
title: Frontend Builds 5 - Build as a Service (BaaS)
layout: post
permalink: frontend-builds-5-build-as-a-service-baas
redirect_from: /frontend-builds-5-build-as-a-service-baas-58716e90d28a
published: true
tags: [Build, Gulp.js]
excerpt: null
featured_image: /assets/images/posts/feature_images/frontend-builds.jpg
unsplash_user_name: Iker Urteaga
unsplash_user_ref: iurte
---
## The Frontend Builds article series
 Welcome to the fifth part of this article series. If you didn't read the other parts, check them out now.

 * [Introducing the Frontend Builds Article Series]({% post_url 2015-10-08-frontend-build-series-introduction %})
 * [Frontend Builds 1: Getting Started ]({% post_url 2015-10-12-frontend-builds-1-getting-started %})
 * [Frontend Builds 2: Readable and Pluggable Gulpfiles  ]({% post_url 2015-10-14-frontend-builds-2-readable-and-pluggable-gulp-files %})
 * [Frontend Builds 3: Cross-Platform Desktop Builds]({% post_url 2015-10-15-frontend-builds-3-cross-platform-desktop-builds %})
 * [Frontend Builds 4: Building Cross-Platform Mobile Apps]({% post_url 2015-10-17-frontend-builds-4-building-cross-platform-mobile-apps %})
 * [Frontend Builds 5: Build as a Service (BaaS)]({% post_url 2015-10-21-frontend-builds-5-build-as-a-service-baas %})
 * [Frontend Builds 6: Configurable builds]({% post_url 2015-10-22-frontend-builds-6-configurable-builds %})
 * [Frontend Builds 7: Conditional Build Tasks]({% post_url 2015-10-24-frontend-builds-7-conditional-build-tasks %})


## The idea

Most developers frequently create new projects, either for work or for just trying something new. This is also true for me. I found myself using yeoman to create new projects almost every day automatically. There are plenty of great generators available in the wild. Just visit the [yeoman website](http://yeoman.io){:target="_blank"} and discover the generator repository, it's fantastic.

I've also built several public and internal generators to generate `gulpfiles` for every new project. However, if you rely on (almost) the same stack for many projects, it makes no sense to maintain all those `gulpfiles` for every project. This makes just no sense!

At that point I started thinking about **Build as a Dependency** or you may also call it **Build as a Service (BaaS)**.

Technically we will package our existing build into an npm package and publish it on [NPM](http://www.npmjs.com){:target="_blank"}, so we can quickly consume the full-fledged build directly from there and don't have to repeat yourself for every project.

## Implement the BaaS

To keep things clean, I've created a new repo which will only host our build scripts. You can find the new repo [here](https://github.com/ThorstenHans/xplatform-build){:target="_blank"}.

When discovering the project, you may realize that there is no additional code in that repo. It's just the gulpfile, and all the contents from the `gulptasks` directory also with its own `package.json`. When building this an npm package, it's important to set `main` within `package.json` to `src/gulpfile.js`.

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
That's awesome. 😀

## Updated x-note on github

You can find the version of x-note on GitHub within a [**dedicated BaaS branch** over here](https://github.com/ThorstenHans/x-note/tree/baas){:target="_blank"}.

## Go ahead ...

.. so read the [next article in the "Frontend Build" article series]({% post_url 2015-10-22-frontend-builds-6-configurable-builds %}).


