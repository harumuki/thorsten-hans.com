---
title: How to Clean ZSH History Temporary
layout: post
permalink: how-to-clean-zsh-history-temporary
published: true
tags: 
  - Shell
excerpt: "This article explains how to clean your ZSH history temporarily by direct invocation or by creating a custom function. Prevent yourself from leaking sensitive information via ZSH history."
image: /terminal.jpg
unsplash_user_ref: grohsfabian
unsplash_user_name: Fabian Grohs
---
I am super fussy when it comes to terminal configuration. I tweak my dotfiles now and then to optimize my workflow and improve my overall productivity.

I love having features like auto-suggestion. However, I work for different customers, and I do quite a lot of public speaking at developer conferences (or virtual events these days). In situations like these, I have to clear the entire ZSH history for the current terminal session, to prevent me from leaking sensitive information unintentionally.

## Clean ZSH History Temporary

To clean history temporarily, you can use `HISTSIZE`:

```bash
# Clear history for the current terminal session
local HISTSIZE=0

```

## Clean ZSH History Temporary With A Function

Alternatively, you can create a custom function in your `.zshrc` configuration file like this:

```bash
# Add function to .zshrc
echo "function clear_history { local HISTSIZE=0; }" >> ~/.zshrc

# reload .zshrc
source ~/.zshrc

# call the clear_history function

```

You see, it is super simple to clear the ZSH history temporarily. Add it as function to your `.zshrc` and prevent yourself from accidentally leaking sensitive information when using your shell.
