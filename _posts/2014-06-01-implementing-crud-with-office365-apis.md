---
title: Implementing CRUD with Office365 APIs
layout: post
permalink: implementing-crud-with-office365-apis
redirect_from: /implementing-crud-with-office365-apis-5180baf46dd4
published: true
tags: [O365]
excerpt: Learn how to implement all CRUD operations using Office365 API.
featured_image: /assets/images/posts/feature_images/references.jpg
unsplash_user_name: Giammarco Boscaro
unsplash_user_ref: giamboscaro
---
Office365 API’s current preview version can generate some sample code for you. However, the sample only contains code for reading data. People from the community asked me how they can write entities back to Office365, and that's why I want to share the following sample, which explains to you how to implement all CRUD methods using Office365 API.

I hope this post makes clear, that Office365 is supporting the full CRUD stack, no matter which kind of entity (Contacts, Calendar Events, Users, Groups, Mails, Files) you’re interested in!

Consider you’ve already created a new MVC Web App using Visual Studio and added a Connected Service for Contacts (with both `READ` and `WRITE` permissions). (See my post [here]({% post_url 2014-05-13-using-office365-apis-in-mvc-webapps %}) if you’re not sure how to complete these steps).

Instead of relying on the generated ContacsAPISample class I’d advice you to use a regular class which allows you to build testable Web Apps and you can, of course, use a Dependency Injection Container such as *Ninject* to decouple your components.

To provide a testable Repository, I’ve extracted the interface IContacsRepositoy which looks like the following

```csharp
internal interface IContactsRepository<T>
{
  Task<T> GetById(string id);
  Task<IEnumerable<T>> Get(int pageNumber);
  void Create(T instance);
  void Update(T instance);
  void Delete(T instance);
}

```

The corresponding implementation is straight forward using the C# async/await pattern.

```csharp
internal class ContactsRepository : IContactsRepository<IContact>
{
  private ExchangeClient _exchangeClient;
  private const string ExchangeResourceId = "https://outlook.office365.com";
  private const string ExchangeServiceRoot = "https://outlook.office365.com/ews/odata";
  private const int PageSize = 50;

  private async Task<ExchangeClient> EnsureExchangeClient()
  {
    if (_exchangeClient != null)
      return _exchangeClient;

    Authenticator authenticator = new Authenticator();
    var authInfo = await authenticator.AuthenticateAsync(ExchangeResourceId);

    _exchangeClient = new ExchangeClient(new Uri(ExchangeServiceRoot), authInfo.GetAccessToken);
    return _exchangeClient;
  }

  public async Task<IContact> GetById(string id)
  {
    var client = await EnsureExchangeClient();
    return await client.Me
      .Contacts
      .Where(c => c.Id.Equals(id))
      .ExecuteSingleAsync();
  }

  public async Task<IEnumerable<IContact>> Get(int pageNumber)
  {
    var skipItems = pageNumber*PageSize;
    var client = await EnsureExchangeClient();
    var contacts = await client.Me
      .Contacts
      .OrderBy(c => c.DisplayName)
      .Skip(skipItems)
      .ExecuteAsync();
        
    return contacts.CurrentPage;
  }

  public async void Create(IContact instance)
  {
    if (instance != null)
    {
      throw new ArgumentNullException("instance");
    }
    var client = await EnsureExchangeClient();
    await client.Me
      .Contacts
      .AddContactAsync(instance);
  }

  public async void Update(IContact instance)
  {
    if (instance != null)
    {
      throw new ArgumentNullException("instance");
    }
    var client = await EnsureExchangeClient();
    await instance.UpdateAsync();
  }

  public async void Delete(IContact instance)
  {
    if (instance != null)
    {
      throw new ArgumentNullException("instance");
    }
    var client = await EnsureExchangeClient();
    await instance.DeleteAsync();
  }
}

```

To make it clear again. *Office 365 API’s support all kind of CRUD operations*.


