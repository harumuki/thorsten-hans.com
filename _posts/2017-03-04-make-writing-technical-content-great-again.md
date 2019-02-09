---
title: Make writing technical content great again!
layout: post
permalink: make-writing-technical-content-great-again
redirect_from: /2017-03-04_Make-writing-technical-content-great-again--d58dedec448b
published: true
tags: [Writing, Tools]
excerpt: How do you write your technical articles? A question I was often asked. This article is a quick overview of my writing workflow and the tools that I use to produce my articles
featured_image: /assets/images/posts/feature_images/2017-03-04-make-writing-technical-content-great-again.jpg
---
Like many other developers, I write articles for various print and online magazines. I do this for almost a decade now and I've used many different approaches to make writing as comfortable as possible for me. That said, I want to share the tools I use and the workflow I prefer.

When writing about frameworks, programming languages or scripts, you've some slightly different requirements than authors of regular books or articles. You want to: 
 * create tables
 * highlight source code directly in the text
 * provide complex code snippets


of course, do you need all the regular support for *images*, *footnotes*, and so on.

## Using proper version control system
I use *git* to manage all my articles. *git* makes editing, restoring and merging various parts of an article very easy.

Everything I create is under version control, so why should my articles be the only exception?

Of course are all my articles stored in a *private repository*. I use *GitHub* and their $7 paid plan to create as many private repositories I want to. I've created dedicated repositories for all different kind of publications (print articles, online articles, white papers).

Only books, for every book I wrote, a dedicated repository has been created. Books are too big, and perhaps you want to set up webhooks to automatically generated previews for your book on each and every `push`.

In the beginning, I was also using [git flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow){:target="_blank"} and created dedicated feature branches for every article. To be honest, that was too much 😜. I ended up in just working on my `develop` branch. I merge to `master` once I've finished an article and associate a proper `w` to the merge commit.

{% include image-caption.html imageurl="/assets/images/posts/2017/technical-writing-1.png" 
title="Releases on GitHub" caption="Releases on GitHub" %}

If you assign a tag to a commit in git, it becomes a **release** on GitHub. So I could easily access any **final article** later using GitHub's website and I don't have to browse thru the repositories history. 

## Markdown

That's no surprise. I use *Markdown* to write my stuff. *Markdown* offers everything I need to produce technical articles. Because technical articles grow fast, I wanted to be able to split articles into separate markdown files. Unfortunately, this isn't supported by the current Markdown standard out of the box. But that's where tooling comes into play.
A lot of writing tools like [iA Writer](https://ia.net/writer){:target="_blank"} are supporting exactly this feature.

It's dead simple. You just provide the path for the markdown file you want to include and you're done. *But this reference has to be placed in its own row*.

```bash
# Article Headline
/artefacts/000-intro.md
/artefacts/010-background.md
## Let's get started
/artefacts/100-lets-get-started.md
## Conclusion
/artefacts/999-outro.md

```

Let's take a look at an artifact. `010-background.md` for example may contain both images and snippets.

```markdown
Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren.

![Figure 1 - FX Arch](images/001-fx-architecture.png)

Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,

/snippets/001-hello-world.js.md

```

## Convention over Configuration (CoC)
I love the concept of *Convention over Configuration*, it's easier to define a clean structure once and follow that “convention” instead of providing a “configuration” for each and every article.

All my articles are structured using a simple schema.

```bash
/articles
/articles/recent-article/
/articles/recent-article/super-awesome-article.md
/articles/recent-article/artefacts/
/articles/recent-article/artefacts/000-intro.md
/articles/recent-article/artefacts/...
/articles/recent-article/artefacts/999-outro.md
/articles/recent-article/artefacts/images/
/articles/recent-article/artefacts/images/001-fx-architecture.png
/articles/recent-article/artefacts/snippets/
/articles/recent-article/artefacts/snippets/001-hello-world.js.md
/articles/recent-article/previews/
/articles/recent-article/deliverables/

```

First, there is the main article folder (here `recent-article`). This folder contains various files. The main article file `super-awesome-article.md` is, of course, the most important one. Next, to this, I store other markdown files containing notes, notes I use during the early stages when I need to do some research on a topic I've to cover as part of the article.

The `artifacts` folder is a collection of small markdown files. I break my article into small chunks and arrange those chunks in `super-awesome-article.md`. Some artifacts are always pre-populated like `001-intro.md` and `999-outro.md`.

Images, surprisingly remain to the `images` subfolder and to stay consistent, all code snippets (longer than three lines) are stored as dedicated markdown files inside of `snippets`.

> Yes, I write all my snippets in markdown instead of just putting a raw code file there.

The advantage of putting the snippet itself, again into a markdown file is just laziness. Each snippet starts with three back-ticks and also end with those. Having this format, I can copy, cut and paste just the single line to include that particular snippet in the text. Otherwise, I've to move around three lines (two lines with the three back-ticks and the include statement).

Last, but not least I have dedicated folders for `previews` and `deliverables`, those folders normally contain generated PDF version of the article.

## Writing Tools

I'm always trying to find better tooling. You should never stop looking for new opportunities or alternatives to things you currently use. In these days I prefer [iA Writer](https://ia.net/writer){:target="_blank"}, it's easy to use and it supports embedding partial markdown files 🤘🏼. It's also possible to use custom themes, to ensure that your articles either follow a given corporate identity or reuse your preferred fonts, colors, margins, ...

## Generating previews and deliverables

For generating previews or deliverables, I use either the export function offered by *iA Writer* or [*Pandoc*](http://pandoc.org/){:target="_blank"}. *Pandoc* is also able to read the include statements for partial markdown files I mentioned earlier.


## Recap

Writing technical articles becomes fun, if you can use the tools and languages you love. Having GitHub and Markdown as basement for writing technical articles, I can finally use my favorite Editor to get that done, instead of relying on apps like *Pages* or *Word*. The markdown extensions provided by *iA Writer* make writing huge articles even easier and maintainable. 
