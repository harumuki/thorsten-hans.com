---
title: Angular Quickie — How to structure your projects
layout: post
permalink: angular-quickie-structure-your-apps
redirect_from: /angular2-quicky-how-to-structure-your-projects-9b521b831de2
published: true
tags: [Angular]
excerpt: Angular will become the next big thing for enterprise developers. That's why you should structure your source code correctly from the very beginning.
featured_image: /assets/images/posts/feature_images/2016-angular-quickie.jpg
---
When building large *Angular* Apps, you've to care about how to structure your project. I can imagine, [John Papa](https://twitter.com/John_Papa){:target="_blank"} will, of course, provide a new style guide soon 🙂 (no pressure here, we've our own for *Angular.JS* and *Angular*).

{% include image-caption.html imageurl="/assets/images/posts/2016/angular-quickie-tweet-john-papa.png"
title="Jogn Papa sneaks a new styleguide for Angular devs" caption="Jogn Papa sneaks a new styleguide for Angular devs" %}

But already in those early days, you've to care about the project structure. Refactoring an entire project structure is hard 💩. So think about it, before you start coding.

The documentation on angular.io provides a good starting point for **spikes or to get hands dirty** but in my eyes, it's a little bit confusing when *JavaScript* and *SourceMaps* generated side-by-side of the *TypeScript* files.

That said and the fact that we always structure our apps by components (also Angular1 apps) I ended up with the following structure.

Source files go into a dedicated `src` folder, and there is **no in place transpiling**, so all transpiled bits are moved to `dist`.

For Angular Components, we're arranging them by use-case or feature-area like `login`, `product/list` or `product/detail`. Other building blocks like `services`, `directives` or `pipes` go to the corresponding folders.

Take the following list of files and folders as an example.

```bash
/src
/src/app
/src/app/components
/src/app/components/app
/src/app/components/app/app.ts
/src/app/components/login
/src/app/components/login/login.ts
/src/app/components/product
/src/app/components/product/list
/src/app/components/product/list/list.ts
/src/app/components/product/detail
/src/app/components/product/detail/detail.ts
/src/app/services
/src/app/services/logger.service.ts
/src/app/services/product.service.ts
/src/app/pipes
/src/app/pipes/user.displayname.ts
/src/app/pipes/product.displayname.ts
/src/app/models
/src/app/models/product.ts
/src/app/models/user.ts
/src/app/boot.ts
/src/index.html
/src/styles/
/src/styles/variables.less
/src/styles/main.less
/dist ( -> ignored in git)
/gulpfile.js
/package.json

```

I've removed some folders like `node_modules`, `.temp` also, some configuration files here because they don't matter at this point.

By using this structure, I can quickly `gulp` all things to `dist` and use the transpiled *Angular* app to build `electron` and `Cordova` apps or it as a web app.

## Recap

No golden rule tells you how to structure your Angular app. However, it's essential to get the setup right at first place. Apps grow quickly, and Angular will become the next big thing for enterprise developers. That said, having a robust and meaningful source code structure is essential.
