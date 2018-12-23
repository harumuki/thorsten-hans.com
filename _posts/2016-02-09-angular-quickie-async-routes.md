---
title: Angular Quickie - Async Routes
layout: post
permalink: angular-quickie-async-routes
published: true
tags: [Angular]
excerpt: null
featured_image: /assets/images/posts/feature_images/2016-angular-quickie.jpg
---
*Angular* ships with its component router. The router makes it easy to compose complex applications from a bunch of components. Multiple routers could easily be nested to achieve almost every requirement for a *SPA*. When using regular routes, all files from your *SPA* are transferred to the client as soon as `RouteConfig` is interpreted by the JavaScript engine of your browser.

With growing apps, you may change this behavior. Clients should only download those files that are required for the current use case. Alternatively, you would initially transfer only those files required to make the core functionality of your app work. Optional components and templates should only be transferred if users request those components explicitly.

This can easily be achieved using `AsyncRoutes`. The AsyncRoute type is part of the `ComponentRouter`, by using the `AsyncRoute` you can specify a custom loader function. The `loader` function is responsible for requesting the component from the backend. Take the following example as a starting point where all routes are loaded traditionally during the initial `RouteConfig` execution.

```typescript
import { Component } from 'angular2/core';
import { ROUTER_DIRECTIVES, RouteConfig } from 'angular2/router';
import { ProductsComponent } from '../products/products';
import { CustomersComponent } from '../customers/customers';
import { SupportCenterComponent } from '../support/supportcenter';
import { AboutComponent } from '../about/about';

@Component({
  selector: 'async-routes-app',
  directives: [ROUTER_DIRECTIVES],
  templateUrl: 'app/components/app/app.html'
})
@RouteConfig([
  {path: '/customers/...', name: 'Customers', useAsDefault: true, component: CustomersComponent},
  {path: '/products/...', name: 'Products', component: ProductsComponent},
  {path: '/support/...', name: 'SupportCenter', component: SupportCenterComponent},
  {path: '/about', name: 'About', component: AboutComponent}
])
export class AppComponent {
}

```

To get their work done, users need almost every time forms and lists underneath `Customers` and `Products`, so it’s a good idea to keep those routes as they are. However, `SupportCenter` and `About` routes aren’t business critical; only a few users may use forms and lists sitting behind those routes.

That said, it’s a great idea to use `AsyncRoutes` to load those pieces only on demand. Let’s change the code from the previous snippet to match those new requirements.

```typescript
import { Component } from 'angular2/core';
import { ROUTER_DIRECTIVES, RouteConfig, AsyncRoute } from 'angular2/router';
import { ProductsComponent } from '../products/products';
import { CustomersComponent } from '../customers/customers';

@Component({
  selector: 'async-routes-app',
  directives: [ROUTER_DIRECTIVES],
  templateUrl: 'app/components/app/app.html'
})
@RouteConfig([
  {path: '/customers/...', name: 'Customers', useAsDefault: true, component: CustomersComponent},
  {path: '/products/...', name: 'Products', component: ProductsComponent},
  new AsyncRoute({
    path: '/support/...',
    name: 'SupportCenter',
    loader: () => System.import('app/components/support/supportcenter').then(m=> m.SupportCenterComponent)
  }),
  new AsyncRoute({
    path: '/about',
    name: 'About',
    loader: () => {
      return System.import('app/components/about/about')
        .then(m=> m.AboutComponent);
    }
  })
])
export class AppComponent {
}

```

Here are a few exciting things happening now. First, we’ve **added** `AsyncRoute` to the import statements and pulled it from `angular2/router`. We’ve removed the import statements for both `AboutComponent` and `SupportCenterComponent` because those Components load dynamically now.

The most significant changes are made to `@RouteConfig`. We removed two regular routes and introduced two `AsyncRoute` implementations.

Take a look at both variants used for the `loader` function. For `SupportCenter` our expression is implicitly returning the `Promise` provided by `System.import().then()`. It’s important that you remember to `return` the promise! That’s why I’ve added the verbose syntax for the second AsyncRoute.

Once `SystemJS` has finished loading the files from the given URL, we’ve to specify the Component or artifact we want to use from our bundle. In both cases we’re – of course – using our required components (`m.SupportCenterComponent` and `m.AboutComponent`).

Angular assigns the payload from the promise to the route’s component property once the promise has resolved.

When transpiling those TypeScript sources to JavaScript right now, you may receive some errors because `TSD` doesn’t know `System.import`. Unfortunately, there are no definition files available for `SystemJS` at this point. Either we sit down and write our definition file right now – which is time-consuming – or we tell TSD to track `System` as a variable of type `any`. It’s not the cleanest solution, but it’s the simplest to get things working now.

To do so, add the following statement to your *TypeScript* file (I prefer such statements underneath all `import` statements.)

```typescript
declare var System: any;

```

There is more. Check out [Minko’s post, he describes in detail how to create virtual proxies to push async loading to another level](http://blog.mgechev.com/2015/09/30/lazy-loading-components-routes-services-router-angular-2).


