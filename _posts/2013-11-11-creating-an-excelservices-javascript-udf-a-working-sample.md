---
title: Creating an ExcelServices JavaScript UDF — A working Sample
layout: post
permalink: creating-excelservices-javascript-udf
redirect_from: /2013-11-11_Creating-an-ExcelServices-JavaScript-UDF---A-working-Sample-71440b39c336
published: true
tags: [Frontend]
excerpt: This article explains how you can create User Defined Functions (UDF) with JavaScript for Excel Services
featured_image: /assets/images/posts/feature_images/learning.jpg
unsplash_user_name: Helloquence
unsplash_user_ref: helloquence
---

*Excel Services* in SharePoint 2013 is offering some new functionalities. One of these is a JavaScript User Defined Actions (**UDFs**). There is currently one a little documentation on MSDN covering this topic. The given MSDN sample contains a small example which didn’t work at all. Because a customer would like to see the new features Excel Services are offering in 2013 (including Office 365). I had the choice to discover this feature by myself 🙂.

First some technical background, JavaScript UDFs have to be hosted inside of the same website as your Excel WebPart and only in the scope of the current site your custom JavaScript UDFs will be available! Facing those limitations, there are only a few scenarios where JavaScript UDFs make sense in my opinion. (MSDN also says something about SkyDrive embedding…. but SkyDrive is not my favorite topic.. so if you’ve any SkyDrive related scenario.. please leave a comment).

Okay to get started with creating our JavaScript UDF we need to inject some JavaScript into our site. SharePoint offers different ways how to achieve this. For this example, I’ve just created a .txt file and uploaded it to the Site Assets library. Within my `WebPartPage` I reference the Script using a `ContentEditorWebPart`. A JavaScript UDF is nothing special it’s just a JavaScript function which is registered within the current instance of an `ExcelWebPart`. So another pre-requirement is a configured `ExcelWebPart` on your `WebPartPage`.

The following script contains a simple JavaScript function converting an input string into UpperCases. (Yes I know that’s not an actual benefit, consider calling an external HTTPs Service returning some data as a real life example). I’ve split the file to ensure better readability.

## Part 1: Defining an UDF

```javascript
window.ThorstenHans = {
  makeUpperString: function(input){
    return input.toUpperString();
  }
};

```

## Part 2: Registering the UDF

```javascript
// ensure that page is loaded
if(window.attachEvent){
  window.attachEvent("onload", registerUserDefinedFunction);
}else{
  window.addEventListener("DOMContentLoaded", registerUserDefinedFunction, false);
}

// actual registration
function registerUserDefinedFunction(){
  var ewaControl = Ewa.EwaControl.getInstances().getItem(0); // assuming that one ExcelWebPart is on the current site
  ewaControl.getBrowserUdfs().add("ToUpperCase", ThorstenHans.makeUpperString, "Converts a string to upper case", false,false);
}

```

In *Part 2* it’s important that your script is running after `ExcelWebPart` has finished loading the Excel JavaScript Object Model (JSOM). See the following script which contains the entire JS logic.

```javascript
window.ThorstenHans = {
  makeUpperString: function(input){
    return input.toUpperString();
  }
};

if(window.attachEvent){
  window.attachEvent("onload", registerUserDefinedFunction);
}else{
  window.addEventListener("DOMContentLoaded", registerUserDefinedFunction, false);
}

// actual registration
function registerUserDefinedFunction(){
  var ewaControl = Ewa.EwaControl.getInstances().getItem(0); // assuming that one ExcelWebPart is on the current site
  ewaControl.getBrowserUdfs().add("ToUpperCase", ThorstenHans.makeUpperString, "Converts a string to upper case", false,false);
}

```

## The entire sample code

If you’ve also loaded jQuery on your WebSite, you can, of course, use jQuery, to delay script execution until the current document is loaded as shown here.

```javascript
window.ThorstenHans = {
  makeUpperString: function(input){
    return input.toUpperString();
  }
};

$(document).ready(function(){
  var ewaControl = Ewa.EwaControl.getInstances().getItem(0); // assuming that one ExcelWebPart is on the current site
  ewaControl.getBrowserUdfs().add("ToUpperCase", ThorstenHans.makeUpperString, "Converts a string to upper case", false,false);
});

```

## The result

Once you’ve referenced the JS file by using the ContentEditor WebPart and refreshed the site, you can easily access the UDF by editing a cell and typing in a `=` sign followed by the name of your UDF.

{% include image-caption.html imageurl="/assets/images/posts/2013/excel-services-udf.png"
title="Using an JavaScript UDF in Excel" caption="Using an JavaScript UDF in Excel" %}

To make this more comfortable to use, I’ve added JS UDF Support to [ShareCoffee](https://github.com/ThorstenHans/ShareCoffee/){:target="_blank"}’s backlog. So check out ShareCoffee recently to see ExcelServices JS UDF’s appearing there.


