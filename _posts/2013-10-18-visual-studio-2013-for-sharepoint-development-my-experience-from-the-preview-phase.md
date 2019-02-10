---
title: Visual Studio 2013 for SharePoint Development — My experience from the Preview Phase
layout: post
permalink: visual-studio-2013-for-sharepoint-development-my-experience-from-the-preview-phase
redirect_from: /visual-studio-2013-for-sharepoint-development-my-experience-from-the-preview-phase-ec48047a9d05
published: true
tags: [Tools]
excerpt: I spent much time using the Visual Studio 2013 preview.Today I want to share my experiences from the preview-phase.
featured_image: /assets/images/posts/feature_images/celebration.jpg
unsplash_user_name: Danny Howe
unsplash_user_ref: dannyhowe
---

On 18th of October *Visual Studio 2013* was published on MSDN. So today (one day later) it’s a perfect day to share my experiences I’ve earned during the preview phase.I’ve installed the VS2013 Preview early in July (it was available since 26th of June) on my *SharePoint* development system. The first thing I’ve noticed was that I didn’t have to upgrade the solution file, which turned out to be a great benefit because my colleagues could continue working with VS2012 and we didn’t run into merge conflicts because of solution or project file modifications. In August I started a big SharePoint App Project, and I decided to build it by using the Preview. After some initial considerations, we decided to realize the project as a Provider-Hosted-App with SQL Azure Backend. So there were many different aspects of our project.

- SharePoint App
- Web Application (is also running on Windows Azure)
- SQL Database (Hosted on Azure)

## MVC Support for SharePoint Apps

The new SharePoint Development Tools are supporting SharePoint Apps with an MVC Web Application as backend. That’s amazing. Finally, you as a SharePoint Developer can get rid of the ASP.NET WebForms Crap, and you get full support from Visual Studio.

{% include image-caption.html imageurl="/assets/images/posts/2013/vs2013-1.png"
title="SharePoint AddIn support in Visual Studio 2013" caption="SharePoint AddIn support in Visual Studio 2013" %}

The new MVC Template for SharePoint Apps, of course, contains the TokenHelper class that many SharePoint developers already may know from the legacy SharePoint App Templates using ASP.NET WebForms. On top of that, the new MVC template contains the SharePointContextFilter. This filter can be used either on MVC Controller classes or controller actions. By applying this attribute to a controller or an action, you can ensure that only calls authorized with a valid SharePoint Security Token (either AppToken, UserToken or the combination of both) are passed through the pipeline and can access the resource sitting behind the controller-action. During the implementation phase, we went a step further and created a new `BaseController` class and called it `SharePointBaseController`.

```csharp
[SharePointContextFilter]
public abstract class SharePointBaseController
{
  [HttpGet]
  public abstract ActionResult Index();
}

```

As you can see the new `BaseController` has the `SharePointContextFilter` Attribute on the class definition. By doing so, all controllers that inherit from `SharePointBaseController` can only be invoked from valid requests. This technique allows us to put both (protected views only accessible for people with valid tokens and public marketing sites which are accessible for everyone) into a single web-project. Yes, you can achieve this also without the `SharePointContextFilter`, but with the Filter, your code will become cleaner and more readable.

## Remote EventReceivers in ASP.NET MVC Projects

When you’re adding RemoteEventReceivers (RER) to your SharePoint Apps, they will automatically be created within the web-project.

{% include image-caption.html imageurl="/assets/images/posts/2013/vs2013-2.png"
title="RemoteEventReceivers in Visual Studio 2013" caption="RemoteEventReceivers in Visual Studio 2013" width="360" %}

The creation works fine with MVC projects. However, without changing the `RouteConfiguration` manually, you’ll not be able to call the services located within the MVC project. The ASP.NET MVC RouteEngine causes this. By default, all requests are transformed by using the given RouteConfiguration.

MVC will look for the right Controller and Action combination based on the requested URL. Visual Studio adds the RER Service by default within a Services folder so you’ve to add an `IgnoreRoute` command to the RouteConfiguration as you can see in the following screenshot.

```csharp
// stripped usings and namespace def
public class RouteConfig
{
  public static void RegisterRoutes(RouteCollection routes)
  {
    routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
    routes.IgnoreRoute("services/*");
    routes.MapRoute(
      name: "Default",
      url: "{controller}/{action}/{id}",
      defaults: new {
        controller = "Home",
        action = "Index",
        id = UrlParameter.Optional 
      });
  }
}

```

As most ASP.NET MVC developers may already know, it’s important to put your custom routes (here an ignore route) before the default route, because the first matching route will win.

## A new Publishing Manager

Regarding the SharePoint development Tools, there is also a new Publishing manager included, the new publishing manager is created in the “document-mode” so you can finally forget about the nasty modal dialog we were forced to use in the days of Visual Studio 2012.

{% include image-caption.html imageurl="/assets/images/posts/2013/vs2013-3.png"
title="Publishing Manager in Visual Studio 2013" caption="Publishing Manager in Visual Studio 2013" %}

## Workflow Debugging also for SharePoint Online

Visual Studio 2013 also allows you as a Workflow Developer to debug the workflows you’ve deployed to the cloud. (SharePoint Online). In 2012 there was a small comment next to the `Debug Workflow` checkbox mentioning that debugging Workflows in SharePoint Online isn’t supported.

{% include image-caption.html imageurl="/assets/images/posts/2013/vs2013-4.png"
title="Enable Workflow Debugging in Visual Studio 2013" caption="Enable Workflow Debugging in Visual Studio 2013" %}

This small little comment is finally gone. Great news for debugging workflows! Forget the days when your SharePoint Online workflow was a black-box. 😉

## ContentType- and List-Designers

I don’t know if the ContentType- and List-Designers were updated with 2013 because I don’t use them. When you seriously create SharePoint Apps or Solutions, you can’t use them because they don’t support localization which is required for almost every project I’ve done so far. I use them to dump the element files, but then I directly move into the XML (or CAML) and do the stuff I need manually.

## ReSharper

I don’t know exactly, but I’m using ReSharper at least since 2005. The Addin is an excellent productivity boost for typical development. However, there is one disadvantage with ReSharper, and it’s slowing down VS dramatically. (As a SharePoint Dev I’ve two things a significant CPU and tons of RAM 😀 so my machine can’t be the bottleneck). The performance with ReSharper installed was getting worse when VisualStudio moved to WPF in 2010. With 2013 I’ve finally uninstalled ReSharper. The refactoring and search experience in VisualStudio is excellent right now, and the benefits from ReSharper aren’t that huge compared to the days of VS2008. Of course, there are still tons of arguments for ReSharper, but it’s fantastic to see how fast VisualStudio is without ReSharper.

## Recap

Let’s keep it short, the best feature for me is ASP.NET MVC Project template with the SharePointContextFilter. I ❤ VisualStudio, and with 2013 I’ve everything I need to build my SharePoint Apps and Solutions. Last but not least it runs perfectly on my SurfacePro so that I can develop software everywhere.


