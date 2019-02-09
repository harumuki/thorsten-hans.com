---
title: NW.js and Electron compared
layout: post
permalink: nw-js-and-electron-compared
redirect_from: /2016-02-09_NW-js-and-Electron-compared-6addc46dc283
published: true
tags: [Electron, NWjs]
excerpt: null
featured_image: /assets/images/posts/feature_images/2016-02-09-nw-js-and-electron-compared.jpg
---

I’ve spent much time doing cross-platform development over the past year with a significant workload on **cross-platform desktop** development.

During that time, I found some customers and blog readers asking me if they should go for **NW.js** or if they should go direction **Electron**. There is no quick answer to this question. It’s this kind of question that has to be answered with **It depends**.

----

I’ve used both frameworks for real projects in the past, and both of them worked great for the given projects. Neither *Electron* nor *NW.js* is perfect (but they’re close to it) 😃. Each has its pitfalls. However, the communities behind those frameworks are fantastic and keep on answering quickly to questions popping up on GitHub or in tools like Gitter or Slack.

There is already a post on the web comparing both from various perspectives, but the post [(available here)](http://tangiblejs.com/posts/nw-js-electron-compared){:target="_blank"} is a bit outdated. Especially *Electron* has evolved a lot since the linked post has been published. So it’s time to compare both frameworks again with all the information publicly available by **February 2016**.

I’ve created a [simple, public sheet on Google](https://docs.google.com/spreadsheets/d/1U56oAazygJiFepW7U2HSTSLox7OvG4Jc9ENUznGEICk/edit?usp=sharing){:target="_blank"} which allows anyone to **leave comments** in it. 


## Some soft-facts

Since the first public release of [Visual Studio Code](http://code.visualstudio.com){:target="_blank"} -  which is built using *Electron* -, the framework gained a lot more attention and tracktion than before.

Since *July 2015*, we’re waiting for a new *NW.js* release which has to move all new features and the highly required dependency updates (like migrating from `io.js` to latest `Node.js`) from beta status to a release candidate. Testing stuff on beta software is excellent, but shipping "real-world" products on beta frameworks doesn't work!

**If you compare both frameworks based on non-beta releases** *Electron* is far ahead. However, I believe in the team building *NW.js* to ship their great beta as soon as possible.

Besides the hard facts listed in the Google Sheet, you and your team should invest some time and look at both frameworks. There are some differences when it comes to architecture and usage from a developers perspective. Make yourself comfortable with *Electron* and *NW.js*. Decide which one fits better to your needs. Currently, both are under active development, so chances are pretty good that both exist for a long time from now (whatever that means in this age) 😃.

## Summary

In the end, it’s once again a personal decision which depends on your requirements. I’ve used *NW.js* for about 6 months before I moved to *Electron*. Since that point in time, I’m only using *GitHub’s Electron* for customer workloads. However, that's personal preference. Both bring your HTML5 app to Windows, Linux, and macOS.


