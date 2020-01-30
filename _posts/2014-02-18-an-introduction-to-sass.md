---
title: An Introduction to SASS
layout: post
permalink: an-introduction-to-sass
published: true
tags: [Frontend]
excerpt: You want to speed up your frontend development skills? Learn SASS and write stylesheets faster. This post will teach you the basics of SASS.
image: /learning.jpg
unsplash_user_name: Tim Mossholder
unsplash_user_ref: timmossholder
---

Throughout this post, I’ll give you a rough introduction into [SASS](www.sass-lang.com){:target="_blank"} as part of my *branding SharePoint sites with yeoman* series. See all other posts from this series here.

1. [Introduction]({% post_url 2013-10-08-from-zero-to-hero-how-we-brand-sharepoint-using-yeoman %})
2. [Yeoman the web development workflow]({% post_url 2013-10-18-yeoman-the-web-development-workflow%})
3. [An Introduction to Pug (aka Jade)]({% post_url  2013-10-22-an-introduction-to-jade %})
4. [An Introduction to CoffeeScript]({% post_url 2014-02-14-an-introduction-to-coffeescript %})
5. [An Introduction to SASS]({% post_url 2014-02-18-an-introduction-to-sass %})

## SASS

*SASS* (Syntactically Awesome StyleSheets) is a language which compiles into CSS and allows you to write your styles in a comfortable and use all the cool things which CSS is missing like variables, mixins or nested rules.

### SASS vs SCSS

*SASS* comes with two different flavors. `SCSS` and `SASS`

### SCSS (or sassy CSS)

*SCSS* is the most popular dialect from *SASS*. It’s based on *CSS3* and adds some custom keywords and syntactic elements to the latest CSS standard. Because it’s based on CSS3 syntax, it’s straightforward to learn, and you should prefer *SCSS* syntax over *SASS* syntax in these days. *SASS* syntax on the other side was the first implementation and is a little bit older. *SASS* syntax is also referenced as indention syntax on many websites.

No matter which flavor you choose, sass compiler can automatically generate the different syntax for you with no effort. As CoffeeScript saves your time writing client-side code, SASS saves your time when writing stylesheets. So let’s dive into SASS instead of messing time with theory.

## Installing SASS on your development box

Before you can start writing *SASS* on your development box you’ve to install Ruby on your system. There are thousands of tutorials available online which are describing how to install Ruby in the best way. — At this point, I’d like to advise you using *the Ruby Version Manager (RMV)* which allows you to switch between different Ruby versions quickly on your system.

After you’ve installed Ruby on your system, you can finally install the SASS compiler on your system using Ruby’s Package manager gem.

```bash
#install sass on windows
gem install sass

#ensure root permissions on -ix systems using sudo
sudo gem install sass

#check the installation by querying for the current SASS version
sass -v

```

### Variables

Variables reduce code duplication through your stylesheets, and they make it easy to create easily customizable designs for your website. Consider the following `scss` file.

```scss
$primary-color: #333;
$secondary-color: #3399cc;

a {
  color: $primary-color;
}

a:visited {
  color: $secondary-color;
} 

button {
    background-color: $secondary-color;
}

```

When compiling the file using

```bash
sass variables.scss variables.css

```

You’ll receive the following stylesheet. Make some changes to the variables by your own and execute the SASS compiler to see the effect.

```css
a {
  color: #333;
}
a:visited {
  color: #39c;
}
button {
  background-color: #39c;
}

```

### Mixins

*Mixins* are awesome. By using mixins, you can define a set of styles at some point and reuse it through your entire stylesheet. Take for example a CSS3 rotation which has been created and tested for most popular browsers. Instead of rewriting all the different styles, again and again, you can include them in SASS and save many keystrokes and much time.

```scss
 @mixin rotate($degrees) {
    -webkit-transform: rotate($degrees);
    -moz-transform: rotate($degrees);
    -ms-transform: rotate($degrees);
    -o-transform: rotate($degrees);
    transform: rotate($degrees);
    -ms-filter: "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=#{cos($degrees)}, M12=#{-1*sin($degrees)}, M21=#{sin($degrees)}, M22=#{cos($degrees)})";
    filter:  progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=#{cos($degrees)}, M12=#{-1*sin($degrees)}, M21=#{sin($degrees)}, M22=#{cos($degrees)});
}

 .rotate {
    @include rotate(-45deg);
}

 .rotate-neg {
    @include rotate(45deg);
}

```

Again, when compiled with the sass executable you’ll receive the following CSS.

```css
.rotate {
  -webkit-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  transform: rotate(-45deg);
  -ms-filter: "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=cos(-45deg), M12=-1*sin(-45deg), M21=sin(-45deg), M22=cos(-45deg))";
  filter: progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=cos(-45deg), M12=-1*sin(-45deg), M21=sin(-45deg), M22=cos(-45deg));
}
.rotate-neg {
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  transform: rotate(45deg);
  -ms-filter: "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=cos(45deg), M12=-1*sin(45deg), M21=sin(45deg), M22=cos(45deg))";
  filter: progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=cos(45deg), M12=-1*sin(45deg), M21=sin(45deg), M22=cos(45deg));
}

```

### Nested rules

The last component from SASS I’d like to demonstrate what nested rules are and which benefits you’ll get when betting on *SASS* instead of *CSS*.

Nested rules are pretty easy but powerful components. Nested rules are adopting the schema, *DOM* elements are following. Consider you’re writing a *SASS* file which is responsible for styling the navigation. When writing plain CSS, you would write some CSS like the following.

```css
nav ul {
}
nav li {
}
nav a {
}

```

Nested rules are optimizing exactly this *CSS* selector definition. Depending on the indention and the parent classes the CSS selectors will be generated from the *SASS* compiler.

```scss
$primary-color: red;

nav {
  ul {
    padding: 4;
    margin: 2;
    list-style: none;
  }

  li { display: inline-block; }

  a {
    display: block;
    padding: 4px 8px;
    text-decoration: none;
    color: $primary-color;
  }
}
```

Once compiled down to *CSS* again, the stylesheet looks like this:

```css
nav ul {
  padding: 4;
  margin: 2;
  list-style: none;
}
nav li {
  display: inline-block;
}
nav a {
  display: block;
  padding: 4px 8px;
  text-decoration: none;
  color: red;
}

```

As you can see, *SASS* offers excellent features to reduce the amount of code to write and to reduce the complexity of your stylesheets.

*SASS* is an essential part of branding SharePoint sites using our yeoman generators because we heavily use *SASS* throughout the branding solutions to use latest and greatest web technologies. Of course, there are some competitors in this area available. I also like *stylus* very much. No matter which abstraction language you use, because of the compile-time-check you should consider using one of them.


