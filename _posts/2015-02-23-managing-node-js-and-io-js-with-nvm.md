---
title: Managing Node.js and io.js with NVM
layout: post
permalink: managing-node-js-and-io-js-with-nvm
redirect_from: /managing-node-js-and-io-js-with-nvm-b7ab849855d5
published: true
tags: [Tools, Productivity]
excerpt: 'Are you using Node.js or io.js? If so, you should know NVM, the Node Version Manager. This article explains how to get started with NVM and how to use it on a daily basis.'
image: /2015-02-23-managing-node-js-and-io-js-with-nvm.jpg
---

Are you building Node.js Apps? **Use NVM**!

If you haven’t seen *NVM* (Node Version Manager) in action, go and install it now. I can’t imagine working with Node.js based projects without *NVM*. I wrote this short post because I saw a friend of mine doing some first steps in Node.js without having NVM installed. So instead of explaining him the basics on a phone call, I wrote this summary, which I’d like to share with you.

Working on multiple JavaScript based projects can be cumbersome. In the past developers had to manage different [Node.js](http://nodejs.org){:target="_blank"} versions locally and switch them for every project they’re involved.

Since the beginning of 2015, [io.js](http://iojs.org){:target="_blank"} may also be part of many JavaScript developer’s toolbelts. So managing all those frameworks is — again — a little bit more effort.

I’ve been using [RVM](http://rvm.io){:target="_blank"} in the past to deal with the different Ruby installations on my machines. What RVM offers for Ruby, is [NVM](https://github.com/creationix/nvm){:target="_blank"} for the JavaScript developer. I’m using NVM for more than a year now, and it’s a big time-saver for me.

Besides managing the local NodeJS installations, it also offers me the ability to quickly test any app for platform upgrades. A few weeks ago I started a new NodeJS based project which I’m currently developing besides my regular work. NVM allows me to switch the current node version easily by executing

```bash
nvm use stable
# or
nvm use v0.12.0

```

Use `nvm ls` to see which versions are installed locally, when executing `nvm ls-remote` you’ll see a list of all available Node.js and io.js versions. Installing a new version is simple. Just execute `nvm install iojs-v1.3.0` to install the most recent ioJS version on your system. Installing io.js using NVM does not change something – for the first view.

To switch from Node.js to io.hs you’ve to execute `nvm use iojs-v1.3.0`. From this point, all your Node calls will be forwarded to the local installation of io.js v1.3.0.

You can see which framework you’re currently running by executing.

```bash
nvm current

```

To uninstall a version from your system, type `nvm uninstall iojs-v1.3.0`

As you can see, it’s pretty simple to get started with NVM. The most significant advantage in my eyes is that you don’t lose the flexibility of changing the node engine once your environment has been set up. As mentioned during the introduction you can switch versions based on your projects in no time.
