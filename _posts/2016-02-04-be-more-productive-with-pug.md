---
title: Be more productive with Pug
layout: post
permalink: be-more-productive-with-pug
published: true
tags: [Pug]
excerpt: null
featured_image: /assets/images/posts/feature_images/2016-02-04-be-more-productive-with-pug.jpg
---

*Pug* (previously known as *Jade*) is like *HTML* on steroids. Once learned, you’ll never miss it. This article isn’t my first post on *Pug*. I had already written an article about it back in 2013 when it still was called *Jade*. If you didn’t read it yet, take your time, [go and read through the Pug introduction]({{ "/an-introduction-to-jade" | absolute_url }}).

This post covers only a few but powerful features *Pug* is offering to make you a more productive frontend developer.

## Installing Pug using npm

To get the following samples up and running, you’ve to install a *Pug* compiler. The most comfortable setup uses NPM. The upcoming commands show how to create a new directory and install all required packages that you’ll use throughout this post.

```bash
mkdir pug-samples && cd pug-samples
npm init --y
npm install pug --save-dev
npm install live-server jstransformer-markdown jstransformer-uglify-js jstransformer-typescript --save-dev

```

Next, open the current directory in an editor of your choice and add the change scripts within your `package.json` file to match the following.

```json
scripts: {
  "build" : "./node_modules/.bin/pug --hierarchy --pretty --out dist .",
  "start": "./node_modules/.bin/live-server dist"
}
```

You’ve just created two scripts that can be invoked from the terminal using `npm`. `build` starts the *Pug* compiler with some flags to keep HTML files readable, respect the folder structure and put all compiled files into the `dist` folder. The `start` script spins up a small HTTP server which you can use for testing.

## Blocks

You may have already used blocks in *Pug* by using the `block` keyword. However, there is more. You can also decide where your block of code is injected – immediately before or after the block statement – in the parent *Pug* file. Let’s create a bunch of files that we need for all the samples on blocks.

```bash
mkdir blocks
touch blocks/layout.pug
touch blocks/simple-blocks.pug
touch blocks/append-block.pug
touch blocks/prepend-block.pug
touch blocks/append-prepend.pug

```

First, let’s create a layout. We use this layout for all samples on the blocks feature.

```pug
// layout.pug
doctype html
html
  head
    block styles
      link(rel='stylesheet', href='/vendor.css')
  body
    .container
      block content
```

The template is providing two blocks that can be used within other *Pug* files to inject some markup. Notice the `styles` block which is providing some default HTML.

We finished our first implementation by using regular `block` statements as shown in `simple-blocks.pug`:

```pug
extends ./layout.pug
block styles
  link(rel='stylesheet', href='/portal.css')
block content
  h1 Welcome to our portal

```

Compile both files using our `build` script

```bash
npm run build

```

The compiled HTML in `dist/blocks/simple-blocks.html` looks like this

```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="/portal.css">
  </head>
  <body>
    <div class="container">
      <h1>Welcome to our portal</h1>
    </div>
  </body>
</html>

```

As you can see `vendors.css` is replaced by the content of the block provided in `simple-blocks.pug`. This is good for some of the situations, but there are many scenarios where you want different behavior. Adding Stylesheets is just a simple example here. So let’s implement our `append-block.pug` also, use the `append` keyword to get both stylesheet references in the *HTML*.

```pug
//append-block.pug
extends ./layout
append styles
  link(rel='stylesheet', href='/portal.css')
block content
  h1 Welcome to our portal

```

Recompile it using `npm run build` and you should receive the following HTML in `dist/blocks/append-block.html`

```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="/vendor.css">
    <link rel="stylesheet" href="/portal.css">
  </head>
  <body>
    <div class="container">
      <h1>Welcome to our portal</h1>
    </div>
  </body>
</html>

```

That’s cool. Besides `append` there is also `prepend`, demonstrated in the `blocks/prepend-block.pug` file.

```pug
extends ./layout
prepend styles
    link(rel='stylesheet', href='/init.css')
block content
    h1 Welcome to our portal
```

As you can imagine, the resulting HTML renders `init.css` before `vendor.css` you can also combine both `append` and `prepend` to get all three stylesheets in the correct order. See `blocks/append-prepend-block.pug` for this combination

```pug
extends ./layout
prepend styles
  link(rel='stylesheet', href='/init.css')
append styles
  link(rel='stylesheet', href='/portal.css')
block content
  h1 Welcome to our portal

```

It’s also **important** to realize that as soon as you use either `append` or `prepend` the block becomes optional, and you don’t have to specify `block styles` explicitly.

## Filters

