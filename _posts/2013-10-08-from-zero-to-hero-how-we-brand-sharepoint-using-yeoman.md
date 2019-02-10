---
title: From Zero to Hero — How we brand SharePoint using Yeoman
layout: post
permalink: from-zero-to-hero-how-we-brand-sharepoint-using-yeoman
redirect_from: /2013-10-08_From-Zero-to-Hero---How-we-brand-SharePoint-using-Yeoman-c1d4b5365f4a
published: true
tags: [Frontend, SharePoint]
excerpt: Learn how we build SharePoint branding projects using latest frontend technologies such as Yeoman, CoffeeScript, Pug and SASS
featured_image: /assets/images/posts/feature_images/branding.jpg
unsplash_user_name: Dose Media
unsplash_user_ref: dose

---

Branding SharePoint has been taken to a new level with SharePoint 2013; you can now easily brand your SharePoint (on Premises and Demand) by using HTML MasterPages and HTML PageLayouts. This step allows many design agencies to brand SharePoint sites without digging deep into SharePoint Insights. About a year ago Experts Inside was faced with the first huge (really huge) SharePoint 2013 project were we had to provide both custom MasterPages and custom PageLayouts. Starting with HTML was fine, but after a few days working on these artifacts, we recognized that the development workflow isn’t as smart as it could be. Kevin Mees (one of our developers) started with combining both, latest SharePoint capabilities and latest web development tools. After some iterations, we’ve built an incredible development workflow for branding SharePoint portals using the latest languages such as

- Jade
- CoffeeScript / TypeScript
- SASS Combined

by the fastest web development workflow, you’ve ever seen  - [yeoman](http://yeoman.io){:target="_blank"}.

{% include image-caption.html imageurl="/assets/images/posts/2013/yo-1.png"
title="Yeoman" caption="Yeoman" width="280" %}

*Yeoman* itself is a composition of great tools driven by the web development community around the world. *yo* which is responsible for scaffolding new projects; grunt which is the most popular task-runner based on JavaScript and last but not least bower a client-side dependency manager.

{% include image-caption.html imageurl="/assets/images/posts/2013/yo-2.png"
title="Modern Frontend Setup" caption="Modern Frontend Setup" %}

Throughout this article series I’ll first explain some essential things about yeoman that every web developer has to know before I move over to the SharePoint related stuff. Here is the outline for the upcoming posts on this topic

1. [This Introduction]({% post_url 2013-10-08-from-zero-to-hero-how-we-brand-sharepoint-using-yeoman %})
2. [Yeoman the web development workflow]({% post_url 2013-10-18-yeoman-the-web-development-workflow%})
3. [An Introduction to Pug (aka Jade)]({% post_url  2013-10-22-an-introduction-to-jade %})
4. [An Introduction to CoffeeScript]({% post_url 2014-02-14-an-introduction-to-coffeescript %})
5. [An Introduction to SASS]({% post_url 2014-02-18-an-introduction-to-sass %})

I tried to keep the number of posts as small as possible, but because many SharePoint’ers out there have never seen real web development using technologies as Jade, CoffeeScript or SAAS, I’ve to give them a rough introduction for these languages.



