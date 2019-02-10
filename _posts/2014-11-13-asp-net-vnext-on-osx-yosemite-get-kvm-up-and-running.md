---
title: ASP.NET vNext on OSX Yosemite — Get KVM up and running
layout: post
permalink: asp-net-vnext-on-osx-yosemite-get-kvm-up-and-running
redirect_from: /asp-net-vnext-on-osx-yosemite-get-kvm-up-and-running-12ec7f774d7
published: true
tags: [NetCore]
excerpt: null
featured_image: /assets/images/posts/feature_images/repair.jpg
unsplash_user_ref: rawpixel
unsplash_user_name: rawpixel
---

I use .NET for building WebAPI’s because all other stuff is mostly done using AngularJS and Node.js in these days. However, since the incredible change that Microsoft is living these days, I can finally get rid of my virtual development machine 🙂

To get ASP.NET vNext up and running on your Mac, you’ve of course to use Mono. In the case you’ve already installed Xamarin on your system, you may run into the issue that your Mono version is outdated.

Xamarin’s documentation doesn’t mention anything regarding support for latest vanilla Mono runtime. Cause of that I’d to uninstall Xamarin, and it’s own Mono build. They Xamarin site is offering a good [guide which explains how to remove Xamarin and all its dependencies](http://developer.xamarin.com/guides/cross-platform/getting_started/installation/uninstalling_xamarin/){:target="_blank"}.

You should install [Homebrew](http://brew.sh/){:target="_blank"} to manage all the software dependencies on your Mac  -  **this is not related to ASP.NET vNext - brew is mandatory on every Mac 😀**

Once Homebrew is installed, you can easily install Mono using

`brew install mono`

When following the guide from [aspnet/home](https://github.com/aspnet/home){:target="_blank"} I ran into some strange issues, caused by the fact that the link to `kvm` in [kvminstall.sh](https://github.com/aspnet/Home/blob/master/kvminstall.sh){:target="_blank"} is pointing to an outdated version of KVM.

I followed the guide step by step, at the end my terminal was broken, and I wasn’t able to start neither iTerm nor Bash. 🙁

The KVM installation script is adding the KVM registration into both `.zshrc` and `.bashrc` which looks like the following:

```bash
[ -s "/Users/<<USERNAME>>/.kre/kvm/kvm.sh" ] && . "/Users/<<USERNAME>>/.kre/kvm/kvm.sh" 
# Load kvm`
```

More information on that issue can be found [here](https://github.com/aspnet/kvm/issues/83){:target="_blank"}.

If you run in the same issue, you should ensure that you’ve trapped the most recent version of aspnet/home. The problem is fixed in the `master` branch since 12th of November 2014.

If you've forked or cloned before that day, it could be possible that you run into the same issue. So you can either pull the latest version of you can change the link to `kvm.sh` in `kvminstall.sh` line `30` and point that one to the most recent version.


