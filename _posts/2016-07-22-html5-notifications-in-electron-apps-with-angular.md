---
title: HTML5 notifications in electron apps with Angular
layout: post
permalink: html5-notifications-in-electron-apps-with-angular
published: true
tags: [Electron, Angular]
excerpt: Electron takes HTML5 notifications and bridges them to operating system notifications. So you'll learn how to create native HTML5 notifications within Angular.
featured_image: /assets/images/posts/feature_images/2016-07-22-html5-notifications-in-electron-apps-with-angular.jpg
---
Within *Electron* apps, you can use *HTML5 Notification API* to keep users posted about events happened. *Electron* is bridging incoming calls to *HTML5 Notification API* to native notification APIs offered by all supported platforms.

## Create a notification

Creating new notifications is straightforward. An instance of the `Notification` class is all you need. In the most basic shape, notification consists of a `title`. Additional metadata could be provided by providing an object as the second parameter to the `Notification` constructor, as demonstrated below with `body`.

```typescript
const options = {
   body: 'Notification Body'
};

new Notification('Notification Title', options);

```

Besides `title` and `body`, more properties are available. You use those, to control the look and feel of desktop notifications.

I want to highlight the `data` for now. `data` is used to pass data from the electron application to the native desktop notification. “This” `data` can be forwarded from the notification itself to any other piece in the application by a simple handler. The entire HTML5 Notification API specification, including more samples, is located [here](https://developer.mozilla.org/de/docs/Web/API/notification).

## Implement handlers

A handler is required to respond to user interaction. Technically a handler is just a `function` being executed for every time a certain event triggers. `onclick`, `onshow` or `onhide` are self-explaining handlers being exposed by the HTML5 Notification API. To implement a `click` handler, change the previously created snippet to match the following one.

```typescript
const options = {
    body: 'Notification Body'
};
const notification = new Notification('Notification Title', options);

notification.onclick = () => {
    console.log('user clicked notification');
};

notification.onclose = () => {
    console.log('notification closed');
};

// ...

```

## Native Notifications and Angular

Notifications are native platform features. Those are displayed and handled outside of Angular, but once the user responds to the notification by clicking on it, Angular needs to get informed.

The following snippet combines HTML5 Notification API with Angular basic stuff. Imagine `hero` to be a valid instance, bound to the component template. If the user clicks the notification, `level` from the `hero` instance is incremented by `1`.

```typescript
public notifiy() {

    const options = {
        body: `Hello, this is ${this.hero.name} speaking`
    };
    
    const notification = new Notification('Hero Notification', options);
    
    notification.onclick = () => {
        this.hero.level ++;
    };
}

// ...

```

Here the corresponding template associated with the component.

```html
<span>{{hero.level}}</span>

```

Fortunately, Angular provides already a perfect solution for scenarios like this. `NgZone` from `@angular/core` is used to trigger change detection manually. Review the public API offered by `NgZone`, it’s self-explaining and well documented.

First, request an instance of `NgZone` by asking Angular’s mighty dependency injection implementation.

```typescript
import { Component, NgZone } from '@angular/core`;

@Component({})

export class HeroComponent {

    constructor(private _zone: NgZone) {
  
    }
}

```

That said, easy refactorings have been applied to the existing codebase. Remember the `onclick` handler we created above?

Change it to use `runOutsideAngular` and `run` offered by the `NgZone` instance (`this._zone`), and native desktop notifications are ready to enhance user experience a lot.

```typescript
notification.onclick = () => {
  
  this._zone.runOutsideAngular(() => {
    this.hero.level ++;
    this._zone.run(()=>void 0);
   });
   
};

```

## Recap

Okay, that was impressive. The simple API provided by *HTML5* was used by the *Electron*-team to wrap existing, complicated operating system APIs. You managed it to create, enhance and even integrate native desktop notifications inside of *Electron* apps. Also, the fantastic API of `NgZone` made it easy to ensure a smooth integration in Angular.

Do you have more ideas? Alternatively, do you want to use this sample as a starting point? That’s great. Grab the implementation [here on GitHub](https://github.com/ThorstenHans/electron-ts-ng2). You’ve never used GitHub’s electron before? No problem, there is my [definitive guide on Angular and Electron](/angular-and-electron-the-definitive-guide/) already waiting for you.



