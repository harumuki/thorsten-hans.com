---
title: 'From the field: Ensure SharePoint Context for all kinds of redirects in MVC'
layout: post
permalink: from-the-field-ensure-sharepoint-context-for-all-kinds-of-redirects-in-mvc
redirect_from: /2014-06-01_From-the-field--Ensure-SharePoint-Context-for-all-kinds-of-redirects-in-MVC-a4123e0cc1a7
published: true
tags: [SharePoint]
excerpt: Are you building Provider Hosted Apps? Check out these insights from real-world projects.
featured_image: /assets/images/posts/feature_images/field.jpg
unsplash_user_name: Tanner Boriack
unsplash_user_ref: tannerboriack
---
During the last months, I was responsible for building a huge *Provider-Hosted SharePoint App*. During this journey, I’ve used the latest version of ASP.NET MVC and Entity Framework to build a beautiful, scalable and clean Web Application to fit customer’s requirements.

When building SharePoint Apps using Visual Studio, a NuGet Package is installed which is also responsible for including `spcontext.js` into your Web-App’s script folder.

This small part of JavaScript is critical. It’s responsible for concatenating SharePoint’s HostUrl QueryString Parameter to each link tag sitting in your Web-App. By concatenating this QueryString parameter, we can create a `SharePointContext` from within the Controller sitting behind the route that catches the target of the Hyperlink.

So far, so good. However, within a real App you may have more kinds of redirections as just hyperlinks.

Within my project I recognized:

- Forms
- Redirections from Controllers

For both of these, there is no solution provided by the project templates. So if you’re also responsible for creating Provider-Hosted SharePoint Apps, the following CodeSnippets may save you a few hours, and you can focus even more on solving customer’s requirements.

## Appending SPHostUrl to Form’s action attribute

I’ve extended the original `spcontext.js` file by a second selector, instead of only changing hyperlink’s `href` attribute I’ll also manipulate form’s action attribute and append the `SPHostUrl` query string to this attribute.

```javascript
(function (window, undefined) {`

  "use strict";
  var $ = window.jQuery;
  var document = window.document;

  // SPHostUrl parameter name
  var SPHostUrlKey = "SPHostUrl";

  // Gets SPHostUrl from the current URL and appends it as query string 
  // to the links which point to current domain in the page.
  $(document).ready(function () {
    ensureSPHasRedirectedToSharePointRemoved();

    var spHostUrl = getSPHostUrlFromQueryString(window.location.search);
    var currentAuthority = getAuthorityFromUrl(window.location.href).toUpperCase();

    if (spHostUrl && currentAuthority) {
      appendSPHostUrlToLinks(spHostUrl, currentAuthority);
    }
  });`

  // Appends SPHostUrl as query string to all the links which point to current domain.
  
  function appendSPHostUrlToLinks(spHostUrl, currentAuthority) {
    $("a")
    .filter(function () {
      var authority = getAuthorityFromUrl(this.href);
      if (!authority && /^#|:/.test(this.href)) {
        // Filters out anchors and urls with other unsupported protocols.
        return false;
      }
      
      if (authority == null) {
        return false;
      }
      return authority.toUpperCase() == currentAuthority;
    }).each(function () {
      if (!getSPHostUrlFromQueryString(this.search)) {
        if (this.search.length > 0) {
          this.search += "&" + SPHostUrlKey + "=" + spHostUrl;
        }
        else {
          this.search = "?" + SPHostUrlKey + "=" + spHostUrl;
        }
      }
    });
    
    $("form")
    .filter(function () {
      var authority = getAuthorityFromUrl(this.action);
      if (!authority && /^#|:/.test(this.action)) {
        return false;
      }
      
      if (authority == null) {
        return false;
      }
      return authority.toUpperCase() == currentAuthority;
    }).each(function () {
      if (this.action.indexOf("?") == -1) {
        this.action += "?" + SPHostUrlKey + "=" + spHostUrl;
      } else {
        if (this.action.indexOf(SPHostUrlKey) == -1) {
          this.action += "&" + SPHostUrlKey + "=" + spHostUrl;
        }
      }
    });
  }

  // Gets SPHostUrl from the given query string.
  function getSPHostUrlFromQueryString(queryString) {
    if (queryString) {
      if (queryString[0] === "?") {
        queryString = queryString.substring(1);
      }
      var keyValuePairArray = queryString.split("&");
      for (var i = 0; i < keyValuePairArray.length; i++) {
        var currentKeyValuePair = keyValuePairArray[i].split("=");

        if (currentKeyValuePair.length > 1 && currentKeyValuePair[0] == SPHostUrlKey) {
          return currentKeyValuePair[1];
        }
      }
    }
    return null;
  }

  // Gets authority from the given url when it is an absolute url 
  // with http/https protocol or a protocol relative url.
  function getAuthorityFromUrl(url) {
    if (url) {
      var match = /^(?:https://|http://|//)([^/?#]+)(?:/|#|$|?)/i.exec(url);
      if (match) {
        return match[1];
      }
    }
    return null;
  }

  // If SPHasRedirectedToSharePoint exists in the query string, remove it.
  // Hence, when user bookmarks the url, SPHasRedirectedToSharePoint will not be included.
  // Note that modifying window.location.search will cause an additional request to server.
  function ensureSPHasRedirectedToSharePointRemoved() {
    var SPHasRedirectedToSharePointParam = "&SPHasRedirectedToSharePoint=1";
    var queryString = window.location.search;

    if (queryString.indexOf(SPHasRedirectedToSharePointParam) >= 0) {
      window.location.search = queryString.replace(SPHasRedirectedToSharePointParam, "");
    }
  }
})(window);

```

## Append SPHostUrl to RedirectToAction method calls

It’s a familiar scenario to redirect the user to another Action using Controller’s `RedirectToAction` method, and its overloads.

By default, you can quickly redirect the user to a `Fallback` Action using the following line of code

```csharp
return RedirectToAction("Fallback");

```

Assuming that you’re executing this call from the `HomeController`, your browser will be redirected to `www.myapp.com/Home/Fallback` and again the `SPHostUrl` is missing.

To fix that you can easily pass the `SPHostUrl` to the `RedirectToAction` method or you can override the method in your BaseController class (which each MVC App should have) and change the actual redirect to something like this:

```csharp
return RedirectToAction("Fallback", new {
  SPHostUrl = Request.QueryString["SPHostUrl"]
  });

```

This forces your browser to request the Action using the following URL `www.myapp.com/Home/Fallback?SPHostUrl=..."`

Of course, there are other pitfalls when building SharePoint Apps using MVC, but being able to create a SharePoint Context from every Controller Method is a critical depending on customer’s requirements.


