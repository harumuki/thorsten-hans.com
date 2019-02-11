---
title: An Introduction to Pug (aka Jade)
layout: post
permalink: an-introduction-to-jade
redirect_from: /an-introduction-to-jade-b11fe3dd6a16
published: true
tags: [Frontend]
excerpt: Learn how to use Jade (aka Pug) to write your frontend code instead of relying on plain old HTML. This article guides you through the basics of Pug.
image: /colorful.jpg
unsplash_user_name: Aashish R Gautam
unsplash_user_ref: kyahaibe
---

'An Introduction to **Pug**' is part of my article series 'Branding SharePoint sites with **yeoman**' see the list of all related articles here.

1. [Introduction]({% post_url 2013-10-08-from-zero-to-hero-how-we-brand-sharepoint-using-yeoman %})
2. [Yeoman the web development workflow]({% post_url 2013-10-18-yeoman-the-web-development-workflow%})
3. [An Introduction to Pug (aka Jade)]({% post_url  2013-10-22-an-introduction-to-jade %})
4. [An Introduction to CoffeeScript]({% post_url 2014-02-14-an-introduction-to-coffeescript %})
5. [An Introduction to SASS]({% post_url 2014-02-18-an-introduction-to-sass %})

## Why Pug (aka Jade)?

Well, _HTML_ MasterPages and PageLayouts are great, and this is precisely what we're going to create, but instead of writing the _HTML_ directly we decided to use _Pug_ (which compiles into _HTML_) to build robust _HTML_ sites.

By using Pug, we can ensure that our HTML is well-formed and valid. Almost every web-developer ran at least once into the issue of having unclosed tags in his/her HTML site. Pug is preventing us from making this mistake. Pug is handling closing tags, for example, depending on the indention of your Pug code. During compilation-time, the compiler throws build errors if the indention in your Pug-File isn't correct. In the bottom line, I can say that Pug is another quality gate which prevents me from making mistakes in the front-end-layer.

## Sample code is available on GitHub

