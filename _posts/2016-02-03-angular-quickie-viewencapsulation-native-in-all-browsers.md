---
title: Angular Quickie — ViewEncapsulation.Native in all browsers
layout: post
permalink: angular-quickie-viewencapsulation-native-in-all-browsers
redirect_from: /2016-02-03_Angular2-Quickie---ViewEncapsulation-Native-in-all-browsers-974b20217b6c
published: true
tags: [Angular]
excerpt: ViewEncapsulation tells Angular how to render the component in the final website, this post explains how to enable native ViewEncapsulation for all browsers
featured_image: /assets/images/posts/feature_images/2016-angular-quickie.jpg
---
A few days ago [I wrote about *Angular ViewEncapsulation*]({% post_url 2016-01-08-angular-quicky-component-viewencapsulation-and-webcomponents %}). The sample I’ve created for that post only works if you’re using *Google Chrome*. In this article, I’ll explain why the sample only works in *Google Chrome* and how you can take the example one step further to work and behave as expected in all modern browsers.

*Angular* is using `ViewEncapsulation.Emulated` by default, to render components. `Emulated` means you’re not using native `ShadowDOM` features; instead *Angular* does some refactoring to both, your template and your styles, to encapsulate those from the rest of your app and render everything as expected. (see the linked article above for more details).

This emulation mode is also used if the browser (Google Chrome) has built-in support for `ShadowDOM`. If you force *Angular* to use `Native` view encapsulation for your components, the component decorators have to look like this:

```typescript
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'todo-item',
  templateUrl: 'todoitem.html',
  styleUrls: ['styles/todoitem.css']
  encapsulation: ViewEncapsulation.Native
})
export class TodoItemComponent {
    
}
```

*Angular* relies on official `ShadowDOM` specs and let browsers decide how to deal with your components. Everything works fine in Google Chrome and Opera, but unfortunately, there are more browsers in the wild.

Both *Chrome* and *Opera* are supporting `ShadowDOM` without using any `polyfills`. However, when users visit your app with browsers like Microsoft Edge or Mozilla Firefox or Apple’s Safari, they will see just nothing because those browsers neither have any native implementation for `ShadowDOM` nor are they shipping any polyfill out of the box. Angular tries to render your app and it will crash as soon as the `ShadowDOM` API will be called by the Angular core framework.

To get `ViewEncapsulation.Native` working across all browsers, you’ve to put another JavaScript dependency in your website by adding a [script reference to *WebComponentsJs*](https://github.com/webcomponents/webcomponentsjs){:target="_blank"}.

`WebComponentsJs` adds the required polyfills at runtime (only if the browser doesn’t provide some), so Angular can call into ShadowDOM APIs. *Some of you may also know `Polymer` project* which was also targeting the same issue.* Polymer is now part of `WebComponentsJs`, so you don’t have to make a decision here.


