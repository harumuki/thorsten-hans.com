---
title: Productivity boost with SublimeText Plugins
layout: post
permalink: productivity-boost-with-sublimetext-plugins
redirect_from: /2013-04-18_Productivity-boost-with-SublimeText-Plugins-6873d0e54219
published: true
tags: [Tools, Productivity]
excerpt: Sublime Text is a mighty editor with a great plugin ecosystem. In this article, I'll share my minimal, fast and yet powerful Sublime text plugin combination.
featured_image: /assets/images/posts/feature_images/productivity.jpg
unsplash_user_ref: carlheyerdahl
unsplash_user_name: Carl Heyerdahl
---

For developing native web languages I use SublimeText 2 ([http://www.sublimetext.com/](http://www.sublimetext.com/)). Like many other editors, SublimeText offers a great plugin ecosystem, which allows you as a developer to add various functionality by installing additional packages.

{% include image-caption.html imageurl="/assets/images/posts/2013/sublime-logo.png"
title="Sublime Text" caption="Sublime Text" %}

Within this post I’ll introduce some plugins I’m using to increase my developer performance.

## Package Control

Package Control is the most robust and vital plugin; it allows you to add new plugins to sublime without typing endless commands into the console or manually copying files to the application directory. To install Package Control, you’ve to execute the following script from Sublime Text’s Console

```python
import urllib2,os; pf='Package Control.sublime-package'; ipp=sublime.installed_packages_path(); os.makedirs(ipp) if not os.path.exists(ipp) else None; urllib2.install_opener(urllib2.build_opener(urllib2.ProxyHandler())); open(os.path.join(ipp,pf),'wb').write(urllib2.urlopen( 'http://sublime.wbond.net/'+pf.replace(' ','%20')).read()); print 'Please restart Sublime Text to finish installation'

```

## Emmet

Emmet (previously known as Zen Coding) is excellent for creating HTML elements because you’re typing a kind of CSS Selector style statements and Emmet is automatically creating the corresponding HTML for you.

{% include image-caption.html imageurl="/assets/images/posts/2013/sublime-emmet.png"
title="Sublime Text - Emmet Plugin" caption="Sublime Text - Emmet Plugin" %}

## JavaScript Minifier

Crunch your JavaScript files by using Google Closure Compiler (`CTRL` + `ALT` + `m`)

## Tag

`Tag` is excellent for developers writing much declarative code. It will automatically add closing tags when you write the opening one.

## Search Stackoverflow

Instant StackOverflow Search Plugin. But-Saver 😉

## Git

Adds Git support to Sublime Text including built-in Diff Viewer. This plugin is one of the best time savers for me.

{% include image-caption.html imageurl="/assets/images/posts/2013/sublime-git.png"
title="Sublime Text - Git Plugin" caption="Sublime Text - Git Plugin" %}

## CoffeeScript

Allows you to write CoffeeScript in Sublime Text and offers features like

- Syntax Highlighting
- Snippets
- Assertions

## CoffeeCompile

Compile your CoffeeScript file directly from within SublimeText 2 [`CTRL` + `SHIFT` + `C`]

## Node.js

Allows you to write Node.js in SublimeText and offers features like

- Syntax Highlighting
- Snippets
- Assertions

### nodejsLauncher

Launch your Node.JS file directly from the editor [`CTRL` + `ALT` + `n` + `r`]

## Summary

There are of course plenty more good plugins available for SublimeText. These are just a few plugins I use frequently.

Is there an essential plugin missing, do you use a plugin that should be listed here? Leave a comment and share your knowledge with the community.


