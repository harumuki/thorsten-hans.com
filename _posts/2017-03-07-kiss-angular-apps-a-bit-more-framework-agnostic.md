---
title: "KISS \U0001F618 Angular apps a bit more framework agnostic"
layout: post
permalink: kiss-angular-apps-more-framework-agnostic
redirect_from: /2017-03-07_KISS----Angular-apps-a-bit-more-framework-agnostic-80d84e07663a
published: true
tags: [Angular]
excerpt: 'This post describes how to build Angular apps more framework-agnostic. Following the simple samples in this post will make your code more reusable. '
featured_image: /assets/images/posts/feature_images/2017-03-07-kiss--f0-9f-98-98-angular-apps-a-bit-more-framework-agnostic.jpg
---
More and more developers are jumping on the *Angular* train in these days. *Angular* is awesome 💚🤘🏼 but it's just a framework, a framework that may be replaced at some point in time by the next big thing.

>Hopefully, the next big thing will also be an Angular thing 😀

But to be honest, nobody can tell. Fast forward a few years and you'll find yourself being responsible for migrating an existing old *Angular* `4.0.0` app to the cool, new kid.
As soon as this will happen, you'll hopefully remember this post. I'm going to share small, easy to adopt steps to make your *Angular* apps a bit more *framework agnostic*.

----

Another reason why you should try to write your app as framework agnostic as possible, is investment protection. Plain *JavaScript* or *TypeScript* code has a longer durability than SPA-Framework based code. In addition, the integration into various SPA-Frameworks is of course easier. You don't have to extract your code from the one SPA-Framework before you can integrate it into the other one. 

## Services in Angular

Services are almost framework agnostic in *Angular*. Services may be marked with the `@Injectable()` annotation. You can separate this framework stuff from the implementation easily, by using simple inheritance.

```typescript
export class FooService {
    public doSomething(): boolean {
        // some complicated logic
        return true;
    }
}

```

In order to make this service injectable, let's create another class.

```typescript
import { Injectable } from '@angular/core';
import { FooService } from './fooService';

@Injectable()
export class FooServiceRef extends FooService {

}

```

We've now separated the logic from framework stuff, our `doSomething` method has no binding to *Angular*.

Finally, let's configure the DI. Instead of adding the configuration directly on `NgModule`, go and create a `providers.ts` file directly inside your `services` folder.

```typescript
import { Provider } from '@angular/core';
import { FooService } from './fooService';
import { FooServiceRef } from './fooServiceRef';

export const ALL_PROVIDERS: Provider[] = [
    { provide: FooService, useClass: FooServiceRef }
];


Update you `NgModule` and load the DI configuration for services from `providers.ts`.

```typescript
import { NgModule } from '@angular/core';
import { ALL_PROVIDERS } from '../services/providers';

@NgModule({
    imports: [],
    declarations: [],
    providers: [...ALL_PROVIDERS]
})
export class AppModule { }

```

As you can see, I've removed some default things like `imports` and `declarations` from the module metadata to keep the snippet short.

## Angular Pipes

Pipes are another building block offered by the framework, that may contain custom logic. To remove the coupling from your custom logic and the stuff required by *Angular*, you can reuse concepts that you already know.
If the logic has no dependencies to other services, you can just push your logic to a *static class*.

```typescript
import { Pipe, PipeTransform } from '@angular/core';
import { Customer } from '../models/customer';
import { TransformService } from '../services/transformService';

@Pipe({ 
    name: 'customerName'
})
export class CustomerNamePipe implements PipeTransform {

    public transform(value: any, args: any[]): any {
        return TransformService.toCustomerName(<Customer>value);
    }
            
}

```

The `TransformService` is straightforward.

```typescript
import { Customer } from '../models/customer';

export class TransformService {

    public static toCustomerName(value: Customer): string {
         return value && value instanceof Customer ? 
               `${value.lastName}, {$value.firstName}` : null;
    }

}

```

If your custom pipe has dependencies to other services, you can reuse the service approach, I've shown at the beginning of the post. In this case, you would create a `TransformService` and a `TransformServiceRef` class. Instead of implementing the methods as `static`, you can build regular instance methods again.

```typescript
import { Pipe, PipeTransform } from '@angular/core';
import { Customer } from '../models/customer';
import { TransformService } from '../services/transformService';

