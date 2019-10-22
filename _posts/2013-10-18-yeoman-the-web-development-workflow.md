---
title: Yeoman the web development workflow
layout: post
permalink: yeoman-the-web-development-workflow
redirect_from: /yeoman-the-web-development-workflow-87630ce36201
published: true
tags: [Frontend]
excerpt: Have you heard of Yeoman? This post explains how to get started with yeoman. No matter if you do frontend or backend development, Yeoman will assist you.
image: /learning.jpg
unsplash_user_name: Tim Mossholder
unsplash_user_ref: timmossholder
---

See other posts on 'Branding SharePoint sites with yeoman'.

1. [Introduction]({% post_url 2013-10-08-from-zero-to-hero-how-we-brand-sharepoint-using-yeoman %})
2. [Yeoman the web development workflow]({% post_url 2013-10-18-yeoman-the-web-development-workflow%})
3. [An Introduction to Pug (aka Jade)]({% post_url  2013-10-22-an-introduction-to-jade %})
4. [An Introduction to CoffeeScript]({% post_url 2014-02-14-an-introduction-to-coffeescript %})
5. [An Introduction to SASS]({% post_url 2014-02-18-an-introduction-to-sass %})

Okay ,  let's get started with *Yeoman*. As I mentioned within the introduction, *Yeoman* is more a web development workflow for front-end apps than a single tool. Yeoman has been founded by leading JavaScript developers from the community (Paul Irish for example) and is maintained by Google and the community. The most important fact about *Yeoman* is that *Yeoman* is based on *Node.js*, which makes *Yeoman* available on all popular platforms such as Windows, Linux and of course macOS.

Through all articles, you'll see screenshots and commands which I use to get things up and running or to achieve several requirements. I'm doing all my development stuff on a Mac, so don't be confused everything will also work on Windows. (Of course, I've got a virtualized Windows to do my regular SharePoint development…)

## Installing Yeoman

*Yeoman* is built on top of *Node.js* and uses Git for managing dependencies and loading packages from the web. If you'd like to use Compass within your projects you've also to install Ruby and Compass on your development machine. We're using Compass within out SharePoint related generators, so the final list of dependencies looks like this.

