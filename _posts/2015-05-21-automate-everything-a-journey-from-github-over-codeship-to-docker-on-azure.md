---
title: Automate everything — A journey from GitHub over Codeship to Docker on Azure
layout: post
permalink: automate-everything-a-journey-from-github-over-codeship-to-docker-on-azure
redirect_from: /2015-05-21_Automate-everything---A-journey-from-github-over-codeship-to-docker-on-azure-b52129d3c6bc
published: true
tags: [DevOps]
excerpt: Learn how to connect a GitHub repository with Microsoft Azure using Codeship to realize a CI / CD pipeline for web applications using Docker images.
featured_image: /assets/images/posts/feature_images/2015-05-21-automate-everything-a-journey-from-github-over-codeship-to-docker-on-azure.jpg
unsplash_user_ref: freeche
unsplash_user_name: Thomas Kvistholt
---

Do you want to go from code to (pre)production in a few seconds? No problem. I’ve used the last night to get that working. I want to share the journey with you guys right here.

There are several services involved, but the glue between those services are a set of good old shell scripts 🙂 So, unfortunately, no introduction for services like

- GitHub
- Codeship
- Microsoft Azure
- Docker

If you don’t know those things go for google. There are tons of introductions for each of those.

## The Sample App

Is hosted on GitHub at [https://github.com/thorstenhans/ci-test](https://github.com/thorstenhans/ci-test), nothing special… an almost plain website. JS is written using ECMAScript6 features… to have some tasks that have to be done during build time … See `Gulpfile.js` in the repo for more information…

## CodeShip CI

From GitHub to Codeship is a no-brainer. The trigger is configured to do the CI on every push on each branch.

The Codeship setup command looks like this.

```bash
nvm install 0.10.25
nvm use 0.10.25
npm install gulp babel -g
npm install

```

**Is NVM not yet installed** on your system? No Problem, I’ve written an article on how to do it the right way. [Read it here]({{ "/managing-node-js-and-io-js-with-nvm" | absolute_url }}).

The actual test command is even simpler.

```bash
gulp build

```

## Docker on Azure

To have a staging environment for my ultra-awesome app, I’m using a Docker server hosted on Azure. You can create such a virtual machine directly from the gallery.

Once the machine is created, map the internal port 80 to the external port 80 an ensure that you can log in using `ssh`. You should also configure authentication using your `ssh-key`. There are plenty of tutorials available that describe how to configure authentication using ssh keys instead of passwords. Go and ask google for it.

## Docker Base Image

I’ve created a simple docker image for hosting my app. The docker image itself is derived from the default `ubuntu` docker image. On top of that, I’ve installed ‘nvm’.

Here the dockerfile (see inline comments for more information)

```docker
FROM ubuntu:14.04
LABEL maintainer="Thorsten Hans <thorsten.hans@gmail.com>"

RUN sudo apt-get update --yes

#ensure required bits
RUN sudo apt-get install build-essential libssl-dev curl --yes

# download and invoke NVM installer from github
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.25.2/install.sh | bash

# set nvm dir 
ENV NVM_DIR /home/node/.nvm

# install stable node and use it
RUN . ~/.nvm/nvm.sh && nvm install stable && nvm use stable

# expose port 8080 (default port when running http-server)
EXPOSE 8080

# once an instance will be created invoke the run-app script
CMD ["/bin/bash", "/opt/my-app/scripts/run-app.sh"]

```

Create a new image using that Dockerfile and provide a proper name for it. Mine is named `thorstenhans/simple-node`.

## Connecting Codeship and the Docker server

Codeship is also exposing an ssh-key for each project you create; this can easily be added to your `authorized_keys` file on the docker server. Once this key is ‘marked’ as authorized-key, you can add a custom **Deployment Script** to your Codeship project. The script looks like the following for my configuration (again see comments in the script for hints and clarification)

Replace `$$UID$$` with your username, `$$DOCKER-NAME$$` with your server name and `$$SSH-PORT$$` with the port you’ve configured for SSH.

```shell
cd ~/clone/
# npm prune --production
# !!! prune --production doesn't work on Codeships servers... 
# looks like they're pulling with a different user .... 
# ticket is already opened...
# so let's hack that :) for now
rm -rf node_modules
targetfolder=/sample-product/builds/$CI_COMMIT_ID/
scriptfolder=/sample-product/scripts/
# use scp to push the project to docker server
# create folder structure on remote host (prevent exceptions...)
ssh $$UID$$@$$DOCKER-NAME$$.cloudapp.net -p $$SSH-PORT$$ "mkdir -p $targetfolder" && scp -rp -P $$SSH-PORT$$ ~/clone/* $$UID$$@$$DOCKER-NAME$$.cloudapp.net:$targetfolder
# kick of shell script which will instanciate the docker container!
ssh $$UID$$@$$DOCKER-NAME$$.cloudapp.net -p $$SSH-PORT$$ "cd $scriptfolder && ./deploy.sh $CI_COMMIT_ID"

```

### Deploy.sh

`Deploy.sh` is responsible for creating new containers once Codeship has finished work.

```shell
#!/bin/bash
echo Using Commit $1 
cd /sample-product/builds/
docker kill stage && docker rm stage
rm -rf current && ln -s $1/ current
# everything is fine... fire up a container...
docker run -d -P --name stage -e "commit=$1" -v /sample-product/:/opt/my-app/ -p 80:8080 thorstenhans/simple-node

```

### run-app.sh

The `run-app` script is referenced within the Dockerfile. It is responsible for pulling all the dependencies and kicking the HTTP-server.

```shell
#!/bin/bash
. ~/.nvm/nvm.sh && nvm use stable;
cd /opt/my-app/builds/$commit/

npm install http-server -g
npm install

http-server .

```

## That’s it!

Now you’ve your app up and running in the latest version, directly from GitHub over Codeship to docker. As you can see in the pic, the entire test and deployment (to an accessible public address) took roughly 60 seconds. That’s cute :)

{% include image-caption.html imageurl="/assets/images/posts/2015/codeship-docker.png"
title="Deployment via Codeship and Docker to Microsoft Azure" caption="Deployment via Codeship and Docker to Microsoft Azure" %}

