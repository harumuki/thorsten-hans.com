---
title: An Introduction to CoffeeScript
layout: post
permalink: an-introduction-to-coffeescript
redirect_from: /an-introduction-to-coffeescript-fce9d9b3fcd5
published: true
tags: [Frontend]
excerpt: I am a CoffeeScript lover. It's so time-saving, powerful and efficient. If you want to build robust frontend stuff, you should also start with CoffeeScript. This article provides a bunch of basic stuff for new CoffeeScript devs.
featured_image: /assets/images/posts/feature_images/learning.jpg
unsplash_user_name: Helloquence
unsplash_user_ref: helloquence
---

A while ago I started a series about how to brand SharePoint sites using the Yeoman web development workflow. With this small introduction to CoffeeScript, I’d like to continue the series.

1. [Introduction]({% post_url 2013-10-08-from-zero-to-hero-how-we-brand-sharepoint-using-yeoman %})
2. [Yeoman the web development workflow]({% post_url 2013-10-18-yeoman-the-web-development-workflow%})
3. [An Introduction to Pug (aka Jade)]({% post_url  2013-10-22-an-introduction-to-jade %})
4. [An Introduction to CoffeeScript]({% post_url 2014-02-14-an-introduction-to-coffeescript %})
5. [An Introduction to SASS]({% post_url 2014-02-18-an-introduction-to-sass %})

*CoffeeScript* is a small language that compiles into *JavaScript*. The initial release of *CoffeeScript* was published back in 2009. Since then the language has become more and more popular. The *CoffeeScript* source code is hosted on [GitHub](https://github.com/jashkenas/coffee-script){:target="_blank"}, and there is an excellent website ([coffescript.org](http://coffeescript.org){:target="_blank"}) which teaches you all the things you’ve to know about the language.

For most SharePoint developers out there languages such as *CoffeeScript* are a little bit strange, which is — in my opinion — caused by Microsoft’s developer marketing who did their best to bring Windows developers to the web — but this is a different and sad story (think about ASP.NET WebForms Designer and UpdatePanel..).

## So, first, the question is why!

Why should I use *CoffeeScript* instead of writing vanilla *JavaScript* when it comes to web development.

1. It’s just plain JavaScript
2. It’s just using JavaScript’s good parts
3. It adds some tremendous syntactic sugar from Ruby to JavaScript
4. It’s generating robust JavaScript
5. The compile-time check is an additional quality-gate
6. You’ve to write less code
7. It allows you to write object-oriented JavaScript quickly
8. It makes dealing with the current context natural (forget about var that = this )
9. There are tons of great frameworks, tools, and libraries available
10. It makes a fun writing CoffeeScript

Instead of writing more and more text I’m going to show you some CoffeeScript Code, which should give you many reasons why to learn CoffeeScript.

## Defining Arrays and Objects

```coffeescript
cars = ["BMW", "Audi", "Mercedes Benz"]

myCar = 
  manufacturer: "BMW"
  model: 
    name: "530d"
    power: 258
    color: "white"

```

Once compiled down to JavaScript, it'll look like:

```javascript
var cars, myCar;
cars = ["BMW", "Audi", "Mercedes Benz"];

myCar = {
  manufacturer: "BMW",
  model: {
    name: "530d",
    power: 258,
    color: "white"
  }
};

```

As you can see in this very easy snippet, you can save many keystrokes because CoffeeScript pays attention to the indentions you’re using within your code. This makes things like brackets and semicolons unnecessary. 

## Readable Comparisons

Based on the *Ruby* syntax you can use cool comparison expressions in *CoffeeScript*:

```coffeescript
foods = ['broccoli', 'spinach', 'chocolate']
eat food for food in foods when food isnt 'chocolate'

```

Compiled to JavaScript the same code looks like this:

```javascript
var food, foods, i, len;

foods = ['broccoli', 'spinach', 'chocolate'];

for (i = 0, len = foods.length; i < len; i++) {
  food = foods[i];
  if (food !== 'chocolate') {
    eat(food);
  }
}

```


## Iterating in CoffeeScript

Iterating over collections or arrays is easy, and you will save tons of code compared to vanilla JavaScript.

```coffeescript
cars = ['BMW M5', 'Audi S6', 'Mercedes Benz C 63 AMG']

drive = (car) -> "Drive carefully with the amazing '#{car}'."
drive car for car in cars

```

The same is a bit more complex in plain old JavaScript

```javascript
var car, cars, drive, i, len;

cars = ['BMW M5', 'Audi S6', 'Mercedes Benz C 63 AMG'];

drive = function(car) {
  return `Drive carefully with the amazing '${car}'.`;
};

for (i = 0, len = cars.length; i < len; i++) {
  car = cars[i];
  drive(car);
}

```

## Classes and Context in CoffeeScript

Define Classes and simply use inheritance. Don’t care about prototype inheritance when writing your code. CoffeeScript handles this behind the scenes.

```coffeescript
class Car
  constructor: (@manufacturer, @model) ->

  drive: (kilometers) ->
    console.log @model + " was moved #{kilometers}km."

class Convertible extends Car
  drive: ->
    console.log "Hopefully the sun is shining..."
    setTimeout(() => this.openRooftop())
    super 10

  openRooftop: ->
    console.log "open rooftop on #{this.model}"
    
class Truck extends Car
  move: ->
    console.log "The bigger the better.."
    super 100

man = new Truck "MAN", "TG510A"
convertible = new Convertible "BMW", "Series 1 Cabrio"

man.drive()
convertible.drive()

```

See also the fat arrow (`=>`) which is responsible for ensuring that context within the function is the one you’ve defined at programming time. So you can finally forget all these var `that = this` statements.

As you can see CoffeeScript is fantastic. Give yourself 30 minutes and check out coffeescript.org and start writing client-side-code the robust way. In addition to all these benefits, it’s fun to write CoffeeScript because you can use cool syntactic features from Ruby which will save much time in your daily business.


