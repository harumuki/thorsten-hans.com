---
title: Frontend build series introduction
layout: post
permalink: frontend-build-series-introduction
redirect_from: 
  - /2015-10-08_Frontend-build-series-introduction-8743add5d978
  - /2015-10-08_Frontend-build-series-introduction-3a8abc53d327
published: true
tags: [Build, Gulp.js]
excerpt: Kill all humans! No not really, this post is the introduction for the Frontend Build article series. It'll explain how to automate critical steps when building Frontend applications.
featured_image: /assets/images/posts/feature_images/frontend-builds.jpg
unsplash_user_name: Iker Urteaga
unsplash_user_ref: iurte
---

Here at *Thinktecture*, we’re focusing on cross-platform apps, and we’re optimizing our development workflow continuously to push boundaries when it comes to development performance. I found myself again falling in love with creating fast and super awesome build processes. I want to use today's lunchtime to write this short introduction post. So in the upcoming weeks, I’ll share some cool things around cross-platform builds. If you haven’t heard of *Gulp.js*, it could be a bit difficult to follow the series because I will not publish an introduction for *Gulp.js*. Do some research on *Gulp.js* to understand the critical concepts of *Gulp.js*.

## What you need

Well, you need three things in your system. First, you need a good configured terminal. If you’re still using the default OS-X terminal, go and read [my article on how to setup iTerm and the incredible oh-my-zsh on your Mac]({{ "/setting-up-iterm2-with-oh-my-zsh-and-powerline-on-osx" | absolute_url }}). Second is, of course, a working installation of *Node.JS*. I highly recommend you to use NVM for dealing with different Node.JS versions on a single system in no-time. There is [also an article that covers nvm]({{ "/managing-node-js-and-io-js-with-nvm" | absolute_url}}). Check those out, they're worth reading! Last but not least you will need a good editor to write all the build tasks. I’m using *Sublime Text 3* for most of the time. So you should double-check *Sublime Text 3* and make yourself comfortable with all the *plugins*, *themes*, and *settings*.

## What you will get

Within the first post, I’ll share a sample SPA project on GitHub which I’m using through all posts as an example. The sample app (note taking app) is written using Angular.JS and Angular Material. If you haven’t done some Angular yet, it’s now time to get started. I’ll also share some of my *Sublime Text 3* snippets which will make building Gulpfiles a no-brainer.

## Talking points

- building Angular SPAs
- contextual frontend builds
- building cross-platform desktop apps
- building cross-platform mobile apps
- making Gulpfiles readable and maintainable
- creating self-documenting Gulpfiles
- build as dependency

## Get started ...

 * [Introducing the Frontend Builds Article Series]({{ "/frontend-build-series-introduction" | absolute_url }})
 * [Frontend Builds 1: Getting Started ]({{ "/frontend-builds-1-getting-started" | absolute_url}})
 * [Frontend Builds 2: Readable and Pluggable Gulpfiles  ]({{ "/frontend-builds-2-readable-and-pluggable-gulp-files" | absolute_url}})
 * [Frontend Builds 3: Cross-Platform Desktop Builds]({{ "/frontend-builds-3-cross-platform-desktop-builds" | absolute_url}})
 * [Frontend Builds 4: Building Cross-Platform Mobile Apps]({{ "/frontend-builds-4-building-cross-platform-mobile-apps" | absolute_url}})
 * [Frontend Builds 5: Build as a Service (BaaS)]({{ "/frontend-builds-5-build-as-a-service-baas" | absolute_url}})
 * [Frontend Builds 6: Configurable builds]({{ "/frontend-builds-6-configurable-builds" | absolute_url}})
 * [Frontend Builds 7: Conditional Build Tasks]({{ "/frontend-builds-7-conditional-build-tasks" | absolute_url}})
