---
title: Use 'bower install' on Heroku
layout: post
permalink: use-bower-install-on-heroku
redirect_from: /use-bower-install-on-heroku-45990de81b5a
published: true
tags: [Frontend]
excerpt: Learn how to use bower on Heroku to manage your client-side dependencies.
featured_image: /assets/images/posts/feature_images/clouds.jpg
unsplash_user_name: Nacho Rochon
unsplash_user_ref: nacho_rochon
---

[bower.io](http://bower.io){:target="_blank"} is a fantastic tool for managing client-side dependencies. When you’re deploying a Node.js app to [Heroku](http://www.heroku.com){:target="_blank"}, you’ve to add `script` to your `package.json` file instead to get bower running right after installing your app using git.

First, you’ve to ensure that bower is part of your dependencies. Either double-check the `dependencies` object within your `package.json` or execute

```bash
npm install bower --save

```

Somewhere in your `package.json` you’ll find another object called `scripts` add a dedicated script for `postinstall` like shown in the following snippet:


```json
{
  "scripts": {
    "postinstall": "./node_modules/bower/bin/bower install"
  }
}

```

`postinstall` will be executed right after you’ve pushed a new release to Heroku and right before the `start` script is responsible for spinning up your Node.js app.


