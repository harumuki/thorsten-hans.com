---
title: grunt-nuget - Create NuGet packages on macOS and Linux
layout: post
permalink: grunt-nuget-packaging-for-mac-and-linux
redirect_from: /grunt-nuget-packaging-for-mac-and-linux-e8c2634c5637
published: true
tags: [Frontend]
excerpt: Learn how to build NuGet packages on macOS and Linux systems.
image: /shipping.jpg
unsplash_user_name: Ronan
unsplash_user_ref: ronan18
---
While building *ShareCoffee*, I recognized that building NuGet packages doesn’t work on macOS or Linux. Today I’d the chance to look again into this issue.

I’ve used [grunt-nuget](https://github.com/spatools/grunt-nuget){:target="_blank"} for building the NuGet packages for ShareCoffee from within my [GruntJS](http://www.gruntjs.com){:target="_blank"} tasks.

Responsible for the fact that I wasn’t able to create the NuGet packages on MacOS or Linux was the `.nuspec` file. To build NuGet packages on other operating systems than Windows systems, you’ve to use Unix paths instead of Windows paths.

Most other `grunt-tasks` are modifying all the paths depending on your environment.

So you’ve to provide the path in the following form for files.

```xml
<files>
  <file src="readme.txt" target="" />
  <file src="dist/**.*" target="content/Scripts/ShareCoffee" />
</files>

```


