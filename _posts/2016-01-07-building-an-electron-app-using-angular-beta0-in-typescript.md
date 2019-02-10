---
title: Building an electron app using Angular Beta0 in TypeScript
layout: post
permalink: building-an-electron-app-using-angular-beta0-in-typescript
redirect_from: /building-an-electron-app-using-angular2-beta0-in-typescript-5c5ac5570963
published: true
tags: [Electron, Angular]
excerpt: Today In contrast to my older ES2015 example, this article demonstrates how to build an Electron application using Angular2 Beta0 and TypeScript.
featured_image: /assets/images/posts/feature_images/2016-01-07-building-an-electron-app-using-angular-beta0-in-typescript.jpg
unsplash_user_ref: grohsfabian
unsplash_user_name: Fabian Grohs
---


You can build Angular apps using plain old *JavaScript* and *TypeScript*. I've been using plain JavaScript for the past *Angular* demonstrations, because I felt in love again with *JavaScript* after spending years with *CoffeeScript* (But that's a different story). However, teams at Google and Microsoft were working together in these days to marriage *Angular* and *TypeScript*. If you don't know *TypeScript* yet, go and learn it. It will change the way how you write Frontend stuff in the upcoming years. You can think of it as todays **JavaScript* on steroids. It makes you more productive, it makes your code more robust, you've to write less plumbing because the *TypeScript Compiler (TSC)* generates all the good parts of *JavaScript* and knows about the edge-cases.

> THINK: When I use TypeScript I'll end in doing less keystrokes; That means I'll be faster 🤘

Go and [checkout the repository on GitHub](https://github.com/ThorstenHans/electron-ngx-sample/tree/246f83da87d2598e732bb681be2a559dab0258c6){:target="_blank"}. You can find the entire application there. To automate the build process I've created a `gulpfile.js`. It takes care about all the transpiling, copying and other required build steps to generate the *Electron* apps for all three major platforms (Windows, Linux and of course MacOS).

By using `gulp-typescript`, you can easily compile the *TypeScript* sources to plain *JavaScript* which is managed by `SystemJS` at runtime. 

```javascript
gulp.task('private:build-app', function(){
    var project = typescript.createProject('tsconfig.json');
    var tsResult = project.src()
        .pipe(typescript(project));
    return tsResult.js.pipe(gulp.dest('dist/frontend'));
});

```

See the entire `gulpfile.js` [here](https://github.com/ThorstenHans/electron-ngx-sample/blob/246f83da87d2598e732bb681be2a559dab0258c6/gulpfile.js#L30){:target="_blank"}.

More important are some pitfalls when combining *Angular* with *Electron*. There are plenty of demo applications available out there. However, a quick google didn't bring up a single sample using angular's new component router.

As mentioned within angular's developer guide on [angular.io](http://angular.io){:target="_blank"}, the router requires a `<base href="/foo"/>` or `<base href="/">` in order to work as expected. If you don't add the `base` node within `<head>` Angular throws an error like shown in figure 1.

{% include image-caption.html imageurl="/assets/images/posts/2016/angular-beta0-electron-ts-1.png"
title="Angular app with missing Base href" caption="Angular app with missing Base href" %}

Adding the `<base />` element works fine when running inside of the *Browser*. However, it prevents the app from finding the routes when executing the same source in *Electron*. You can alternatively configure the `base` within your application's bootstrap routine.

**This is required when you're loading scripts from within Electron's renderer process.**

Snippet 1 shows the `boot.ts` file which is responsible for bootstrapping our Angular app.

```typescript
import { provide } from 'angular2/core';
import { bootstrap } from 'angular2/platform/browser';
import { AppComponent } from './components/app/app.component';
import { ROUTER_PROVIDERS, APP_BASE_HREF } from 'angular2/router';

bootstrap(AppComponent, [ROUTER_PROVIDERS,
     provide(APP_BASE_HREF, {useValue : '/'})]);

```

The essential and new part here is the usage of `provide` to tell angular where the new `base` is. However, there is more required. Angular is offering a `Location` service which is responsible for interacting with the browser's URL. Check out `app.component.ts` (Snippet 2); the `RouteConfig` can take an optional `useAsDefault` property of type boolean. Setting this to true works fine when not using `provide` but the combination of `provide` and `useAsDefault: true` didn't work for me here. That's why I used the `Location` service (provided by *Angular's* DI container) to redirect the user immediately to the **Splash Component**.

```typescript
import { Component } from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES, Location } from 'angular2/router';
import { SplashComponent } from "../splash/splash.component";

@Component({
    selector: 'sampleapp',
    templateUrl: 'templates/app.html',
    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
    { path: '/splash', name: 'Splash', component: SplashComponent }
])
export class AppComponent {

  constructor(private _location: Location) {
    _location.go('/splash');
  }

}

```

Within the current publicly available version of this sample,I've to load the splash template by using the plain `template` property when using `templateUrl` as I did for the `app.component.ts` angular2 isn't able to find the template. For now, it seems like the template is requested after the AppBaseHref is set and in combination with electron's path handling Angular isn't able to find the template at a given URL.

#### Action required

If you've any idea how to fix that feel free to send me a pull request on *GitHub* or chat with me about it.