1. [Node.js](http://nodejs.org){:target="_blank"}
2. [Git](http://git-scm.com){:target="_blank"}
3. [Ruby](http://ruby-lang.org){:target="_blank"}
4. [Compass](http://compass-style.org){:target="_blank"}

See detailed installation documentation linked behind the dependencies.

Installing *Yeoman* itself is straight forward. Yeoman is available as Node-Package and can easily be installed by using npm. By executing the following command, *Yeoman* will be installed on your system.

```bash
npm install –g yo

```

When the installation process is finished, you've successfully installed *Yeoman* with all it's required tools. So let's move on and install some *Yeoman* generators.

### Yeoman Generators — The heart of Yeoman

As described in the introduction post, yo is a simple scaffolding tool that is responsible for creating the app structure and providing pre-configured files to get started with development in no time.

Because almost every project is different from another, *Yeoman* uses generators to describe how a new project will look like.

Most generators are also available as NPM package and can be installed by using the `npm` command. Before I install a new generator, it's an excellent point to get an overview of which generators are currently available.

By executing `npm search generator-*` you can get a list of all *Yeoman* generators available through NPM. Alternatively, you can browse the list on *Yeoman's* homepage at [http://yeoman.io/community-generators.html](http://yeoman.io/community-generators.html){:target="_blank"}

Let's install the most simple generator right now by executing.

```bash
npm install –g generator-webapp

```

### Create your first project with Yeoman

Creating projects using *Yeoman* is straight forward. You have to create a new folder and execute

```bash
yo

```

Append the name of the generator you would like to use.

{% include image-caption.html imageurl="/assets/images/posts/2013/yeoman-1.png"
title="Say Hello to Yeoman" caption="Say Hello to Yeoman" %}

Alternatively you can execute `yo`, and *Yeoman* will ask you for a generator based on all installed generators. Depending on the generator you've chosen *Yeoman* will ask you some questions about your project. In this example, *Yeoman* is asking which dependencies you want to add directly to the new project. After selecting, for example, Bootstrap you'll see the *Yeoman* magic. Yeoman will dump the project structure and install various dependencies from the web using npm and bower. After downloading the dependencies has finished, it'll execute the generated Gruntfile to 'build' your web-app. (Don't care about all details now, we'll go through them later)

That's it now your first project has been created by using *Yeoman*. However, what do we get? Let's have a closer look at the project directory.

{% include image-caption.html imageurl="/assets/images/posts/2013/yeoman-2.png"
title="The list of Dependencies" caption="The list of Dependencies" %}

As you can see there are several files and folders created by *Yeoman*. Most important artifacts are

- `package.json` – This file describes your project and lists all Node.js dependencies such as grunt, various grunt tasks
- `bower.json` – This file is used to manage client-side dependencies and tells bower which libraries it has to install (jQuery, Bootstrap, …)
- `gruntfile.js` – The Gruntfile describes what grunt should do during 'compilation' of the project. Depending on the generator you've chosen the file may be existing as CoffeeScript file with the name Gruntfile.coffee
- `app` folder – this is the folder where you develop. All sources are located here including HTML, SASS, and JavaScript (or CoffeeScript or TypeScript)
- `test` folder – Put your unit-tests right here
- `bower_components` folder – Bower installs your dependencies right here (will not be stored in git)
- `node_modules` folder – NPM installs your dependencies right here (will not be stored in git)

### Building the project

To build your project you've to start the task inside of the project's folder as demonstrated here:

```bash
grunt build

```

`Grunt` is going to execute the tasks described in your Gruntfile. As a result, you'll recognize a new subfolder called `dist`. Within the `dist` folder, you'll find that's required for your app to work as expected.

{% include image-caption.html imageurl="/assets/images/posts/2013/yeoman-3.png"
title="Minified Vendor Scripts" caption="Minified Vendor Scripts" %}

### Executing the project

There is also a grunt task for running a small web server serving your project. You have to execute the command.

```bash
grunt server

```

As you may realize the process stays active and in the background, it's watching to your source directory. This feature gives you the most significant performance boost. You can now change the HTML of your website, and the files are compiled in the background. You'll get quick feedback, and you can directly see the results in your browser.

{% include image-caption.html imageurl="/assets/images/posts/2013/yeoman-4.png"
title="Live-reloading for every change" caption="Live-reloading for every change" %}
### Executing the unit tests

Unit-Testing is built in, so execution is also straight forward. You have to

```bash
grunt test


```

also, Grunt will explicitly run all tests in your project.

{% include image-caption.html imageurl="/assets/images/posts/2013/yeoman-5.png"
title="All green - Unit Testing" caption="All green - Unit Testing" %}

### What's going on behind the scenes

Right now you should have a rough understanding of what *Yeoman* is offering. You've seen how to create a new project and how to build it, how to execute your tests and how to start your project by using grunt. Playing around within your sources and see the changes directly in the browser has also been described in 'Executing the project' section. However, now it's time to see what's going on. The simple web-app generator generates a both `package.json` and `gruntfile.js`. To understand the insights, these are the most critical files.

First, see the list of `devDependencies` in the `package.json` file. By examining this list, you can understand which tasks are executed when you fire-up grunt build for example. Several tasks such as minifying your images, CSS and HTML are described here. You may also notice the `grunt-contrib-compass` reference which will be used to control the powerful compass command directly from your Gruntfile.

Understanding each task may take a while. Therefore you should learn more about GruntJS and the Gruntfile. The GruntJS website offers proper documentation, and it's also essential to browse the git repositories from all community tasks to see how these tasks can be configured.

When you open up `gruntfile.js` you see the work that's done for you. In more than 350 lines of JavaScript, everything is already configured for you. Scroll to the bottom of the file to see all available tasks. Each registered tasks can easily be executed from the command-line by using the grunt command. I don't want to explain all task configurations right now. However, let's take the copy task for example.

### The copy task configuration

Search for `copy:` in your Gruntfile, and you should find the following part.

{% include image-caption.html imageurl="/assets/images/posts/2013/yeoman-6.png" width="430"
title="The 'copy' Task" caption="The 'copy' Task" %}

As you can see, each task is configured using a simple JSON object. The complexity of the various tasks differ depending on their level of configuration, but hey JSON is super readable. Don't be afraid. 🙂

The copy-task has two sub-tasks (`dist` and `styles`). The generator requires two sub-tasks here because other tasks such as `cssmin` require to do some further actions with the style sheets. The most complex properties are file-system related. GruntJS offers a great set of wildcard filters to select the files you're interested in from the file system.

The `dist` sub-task is going to copy all files that match the source pattern (`src`) from the current working directory (`cwd`) and will copy them into the given destination (`dest`). The expand property a unique property! By setting it to `true`, you tell the engine that it should build the array of files dynamically instead of defining the files manually. The engine is going to use the combination of all other properties (src, dest, cwd,…).

As you can see, grunt-tasks are very flexible and provide solutions for almost every scenario. Further details see the grunt documentation on [http://gruntjs.com](http://gruntjs.com/){:target="_blank"} or the specific documentation on the grunt-task you're currently working on. (Almost every grunt task is hosted on github _hooray_)

### The CLI

Depending on the chosen generator you may have different command line options when executing grunt. These options are also configured within the Gruntfile. The following screenshot shows the “test” and “build” option for the grunt executable. As you can see the option is defined followed by all dependent grunt-tasks that will be invoked in the given order by using grunt.registerTask you can easily create your own CLI or tweak the current configuration. For example, you can easily enable the CoffeeScript compiler by adding the grunt-contrib-coffee package to the project, configure the task as shown with the `copy`-task and put it right here in the dependency list.

{% include image-caption.html imageurl="/assets/images/posts/2013/yeoman-7.png" width="330"
title="'build'-task dependencies" caption="'build'-task dependencies" %}

Installing a package such as `grunt-contrib-coffee` is straight forward. Just open a terminal and navigate to the project directory. By executing

```bash
npm install grunt-contrib-coffee --save-dev

```

The package will be installed and added as development dependency (see `package.json`). Because *Yeoman* is using a package called `load-grunt-tasks` it's automatically loaded and available for configuration and execution within the Gruntfile.

## Recap

Yeoman brings great operations for each developer, and it's great to see how fast you can develop frontend-apps with the *Yeoman* stack. I think you get a rough introduction into the topic with this post. Don't worry if you don't understand all the insights of *Yeoman* yet. The easiest way of learning the *Yeoman* insights is to start at this point and tweak the Gruntfile to fit your needs. Of course, it's difficult if you come from standard SharePoint development. However, with the rise of the AppModel, we're finally back to good old web development. Therefore it's time to catch up with the latest tools and workflows to increase productivity and make SharePoint Apps and customizations popping up quickly.

Within the upcoming posts, we move on with some programming languages and frameworks we've backed into our development stack. So keep on reading, and hopefully, you'll leave your thoughts right here as a comment.
