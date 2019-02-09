---
title: Yeoman the web development workflow
layout: post
permalink: yeoman-the-web-development-workflow
published: true
tags: [yeoman]
excerpt: null
featured_image: /assets/images/posts/feature_images/2013-10-18-yeoman-the-web-development-workflow.jpg
---

See other posts on ‘Branding SharePoint sites with yeoman’.

1. [Introduction]( {{ "from-zero-to-hero-how-we-brand-sharepoint-using-yeoman" | absolute_url }})
2. [Yeoman the web development workflow]({{ "yeoman-the-web-development-workflow" | absolute_url }})
3. [An Introduction to Pug (aka Jade)]({{ "an-introduction-to-jade" | absolute_url }})
4. [An Introduction to CoffeeScript]({{ "an-introduction-to-coffeescript" | absolute_url }})
5. [An Introduction to SASS]({{ "an-introduction-to-sass" | absolute_url }})

Okay — let’s get started with _yeoman_. As I mentioned within the introduction, _yeoman_ is more a web development workflow for front-end apps than a single tool. Yeoman has been founded by leading JavaScript developers from the community (Paul Irish for example) and is maintained by Google and the community. The most important fact about _yeoman_ is that _yeoman_ is based on Node.JS, which makes _yeoman_ available on all popular platforms such as Windows, Linux and of course macOS.

