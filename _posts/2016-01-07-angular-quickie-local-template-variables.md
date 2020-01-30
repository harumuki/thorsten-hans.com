---
title: Angular Quickie - Local template variables
layout: post
permalink: angular-quickie-local-template-variables
published: true
tags: [Angular]
excerpt: In Angular, HTML templates aren't static. By using local template variables you can make your HTML even more dynamic and more flexible. Learn how to use local template variables in Angular, now!
image: /2016-angular-quickie.jpg
---
Local template variables in *Angular* can be used to reference *HTML* elements easily and use their properties either on sibling or child nodes.

It's pretty easy to create and use those local template variables. Let's say you have got an input file for dealing the first name of someone.

```html
<input type="text" placeholder="your name please" required maxlength="25" />

```

You can make the `HTMLInputField` available to sibling or child nodes using the `#` symbol.

```html
<input type="text" #firstName placeholder="your name please" required />

```

Next, let's say we want to extend our small example to provide a char counter beside the element. Users will see how many characters are available until they hit the maximal length constraint. First, let's add the corresponding `span` which is responsible for displaying this information.

{% raw %}
```html
<input type="text" #firstName placeholder="your name please" maxlength="25" required />
<span>
  <small>{{firstName.value.length}} / {{firstName.maxlength}} </small>
</span>

```
{% endraw %}

However, that's not enough; if you execute the sample right now you see something like this:

```html
<input type="text" placeholder="your name please" required maxlength="25"/>
<span>
  <small>0 / 25</small>
</span>

```

See the `0 / 25` right after the `textbox`. It is displaying the `maxlength` but and it's not updating the actual length property of the value (**0** in this case). To fix that you can either hook up a function from your component, or you can use a small trick to let angular update the view as soon as the user does a keystroke. Update the sample above to look like the following.

{% raw %}
```html
<input type="text" #firstName (keyup)="0" placeholder="your name please" maxlength="25" required />
<span>
  <small>{{firstName.value.length}} / {{firstName.maxlength}} </small>
</span>

```
{% endraw %}

## Passing data to a Component's function

In the sample above, I'm using a simple app component with no logic

```typescript
import { Component } from '@angular/core';

@Component({})
export class AppComponent{

}
```

let's extend the class to provide some super logic:

```typescript
import { Component } from '@angular/core';

export class AppComponent{
  public repeatedName: string = null;

  public repeatName(name: string, times: number) {
    this.repeatedName = (new Array(times+1)).join(name + " ");
  }

}

```

The `repeatName` method prints the value of `name` as many times as provided for the `times` parameter.

Let's reuse the things we've learned during this article and update the template to look like the following:

{% raw %}
```html
<input type="text" #firstName (keyup)="0" placeholder="your name please" maxlength="25" required />

<span>
  <small>{{firstName.value.length}} / {{firstName.maxlength}} </small>
</span>

<br/>
<label>Repeat: </label>
<input type="number" #repeater (keyup)="repeatName(firstName.value, repeater.value)" min="1" max="999" />
<label> Times </label>
<p>{{ repeatedName }}</p>

```
{% endraw %}

If you execute the sample and enter **John** and set the value of the `repeater` to any valid number, you see **31**, if you provide **3** as repeater count.

So why is that? As you may guess, `HTMLInputField` is treating the value as a `string`. Angular forwards the value as string no matter how your method signature looks.

To fix this, update the `repeatName` method to look like shown below

```typescript
public repeatName(name:string, times:string){
  if(times){
    const repeat = parseInt(times) + 1;
    this.repeatedName = (new Array(repeat)).join(name+ " ");
  }
}

```

Now the sample works as expected and multiply the name depending on the number you provide.
