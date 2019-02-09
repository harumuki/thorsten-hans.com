---
title: Autocompletion for kubectl and aliases using oh-my-zsh
layout: post
permalink: autocompletion-for-kubectl-and-aliases-using-oh-my-zsh
redirect_from: /2017-08-22_Autocompletion-for-kubectl-and-aliases-using-oh-my-zsh-6b5295dc6dfb
published: true
tags: [Kubernetes, Tools, Shell]
excerpt: Learn how to boost your productivity by defining aliases and enable auto completion for kubectl
featured_image: /assets/images/posts/feature_images/2017-08-22-autocompletion-for-kubectl-and-aliases-using-oh-my-zsh.jpg
---
*Kubernetes* is managed and used by utilizing the command line interface `kubectl`. I got a ton of questions regarding my terminal configuration for daily k8s tasks. Questions like *“Which aliases do you use for regular k8s tasks?”* or *“How did you get autocompletion for all the k8s stuff up and running on your mac?”* 
So this post will answer those questions quickly to ensure everyone will become more productive and can spin up even more pods and nodes in less time 🚀

## Create an kubectl alias

`kubectl` is an amazing CLI. There is only one disadvantage, the name. I can’t recall how many times my terminal was saying

```bash
zsh: command not found: kuberclt
# or
zsh: command not found: kubctl

```

Or referring to any of the other 1000 typos. Thankfully each and every shell can deal with aliases. No matter if you use *bash* or *oh-my-zsh*, the configuration syntax for aliases is dead simple and consistent across most important shells. Simply add the following line to your `.zshrc` or `.bashrc` file.

```bash
alias k="kubectl"

```

Restart the terminal or source the config file `source ~/.zshrc` and you’re done. You can access `kubectl` by simply hitting `k`.

## Enable autocompletion for kubectl

Enabling autocompletion for `kubectl` heavily depends on the shell you’re using. To be honest, I don’t know if each shell is able to provide autocompletion for `kubectl`. That’s the point when *oh-my-zsh* enters the stage. That shell is awesome, easy to configure and it has a minimal *time-to-code*.

*time-to-code* is a term that describes the time you spent from unboxing your shiny new notebook till writing the first line of code or executing the first command in this case. (hopefully, neither [Andrew Connell](https://twitter.com/andrewconnell) nor [Chris Johnson](https://twitter.com/c_f_johnson) have a trademark for that term).

Once you’ve [installed *oh-my-zsh*](http://ohmyz.sh/)😃, you can easily enable the **kubectl** plugin by adding `kubectl` to the list of plugins in your `.zshrc`. That should look similar to this:

```bash
# somewhere in your zshrc
plugins=(git git-flow brew history node npm kubectl)

```

That’s it. Nothing more is required. *oh-my-zsh* does all the magic for you. Autocompletion will work for both: `kubectl` and the recently created alias `k`.

{% include image-caption.html imageurl="/assets/images/posts/2017/ohmyzsh-kubectl.gif" 
title="kubectl and k autocompletion in oh-my-zsh" caption="kubectl and k autocompletion in oh-my-zsh" %}

Having this configuration in place, you'll gain more speed when working with *Kubernetes* and you'll produce less typos!
