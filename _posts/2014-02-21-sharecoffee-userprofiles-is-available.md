---
title: ShareCoffee.UserProfiles is available
layout: post
permalink: sharecoffee-userprofiles-is-available
redirect_from: /sharecoffee-userprofiles-is-available-ae16b1569f64
published: true
excerpt: A bunch of new features for ShareCoffee targeting user profiles. Check them out!
tags: [SharePoint, O365, ShareCoffee]
featured_image: /assets/images/posts/feature_images/announcement.jpg
unsplash_user_name: Matt Botsford
unsplash_user_ref: mattbotsford
---

Today I’ve published the next AddOn for [ShareCoffee](https://github.com/ThorstenHans/ShareCoffee){:target="_blank"}. ShareCoffee.UserProfiles. It’s providing a dedicated wrapper for SharePoint’s UserProfiles API.

By using the new AddOn, you can easily configure REST requests for dealing with SharePoint’s UserProfile REST API from both, SharePoint Hosted and Cloud-Hosted Apps.

## Installation

You can install the AddOn (which will automatically pull ShareCoffee as a dependency) by using.

- NuGet
- bower.io

## Coverage

Not all UserProfile methods are currently available as REST endpoint. Currently, SharePoint is offering the following methods which can, of course, be used with ShareCoffee

- `GetMyProperties`
- `GetProperties`
- `GetUserProfileProperty`
- `SetMyProfilePicture`

## Sample

Here is a short sample on how to use ShareCoffee’s UserProfiles AddOn from within an AngularJS App written in CoffeeScript:

```coffeescript
window.MyAngularApp.service 'userProfilesService', ['$http', ($http) ->
  loadMyProfile: (onSuccess, onError) ->
    
    $http ShareCoffee.REST.build.read.for.angularJS
      url: ShareCoffee.Url.GetMyProperties
    .success onSuccess
    .error onError
    
  loadProfilePropertiesForUser: (accountName, onSuccess, onError) ->
    properties = new ShareCoffee.UserProfileProperties(ShareCoffee.Url.GetUserProfileProperty, accountName, 'WorkEmail')
    $http ShareCoffee.REST.build.read.for.angularJS
      properties
    .success onSuccess
    .error onError

```

If you’re looking for sample Apps using ShareCoffee and all of its AddOns (Search / UserProfiles) you should check out the updated Samples repository [on the GitHub repository](https://github.com/ShareCoffee/ShareCoffee.Samples){:target="_blank"}.

If you’ll be visiting SharePoint Conference 2014 in Las Vegas come to my session #SPC417 and see some ShareCoffee Action 🙂


