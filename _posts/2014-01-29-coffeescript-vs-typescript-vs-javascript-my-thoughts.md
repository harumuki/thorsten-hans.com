---
title: CoffeeScript vs TypeScript vs JavaScript — my thoughts
layout: post
permalink: coffeescript-vs-typescript-vs-javascript-my-thoughts
published: true
tags: [Frontend]
excerpt: CoffeeScript, TypeScript or plain old JavaScript? I get that question many times from customers. Here are my thoughts...
image: /compare.jpg
unsplash_user_name: Timothy Eberly
unsplash_user_ref: timothyeberly
---

Throughout this post, I’d like to share my thoughts on Coffee-, Type- and JavaScript, because many people from the community were asking me for which language they should go or why I’ve chosen CoffeeScript for writing my SharePoint framework ShareCoffee. First of all, I’ve been doing JavaScript for a long, long time. I’ve spent much time reading books on how to write JavaScript code and how to do it well. Here, for example, two (in my opinion essential) books for JavaScript Developers, independent from their skill.

- [JavaScript the good parts](http://www.amazon.de/JavaScript-Good-Parts-ebook/dp/B0026OR2ZY/ref=sr_1_6?s=books-intl-de&ie=UTF8&qid=1391000834&sr=1-6&keywords=javascript){:target="_blank"}
- [Object-Oriented JavaScript](http://www.amazon.de/Object-Oriented-JavaScript-Stoyan-Stefanov-ebook/dp/B0057UNEJC/ref=sr_1_31?s=books-intl-de&ie=UTF8&qid=1391000865&sr=1-31&keywords=javascript+patterns){:target="_blank"}

With the release of CoffeeScript 0.1.0 back in 2009 I’ve started to play around with CoffeeScript. CoffeeScript is nothing more than JavaScript on steroids 🙂 It’s a language which compiles into JavaScript (*same is, of course, true for TypeScript*). CoffeeScript goes one step further than plain old JavaScript; it adds a lot of great languages features known from Ruby (the sexiest programming language on earth). During compile-time, the coffee compiler is responsible for translating your CoffeeScript code into the good parts of JavaScript, and this is the biggest advantage. It’s generating robust, secure and standardized JavaScript goal by paying attention to the golden CoffeeScript rule “It’s just JavaScript.” 

Since GA of CoffeeScript, it became more and more popular, and many frameworks and tools such as RubyOnRails or IDE’s like VisualStudio are adopting the language and giving programmers the chance to write their client-side code in CoffeeScript instead of plain old JavaScript. For CoffeeScript, there is also available a great book which I’ve read within almost 2 days.  [CoffeeScript Application Development](http://www.amazon.de/CoffeeScript-Application-Development-Ian-Young-ebook/dp/B00ESX13IS/ref=sr_1_5?s=books-intl-de&ie=UTF8&qid=1391000961&sr=1-5&keywords=coffeescript){:target="_blank"}.

When talking about TypeScript, you should consider that TypeScript is  -  compared to CoffeeScript  - really young, and its first release was back in 2012. Typescript is highly addicted to the (nobody can say precisely when) upcoming ECMA Script standard. TypeScript also offers support for classes and inheritance as CoffeeScript does, but in addition to that TypeScript adds support for Types and Generics to the client side. The TypeScript syntax looks a little bit like C# and makes it easy for .NET developers to move from the server-side coding to the client-side. Microsoft is not only providing packages to write TypeScript on Windows but based on Node.js you can also write and compile TypeScript from any platform supporting Node.js. 

That’s awesome.


Regarding the question *“Which language should I use? TypeScript or CoffeeScript?”* I can’t tell you the right answer. I always say something like *“It depends on your team. Just give your team a rough introduction into both languages and give them the chance to write some spikes using both.”* 

Depending on the results you should either go for CoffeeScript or TypeScript. However, independent from this choice it’s important that you chose one of these. Writing plain old JavaScript is, of course, required in some scenarios... 

However, the most significant advantage of both languages is their compilers. Think about the compilers as an extra security gate preventing your client-side code from breaking a release-candidate. Hopefully, I could give you a rough introduction and some good points why it’s important to move on and use the great languages available, instead of using plain old JavaScript.


