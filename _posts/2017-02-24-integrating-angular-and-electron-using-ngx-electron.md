---
title: Integrating Angular and Electron using ngx-electron
layout: post
permalink: integrating-angular-and-electron-using-ngx-electron
published: true
tags: [Electron, Angular]
excerpt: 'ngx-electron is here to help you! If you want to write a desktop application using Angular, GitHub''s Electron is the tool of choice to bring Single Page Applications to the desktop. ngx-electron you''ll be quicker and accessing Electron''s APIs is even easier from within Angular.'
featured_image: /assets/images/posts/feature_images/2017-02-24-integrating-angular-and-electron-using-ngx-electron.jpg
---
GitHub Electron makes crafting cross-platform desktop applications really simple. You can take any existing website or *Single Page Application* (*SPA*) and just wrap it into a native container. Those containers (powered by *Chromium* and *Node.js*) could easily be distributed to all major desktop operating systems like *Windows*, *macOS* or *Linux*.

On the other side is *Angular* as a full-blown application framework for building robust *SPAs*. *Angular* makes building *SPAs* fun and provides a rich set of APIs to get everything done, inside of the client. However, sometimes you need a deeper integration. For example, you want to call into *Electron’s* main-process to execute some *Node.js* script like reading files from a directory or do some other processing using *Node.js*. In those cases, you could utilize *Electron’s* APIs.

There is an existing `@types/electron` package, which provides typings for *TypeScript* developers. But due to the fact that *Electron* is relying on a `window.require()` method, which is only available inside of *Electron’s* renderer process. Using those typings directly to access any of those APIs will result in tsc compilation errors. *Just ask Google or StackOverflow*, there are plenty of posts where developers are looking for a proper solution to get access to *Electron* APIs from within *Angular* apps.

----

There are some ugly workarounds how to achieve this, most of them actually don’t work. Some of the workarounds will help to get it **somehow** up and running. Using those workarounds results in losing all strong types provided by `@types/electron`.

That’s the reason why I wrote `ngx-electron` a small package, which wraps all the *Electron* API’s exposed to the renderer process into a single `ElectronService`.
`ngx-electron` is a frictionless way to use Electron APIs with strong types inside of *Angular* apps.
You can consume `ngx-electron` either by `npm` or `yarn`, just add it to the list of dependencies and you’re ready to go.

```bash
yarn add ngx-electron --save
# or
npm install ngx-electron --save

```

Once the package has been installed, it’s time to import `NgxElectronModule` into your `AppModule` as shown below.

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxElectronModule } from 'ngx-electron';
import { AppComponent } from './app.component';
 
@NgModule({
    declarations: [],
    imports: [
      BrowserModule,
      NgxElectronModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
 
}

```


## The ElectronService
`NgxElectronModule` provides the `ElectronService`, a simple but powerful service that could be requested from Angular Dependency Injection container.

```typescript
import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';
 
@Component({
  selector: 'my-app',
  templateUrl: 'app.html'
})
export class AppComponent {
 
    constructor(private _electronService: ElectronService) { }
    
    public playPingPong() {
        let pong: string = this._electronService
            .ipcRenderer.sendSync('ping');
        console.log(pong);
    }
    
    public beep() {
        this._electronService.shell.beep();
    }
}

```

The API offered by `ElectronService` is pretty easy, it’s just exposing all APIs accessible from within the **renderer process** as simple getters. The following list shows all available getters exposed by `ElectronService`.

```typescript
public get desktopCapturer(): Electron.DesktopCapturer;

public get ipcRenderer(): Electron.IpcRenderer;

public get remote(): Electron.Remote;

public get webFrame(): Electron.WebFrame;

public get clipboard(): Electron.Clipboard;

public get crashReporter(): Electron.CrashReporter;

public get process(): NodeJS.Process;

public get screen(): Electron.Screen;

public get shell(): Electron.Shell;

```

> **Note**: If you’re using the ElectronService outside of the renderer process, all getters will just return **null**.

In addition to those instance getters, a static getter called `runningInElectron` is also available. You can use the getter to identify if your app is currently running inside of an Electron renderer process.

```typescript
const isAnElectronApp: boolean = 
    this._electronService.runningInElectron;
```


As you can see, IntelliSense is working perfectly in IDEs like *WebStorm* or editors like *Atom*.

{% include image-caption.html imageurl="/assets/images/posts/2017/ngx-electron-1.png" 
title="IntelliSense for Electron's APIs in Angular" caption="IntelliSense for Electron's APIs in Angular" %}

You can find the package on [npmjs](https://www.npmjs.com/) and of course, all [code is hosted on GitHub](https://github.com/ThorstenHans/ngx-electron/). If you’ve any other Electron API that’s missing in the current version, either submit a pull request or file an issue. 

I hope `ngx-electron` will make integration of *Angular* and *Electron* APIs a bit easier for *Angular* developers out there. If you like the post please share it on Twitter 😜
