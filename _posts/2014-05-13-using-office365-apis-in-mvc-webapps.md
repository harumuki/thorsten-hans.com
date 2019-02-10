---
title: Using Office365 API's in MVC WebApps
layout: post
permalink: using-office365-apis-in-mvc-webapps
redirect_from: /2014-05-13_Using-Office365-API-s-in-MVC-WebApps-e544eab2b184
published: true
tags: [O365]
excerpt: Learn how to use Office365 APIs in ASP.NET MVC WebApps to extend your webapps with data from Office365
featured_image: /assets/images/posts/feature_images/clouds.jpg
unsplash_user_name: Nacho Rochon
unsplash_user_ref: nacho_rochon
---

Yesterday a new version of Office365 API Tools Preview had been shipped. Many things have changed with the latest release. I’ll not write all the new features and changes down manually, instead I’ll explain how to write an MVC WebApp which calls into Office365 and pulls out upcoming events from Exchange Online for the given user.

## Before you start

Ensure that you’ve installed the latest Version of **Office365 API Tools Preview** you can either download the bits from [dev.office.com](http://dev.office.com){:target="_blank"} or install/update it directly from within Visual Studio 2013 using the **Extensions and Updates** window.

When you’ve installed the latest bits, you’re ready to start.

## Setting up the project

After creating a new ASP.NET MVC App, you can bring O365 APIs into play by adding a *Connected Service* to your project.

Within the “Add a connected Service” dialog you’ve to log in with your O365 identity, by default the App is configured to target a single tenant. (The tenant, your O365 user, belongs to)

Let’s say you’re interested in consuming calendar entries from users calendar, so you’ve to request the **read permission** as shown in the following figure.

As soon as you hit `Ok`, O365 API Tools pulls all the required NuGet packages into your project and create a sample API implementation. Behind the scenes your app (including all the requested permissions are installed within your `AAD`, to ensure that the app can request these permissions at runtime).

To display all events on the website, you’ve to update the HomeController’s Index method to look like the following.

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace WebApplication2.Controllers
{
  public class HomeController : Controller
  {
    public async Task<ActionResult> Index()
    {
      var events = await CalendarAPISample.GetCalendarEvents();
      return View(events);
    }
}
}

```

The last thing you’ve to do is creating the View. VS has created an index view by default, let’s now change this one to print all the calendar entries.

{% raw %}
```html
@model IEnumerable<Microsoft.Office365.Exchange.IEvent>

@{
    ViewBag.Title = "My Events";
}

<h2>My Events</h2>

<table class="table table-striped">
    <tr>
        <th>Subject</th>
        <th>Start</th>
    </tr>

    @foreach (var item in Model) {
    <tr>
        <td>
          @item.Subject
        </td>
        <td>
            @item.Start
        </td>
    </tr>
    }
</table>

```
{% endraw %}

#### First run

When you start the App for the first time, your App starts on your local IIS Express. Because we’re printing all calendar entries directly to the index view, you’ll get redirected to the Common Consent dialog, which takes care of authenticating users. (You may know this experience from O365 already).

After signing in, the O365 API’s take care of dealing with your OAuth 2.0 token, which is used for any further call into Office365. Finally, our events are printed to the website

#### Let’s review CalendarAPISample

Tools are generating an API Sample for the type of data you’ve requested. It is the place where things like Authentication and querying data happen.

```csharp
using Microsoft.Office365.Exchange;
using Microsoft.Office365.OAuth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApplication2
{
  public static class CalendarAPISample
  {
    const string ExchangeResourceId = "https://outlook.office365.com";
    const string ExchangeServiceRoot = "https://outlook.office365.com/ews/odata";

      
    public static async Task<IOrderedEnumerable<IEvent>> GetCalendarEvents()
    {
      var client = await EnsureClientCreated();

      // Obtain calendar event data
      var eventsResults = await (from i in client.Me.Events
                                  where i.End >= DateTimeOffset.UtcNow
                                  select i).Take(10).ExecuteAsync();

      var events = eventsResults.CurrentPage.OrderBy(e => e.Start);

      return events;
    }

    private static async Task<ExchangeClient> EnsureClientCreated()
    {
      Authenticator authenticator = new Authenticator();
      var authInfo = await authenticator.AuthenticateAsync(ExchangeResourceId);

      return new ExchangeClient(new Uri(ExchangeServiceRoot), authInfo.GetAccessToken);
    }
    
    public static void SignOut(Uri postLogoutRedirect)
    {
      new Authenticator().Logout(postLogoutRedirect);
    }
  }
}

```

Before you can query or post data to O365, you’ve to ensure that the user is authenticated using the **EnsureClientCreated** method. If the user isn’t authenticated yet, the Common Consent dialog will be presented.

*Depending on the kind of project, you’ll either receive a native dialog or a redirect - like in this sample the website - is issued.*

Once the user successfully authenticated, we can query O365 by using a combination of O365 API and LINQ queries as shown in **GetCalendarEvents**.

Finally, there is a **SignOut** method, which can be used to force logging out the current user.

#### Recap

Getting started with O365 API’s targeting a single tenant or a single organization is easy. Reading or Writing data is straight forward. Within my upcoming post, I’ll explain how to create Apps targeting multiple tenants using the Discovery Service which is offered by O365.


