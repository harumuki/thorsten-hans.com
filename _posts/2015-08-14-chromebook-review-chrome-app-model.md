---
title: Chromebook review / Chrome App Model
layout: post
permalink: chromebook-review-chrome-app-model
redirect_from: /2015-08-14_Chromebook-review---Chrome-App-Model-bb7bc7977a11
published: true
tags: [Tools]
excerpt: I bought a Chromebook because I want to dig a bit deeper into the Chrome App Model from a developers perspective. Check out what happened...
featured_image: /assets/images/posts/feature_images/2015-08-14-chromebook-review-chrome-app-model.jpg
unsplash_user_ref: nate_dumlao
unsplash_user_name: Nathan Dumlao
---
Today I received my **Acer C720P Touch** Chromebook. I've used it now for around about two hours. It is a stunning device, double check the price on Amazon it's about $280 (199€ in Germany) [Amazon Deeplink](http://www.amazon.com/Acer-Chromebook-11-6-Inch-Touchscreen-Moonstone/dp/B00H7WF22K/ref=sr_1_1?ie=UTF8&qid=1439573518&sr=8-1&keywords=acer+c720p){:target="_blank"}!

## Some technical details

- Intel Celeron Processor 2955U
- 2 Gigs of RAM
- 16 Gigs SSD
- 11.6” Screen @ 1366×768 pixels
- TouchScreen
- Multi-Gesture TouchPad
- 7.5 hrs Battery Lifetime

## First Impressions

As you can see in the picture below, the device looks pretty good, and you may recognize the glossy display. The keyboard is good for programming, but it's a bit small for my hands.

{% include image-caption.html imageurl="/assets/images/posts/2015/chromebook-1.jpg"
title="My new Chromebook - Acer P720P Touch" caption="My new Chromebook - Acer P720P Touch" %}

{% include image-caption.html imageurl="/assets/images/posts/2015/chromebook-2.jpg"
title="My new Chromebook 2 - Display close-up" caption="My new Chromebook 2 - Display close-up" %}

The touchpad supports some basic gestures, but after 10 minutes I've connected an external mouse. The system performance is okay — startup is, but I/O related stuff may take a few msecs/secs/mins (depending on how you define I/O related stuff) more than on a mac 🙂

## Why did I bought a Chromebook

There was only one reason, the Chrome App Model. The Chrome App Model gives you a small set of powerful API's which you — as a dev — can use to build Apps for all platforms. Moreover, with “all” I mean all, not only desktop platforms. Because Chrome Apps are built using conventional frontend technologies such as HTML, JavaScript (or DART) and CSS you can use tools like Cordova or Ionic to bring the same codebase also to mobile platforms.

Google is Offering Chrome Apps for Mobile (MCA) which is a superset on top of Apache Cordova, bringing all the `chrome` APIs to the mobile platform. MCA is available for free at [https://github.com/MobileChromeApps/mobile-chrome-apps](https://github.com/MobileChromeApps/mobile-chrome-apps){:target="_blank"}.

## What does all platforms mean

When saying all platforms, again and again, I have the following list in mind

- OS X
- Linux
- ChromeOS*
- Windows
- iOS
- Android

> *By the way*: Chrome Apps are the only development model for bringing new bits to ChromeOS!

Sure there are some other platforms like Windows Phone and Blackberry, but for those *misfits* is no support right now.

## What are Chrome pps

Instead of executing within the browser, Chrome Apps may run with a “native-like” experience and behave even more like native Apps. The typical browser address-bar is also not visible within Chrome Apps which prevents users from navigating away or providing invalid URLs or something like that.

Chrome Apps are sandboxed by default, to access any capabilities, Chrome Apps have to ask for them. As a user, you can double check the requested permissions of an App before installing it from the Chrome Web Store. In addition to the sandboxing model, Apps can't download or execute any script, text, images or something else from remote locations if those are not named explicitly. Also, again you as a user have **full transparency and control** over all those things.

Chrome Apps should be designed offline-first. However, what does that mean? Offline first means that your App should work without any connectivity. If your app can function without a network connection, then your app will receive a particular tag within the Web Store which is in these days as a kind of promotion.

{% include image-caption.html imageurl="/assets/images/posts/2015/chrombook-todo-mvc.png"
title="Chrome Apps on the Chromebook and on Android" caption="Chrome Apps on the Chromebook and on Android" %}

Source: [https://github.com/MobileChromeApps/mobile-chrome-apps](https://github.com/MobileChromeApps/mobile-chrome-apps){:target="_blank"}

## What's next

As already mentioned, I've spent only two ours with the Chromebook until now, but within that time I wrote an entire Chrome App that is already on it's the way to the Chrome web store. As soon as the App becomes available I'll recap the entire process of writing such an app and how to bring it to the store.


