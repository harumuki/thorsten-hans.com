---
title: Write your own ShareCoffee AddOns using the yeoman generator
layout: post
permalink: write-your-own-sharecoffee-addons-using-the-yeoman-generator
redirect_from: /write-your-own-sharecoffee-addons-using-the-yeoman-generator-9c251fe25a6c
published: true
tags: [ShareCoffee, Frontend]
excerpt: You can write your own, custom Add-Ons for Yeoman using the brand new sharecoffee-addon generator. Get started with ShareCoffee Add-Ons now.
image: /announcement.jpg
unsplash_user_name: Matt Botsford
unsplash_user_ref: mattbotsford
---

Today I’ve published a new yeoman generator which allows you to create new *ShareCoffee* Add-Ons easily. ([view on GitHub](https://github.com/ThorstenHans/generator-sharecoffee-addon){:target="_blank"}) If you haven’t heard of *Yeoman*, you should check out its website at [yeoman.io](http://yeoman.io){:target="_blank"}.

By using such a yeoman generator, you can start building web-apps or –in this case– *ShareCoffee* Add-Ons in no time.

Moreover, the best advantage is: All these frameworks and tools are based on *Node.js* and can be used from any platform running *Node.js*. (Also a low budget Chromebook can run *Node.js*).

Once you’ve installed the *Yeoman* tools as described on yeoman's website you install my latest generator using

```bash
npm install generator-sharecoffee-addon –g

```

Right now your system is configured for writing *ShareCoffee* Add-Ons. Creating a new Add-On is straight forward as described in the following shell script.

```bash
# Ensure that nodejs is installed on your system

# Install yeoman globally
npm install yo -g
# on unix systems or macs you should use sudo when installing global packages
sudo npm install yo -g #MAC/LINUX

# Install generator globally
npm install generator-sharecoffee-addon -g

# Create a project directory and go there
mkdir FooBar
cd FooBar

#Invoke yeoman and pass the generator
yo sharecoffee-addon

#execute unit tests
grunt test

#build the addon
grunt build

#build the addon and automatically generate the nuget packge (Windows Only)
grunt default
#or just
grunt

```

The *Yeoman* generator asks you a couple of questions about your new Add-On and generates all the required files and directories for you. After generating everything it automatically invokes `npm install` which pulls all dependencies from the web an installs them (isolated to the project directory).

I created a quick video which should demonstrate how this could look like on a Mac.

<iframe width="560" height="315" src="https://www.youtube.com/embed/NpNC2SWSxJg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