Through all articles, you’ll see screenshots and commands which I use to get things up and running or to achieve several requirements. I’m doing all my development stuff on a Mac, so don’t be confused everything will also work on Windows. (Of course, I've got a virtualized Windows to do my regular SharePoint development…)

## Installing Yeoman

Yeoman is built on top of Node.JS and uses Git for managing dependencies and loading packages from the web. If you’d like to use Compass within your projects you’ve also to install Ruby and Compass on your development machine. We’re using Compass within out SharePoint related generators, so the final list of dependencies looks like this.

1. [Node.js](http://nodejs.org)
2. [Git](http://git-scm.com)
3. [Ruby](http://ruby-lang.org)
4. [Compass](http://compass-style.org)

See detailed installation documentation linked behind the dependencies.

Installing yeoman itself is straight forward. Yeoman is available as Node-Package and can easily be installed by using npm. By executing the following command, yeoman will be installed on your system.

```bash
npm install –g yo

```

When the installation process is finished, you’ve successfully installed yeoman with all it’s required tools. So let’s move on and install some yeoman generators.

### Yeoman Generators — The heart of yeoman

As described in the introduction post, yo is a simple scaffolding tool that is responsible for creating the app structure and providing pre-configured files to get started with development in no time.

Because almost every project is different from another, yeoman uses generators to describe how a new project will look like.

Most generators are also available as NPM package and can be installed by using the `npm` command. Before I install a new generator, it’s an excellent point to get an overview of which generators are currently available.

By executing `npm search generator-*` you can get a list of all yeoman generators available through NPM. Alternatively, you can browse the list on yeoman’s homepage at [http://yeoman.io/community-generators.html](http://yeoman.io/community-generators.html)

Let’s install the most simple generator right now by executing.

```bash
npm install –g generator-webapp

```

### Create your first project with yeoman

Creating projects using yeoman is straight forward. You have to create a new folder and execute

```bash
yo

```

it is followed by the generator you would like to use.

<figure>![](http://localhost:8000/wp-content/uploads/2018/10/5c2ca-00t4jtgzlv4w9hdyr.png)

</figure>Alternatively you can execute yo, and yeoman will ask you for a generator based on all installed generators. Depending on the generator you’ve chosen yeoman will ask you some questions about your project. In this example, yeoman is asking which dependencies you want to add directly to the new project. After selecting, for example, Bootstrap you’ll see the yeoman magic. Yeoman will dump the project structure and install various dependencies from the web using npm and bower. After downloading the dependencies has finished, it’ll execute the generated Gruntfile to ‘build’ your web-app. (Don’t care about all details now, we’ll go through them later)

That’s it now your first project has been created by using yeoman. However, what do we get? Let’s have a closer look at the project directory.

<figure>![](http://localhost:8000/wp-content/uploads/2018/10/8b3c4-0wvegawvb1k1yskt4.png)

</figure>As you can see there are several files and folders created by yeoman. Most important artifacts are

- `package.json` – This file describes your project and lists all Node.JS dependencies such as grunt, various grunt tasks
- `bower.json` – This file is used to manage client-side dependencies and tells bower which libraries it has to install (jQuery, Bootstrap, …)
- `gruntfile.js` – The Gruntfile describes what grunt should do during ‘compilation’ of the project. Depending on the generator you’ve chosen the file may be existing as CoffeeScript file with the name Gruntfile.coffee
- `app` folder – this is the folder where you develop. All sources are located here including HTML, SASS, and JavaScript (or CoffeeScript or TypeScript)
- `test` folder – Put your unit-tests right here
- `bower_components` folder – Bower installs your dependencies right here (will not be stored in git)
- `node_modules` folder – NPM installs your dependencies right here (will not be stored in git)

### Building the project

To build your project you’ve to execute

```bash
grunt build

```

Within the project folder and grunt is going to execute the tasks described in your Gruntfile. As a result, you’ll recognize a new subfolder called dist. Within the dist folder, everything is placed that your app requires to run.

<figure>![](http://localhost:8000/wp-content/uploads/2018/10/3a9f0-003s8jfyscujlx5vi.png)

</figure>

### Executing the project

There is also a grunt task for running a small web server serving your project. You have to execute the command

```bash
grunt server

```

As you may realize the process stays active and in the background, it’s watching to your source directory. This is a pretty cool and perhaps the most boosting feature. You can now change the HTML of your website, and the files will be compiled in the background, and you’ll get quick feedback, and you can directly see the results in the browser.

<figure>![](http://localhost:8000/wp-content/uploads/2018/10/c9d85-0fbffejsg40wdzzzl.png)

</figure>

### Executing the unit tests

Unit-Testing is built in, so execution is also straight forward. You have to

```bash
grunt test


```

also, grunt will explicitly run all tests in your project.

<figure>![](http://localhost:8000/wp-content/uploads/2018/10/95819-00rrjdrgeuuptps8e.png)

</figure>

### What’s going on behind the scenes

Right now you should have a rough understanding of what yeoman is offering. You’ve seen how to create a new project and how to build it, how to execute your tests and how to start your project by using grunt. Playing around within your sources and see the changes directly in the browser has also been described in ‘Executing the project’ section. However, now it’s time to see what’s going on. The simple web-app generator generates a both `package.json` and `gruntfile.js`. To understand the insights, these are the most critical files.

First, see the list of `devDependencies` in the `package.json` file. By examining this list, you can understand which tasks are executed when you fire-up grunt build for example. Several tasks such as minifying your images, CSS and HTML are described here. You may also notice the `grunt-contrib-compass` reference which will be used to control the powerful compass command directly from your Gruntfile.

Understanding each task may take a while. Therefore you should learn more about GruntJS and the Gruntfile. The GruntJS website offers proper documentation, and it’s also essential to browse the git repositories from all community tasks to see how these tasks can be configured.

When you open up `gruntfile.js` you see the work that’s done for you. In more than 350 lines of JavaScript, everything is already configured for you. Scroll to the bottom of the file to see all available tasks. Each registered tasks can easily be executed from the command-line by using the grunt command. I don’t want to explain all task configurations right now. However, let’s take the copy task for example.

### The copy task configuration

Search for `copy:` in your Gruntfile, and you should find the following part.

<figure>![](http://localhost:8000/wp-content/uploads/2018/10/62144-0o-w6h8rdnfu9ddgr.png)

</figure>
As you can see is each task configured by using a simple JSON object. The complexity of the various tasks differ depending on their level of configuration, but hey JSON is super readable. Don’t be afraid. 🙂

The copy-task has two sub-tasks (`dist` and `styles`). The generator requires two sub-tasks here because other tasks such as `cssmin` require to do some further actions with the style sheets. The most complex properties are file-system related. GruntJS offers a great set of wildcard filters to select the files you’re interested in from the file system.

The `dist` sub-task is going to copy all files that match the source pattern (`src`) from the current working directory (`cwd`) and will copy them into the given destination (`dest`). The expand property a unique property! By setting it to `true`, you tell the engine that it should build the array of files dynamically instead of defining the files manually. The engine is going to use the combination of all other properties (src, dest, cwd,…).

As you can see, grunt-tasks are very flexible and provide solutions for almost every scenario. Further details see the grunt documentation on [http://gruntjs.com](http://gruntjs.com/) or the specific documentation on the grunt-task you’re currently working on. (Almost every grunt task is hosted on github _hooray_)

### The CLI

Depending on the chosen generator you may have different command line options when executing grunt. These options are also configured within the Gruntfile. The following screenshot shows the “test” and “build” option for the grunt executable. As you can see the option is defined followed by all dependent grunt-tasks that will be invoked in the given order by using grunt.registerTask you can easily create your own CLI or tweak the current configuration. For example, you can easily enable the CoffeeScript compiler by adding the grunt-contrib-coffee package to the project, configure the task as shown with the ‘copy’-task and put it right here in the dependency list.

<figure>![](http://localhost:8000/wp-content/uploads/2018/10/1e142-0vrdo8cvv4zyo3xfv.png)

</figure>
Installing a package such as `grunt-contrib-coffee` is straight forward. Just open a terminal and navigate to the project directory. By executing

```bash
npm install grunt-contrib-coffee --save-dev

```

The package will be installed and added as development dependency (see `package.json`). Because yeoman is using a package called `load-grunt-tasks` it’s automatically loaded and available for configuration and execution within the Gruntfile.

## Recap

Yeoman brings great operations for each developer, and it’s great to see how fast you can develop frontend-apps with the yeoman stack. I think you get a rough introduction into the topic with this post. Don’t worry if you don’t understand all insights of yeoman yet. The easiest way of learning the yeoman insights is to start at this point and tweak the Gruntfile to fit your needs. Of course, it’s difficult if you come from standard SharePoint development. However, with the rise of the AppModel, we’re finally back to good old web development. Therefore it’s time to catch up with the latest tools and workflows to increase productivity and make SharePoint Apps and customizations popping up quickly.

Within the upcoming posts, we move on with some programming languages and frameworks we’ve backed into our development stack. So keep on reading, and hopefully, you’ll leave your thoughts right here as a comment.
