---
title: Testing Angular Apps with Jasmine and TypeScript
layout: post
permalink: testing-angular-apps-with-jasmine-and-typescript
redirect_from: /testing-angular2-apps-with-jasmine-and-typescript-4525195f2412
published: true
tags: [Angular]
excerpt: Every developer should be able to write unit tests. This article explains how to write tests based on the popular testing framework Jasmine in combination with Angular and TypeScript.
featured_image: /assets/images/posts/feature_images/testing.jpg
unsplash_user_name: David Travis
unsplash_user_ref: dtravisphd
---

Unit-Testing *Angular* applications made me crazy during Beta time. In this post, I'll share how to set up unit testing for *Angular* applications. The samples below were tested on *Angular 2* *Beta 2* and *Beta 3*. There are many resources available on the web that explain how unit-testing should work in *Angular* beta. Unfortunately, none of them worked for me from front to end. The official documentation is also lacking a fully working example with *SystemJS* while I'm writing this article. Things may change over time, so you should check out the latest documentation on [https://angular.io](https://angular.io){:target="_blank"}.

## Prerequirements

You should be able to reproduce the upcoming steps with **any of your angular apps**. So there is **no need for particular structure** or something like this.

### Install dependencies

To get tests with Jasmine and TypeScript working, let's install the required dependencies.

```bash
npm install jasmine-core concurrently live-server --save-dev --save-exact

```

The official *Angular* documentation uses `live-server` all over the place. However, I'm using `live-server` because it's faster and smaller than `lite-server`, but it's entirely up to you.

### Create a test page

This introduction explains how to execute tests in the browser using a simple `tests.html` file. Executing the tests in a headless mode is a topic for another post. That said, let's go and create the `tests.html` file

```bash
touch tests.html

```

Also, provide the following content:

```html
<html>
<head>
    <title>testing ng2 apps with jasmine</title>
    <link rel="stylesheet" href="/node_modules/jasmine-core/lib/jasmine-core/jasmine.css">
    <!-- Jasmine Scripts -->
    <script src="/node_modules/jasmine-core/lib/jasmine-core/jasmine.js"></script>
    <script src="/node_modules/jasmine-core/lib/jasmine-core/jasmine-html.js"></script>
    <!-- Jasine's main.js has recently be renamed to boot.js -->
    <script src="/node_modules/jasmine-core/lib/jasmine-core/boot.js"></script>
    <!-- Common dependencies for ng2 -->
    <script src="/node_modules/es6-shim/es6-shim.min.js"></script>
    <script src="/node_modules/systemjs/dist/system-polyfills.js"></script>
    <script src="/node_modules/angular2/bundles/angular2-polyfills.js"></script>
    <script src="/node_modules/systemjs/dist/system.src.js"></script>
    <script src="/node_modules/rxjs/bundles/Rx.js"></script>
    <script src="/node_modules/angular2/bundles/angular2.dev.js"></script>
    <script src="/node_modules/angular2/bundles/router.js"></script>
    <!-- Import ng2 testing -->
    <script src="/node_modules/angular2/bundles/testing.dev.js"></script>
</head>
<body>
    <script>
            System.config({
            packages: {
                'app': {
                    defaultExtension: 'js'
                }
            }
        });
        System.import('app/components/app/app.spec')
            .then(window.onload)
            .catch(console.error.bind(console));
    </script>
</body>
</html>

```

Examine the code, besides the *Angular* boilerplate, all *Jasmine* stuff - stylesheets and scripts - are loaded. Be aware, documentation on angular.io isn't correct here. `jasmine-core` has no `main.js` as described in their docs. You've to load `boot.js`.

Another interesting part is the `script` node for `testing.dev.js`; you've to reference this file if you want `tsc` to work as expected and to get the *Angular* related implementation for testing to work with `DI`.

At the end of the HTML file, I'm importing the `app.spec`. That's pointing to our transpiled `app.spec.ts` file (see the `defaultExtension` property for the `app` package). So that's what we're looking at next.

## Writing a Unit-Test

In my sample repo, I've created a dead-simple `AppComponent` which is exposing a property called `items` to the view. So we could take this under test to see everything is working as expected. The `AppComponent` is defined in an `app.ts` file which is located in `app/components/app/app.ts` and that's exactly where I will create the `spec-file`.

```bash
touch app/components/app/app.spec.ts

```

Let's write a simple test:

```typescript
import { AppComponent } from './app';
import { describe, it, beforeEach, expect } from 'angular2/testing';

describe('AppComponent', () => {
    var app: AppComponent = null;
  
  beforeEach(()=>{
        app = new AppComponent();
  });
  
  it('should have an items property', () => {
    expect(app.items).toBeDefined();
  });
});

```

As you can see, I'm using normal module loading right here. Moreover, I'm importing the required things from `angular2/testing` to get rid of TypeScript compilation errors (caused by methods like `describe`, `it`, `beforeEach`,…).

## Execute Unit-Tests

To get the results from our simple test, you've to execute a few commands.

```bash
./node_modules/.bin/tsc
./node_modules/.bin/live-server --open=tests.html

```

Your browser should fire-up and display the following result.

{% include image-caption.html imageurl="/assets/images/posts/2016/jasmine-angular-typescript.png"
title="Jasmine Tests Result in Chrome" caption="Jasmine Tests Result in Chrome" %}

## Add JIT-Transpilation and Live-Reload

Manually starting the *TypeScript* transpilation process each time is time-consuming. Use `tsc -w` to get rid of this, it watches our *TypeScript* files. `Concurrently` also starts the web server which directly points to the `tests.html` site. To do so, ensure that the following `scripts` are located in your `package.json`

```json
"scripts": {
  "tsc": "tsc",
  "tsc:w": "tsc -w",
  "live": "live-server",
  "test": "live-server --open=tests.html",
  "test:w": "concurrent \"npm run tsc:w\" \"npm run test\" "
}

```

Save the file, go to your terminal and execute

```bash
npm run test:w

```

Now TypeScript starts the compilation process and keeps watching the files. Once `tsc` finishes the compilation, the browser displays the expected result.

## Fix common issues thrown by Jasmine

If your setup is fine and *Jasmine* keeps on reporting 'No specs found', you made just a small mistake. The root cause is that *Jasmine* has finished looking for specs when *SystemJS* is ready for loading the spec files. To fix this, ensure that `window.onload` is called right after *SystemJS* has loaded your spec-files. Change the part of your testing page to match the following snippets, and the specs appear.

```typescript
System.import('app/components/app/app.spec')
  .then(window.onload)
  .catch(console.error.bind(console));

```

## Recap

As you can see, using *Jasmine* in *TypeScript* is comfortable. The custom implementation from the Angular core team allows you an easy integration into core concepts from the framework itself, such as dependency injection. That said, it's also easy to test services relying on `HTTP` oder other services exposed by the *Angular* framework itself.
