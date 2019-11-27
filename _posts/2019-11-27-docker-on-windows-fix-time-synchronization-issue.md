---
title: Docker on Windows - Fix Time Synchronization Issue
layout: post
permalink: docker-on-windows-fix-time-synchronization-issue
published: true
tags: [Windows,Docker]
excerpt: 'Are your Docker containers on Windows behind a couple of hours or even days? Are they displaying or working with a wrong time/date? Read why this happens and how to fix it.'
image: /orca.jpg
unsplash_user_name: NOAA
unsplash_user_ref: noaa
---

If you follow [me on Twitter (@ThorstenHans)](https://twitter.com/ThorstenHans){:target="_blank"}, you may have recognized that I am in the process of switching from macOS back to Windows after almost seven years. (Different story, and I schedule a dedicated post on that at some point before 2020).

During validation of Windows as main operating system (which is still ongoing), I experienced strange issues when trying to build my blog using the `jekyll/jekyll` Docker Image running on Windows 10.

At some point, `jekyll build` printed strange warnings that my shiny new article wont be compiled because it has a date in future.

I checked the filename and frontmatter metadata of the post. However both looked good. So I dived a bit deeper and recognized that the date within the container was set to **25th** of November whereas my host system was displaying the **27th** of November.

I recognized this by looking into the running `myblog` container like this:

```bash
# running container
docker exec -it myblog sh

root@myblog $ date
Wed Nov 25 15:19:00 CST 2019

# kill
root@myblog $ [CTRL+D]

```

Without running container, you can spin up a new  to verify like this:

```bash
docker run --rm -it alpine sh
root@342a34d $ date
Wed Nov 25 15:19:00 CST 2019

# kill
root@342a34d $ [CTRL+D]
```

A quick search brought me to this dedicated [Docker Desktop for Windows issue](https://github.com/docker/for-win/issues/72){:target="_blank"}.

## Whats the problem

The problem only appears if you use Windows hibernation. Which is - for a notebook and former macOS user - a fairly common task. Anyways. If you put your machine a sleep using hibernation, the underlying Docker virtual machine (running in HyperV) will be hibernated too. However, when waking up your machine again, **time synchronization** doesn't work anymore.

The differnce between time on host OS and within container is exaclty the duration between hibernation and first Docker Machine interaction after wake-up.

## How to fix it

You can fix it either clicking through the HyperV Admin Interface and disable/enable **Time Synchronization** (*SETTINGS* - *INTEGRATION SERVICES*), or by using the following PoSh script

```powershell
# fix-docker-machine-time-sync.ps1
$vm = Get-VM -Name DockerDesktopVM
$feature = "Time Synchronization"

Disable-VMIntegrationService -vm $vm -Name $feature
Enable-VMIntegrationService -vm $vm -Name $feature

```

Another potential solution is to stop/start the Docker service after hibernation.

HTH
