---
title: Developer presentations using reveal.js
layout: post
permalink: developer-presentations-using-reveal-js
redirect_from: /2015-02-19_Developer-presentations-using-reveal-js-2ef5c270b59a
published: true
tags: [Tools, Productivity]
excerpt: Are you speaking at user groups or conferences? As a developer we would love to code our presentations. With reveal.js you can finally do it. Read this article and get started with Presentations as Code (PaC)
featured_image: /assets/images/posts/feature_images/2015-02-19-developer-presentations-using-reveal-js.jpg
---

[reveal.js](https://github.com/hakimel/reveal.js/){:target="_blank"} has been around for a while. I saw many people using it for their presentations (for example [AC](http://www.andrewconnell.com/blog){:target="_blank"}). AC also wrote [a great article](http://www.andrewconnell.com/blog/using-github-for-developer-technical-presentations-post-mortem){:target="_blank"} on how he is organizing his presentations on GitHub using reveal.js.

AC’s idea is cool, but I wanted something **more** something which is less pain, I don’t want to set up a **gh-pages** branch on every repo I create for my demos.

Instead, I built a **presentation hub** using reveal.js and some simple [Gulp.js](http://gulpjs.com){:target="_blank"} tasks.

The idea is to publish presentations in the same look and feel in no-time. I ended up with some markdown files being generated on the fly by the gulp tasks and replacing simple tokens for any new presentation.

You can see my presentation hub live at [http://thorstenhans.github.io](http://thorstenhans.github.io){:target="_blank"}.

{% include image-caption.html imageurl="/assets/images/posts/2015/revealjs-1.png"
title="Thorsten's presentation hub" caption="Thorsten's presentation hub" %}

From a user perspective, it’s straightforward. If I start a new presentation, I’ve to execute

```bash
gulp add-presentation --title 'Awesome Topic' --repo 'awesome-topic'

```

The task itself will generate the new presentation for you and link it on the hub site.

The code is available [here](https://github.com/ThorstenHans/thorstenhans.github.io){:target="_blank"}

Note

Currently, there is only a placeholder presentation on my presentation hub. 😀
