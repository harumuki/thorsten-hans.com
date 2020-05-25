---
title: Container Metrics With CTOP
layout: post
permalink: docker-container-metrics-ctop
published: true
tags: 
  - Docker
excerpt: Get Docker container metrics with ctop. Get direct access to log streams and fundamental container interactions. Get super efficient using ctop and its keybindings
image: /mechanical-keyboard.jpg
unsplash_user_name: NihoNorway graphy
unsplash_user_ref: nihongraphy
---
A while ago, I stumbled upon `ctop`; a small, yet handy command-line tool to interact with Docker containers and gather essential metrics. You know `docker stats`? `ctop` is `docker stats` on steroids. The open-source tool is available for free and can be installed directly on Linux and macOS.

{% include image-caption.html imageurl="/assets/images/posts/2020/docker-metrics-ctop-1.png"
title="Docker Container Metrics with ctop" caption="ctop - Essential metrics for Docker containers" %}

With `ctop`, you get more than just fundamental metrics. Overall, `ctop` combines the following features in one single tool:

- display memory consumption per container ([learn how to limit memory consumption]({% post_url 2020-05-15-limit-memory-for-docker-containers %}))
- display CPU utilization per container  ([learn how to limit CPU utilization]({% post_url 2020-05-18-limit-cpu-usage-for-docker-containers %}))
- direct access to the container log stream
- essential container interaction like starting. stopping and so on
- execute commands in containers

I use ctop because it is efficient and straightforward. All features are accessible within just one keystroke.

## Install CTOP

### Linux

Manual Installation:

```bash
# Download ctop
sudo wget https://github.com/bcicen/ctop/releases/download/v0.7.3/ctop-0.7.3-linux-amd64 -O /usr/local/bin/ctop
# change file mod to make it executable
sudo chmod +x /usr/local/bin/ctop

```

### MacOS

Installation with Homebrew:

```bash
brew install ctop

```

Manual installation:

```bash
# Download ctop
sudo curl -Lo /usr/local/bin/ctop https://github.com/bcicen/ctop/releases/download/v0.7.3/ctop-0.7.3-darwin-amd64
# change file mod to make it executable
sudo chmod +x /usr/local/bin/ctop

```

### Run It In A Container

Alternatively, you can run `ctop` directly inside of a Docker container.

```bash
docker run --rm -it --name ctop-container \
  --volume /var/run/docker.sock:/var/run/docker.sock:ro \
  quay.io/vektorlab/ctop:latest

```

## CTOP Keybindings

Navigation in `ctop` is simple but efficient. Learn the following keybindings to get most out of `ctop`.

| Key     | Action                                  |
|---------|-----------------------------------------|
| h       | Show help dialog                        |
| l       | Show container logs                     |
| e       | Exec Shell                              |
| q       | Close ctop                              |
| [ENTER] | Open container menu                     |
| a       | Toggle view (running / all containers)  |
| f       | Filter view (ESC to close filter view)  |
| H       | Toggle Header                           |
| s       | Select sort field                       |
| r       | Reverse sort order                      |
| o       | Open single view for selected container |

## Stream Container Logs With CTOP

From the main view, select the desired container using arrow keys and hit `l` top access the log stream of the container

{% include image-caption.html imageurl="/assets/images/posts/2020/docker-metrics-ctop-2.png"
title="Docker Container log stream with ctop" caption="ctop - Access Docker container log stream" %}

## Navigate CTOP With The Container Menu

While you are learning the keybindings, you could use the container menu to navigate. Just select a container - arrow keys - and hit `[ENTER]`. `ctop` will bring up a contextual menu, showing all available actions in the context of a particular Docker container.

{% include image-caption.html imageurl="/assets/images/posts/2020/docker-metrics-ctop-3.png"
title="ctop container menu navigation" caption="ctop - Access functionalities with container menu" %}

## Conclusion

I love the simplicity and efficiency of `ctop`.  I can access a bunch of container-related features within just one keystroke. It makes investigating super-efficient and increases overall productivity. Do you use another tool to achieve this? I would love to learn about your setup and see other opportunities.
