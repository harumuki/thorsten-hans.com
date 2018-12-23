---
title: Standard Angular Pipes and ng-translate
layout: post
permalink: standard-angular-pipes-and-ng-translate
published: true
tags: [Angular]
excerpt: internationalization is important if you build Angular applications for a bigger audience. Learn how to use standard Angular pipes with ng-translate
featured_image: /assets/images/posts/feature_images/2017-02-23-standard-angular-pipes-and-ng-translate.jpg
---
Of course is *Angular* itself shipping with some *i18n* (internationalization) APIs, but [ng-translate](https://github.com/ngx-translate/core) has become the new default for many developers to provide translations within *Angular* apps.

Personally, I prefer `ng-translate` over built-in i18n APIs because it is fast, easy to explain and it allows to run multilingual apps without having the requirement to have dedicated hosting for each language.

One of the disadvantages is, that `ng-translate` doesn’t provide *Pipes* as *Angular* does. *Angular* ships twelve useful *Pipes*, including things like `DecimalPipe`, `DatePipe` or the `CurrencyPipe`. Some of those standard *Pipes* offer a simple way to format values directly within *HTML* templates. 

The standard *Angular* pipes are implemented relying on the `LOCALE_ID` value (which is consumed by Dependency Injection) and the actual formatting logic which unfortunately **NOT** injected by Dependency Injection. As a developer, you can specify the `LOCALE_ID` by using the `providers` array as Dependency Injection container configuration. This could be done for example within `NgModule` metadata.

```typescript
import { LOCALE_ID } from '@angular/core';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [],
    imports: [],
    bootstrap: AppComponent,
    providers: [
        { provide: LOCALE_ID, useValue: window.navigator.language }
    ]
})
export class AppModule {
}

```

This works great when you want to set the language for your app once. **But it doesn’t work, if you want to change the language during runtime**.


## Using ng-translate
By using `ng-translate` you can register multiple languages easily from within the app by using `TranslateService.addLangs`.

```typescript
@Component()
export class RootComponent implements OnInit {

    constructor(private _translateService: TranslateService) { }
    
    public ngOnInit(): void {
        this._translateService.addLangs(['en-US', 'de-DE']);
    }
}

```

Once languages were added, you can utilize the `TranslateService.use` method to switch between the registered languages at runtime. Imagine you’ve implemented a simple language switcher component like shown below.

```typescript
import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate';

@Component({
    selector: 'language-switcher',
    template: `<ul>
      <li *ngFor="let l of languages" (click)="use(l)>{{l}}</li>
     </ul>`})
 export class LanguageSwitcherComponent implements OnInit {
 
     constructor(private _translateService: TranslateService) { } 
     
     public languages: Array<string> = [];
     
     public ngOnInit(): void {
         this.languages = this._translateService.getLangs();
     }
     
     public use(languageKey: string): void {
         this._translateService.use(languageKey);
     }
 }

 ```

Having this up and running in your app, it may be a bit frustrating to see `DatePipe` and all the others not respecting the language change. But there is a simple way to achieve this, without rewriting the logic provided by Angular as part of the Pipes.

## Creating proxy pipes

Internally all the formatting Pipes from *Angular* are using static classes like `DateFormatter` instead of relying on DI. Because of this and because some initial validation and transforming is also implemented in the transform method itself, the best solution is to create a kind of proxy pipe. Having everything under control, you’ve just to ensure that both, the **selector** and the parameter handling for the **transform** method are identical to the original Pipe offered by the framework.

The following snippet demonstrates how to implement a Proxy for *Angular’s* `DatePipe`:

```typescript
import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from 'ng2-translate';
@Pipe({
    name: 'date'
})
export class DatePipeProxy implements PipeTransform {

    constructor(private _translateService: TranslateService) {

    }

    public transform(value: any, pattern: string = 'mediumDate'): any {
        let ngPipe = new DatePipe(this._translateService.currentLang);
        return ngPipe.transform(value, pattern);
    }

}

```

As you can see, the `TranslateService` will be injected into the constructor and used within the `transform` method to pass the currently selected language to the default `DatePipe`. By reusing the entire `DatePipe`, you can ensure that formatting behaves like before. Once the Proxy Pipe has been implemented, you’ve to add it to the `declarations` section of your module.

```typescript
@NgModule({
    declarations: [
            DatePipeProxy, 
            //...
        ]})
export class AppModule {
}

```

Now all the formats within your app should automatically be updated if you change the app display language using `ng-translate`. If you want to see a working sample, go and check [out my sample repo on GitHub](https://github.com/ThorstenHans/angular-i18n-by-example/).