@Pipe({ 
    name: 'customerName'
})
export class CustomerNamePipe implements PipeTransform {

    constructor(private _transformService: TransformService) { }

    public transform(value: any, args: any[]): any {
        return this._transformService
            .toCustomerName(<Customer>value);
    }
                
}

```

Here base services classes, which contains the entire custom logic.

```typescript
import { Customer } from '../models/customer';
import { SomeDependency } from './someDependency';

export class TransformService {

    constructor(protected _dep: SomeDependency) { }

    public toCustomerName(value: Customer): string {
        this._dep.doSomething();
        return value && value instanceof Customer ? 
               `${value.lastName}, {$value.firstName}` : null;
    }

}

```

And the `TransformServiceRef`

```typescript
import { Injectable } from '@angular/core';
import { SomeDependency } from './someDependency';

@Injectable()
export class TransformServiceRef extends TransformService {

    constructor(dep: SomeDependency) {
        super(dep);
    }

}

```

## HTTP
Get rid of `Http` 😜. Instead of using *Angular's* Http Service, you could either use the `fetch` API or at least create an abstraction layer on top of *Angular's* `http`. In this post, I'll demonstrate how to implement `fetch` instead of abstracting `http`. Unfortunately `fetch` isn't supported by all browsers, but there is a [tiny polyfill for `fetch`](https://github.com/github/fetch){:target="_blank"}.

See the following sample, it's demonstrating how to use `fetch` inside of a simple TypeScript class.

```typescript
import { Starship } from '../models/starship';

export class StarshipService {

  public getAll(): Promise<Array<Starship>> {
    return fetch('http://swapi.co/api/starships/')
      .then((resp) => resp.json())
      .then((resp) => resp.results);  
    }

}

```

Now it's time to integrate our implementation again with *Angular*.

```typescript
import { Injectable, NgZone } from '@angular/core';
import { Starship } from '../models/starship';
import { StarshipService } from './starshipService';

@Injectable()
export class StarshipServiceRef extends StarshipService {

    constructor(private _ngZone: NgZone) { }

    public getAll(): Promise<Array<Starship>> {
        return new Promise((resolve, reject) => {
            fetch('http://swapi.co/api/starships/')
                .then((resp) => resp.json())
                .then((resp) => {
                    this._ngZone.run(()=>{
                        return resolve(resp.results);
                    });
                })
                .catch(error => reject(error));
        });
    }

}

```

Don't forget to update your DI registration. Again, it's simple as:

```typescript
{ provide: StarshipService, useClass: StarshipServiceRef }

```

Depending on your TypeScript Compiler `tsc` version, you may receive an error like: `ERROR in /Users/th/dev/fetchsample/src/services/starshipServiceRef.ts (10,13) Cannot find name 'fetch'`.

This happens if typings for `fetch` aren't installed in the scope of the project. You can fix this by executing:

```bash
yarn add @types/isomorphic-fetch --save-dev
#or
npm install @types/isomorphic-fetch --save-dev

```

*Microsoft* will include typings for fetch according to [this issue on GitHub](https://github.com/Microsoft/TypeScript/issues/4948){:target="_blank"}

## Involve the server  - if possible

Finally, I want to talk about client-server communication. This is more about how to architecture your *SPA* instead of providing a dedicated code snippet. Especially opinions like the following are a great reason to start a discussion and I'd love to get yours!

*JavaScript*, awesome browsers, mighty frameworks like *Angular* or *React*, all those things are powerful, but we should not forget about the server.

> If you're looking for real processing power, use the server.

Servers are easy to scale, clients not, clients are limited to the available resources offered by the device. We as developers should keep that in mind when building rich SPAs. Frameworks like *Angular* or *React* are offering a great set of functionalities, but it's not always the best choice to do everything inside of the client.
There are no hard rules that tell you, when to use the client or when to use the server. It's also depending on the type of client; your customer is using. Are you focusing on mobile phones? Is your app being executed inside of a local network?

Depending on those (and many more) questions you've to decide if it's better to reduce the number of HTTP calls between app and API or to increase that amount of calls but move more logic from the app to the server-side API.

When designing an API, we try to build those as close to the use-case as possible. If the client wants to render a complex mashed up dashboard, a **single** `HTTP` call is enough to get **all the expected data** (the data will also be sorted in the correct order).
