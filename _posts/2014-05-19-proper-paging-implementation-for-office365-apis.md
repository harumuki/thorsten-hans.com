---
title: Proper Paging Implementation for Office365 APIs
layout: post
permalink: proper-paging-implementation-for-office365-apis
published: true
tags: [O365]
excerpt: Another tip from the field. This post shows a proper paging implementation for lists
image: /field.jpg
unsplash_user_name: Tanner Boriack
unsplash_user_ref: tannerboriack
---

I’m currently working on another (fancier) sample for using Office365 APIs from Web Applications. During today's night session I tried to implement the entire Service and Repository for my sample. I started with the current sample API implementation from Office 365 API Tools I made a lot of changes to this to provide even more features and to be more efficient as the current static class sample.

During this post, I’d like to show only the `GetContacts` method which has been refactored a little bit to provide real paging support for my contacts sitting in Exchange Online.

So I’ve changed the default implementation of getting Contacts to something like this:

```csharp
public Task<IEnumerable<IContact>> GetContacts(int pageIndex = 0)
{
  var skipItems = pageIndex * 50;
  
  // default page size is 50
  var client = await EnsureClientCreated();
  var contacts = await client.Me.Contacts
    .OrderBy(c=>c.DisplayName)
    .Skip(skipItems)
    .ExecuteAsync();
    
  return contacts.CurrentPage;
}

```

Of course, I’ve made more changes to the `ContactsAPISample` but during the upcoming days, I’ll try to create small posts guiding to the entire full-blown sample.


