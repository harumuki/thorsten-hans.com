---
title: Easy switching between yammer accounts
layout: post
permalink: easy-switching-between-yammer-accounts
redirect_from: /easy-switching-between-yammer-accounts-73579d4d4001
published: true
tags: [Tools]
excerpt: Are you using multiple Yammer networks, in this post I'll explain how to switch easily between those.
image: /general.jpg
unsplash_user_name: Sergey Zolkin
unsplash_user_ref: szolkin
---

Yammer is organized within different networks, which is excellent as long as you’re invited with a single mail address. As soon as you accept an invitation for a second email address you’ve to explicitly log out with the first mail address and re-login with the second one.

Yammer is currently not offering a mechanism to merge or link two accounts.

Most Yammer users are using different browsers to deal with this problem. However, that wasn’t a solution for me. I’ve configured Chrome to fit my needs, provide all my bookmarks in a single place and I won't lose this experience because of the missing ‘merge my accounts feature’ in Yammer.

Chrome is offering an extension API that allows us as developers to easily create Add-Ons for the perhaps most popular browser.

Creating a new AddOn is straight forward, you need only three natural components to achieve the requirement of easily switching accounts.

- An image for the extension
- A manifest file (JSON)
- A script file which contains the logic for our extension

Within the manifest, there are a few metadata fields which you’ve to set to get your extension working. However, most important are the permissions that our extension needs to demand.

To open a new incognito window in the Chrome Browser, we’ve to request the `tabs` permission. Because we’re requesting a redirect to yammer itself we’ve also to add permission requests for `http://*.yammer.com**` and `https://*.yammer.com**`.

The actual extension is pretty simple; when our extension button is clicked, we’d like to execute a small piece of JavaScript which will open a new Incognito Chrome Window and redirect the user to the Yammer landing page.

Chrome is offering a great API-set which makes it easy to deal with that requirement.

```javascript
chrome.browserAction.onClicked.addListener(function(window) {
  chrome.windows.create({url:"https://www.yammer.com/login", incognito: true});
});

```

With all these files in a single directory, you can easily install the extension directly from Chrome’s `Extension` window.

I’ve uploaded my **YammerSwitcher** to github, browse it [here](https://github.com/ThorstenHans/YammerSwitcher){:target="_blank"}


