---
title: Talking to SharePoint's REST Services with C# using RESTSharp
layout: post
permalink: consume-sharepoints-rest-services-with-restsharp
redirect_from: /talking-to-sharepoints-rest-services-with-c-using-restsharp-bd01cf3e2c9e
published: true
tags: [SharePoint]
excerpt: Do you have to consume data from SharePoint using C#? Then this article is for you! It explains how to query data from SharePoint's API using RESTSharp.
image: /learning.jpg
unsplash_user_name: Helloquence
unsplash_user_ref: helloquence
---

When it comes to SharePoint App Development (especially Cloud- and Provider Hosted Apps), most samples out there are demonstrating how to use CSOM from ASP.NET or ASP.NET MVC. Most REST Samples are dedicated to client-side logic either in JavaScript, CoffeeScript or TypeScript.

That’s fine for most scenarios, but for me, it’s important to do as many calls as possible with a single kind of data-access or service consummation.

Therefore I tried to get rid of `CSOM` calls from my ASP.NET MVC backend (Controllers, Repositories,…) Of course, it’s possible to deal with SharePoint’s REST API by using plain .NET Framework, but it’s not the kind of code I’d like to write in these days.

The most significant advantage of SharePoint Apps for me as a developer is that I can use my favorite frameworks and technologies to get my things done. Making REST calls by using `HttpWebRequest` is not what I’m referring. 😉

After asking google which libraries are commonly used for REST communication from C#, I stumbled upon RESTSharp, which is hosted on GitHub and actively maintained by the community.

[RESTSharp](https://github.com/restsharp/RestSharp){:target="_blank"} offers various mechanisms for handling authentication and serializing responses from REST endpoints. So, it’s exactly what I was looking for. I’ll explain how to use RESTSharp with SharePoint’ REST Services by creating a small sample App. Based on the give Provider-Hosted App template, I’ll change the communication from the Website with SharePoint. So we get rid of CSOM code and use `RESTSharp`. By using Visual Studio 2013 Preview, you can easily create Provider- (or Auto-Hosted) Apps with an ASP.NET MVC web application in the back. Finally, get rid of WebForms (hold on a second and celebrate this) Okay, after creating a new SharePoint App Project (ProviderHosted App with ASP.NET MVC web project) you will be faced with a Solution that should look similar to this.

{% include image-caption.html imageurl="/assets/images/posts/2013/restsharp-1.png"
title="Typical MVC web project" caption="Typical MVC web project" width="300" %}

## Add RESTSharp to the Web-Project

Adding RESTSharp to a project is relatively easy, because of the existing NuGet Package. So you’ve to fire up the PackageManagerConsole and verify that the web project is selected. After running the command, Install-Package RESTSharp NuGet will install all required references, and we’re ready to go.

```powershell
Install-Package RestSharp

```

## Retrieving required contextual data

Talking to SharePoint through it’s REST API is simple. The most complicated things are configuring the proper header values for your requests. Because SharePoint’s App Security is based on OAuth2.0, we’ve to provide an AccessToken for each request. At this point, you’ve to decide if you’re going to act with SharePoint in behalf of the current user (SharePoint will internally work with both User- and App-Context) or if you like to deal with SharePoint with App-Only-Permissions (SharePoint will internally work with an App-Context and without any User-Context). Depending on your scenario you’ve to request different tokens from the TokenHelper in the following snippet. (For this sample, I’m going to act in behalf of the user, because I don’t want to ask for more permissions in the AppManifest explicitly)

```csharp
var contextTokenString = TokenHelper.GetContextTokenFromRequest(Request);
var contextToken =  TokenHelper.
  ReadAndValidateContextToken(contextTokenString, Request.Url.Authority);

var sharePointUrl = new Uri(Request.QueryString["SPHostUrl"]);
var accessToken = TokenHelper.GetAccessToken(contextToken, sharePointUrl.Authority);

```

## Configuring the RestClient

The first step with RESTSharp is to create a RESTClient which can talk to SharePoint. The most important part is here defining the Authenticator property of our RestClient instance. The second important command is providing a custom handler for the Content-Type (Response’s Content-Type not SharePoint ContentType).

```csharp
var restClient = new RestClient("https://dotnetrocks.sharepoint.com/sites/developer/_api/");

restClient.AddHandler("application/json", new SharePointJsonDeserializer());
restClient.Authenticator = new OAuth2AuthorizationRequestHeaderAuthenticator(accessToken.AccessToken, "Bearer");

```

## The SharePointJsonDeserializer class

By default, RESTSharp is using `Newtonsoft.JSON` with its default settings to deserialize responses from REST services. This will not work for SharePoint. SharePoint’s REST Services are wrapping the results in a property called “d” which is also called an AJAX wrapper. By using a custom deserializer, we can easily adjust this, and as a result RESTSharp can serialize services responses into POCO’s.

```csharp
public class SharePointJsonDeserializer : IDeserializer
{
  public T Deserialize<T>(IRestResponse response)
  {
    try
    {
      return JsonConvert.DeserializeObject<T>(JObject.Parse(response.Content)["d"].ToString());
    }
    catch (Exception exception)
    {
      //log exception
      Console.WriteLine(exception.Message);
    }
    return default(T);
  }

  public string RootElement { get; set; }
  public string Namespace { get; set; }
  public string DateFormat { get; set; }
}

```

## Define a POCO

For this example, I’d like to read the title and email from the current user. This could be achieved by using a dynamic type, but for clarification, I’m going to create a good `POCO` .😉

```csharp
public class SharePointUser
{
  public SharePointUser() { }
  
  public String Title { get; set; }
  public String Email { get; set; }
}

```

Nothing special right here. However, to use your POCO with Newtonsoft.JSON it has to provide a parameterless public constructor.

## Making a request using RESTSharp

Last step in the sample it to make the actual request. As for any SharePoint REST call, it’s important to specify the datatype you’re interested in by setting the Accept Header.

```csharp
var request = new RestRequest("web/CurrentUser?$select=Title,Email", Method.GET);
request.AddHeader("Accept", "application/json;odata=verbose");

var currentUser = restClient.Execute<SharePointUser>(request).Data;
ViewBag.UserName = currentUser == null ?
  "[Can't retrieve user]" :
  String.Format("{0}({1})",currentUser.Title,currentUser.Email);

```

The coolest part here is the actual call. RESTSharp is offering a generic interface which will (based on the Content-Type) invoke our `SharePointJsonDeserializer` who is responsible for creating and filling our POCO. Finally, I’ve to assign POCO’s value to the ViewBag and now, I can run my App with precisely the same result, but I got rid of all CSOM code here 😉

## Summary

RESTSharp is cool and offers a handy API when you’re going to build SharePoint Apps where not all business logic will run on the client. This sample should only give a rough introduction to the topic. For real-world scenarios, you should think about providing more infrastructure to your code. You’ve to store context-tokens, and you may create a factory which will generate new instances of `RestClient` and `RestRequest` for you on the fly.


