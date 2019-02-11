---
title: Maintaining Brownfield JS Apps? Check Js2Coffee
layout: post
permalink: maintaining-brownfield-js-apps-check-js2coffee
redirect_from: /maintaining-brownfield-js-apps-check-js2coffee-1e800ca45cfc
published: true
tags: [Frontend, Tools]
excerpt: null
unsplash_user_ref: johnschno
unsplash_user_name: John Schnobrich
image: /demo-code.jpg
---

Do you love *CoffeeScript*? Alternatively, you've to maintain Brownfield *JavaScript* based Applications?

{% include image-caption.html imageurl="/assets/images/posts/2013/coffeescript-logo.png"
title="CoffeeScript Logo" caption="CoffeeScript Logo" %}

Checkout *Js2coffee*! *Js2coffee* translates your JavaScript Code into nice, readable and valid CoffeeScript. In addition to the Js2coffee website ([js2coffee.org](js2coffee.org "js2coffee.org")), there is also an `NPM` package available. You can install it directly from the terminal

```bash
npm install js2coffee
# or globally
npm install js2coffee --g

```

You can translate your JS file easily by providing the following command.

```bash

"console.log('sample javascript file')" >> some.js
js2coffee some.js > some.coffee

```

I found this little package very handy to remove the smell from old *JavaScript* files and move them to more readable and maintainable CoffeeScript files.

What do you think? Is this a good solution for maintaining the old *JavaScript* code?