Filters are another great feature of *Pug*. Because no website is entirely built from Markup, you’ve always to care about other languages. Filters can make this more natural and less error proven. Filters allow you to inject any content — concerning the HTML specs — into your HTML file. To get that working, you’ve to use `JavaScript Transformers`. Tons of those transformers are available on www.npmjs.org. I’ve chosen three different ones that I want to demonstrate.

Let’s start with an easy one, let’s start with `markdown`. To compile markdown directly into your HTML, you need `jstransformer-markdown` that we’ve already installed during the beginning of the article. However, there is no other manual step required here. The *Pug* compiler uses those transformers automatically.

Create the folder and files we need for our samples.

```bash
# move to the project root directory (pug-samples)
mkdir filters
touch filters/markdown.pug
touch filters/uglify-js.pug
touch filters/typescript.pug

```

Our markdown example is straightforward and goes to `filters/markdown.pug`:

```pug
doctype html
head
  title markdown sample
body
  :markdown
    # Hello from markdown
    This should render as **nice looking HTML**

```

Again compile the sources using `npm run build` and take a look at the generated HTML in `dist/filters/markdown.html`, it should look like this

```html
<!DOCTYPE html>
<head>
  <title>markdown sample</title>
</head>
<body>
  <h1>Hello from markdown</h1>
  <p>This should render as <strong>nice looking HTML</strong></p>
</body>

```

That’s cool!

We got a clean HTML file. However, there is more. Let’s take a look at `jstransformer-uglify-js`; it’s responsible for taking regular JavaScript and transforming it into a minified version.

Think about that. We’re invoking pre-processors as we usually do use things like `Gulp` or `Grunt` but without the configuration overhead. Everything works by indenting the sources one level underneath the filter `:uglify-js`.

```pug
doctype html
head
  title markdown sample
body
  script
    :uglify-js
      document.addEventListener('DOMContentLoaded', function(){
        console.log('Hello from JavaScript');
      });

```

becomes after compiling

```html
<!DOCTYPE html>
<head>
  <title>markdown sample</title>
</head>
<body>
  <script>document.addEventListener("DOMContentLoaded",function(){console.log("Hello from JavaScript")});
  </script>
</body>

```

Moreover, let’s take a look at `jstransformer-typescript` which is also a mighty pre-processor which calls `tsc` (TypeScript Compiler) to transpile your TypeScript code directly to ES5 code. The `filters/typescript.pug` first

```pug
doctype html
head
  title markdown sample
body
  button#greet Greet!
  script
    :typescript
      class Greeter{
        greet(name: string){
          alert(`Hello ${name}`);
        }
      }
  
      document.getElementById('greet').addEventListener('click', ()=>{
        var g= new Greeter();
        g.greet('Jade Developer');
      });

```

Finally, the corresponding HTML from `dist/filters/typescript.html`

```html
<!DOCTYPE html>
<head>
  <title>markdown sample</title>
</head>
<body>
  <button id="greet">Greet!</button>
  <script>var Greeter = (function () {
    function Greeter() {
    }
    Greeter.prototype.greet = function (name) {
        alert("Hello " + name);
    };
    return Greeter;
    })();
    
    document.getElementById('greet').addEventListener('click', function () {
      var g = new Greeter();
      g.greet('Jade Developer');
    });
  </script>
</body> 

```

## Mixins with Splats

Last but not least, I’d like to show the combination of a `mixin` with a `splat`. Splats are well-known language constructs from languages like Ruby or CoffeeScript. It allows you to have a flexible method signature. So your method can receive a flexible range of arguments.

Again let’s create a folder and files first before bringing them to life.

```bash
mkdir mixin-with-splats
touch mixin-with-splats/sample.pug

```

The implementation is quite simple. Look at these few lines of *Pug*, demonstrating how to define and use such a mixin-splat combination.

```pug
mixin nav-list(id, ...items)
  ul.navigation(id=id)
    each item in items
      li.nav-item= item
+nav-list('main-navigation', 'Home', 'Articles', 'Videos', 'Podcasts', 'Forum')

```

Once compiled, you receive the following HTML.

```html
<ul id="main-navigation" class="navigation">
  <li class="nav-item">Home</li>
  <li class="nav-item">Articles</li>
  <li class="nav-item">Videos</li>
  <li class="nav-item">Podcasts</li>
  <li class="nav-item">Forum</li>
</ul>

```

The cool thing here is, it doesn’t matter how many arguments you pass to the `mixin`. It’s entirely up to the scenario.

## Summary

As you can see, *Pug* is a fresh and powerful language that makes you more productive when writing markup. It’s worth looking into it and learning those language features. By combining all those simple things, you could quickly build big projects in almost no time.

All code written [here is also available on *GitHub*](https://github.com/ThorstenHans/jade-introduction).

I hope you enjoyed this tutorial! Leave a comment and share your opinion about *Pug* or perhaps your experience gathered while using *Pug* in the wild.