During this post I often refer to several files, you can find all these files within this [**GitHub repository**](https://github.com/ThorstenHans/jade-introduction){:target="_blank"}.

## Installing Pug

Pug is a node package that can easily be installed on your system using the

```bash
npm install pug –g

```

Command. After executing this command, the Pug compiler will be installed globally and can easily be invoked by using the `pug` command from the command-line.

## Let's get started with Pug. Create your first Pug file.

Creating Pug files is easy you need nothing than a text editor to create a Pug file. As you can imagine are Pug-files using the `.pug` extension.

So let's fire-up an editor and put the following lines of Jade into a new file and save the file as `01-getting-started-with-pug.pug`

```pug
  head
      title My very first pug document
  body
      h1 Welcome
      p This HTML page has been written in pug

```

Let's talk a little bit about the Jade-Source. You may have noticed that you can save some keystrokes using Pug. Pug doesn't need to type the angle brackets, and because of the indention-convention, you can also ignore the closing tags.

To compile the Jade-file into HTML open a command-line and navigate to the folder containing your Jade-file and execute

```bash
pug 01-getting-started-with-pug.pug

```

The Pug compiler will translate your source into HTML and create a corresponding .html file within the folder.

```html
<head>
  <title>My very first pug document</title>
</head>
<body>
  <h1>Welcome</h1>
  <p>This HTML page has been written in pug</p>
</body>
```

## Generating Tags with Attributes

In every HTML document, you need to specify attributes on tags. Let's take a hyperlink for example.

```html
<a href="foo.bar" class="my-link" target="_blank">Foo</a>
```

Writing the corresponding Pug is easy, it's just

```pug
a(href='foo.bar', class='my-link', target='_blank') Foo
//- or
a.my-link(href='foo.bar', target='_blank') Foo

```

You can find more examples in the `02-generating-tags-with-attributes.pug` file on GitHub

## Generating `div` containers

The div-container is the most frequently used tags in websites. Therefor Pug is offering different easy ways to create new divs.

```pug
.foo
.foo.bar
#foo.bar
div.foo.bar
div#foo2.bar

```

The corresponding HTML will look like this:

```html
<div class="foo"></div>
<div class="foo bar"></div>
<div class="bar" id="foo"></div>
<div class="foo bar"></div>
<div class="bar" id="foo2"></div>
```

You can find more examples in the `03-generating-divs-with-pug.pug` file on GitHub

## Mixins and Blocks

By using Mixins, you can create reusable blocks of Pug in no-time. To keep your project structure clean, you should place your mixins separated files and load them if they are required. In the following picture, you can see two mixins. The first one is straight forward. It will just put the source from the mixin at the place where you reference it. However, the second one is more powerful by using a `block` you can inject jade source from the reference location into the mixin.

```pug
// file mixins/mixins.pug
mixin icon(name)
  i(class="fa fa-#{name}")

```

```pug
// file index.pug
include ./mixins/mixins

.contact-info
  .phone
    +icon('phone')
    span 0123456789
  .website
    +icon('globe')
    span
      a(href='https://www.thorsten-hans.com', target='_blank') thorsten-hans.com

```

will become the following HTML

```html
<div class="contact-info">
  <div class="phone"><i class="fa fa-phone"></i> <span>0123456789</span></div>
  <div class="website">
    <i class="fa fa-globe"></i> <span> <a href="https://www.thorsten-hans.com" target="_blank">thorsten-hans.com</a> </span>
  </div>
</div>
```

Okay, let refactor the `mixin` and add a `block`

```pug
// file mixins/mixins.pug

mixin contactInfo(name)
  i(class="fa fa-#{name}")
    block

```

```pug
// file index.pug
include ./mixins/mixins

.contact-info
  .phone
    +contactInfo('phone')
      span 0123456789
  .website
    +contactInfo('globe')
       span
         a(href='https://www.thorsten-hans.com', target='_blank') thorsten-hans.com

```

It will again become the following HTML

```html
<div class="contact-info">
  <div class="phone"><i class="fa fa-phone"></i> <span>0123456789</span></div>
  <div class="website">
    <i class="fa fa-globe"></i> <span> <a href="https://www.thorsten-hans.com" target="_blank">thorsten-hans.com</a> </span>
  </div>
</div>
```

Referencing mixins is also easy. First, you've to import the mixin.pug file by using the include command as shown in the upcoming picture. When included you can reference a mixin with the plus-sign (`+`) followed by the mixins name.

If a `mixin` contains a single `block`, you can pass the block's value by nesting the code (one indention).

## Inheritance in Pug using the extends mechanism.

Inheriting HTML structures has become a required for almost every language that compiles into HTML, in ASP.NET we call it MasterPages and also Pug is offering such a system. Pug offers the extends command which can be used to achieve precisely what MasterPages are offering. Let's take the following Pug `05-a-simple-pug-layout.pug`

```pug

// file _layout.pug
html
  head
    title my Blog
      link(rel='stylesheet', href='/styles/bootstrap.min.js')
  body
    .container
      block content
    script(src='/scripts/angular.min.js')

```

As you can see within this pug are two blocks defined, the content of these blocks will be defined with the actual page which is extending this layout `05-a-simple-pug-page.pug`

```pug
extends _layout

block content
  .row
    .col-md-3
      nav
    .col-md-9
      h1 Welcome

```

After compile time, you receive an _HTML_ file containing the layout defined from our `05-a-simple-pug-layout.pug` mixed up with everything written in `05-a-simple-pug-page.pug`. To compile this execute

```bash
pug 05-a-simple-pug-page.pug

```

You will receive the following _HTML_ markup:

```html
<html>
  <head>
    <title>my Blog</title>
    <link rel="stylesheet" href="/styles/bootstrap.min.js" />
  </head>
  <body>
    <div class="container">
      <div class="row">
        <div class="col-md-3"><nav></nav></div>
        <div class="col-md-9"><h1>Welcome</h1></div>
      </div>
    </div>
    <script src="/scripts/angular.min.js"></script>
  </body>
</html>
```

## Further Pug Features

With all these features you're prepared to start with Pug, more features and tricks from Pug can be found on Pug's GitHub repository at ([https://github.com/visionmedia/jade](https://github.com/visionmedia/jade){:target="_blank"}) or on the Pug language site at ([http://jade-lang.com/](http://jade-lang.com/){:target="_blank"}).

## Update

See my recent post [on more advance Pug language features here]({% post_url 2016-02-04-be-more-productive-with-pug %}).
