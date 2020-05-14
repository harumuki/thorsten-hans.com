---
title: How To Run Commands In Stopped Docker Containers
layout: post
permalink: how-to-run-commands-in-stopped-docker-containers
published: true
tags: 
  - Docker
excerpt: "This article explains how to execute a command in a Docker container, which stopped already. See how to promote a Docker container as a Docker image and how to overwrite the original Entrypoint to inspect container internals like filesystem."
image: /orca.jpg
unsplash_user_name: NOAA
unsplash_user_ref: noaa
---

You may already know the `exec` command, which allows you to execute a command inside of a running Docker container. This works excellent and will enable us to dive into a running container to inspect certain things like files in the file system, running processes, and other stuff. However, `exec` does not work when the Docker container stopped already.  

When we try to run `/bin/sh` on a stopped container using `docker exec`, Docker will throw a `No such container` error. We have to transform the stopped Docker container into a new Docker image before we can inspect the internals of the container.
We can transform a container into a Docker image using the  `commit` command. All we need to know is the name or the identifier of the stopped container. (You can get a list of all stopped containers with `docker ps -a`).

```bash
docker ps -a
CONTAINER ID   IMAGE   COMMAND     CREATED         STATUS                    NAMES
0dfd54557799   ubuntu  "/bin/bash" 25 seconds ago  Exited (1) 4 seconds ago  peaceful_feynman

```

Having the identifier `0dfd54557799` of the stopped container, we can create a new Docker image. The resulting image will have the same state as the previously stopped container. At this point, we use `docker run` and overwrite the original `entrypoint` to get a way into the container.

```bash
# Commit the stopped image
docker commit 0dfd54557799 debug/ubuntu

# now we have a new image
docker images list
REPOSITORY    TAG     IMAGE ID       CREATED         SIZE  
debug/ubuntu  <none>  cc9db32dcc2d   2 seconds ago   64.3MB


# create a new container from the "broken" image
docker run -it --rm --entrypoint sh debug/ubuntu
# inside of the container we can inspect - for example, the file system
$ ls /app
App.dll
App.pdb
App.deps.json
# CTRL+D to exit the container

# delete the container and the image
docker image rm debug/ubuntu

```

As you can see, it is easy to inspect certain things of stopped containers by re-using them as Docker image for investigation. Did you like the article? Were all questions answered? Please let me know. 👇🏻