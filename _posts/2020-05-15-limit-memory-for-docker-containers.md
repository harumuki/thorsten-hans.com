---
title: Docker Container Memory Limits Explained
layout: post
permalink: limit-memory-for-docker-containers
published: true
date: 2020-05-15 08:30:00
tags: 
  - Docker
excerpt: "Specifying Docker container memory limits is essential to keep your local machine fast and healthy. This post shows how to set memory and swap limits for Docker Containers."
image: /memory.jpg
unsplash_user_name: Liam Briese
unsplash_user_ref: liam_1
---

When running [Docker](http://docker.com/){:target="_blank"} Images locally, you may want to control how many memory a particular container can consume. Otherwise, it may end up consuming too much memory, and your overall system performance may suffer.
By default, Docker does not apply memory limitations to individual containers. Containers can consume all available memory of the **host**.

No need to panic (for most of the users)! If you are using [Docker Desktop](https://www.docker.com/products/docker-desktop){:target="_blank"}, the **host** is actually a **virtualized host**. On macOS, the **host** is a virtualized system leveraging Apple’s Hypervisor framework (which has been released with macOS 10.10 Yosemite). We use the Docker Desktop app, to specify an overall limit for containerized workloads.

{% include image-caption.html imageurl="/assets/images/posts/2020/docker-memory-1.png"
title="Docker Container Memory Limits - Set global memory limit" caption="Docker Desktop - Set global memory limit" width="750px" %}

When starting a container with Docker CLI using `docker run`, two flags - `--memory` and `--memory-swap` - are available, which you can use to control the available memory for the container.

We can specify the Docker container memory limits (excluding swap) using the `--memory` or the shortcut `-m`.  When the container exceeds the specified amount of memory, the container will start to swap. By default, the container can swap the same amount of assigned memory, which means that the overall hard limit would be around 256m when you set `--memory 128m`. I quickly create a diagram to explain how both values relate to each other.

{% include image-caption.html imageurl="/assets/images/posts/2020/docker-memory-2.png"
title="Docker Container Memory Limits - Relationship of memory and swap" caption="Docker Memory Limits - Relationship of memory and swap" %}

## Testing Docker Memory Limits

To test memory limits for Docker containers, we will use the `progrium/stress` [image from Docker Hub](https://hub.docker.com/r/progrium/stress/){:target="_blank"}, which is a Docker image providing the stress-testing-tool [stress](http://people.seas.harvard.edu/~apw/stress/){:target="_blank"}.

Knowing about the default behavior of `memory-swap`, both of the following tests will succeed, although the allocated memory is higher than `memory`.

### Respect Memory Limit

```bash
docker run --rm -m 128m progrium/stress -c 1 --vm 1 --vm-bytes 96m -t 5s

stress: info: [1] dispatching hogs: 1 cpu, 0 io, 1 vm, 0 hdd
stress: dbug: [1] using backoff sleep of 6000us
stress: dbug: [1] setting timeout to 5s
stress: dbug: [1] --> hogcpu worker 1 [6] forked
stress: dbug: [1] --> hogvm worker 1 [7] forked
stress: dbug: [1] <-- worker 6 signalled normally
stress: dbug: [1] <-- worker 7 signalled normally
stress: info: [1] successful run completed in 5s

```

### Utilize The Swap

```bash
docker run --rm -m 128m progrium/stress -c 1 --vm 1 --vm-bytes 200m -t 5s

stress: info: [1] dispatching hogs: 1 cpu, 0 io, 1 vm, 0 hdd
stress: dbug: [1] using backoff sleep of 6000us
stress: dbug: [1] setting timeout to 5s
stress: dbug: [1] --> hogcpu worker 1 [6] forked
stress: dbug: [1] --> hogvm worker 1 [7] forked
stress: dbug: [1] <-- worker 6 signalled normally
stress: dbug: [1] <-- worker 7 signalled normally
stress: info: [1] successful run completed in 5s

```

### Exceed Implicit Swap Limit

However, if we exceed the overall limit (memory plus swap), by instructing `stress` to allocate 300 MB, our container will fail due to insufficient memory.

```bash
docker run --rm -m 128m progrium/stress -c 1 --vm 1 --vm-bytes 300m -t 5s
stress: FAIL: [1] (416) <-- worker 7 got signal 9
stress: WARN: [1] (418) now reaping child worker processes
stress: FAIL: [1] (452) failed run completed in 2s
stress: info: [1] dispatching hogs: 1 cpu, 0 io, 1 vm, 0 hdd
stress: dbug: [1] using backoff sleep of 6000us
stress: dbug: [1] setting timeout to 5s
stress: dbug: [1] --> hogcpu worker 1 [6] forked
stress: dbug: [1] --> hogvm worker 1 [7] forked
stress: dbug: [1] <-- worker 6 reaped

```

### Define Swap Explicitly

We control the overall available memory (including the swap) by individually setting the `--memory-swap` flag.

```bash
docker run --rm -m 128m --memory-swap 150m progrium/stress -c 1 --vm 1 --vm-bytes 140m -t 5s

stress: info: [1] dispatching hogs: 1 cpu, 0 io, 1 vm, 0 hdd
stress: dbug: [1] using backoff sleep of 6000us
stress: dbug: [1] setting timeout to 5s
stress: dbug: [1] --> hogcpu worker 1 [6] forked
stress: dbug: [1] --> hogvm worker 1 [7] forked
stress: dbug: [1] <-- worker 6 signalled normally
stress: dbug: [1] <-- worker 7 signalled normally
stress: info: [1] successful run completed in 5s

```

### Exceed Explicit Swap Limit

If we exceed the overall memory limit, the stress test will fail because of insufficient memory

```bash
docker run --rm -m 128m --memory-swap 150m progrium/stress -c 1 --vm 1 --vm-bytes 160m -t 5s

stress: FAIL: [1] (416) <-- worker 7 got signal 9
stress: WARN: [1] (418) now reaping child worker processes
stress: FAIL: [1] (452) failed run completed in 1s
stress: info: [1] dispatching hogs: 1 cpu, 0 io, 1 vm, 0 hdd
stress: dbug: [1] using backoff sleep of 6000us
stress: dbug: [1] setting timeout to 5s
stress: dbug: [1] --> hogcpu worker 1 [6] forked
stress: dbug: [1] --> hogvm worker 1 [7] forked
stress: dbug: [1] <-- worker 6 reaped

```

### Assign Unlimited Swap

Sometimes it makes sense to limit the memory but use an unlimited amount of swap. You can do so by setting the `--memory-swap` to `-1`. The following example allocates 512 MB of memory in total, where it swaps 384 MB.

```bash
docker run --rm -m 128m --memory-swap -1 progrium/stress -c 1 --vm 1 --vm-bytes 512m -t 10s

stress: info: [1] dispatching hogs: 1 cpu, 0 io, 1 vm, 0 hdd
stress: dbug: [1] using backoff sleep of 6000us
stress: dbug: [1] setting timeout to 10s
stress: dbug: [1] --> hogcpu worker 1 [7] forked
stress: dbug: [1] --> hogvm worker 1 [8] forked
stress: dbug: [1] <-- worker 7 signalled normally
stress: dbug: [1] <-- worker 8 signalled normally
stress: info: [1] successful run completed in 10s

```

## Conclusion

Using the `--memory` and `- memory-swap` flags, you have fine-granular control over Docker container memory limits. Understanding how Docker handles memory and swap limits you are able to control how many memory your containers may consume.

By setting memory and swap limits explicitly to all your Docker containers, you can balance resource utilization and control priority between different containers running at the same time on your local machine.
