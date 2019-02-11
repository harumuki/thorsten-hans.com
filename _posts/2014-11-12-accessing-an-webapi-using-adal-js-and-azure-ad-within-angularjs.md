---
title: Accessing an WebAPI using ADAL.JS and Azure AD within AngularJS
layout: post
permalink: accessing-an-webapi-using-adal-js-and-azure-ad-within-angularjs
redirect_from: 
  - /accessing-an-webapi-using-adal-js-and-azure-ad-within-angularjs-5ceae9165e75
  - /2014/11/12/accessing-an-webapi-using-waad-and-adal-js-using-angularjs/
published: true
tags: [Azure, Frontend]
excerpt: null
image: /secure.jpg
unsplash_user_name: James Sutton
unsplash_user_ref: jamessutton_photography
---

Building a secured WebAPI using *Azure Active Directory (AAD)* is pretty easy, OWIN middleware allows developers to integrate AuthN in their services quickly.

Accessing those API with plain old C# is easy because *AAD Authentication Library (ADAL)* for .NET is available for quite a long time (at least what we call a long time in our business :D)

During TechEd Europe, Microsoft announced and released the developer preview for *ADAL.js*  — a lightweight JavaScript library for integrating AAD authentication into your *Single Page Application (SPA)*.

To get *ADAL.js* working for your AAD   Application, you’ve to *opt-in* for *OAuth2.0 implicit flow* which is currently disabled by default. This setting can only be changed by downloading the application manifest and changing `oauth2AllowImplicitFlow` to `true`, once you’ve uploaded the manifest again, you can use ADAL.JS with your Azure AD Application.

ADAL.JS is available on GitHub, and the community and contributions from the community are more than welcome. [ADAL.js Repository](https://github.com/AzureAD/azure-activedirectory-library-for-js){:target="_blank"}. There is also a working example right here [ADAL.js AngularJS Sample SPA](https://github.com/AzureADSamples/SinglePageApp-DotNet){:target="_blank"}.

When exploring that example, I stumbled upon many bugs and naming issues in AngularJS. However, again, 😀 after reading their AngularJS code, I’m 100% sure that Microsoft doesn’t do that much **AngularJS** development.

To fix those bugs and apply a proper naming for all the AngularJS stuff, I’ve forked the repository and applied my changes their :).

If you’re interested in the *polished, fixed and readable* version, go and check out my implementation right here [Polished ADAL.js AngularJS Sample](https://github.com/ThorstenHans/SinglePageApp-DotNet){:target="_blank"}

Further readings on *ADAL.js* could be found on Vittorio Bertocci’s [blog](http://www.cloudidentity.com){:target="_blank"}

I’ve created a pull request, so perhaps my changes will go to the official sample 🙂

###Get the Sample up and running

To get the sample up and running you should follow the instructions in [Readme.md](https://github.com/ThorstenHans/SinglePageApp-DotNet/blob/master/README.md){:target="_blank"}. The code currently shows Tenant-Id’s in `web.config` and `app.js` but putting in the primary domain name of your AAD is also fine.
