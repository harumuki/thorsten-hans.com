---
title: Angular Quickie - Why can't I compile my Angular app anymore
layout: post
permalink: angular-quickie-why-cant-i-compile-my-angular-app-anymore
redirect_from: /angular-2-quickie-why-cant-i-compile-my-angular2-app-anymore-c36483c8d0a4
published: true
tags: [Angular]
excerpt: null
image: /2016-angular-quickie.jpg
---

Staying on top of the technology stack is sometimes really hard. The *Angular* core team tries to do it's best to keep breaking changes as seldom as possible. Because *Angular* is still in beta, breaking changes may happen. I was facing some issues while catching up latest betas. If you're also facing `TS2304` while transpiling your app, this article may help.

----

After pulling a remote branch from git this morning, I tried to start a simple *Angular* project by invoking our *Gulp.JS* tasks. However, suddenly the script crashed and printed tons of errors from the *TypeScript Compiler* (short `tsc`). After some short discussion, I decided to dig deeper into the issue and tried to fix the issue and understand why this has happened.

As always, everything worked perfectly before switching the branches (where each branch has precisely the same dependencies and gulp scripts).

So this post is what you're looking for if tsc keeps driving you crazy with `TS2304`.

{% include image-caption.html imageurl="/assets/images/posts/2016/angular-quickie-tsc-error.png"
title="tsc errors with Angular beta6" caption="tsc errors with Angular beta6" %}

The solution for this error is quite easy, but let's first look at what happened and why you have to care about this also if you're using earlier beta releases of *Angular*.

----

*Angular* is using `SemVer` to specify their package versions. That said, you may run into the same issue when using older *Angular* versions if you specify your *Angular* dependency using `"angular2": "^2.0.0-beta.3"` for example.

In this case `npm`  pulls the latest compatible version which is `beta6` instead of `beta3`, so you could either lock the specific version using `"angular2": "2.0.0-beta.3"` (which means you'll still use the older, outdated `beta3` or you follow the instructions written down in Angular2's changelog.

## What are those breaking changes

According to *Angular's* changelog, only those projects targeting `es5` were affected. Transitive typings are no longer included in the distribution package of Angular. So you've to specify the typings manually.

To get your TypeScript compilation working again, you've to reference the typings explicitly.

An excellent place to add this reference is your global `boot.ts` file. Imagine your project structure is something like `node_modules/<br></br>src/<br></br>src/app/<br></br>src/app/boot.ts`.

Add the following reference to your `boot.ts`.

```typescript
///<reference path="../../node_modules/angular2/typings/browser.d.ts"/>

```

Save the changes and start either your *Gulp.js* build or plain `tsc` again. Now your app should compile again as expected. I hope that works for you and you saved some time for developing instead of fighting this issue.
