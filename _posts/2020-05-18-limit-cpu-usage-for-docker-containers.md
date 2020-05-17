---
title: Docker Container CPU Limits Explained
layout: post
permalink: docker-container-cpu-limits-explained
published: true
date: 2020-05-18 08:30:00
tags: 
  - Docker
excerpt: "Limit CPU capacity per Docker container. Assign containers to dedicated CPUs. Balance available CPU capacity by priority to Docker containers. Control the Docker container CPU limits now."
image: /cpu.jpg
unsplash_user_name: Liam Briese
unsplash_user_ref: liam_1
---

If we think about Docker containers, we tend to associate words like efficient and small to them. Although this may be the case for the vast of situations, there are exceptions. There are containers that - perhaps unintentionally -  have a very high CPU utilization. This post explains how you can limit CPU utilization for specific Docker containers to have better control of the overall hardware utilization.

On top of providing CPU limits for Docker containers, you should also limit the memory consumption. Consider reading my article, [Limit Memory For Docker Containers]({% post_url 2020-05-15-limit-memory-for-docker-containers%}){:target="_blank"}, and learn how to prevent memory-intensive Docker containers from draining your overall system performance.

By default, Docker does not apply any CPU limitations. Containers can all of the hosts given CPU power.

Relax, a Docker container will not consume the entire CPU power of your **physical host**. If you are using Docker Desktop, the **host** I mentioned, it is a **virtualized host**, responsible for running your Docker containers. On macOS, the **host** is a virtualized system leveraging Apple’s Hypervisor framework (which has been released with macOS 10.10 Yosemite). We can use the Docker Desktop application to control the overall limit of CPU utilization in all Docker containers.

{% include image-caption.html imageurl="/assets/images/posts/2020/docker-overall-cpu-limits.png"
title="Docker container CPU limits - Virtual host limits" caption="Docker Desktop - Virtual host limits" width="750px" %}

We have several attributes, which we use to control CPU allocation and allocation-priority for a Docker container. We use `--cpus` to set a CPU utilization limit, `--cpuset-cpus` to associate containers to dedicated CPUs or CPU-cores, and we have `--cpu-shares` which we will use to control CPU allocation-priority for a Docker container.

## Verifying CPU Utilization With Ctop

