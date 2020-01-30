---
title: Launch modal dialogs from ECB CustomActions from within the HostWeb
layout: post
permalink: modal-dialogs-from-ecb-customactions-from-within-the-hostweb
published: true
tags: [SharePoint]
excerpt: Learn how to launch modal dialogs in a SharePoint App using CustomActions for the EditControlBlock
unsplash_user_ref: johnschno
unsplash_user_name: John Schnobrich
image: /demo-code.jpg
---

When you're building Apps for SharePoint 2013, you can create Pages, Client Parts or CustomActions.

For CustomActions there are two different targets, either the Ribbon or the Edit Control Block (ECB) in both cases it's not allowed to inject JavaScript. If SharePoint allowed adding JS in these situations, the client script would run in the context of the HostWeb which would cause possible security leaks.

For ECB CustomActions you can provide an URL-Action which redirects the user to a URL defined by you (the App developer). You can add various tokens to the URL, as a SharePoint developer you're perhaps aware of this functionality from previous SharePoint versions.

As an App developer, you would redirect the user from the ECB to a page sitting in your App (either within the AppWeb or in the RemoteWeb) in both cases clicking your ECB CustomAction will cause an HTTP Redirect, which may break the users' Workflow.

SharePoint 2013 is offering a solution if you don't want to navigate away from the current ListView. You can display the target as a modal dialog by adding three simple properties to your CustomAction. Figure 1 shows the required XML Properties to display your UrlAction as a modal dialog within SharePoint 2013.

{% include image-caption.html imageurl="/assets/images/posts/2013/edit-control-block-xml.png"
title="ECB Modal Dialog XML" caption="ECB Modal Dialog XML" %}

If you're doing this within a SharePoint-Hosted App, you have to explicitly activate Framing support within your Page by adding the `<WebPartPages:AllowFraming />` tag to your page as shown in the snippet.

```xml
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
  <WebPartPages:AllowFraming ID="AllowFraming" runat="server" />This is my aweome Dialog shipped within a SharePoint hosted app .NET Rocks
</asp:Content>

```

Figure 2 shows the created dialog that has been launched from the ECB (directly from within the HostWeb)

{% include image-caption.html imageurl="/assets/images/posts/2013/edit-control-block-modal-demo.png"
title="ECB Modal Dialog in Action" caption="ECB Modal Dialog in Action" %}

I hope this post was helpful for you. If so, please feel free to leave a comment!


