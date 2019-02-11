---
title: Angular Quickie — Elvis is in tha house
layout: post
permalink: angular-quickie-elvis-operator
redirect_from: 
  - /angular2-quicky-elvis-is-in-tha-house-61c6a714dfe3
  - /2016/01/07/angular2-quicky-elvis-in-tha-house/
published: true
tags: [Angular]
excerpt: Angular introduces the Elvis operator. Learn how to use it in templates and how to build more efficient HTML templates for your Angular components.
image: /2016-angular-quickie.jpg
---
Another *Angular quickie* for today!😉 *Angular* introduces the *Elvis* operator **?.** is used in templates.

*CoffeeScript* Developers may know this as “Existential Operator” which can easily be used to check if a variable has a value.In combination with `*ngFor` and `*ngIf` this makes a good toolbelt for rapidly building UIs within *Angular *Apps.

{% include image-caption.html imageurl="/assets/images/posts/2016/angular-quickie-elvis.gif"
title="Elvis in tha Angular House" caption="Elvis in tha Angular House" %}

The [official Angular documentation](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#expression-operators){:target="_blank"} gives you a few examples of how to use the *Elvis* operator.

The good thing about the *Elvis* operator is that you can use it in chains like shown below:

{%raw %}
```html
<span>{{a?.b?.c?.d?.name}}</span>

```
{%endraw %}

However, that's only half of the truth. Only in a few situations, you want to display **nothing**. Most of the time you want to provide a kind of fallback value. Think about an App for buying and selling stuff. It displays messages dynamically. For example either

 * Thank you for selling 100 items
 * Thank you for buying 10 items

However, what should be displayed if the `action` (`buying` or `selling` above) isn't defined? You don't want to display **Thank you for 20 items**.  You want to provide the default value instead of nothing. So let's start with the following `HTML` which still lacks the default value:
{%raw %}
```html
<span>Thank you for {{transaction?.operation?.caption}}
  {{transaction.items.length+1}} items
</span>

```
{%endraw %}

Depending on the current state, the two different messages from above will be generated:

```typescript

@Component({})
export class MyComponent {

  public transaction: any = {
    items = [{ /* ... */ }],
    operation = { caption: 'selling'}
  }

}

// output
'Thank you for selling 100 items'

```

```typescript
@Component({})
export class MyComponent {

  public transaction: any = {
    items = [{ /* ... */ }],
    operation = { caption: 'buying'}
  }

}

// output
'Thank you for buying 20 items'
```

And the already described worst-case:

```typescript
@Component({})
export class MyComponent {
  public transaction: any = {
    items = [{ /* ... */}],
    operation = null
  }
}
// generated output:
'Thank you for 20 items'

```

To add support for a default value, you don't want to use *ngIf*. There is a more elegant way. 
Use the logical or `||` operator in conjunction with the Elvis operator to add support for default values. 

Update the sample HTML to match the following:

{%raw %}
```html
<span>Thank you for {{transaction?.operation?.caption || 'buying' }}
  {{transaction.items.length+1}} items
</span>

```
{%endraw %}

I've created a [small plnkr sample](https://embed.plnkr.co/D1AWgU/){:target="_blank"} that uses the combination of `*ngFor`, `*ngIf` and `?` the Elvis operator.