[ctop](https://ctop.sh/){:target="_blank"} is an excellent, yet minimalistic command-line tool to inspect actual resource consumption of Docker containers on your system. I highly recommend using ctop on macOS and Windows to get insights about your Docker containers in no time, straight from the command line. ctop is also great for Linux systems. However, on Linux, you have way more possibilities to inspect container resource utilization because underlying [cgroups](https://www.kernel.org/doc/Documentation/cgroup-v1/cgroups.txt){:target="_blank"} collect and expose way more metrics about actual resource usage. Consult the official Docker documentation and [learn how to get deeper insights using croups](https://docs.docker.com/config/containers/runmetrics/#control-groups){:target="_blank"}.

## Docker Image Used For Testing

To test CPU utilization limits, we use the `progrium/stress` [image from Docker Hub](https://hub.docker.com/r/progrium/stress/){:target="_blank"}, which is a Docker image providing the stress-testing-tool stress. `stress` will generate load on the CPU by calculating the square root of random numbers.

## The Test Environment

All of the tests were executed on a MacBook Pro 15, equipted with an Intel Core i7-7920HQ and 16 gigs of memory.I have **assigned two (2) CPU cores** in Docker Desktop for **all of my local containers**. I have also opened two terminal sessions next to each other, which allows me to switch between _ctop_ and the terminal to spin up containers instance quickly.

{% include image-caption.html imageurl="/assets/images/posts/2020/docker-cpu-terminal-setup.png"
title="Docker container CPU limits - Terminal configuration" caption="Terminal configuration for tests" %}

## Run Containers Without Limits

First, let us see how the `stress` container allocates the CPUs when we run the Docker Image without specifying any CPU limitation. The following command will run the `stress` container for 20 seconds:

```bash
# 20 seconds NO LIMIT
docker run -d --rm progrium/stress -c 8 -t 20s

```

The container allocates all of the available 200% CPU capacity (per CPU you have 100%) to get its job done.

{% include image-caption.html imageurl="/assets/images/posts/2020/docker-cpu-test-1.png"
title="Docker container CPU limits - Unlimited" caption="Docker container without CPU limit" %}

## Define A CPU Limit

Now let’s limit the next container to just one (1) CPU. We specify such a limit by using the `--cpus` argument when using `docker run`:

```bash
# 20 seconds limit of 1 CPU
docker run -d --rm --cpus 1 progrium/stress -c 8 -t 20s

```

Again, take a look at ctop and verify your container using ~ 100% CPU.

{% include image-caption.html imageurl="/assets/images/posts/2020/docker-cpu-test-2.png"
title="Docker container CPU limits - Limit to one CPU" caption="Limit Docker container to one CPU" %}

We can use this approach and balance CPU utilization when running multiple containers at the same time:

```bash
# Spin up four containers, each with a limit of 0.5
docker run -d --rm --cpus 0.3 progrium/stress -c 8 -t 10s
docker run -d --rm --cpus 0.3 progrium/stress -c 8 -t 20s
docker run -d --rm --cpus 0.3 progrium/stress -c 8 -t 20s
docker run -d --rm --cpus 0.3 progrium/stress -c 8 -t 20s

```

Take a look at _ctop_; you will see every container allocating around 33%. The first container will be stopped ten (10) seconds before the other ones. However, none of the remaining will consume the spare 33% CPU capacity.

{% include image-caption.html imageurl="/assets/images/posts/2020/docker-cpu-test-3.gif"
title="Docker container CPU limits - Balancing CPU load" caption="Docker containers balanced CPU load" %}

### Docker Prevents You From Exceeding The Limit

Docker will throw an error when you try to set a limit, higher than the number of CPUs available to the Docker host. Remember, we have assigned 2 CPUs to the Docker host. If we try to limit the container to three (3) CPUs, Docker will throw:

```bash
# Set limit higher than the number of available CPUs
docker run -d --rm --cpus 3 progrium/stress -c 8 -t 20s

docker: Error response from daemon: Range of CPUs is from 0.01 to 2.00, as there are only 2 CPUs available.

```

## Assign Containers To Dedicated CPU(s)

The chances are good that your Docker host has more than just a single CPU. If that is the case, you can select the CPU - or the CPUs - which should be allocated by the container. This allows you to separate several containers onto different CPUs or cores. `--cpuset-cpus` accepts values in two different formats. You can specify desired CPUs using

- a comma-separated list `0,2,4`
- a range `1-3`

CPUs are addressed using a zero (`0`) based index. This means `0,2,4` tells Docker to allocate compute-power from the first, third, and fifth CPU.

```bash
 # Run a container and allocate just the 2nd CPU
docker run -d --rm --cpuset-cpus 1 progrium/stress -c 8 -t 20s

```

Becuase the set of CPUs is selected explicitly, the container is limited to the capacity of the set.

{% include image-caption.html imageurl="/assets/images/posts/2020/docker-cpu-test-4.png"
title="Docker container CPU limits - Limit load with CPU sets" caption="Limit Docker container CPU load with CPU sets" %}

If you specify an invalid CPU index, Docker will throw an error when you try to start the container.

```bash
# Try to start a container with invalid CPU pointer
docker run -d --rm --cpuset-cpus 5 progrium/stress
docker: Error response from daemon: Requested CPUs are not available - requested 5, available: 0-1.

```

### Prioritize CPU Allocation

With `--cpu-shares`, we can control the allocation priority when CPU cycles are constrained. If your environment has enough CPU cycles available, the value provided for `--cpu-shares` has no effect.

The default value is `1024`. Use lower numbers to define a lower priority, in contrast values greater than `1024` result in a higher priority. Remember the overall CPU limitation of two (2) CPUs. We will run the stress-test with the same configuration values to allocate up to one and a half (1.5) CPUs. The only difference is in specified shares (`--cpu-shares`).

```bash
docker run -d --rm --cpu-shares 2000 --cpus 1.5 progrium/stress -c 8 -t 40s
docker run -d --rm --cpu-shares 1000 --cpus 1.5 progrium/stress -c 8 -t 20s

```

The first container consumes the desired 150% CPU. As soon as the second container appears, Docker starts balancing the CPU consumption based on values provided for `--cpu-shares`. Once the second container finished calculating square roots of random numbers, the first container will again consume 150%.

{% include image-caption.html imageurl="/assets/images/posts/2020/docker-cpu-test-5.gif"
title="Docker container CPU limits - Balance load with CPU shares" caption="Balance CPU load with CPU shares" %}

## Conclusion

Defining Docker container CPU limits is as essential as defining memory limits. Fortunately, Docker Desktop sets global limits to prevent users from draining their system entirely by running insufficient Docker Images on their rig. However, I think it is a good practice to treat your local development machine like your Kubernetes cluster and explicitly set resource limits.

I hope this post found you healthy and addressed all questions. If you enjoyed the article, leave a comment, and share the article with your teammates and help them grow.
