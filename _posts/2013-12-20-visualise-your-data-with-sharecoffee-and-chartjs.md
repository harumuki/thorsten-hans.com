---
title: Visualise your data with ShareCoffee and ChartJS
layout: post
permalink: visualise-your-data-with-sharecoffee-and-chartjs
redirect_from: /2013-12-20_Visualise-your-data-with-ShareCoffee-and-ChartJS-7f306381f39e
published: true
tags: [SharePoint, O365, ShareCoffee]
excerpt: Learn how to query data from SharePoint using ShareCoffee and visualize it with the open-source library Chart.js.
featured_image: /assets/images/posts/feature_images/charts.jpg
unsplash_user_name: rawpixel
unsplash_user_ref: rawpixel
---

Visualizing data in SharePoint Apps is easy if you combine [ShareCoffee](https://github.com/ThorstenHans/ShareCoffee){:target="_blank"} and [ChartJS.org](http://www.chartjs.org/){:target="_blank"}. ChartJS.org is a small JavaScript library which is responsible for rendering HTML5 charts in websites.

## Creating a sample App

For this post, I’ve prepared a small SharePoint list containing EnergyDrinks and their amount of caffeine. 🙂 To read the data from SharePoint, you need to include and reference ShareCoffee. Using Visual Studio’s Package Manager Console you can install ShareCoffee using **Install-Package ShareCoffee** Including ChartJS.org is also really easy, grab the *Chart.js* file from [GitHub](https://github.com/davidaparicio/chartjs){:target="_blank"} or the project site [chartjs.org](http://www.chartjs.org/){:target="_blank"}. 

## Creating the Markup

ChartJS requires only a canvas control for creating charts like the following:

{% raw %}
```html
<canvas id="energy-drink-chart" width="900" height="380">
</canvas>

```
{% endraw %}

## Creating the Chart

If you’re not aware of ShareCoffee’s API check out the wiki on GitHub. I’ve included some comments into the JavaScript code to explain what’s going on.

```javascript
// the next line of code brings somple IntelliSense within VS
/// <reference path="ShareCoffee/ShareCoffee.js"/>
$(document).ready(function () {
  
  var onLoaded = function (data) {
    var ctx = document.getElementById("myChart").getContext("2d");
    var chartData = {
      labels: [],
      datasets: [{
        fillColor: "#3399cc",
        data: []
      }]
    };
  
    // convert SharePoint's data into required data structure
    for (var i = 0; i < data.d.results.length; i++) {
      chartData.labels.push(data.d.results[i].Title);
      chartData.datasets[0].data.push(data.d.results[i].Caffeine);
    }
    // create a new Chart from type BarChart and associate the data
    var chart = new Chart(ctx).Bar(chartData);
  };
  
  // simple error handler
  var onError = function (error) {
    console.log(error);
  }

  // grab the data from SharePoint using ShareCoffee
  $.ajax(ShareCoffee.REST.build.read.for.jQuery({
    url: "/web/lists/GetByTitle('Energy Drinks')/items?$select=Title,Caffeine",
    hostWebUrl : ShareCoffee.Commons.getHostWebUrl()
  }))
  .done(onLoaded)
  .fail(onError);
});

```

In this sample, I’ve used the Bar-Chart layout from ChartJS.

See the [documentation](http://www.chartjs.org/docs/) which is explaining all different chart types. When executing the sample app, you’ll receive the following result.

{% include image-caption.html imageurl="/assets/images/posts/2013/chartjs-1.png"
title="Chart.JS with data pulled from SharePoint" caption="Chart.JS with data pulled from SharePoint" %}

As you can see it's not complicated to query data from SharePoint using *ShareCoffee* and display it in a user-friendly way using *Chart.js*.
