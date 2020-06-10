---
title: Frictionless zsh And oh-my-zsh Management With Antigen
layout: post
permalink: frictionless-zsh-and-oh-my-zsh-management-with-antigen
published: true
tags: 
  - Shell
excerpt: "In ZSH you can increase your productivity with aliases. This post explains 5 types of aliases that you should know. Boost your shell productivity now and make ZSH your own"
image: /terminal.jpg
unsplash_user_ref: grohsfabian
unsplash_user_name: Fabian Grohs
---

I love tinkering my shell environment. I found myself sitting down during the weekend and doing an overhaul of my configuration approach for ZSH. That said, I decided to change my ZSH plugin management and started using [Antigen](http://antigen.sharats.me/){:target="_blank"}.

Antigen is a small set of helper functions that allow you to frictionless management of ZSH plugins. Personally, I was addicted to vim for decades and used vundle to manage my vim customizations. As the official Antigen website mentions: "*Antigen is to ZSH what Vundle is to vim.*"

{% include image-caption.html imageurl="/assets/images/posts/2020/zsh-configuration-antigen.png"
title="ZSH and oh-my-zsh configuration with Antigen" caption="ZSH and oh-my-zsh configuration with Antigen" %}

This small post guides you through the setup process and demonstrates how to manage plugins and themes with Antigen to tailor your ZSH experience.

## Install Antigen

Installing Antigen on your system is just a one-liner. All necessary helper functions are part of a single file that you have to download on your machine. I use `curl` to do so:

```bash
# download antigen onto to machine
curl -L git.io/antigen > ~/antigen.zsh

```

## Backup .zshrc

Before we dive into changing the `.zshrc`, let's do a backup of the current configuration.

```bash
# Create a backup of .zshrc
cp ~/.zshrc ~/backup.zshrc

```

## Overhaul .zshrc

Using Antigen in your `.zshrc` consists of three major parts.

1. source the previously downloaded `antigen.zsh` file
2. use the `antigen` functions to load desired stuff into your ZSH
3. Commit your configuration by invoking `antigen apply`

If you are starting using a fresh `.zshrc` you may end up with something like this

```bash
# 1. Source Antigen
source /path-to-antigen/antigen.zsh

# 2. Use Antigen to load stuff
## Use oh-my-zsh
antigen use oh-my-zsh
## Use some plugins
antigen bundle git
antigen bundle docker
antigen bundle kubernetes
## Load a custom Theme
antigen theme cloud

# 3. Commit Antigen Configuration
antigen apply

```

## Antigen Configuration

Although Antigen works out of the box pretty well, you can tailor Antigen's behavior a little bit by using certain environment variables. We won't go through all the configuration properties here. Instead, I just want to point you to those properties that were most interesting to myself:

| Environment Variable     | Description                                                                                            |
|--------------------------|--------------------------------------------------------------------------------------------------------|
| ADOTDIR                  | The directory where Antigen stores all downloaded stuff like plugins and themes                        |
| ANTIGEN_LOG              | The path where Antigen will store log files. Activates logging once set                                |
| ANTIGEN_DEFAULT_REPO_URL | Set the default Git repository URL for antigen bundle function calls. Defaults to oh-my-zsh repository |

Consult the [Configuration Page](https://github.com/zsh-users/antigen/wiki/Configuration){:target="_blank"} to get a full list of all available configuration variables.

## Common Antigen Commands

I already mentioned that Antigen is just a set of helper functions. However, it makes sense to look into a couple of those commands in more detail to understand what is going on and what is possible. Look at the [commands page](https://github.com/zsh-users/antigen/wiki/Commands){:target="_blank"} of the documentation to get the entire list of available commands.

### Load oh-my-zsh With Antigen Use

With `antigen use` you load and configure any kind of pre-packaged ZSH-framework like for example the awesome [oh-my-zsh](https://github.com/ohmyzsh/ohmyzsh){:target="_blank"}. You should call `antigen use` before loading further plugins.

```bash
# use oh-my-zsh
antigen use oh-my-zsh

# load plugins and themes...

```

Besides oh-my-zsh you can also use [prezto](https://github.com/sorin-ionescu/prezto){:target="_blank"} or any other custom library, by providing its Git repository.

```bash
# load custom library
antigen use https://github.com/custom/lib.git

```

### Load Plugins With Antigen Bundle

`antigen bundle` is perhaps the function that you will use most often. It comes with some great conventions that will boost your productivity. By default, `antigen bundle` loads plugins into your terminal from the official oh-my-zsh Git repository. Having this context, we can address several plugins just by its name.

```bash
# load git plugin from https://github.com/robbyrussell/oh-my-zsh
antigen bundle git

```

If you have set a different default repository (`ANTIGEN_DEFAULT_REPO_URL`), you can still consume plugins from oh-my-zsh by adding the repository as a qualifier:

```bash
# load git plugin from https://github.com/robbyrussell/oh-my-zsh
antigen bundle robbyrussell/oh-my-zsh plugins/git

```

In this case, we specify the Git repository (`robbyrussell/oh-my-zsh`). The desired plugin is located at `plugins/git` within the repository. You can verify by navigating the repository on GitHub.

There are [some additional arguments](https://github.com/zsh-users/antigen/wiki/Commands#antigen-bundle){:target="_blank"} that you can provide when calling `antigen bundle` like `--branch`. However, I was fine with being able to consume plugins from oh-my-zsh and by addressing the explicitly using `gituser:repo path/to/plugin`.

### Set A Theme With Antigen Theme

With `antigen theme`, you can load and activate the desired theme for your shell instance. The syntax is similar to `antigen bundle` and allows to consume themes by name from the default repository:

```bash
# use theme from the default repository
antigen theme cloud

```

Alternatively, you can load themes from other sources like Git repositories or Gists by specifying the entire URL

```bash
# use theme from a GitHub gist
antigen theme https://gist.github.com/3750104.git agnoster

```

Many themes in oh-my-zsh rely on custom functions provided by oh-my-zsh itself. Because of this, you should call `antigen theme` after `antigen use`.

### Inspect With Antigen List

I found myself using `antigen list` a couple of times within the shell instance to verify and validate Antigen loads all the desired plugins. You can also append `--long` and get more detailed information directly in the shell. This makes it easy to spot misconfiguration and get an overview of what is loaded in your shell instance.

```bash
antigen list --long
https://github.com/robbyrussell/oh-my-zsh.git lib plugin true
https://github.com/robbyrussell/oh-my-zsh.git plugins/git plugin true
https://github.com/robbyrussell/oh-my-zsh.git plugins/docker plugin true
https://github.com/robbyrussell/oh-my-zsh.git plugins/kubectl plugin true
https://github.com/robbyrussell/oh-my-zsh.git plugins/themes plugin true
https://github.com/robbyrussell/oh-my-zsh.git themes/cloud.zsh-theme theme true

```

## Conclusion <!-- omit in toc -->

As you can see, Antigen simplifies and unifies the process of consuming both plugins and themes from different sources. Adopting Antigen allows me to keep my `.zshrc` readable and maintainable. I think it is worth checking out this small set of helper functions.