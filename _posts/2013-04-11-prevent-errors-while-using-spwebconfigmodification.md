---
title: Prevent errors while using SPWebConfigModification
layout: post
permalink: prevent-errors-while-using-spwebconfigmodification
redirect_from: /prevent-errors-while-using-spwebconfigmodification-75eaccc41531
published: true
tags: [SharePoint]
excerpt: Have you ever heard of SPWebConfigModification? If so, check this post and see how to use it correctly.
unsplash_user_ref: johnschno
unsplash_user_name: John Schnobrich
featured_image: /assets/images/posts/feature_images/demo-code.jpg
---

Today I ran into an issue with `SPWebConfigModification`.

`SPWebConfigModification` can be used to make changes to SharePoint's `web.config`. The advantage of using `SPWebConfigModification` - instead of manually changing `web.config` files on each server - is that changes are applied automatically to each Web Frontend Server (WFE) in the farm.

Internally SharePoint is holding a collection of modifications (a collection of `SPWebConfigModification`) that should be applied to the `web.config` File. Once a modification failed, this particular instance of `SPWebConfigModification` may resist within the collection. Therefore you should always clear the collection directly before staging your modifications on an instance of `SPWebApplication`.

The snippet below demonstrates it, right after receiving the `webApp`, `WebConfigModifications.Clear()` is invoked:

```csharp
public override void FeatureActivated(SPFeatureReceiverProperties properties)
{
    var webApp = (SPWebApplication)properties.Feature.Parent;
    webApp.WebConfigModifications.Clear();
    var myModification = new SPWebConfigModification("mode", "system.web/customErrors")
    {
            Owner = properties.Feature.DefinitionId.ToString(),
            Sequence = 0,
            Type = SPWebConfigModification.SPWebConfigModificationType.EnsureAttribute,
            Value = "Off"
    };
    webApp.WebConfigModifications.Add(myModification);
    webApp.Update();
}
 
```

Happy SharePoint'ing


