---
title: Pug-up your Angular markup
layout: post
permalink: pug-up-your-angular-markup
redirect_from: /jade-up-your-angular2-markup-8a7d51514be9
published: true
tags: [Angular, Pug]
excerpt: null
image: /2016-02-05-pug-up-your-angular-markup.jpg
---
Can you imagine the combination of *Angular* and Pug (previously known as Jade) is super awesome and timesaving? If not, read the following lines and reconsider!

When building *SPAs* using *Angular* or *AngularJS*, you use custom *HTML* markup extensions (aka *directives*) to instrument *Angular* how to render your *SPA* or how the different building blocks of your app should correspond to user interaction. Using those directives is smooth and well known in the *Angular* Community.

However, I found myself repeating almost the same markup multiple times while building different prototypes on *Angular*. To get rid of those duplications, `*ngFor` may be a solution, but concerning performance on mobile devices, you should avoid using those structural directives for such basic things.

At this point, *Pug* enters the stage. *Pug* offers stunning but simple mechanisms to make you even more productive. You could easily build compassable `mixins`, derived templates and other cool things. Besides all the advantages like maintainability, readability or the time you save, it's also fun to use it!

> If you have not used Pug before, see my other posts on Pug [here]({% post_url 2013-10-22-an-introduction-to-jade %}) and [here]({% post_url 2016-02-04-be-more-productive-with-pug %})

**Fasten your seatbelt** and prepare for some extra time that you can spend with your friends and family instead of waisting this time with tons of markup code.

## Get started — baby steps

FontAwesome is cool, it takes away much pain, like looking for the right images, integrating those in the build process, creating image-maps to reduce HTTP requests… you see, it's cool!

But it's frustrating to write `<i class="fa fa-foo"></i>` for the 3242th time. Let's build a `mixin` to get rid of that.

```pug
// mixins/base.pug
mixin icn(name,x)
  if(x)
    i(class='fa fa-#{name} fa-#{x}x')
  else
    i(class='fa fa-#{name}')

```

Using it is simple, include the `mixin` file and call the `mixin` using `+mixin-name(parameters)`

```pug
include mixins/base.pug
+icn('globe')
+icn('heart',5)
+icn('github')

```
This will generate

```html
<i class="fa fa-globe"></i>
<i class="fa fa-heart fa-5x"></i>
<i class="fa fa-github"></i>

```

## Creating Forms

Let's start with forms. Building forms (as soon as designing those in CSS is done) is a stupid task. It's all about writing the same `input` node with tons of attributes multiple times. Here a short mixin for `bootstrap` based `input` nodes.

```pug
// mixins/forms.pug
mixin input(slug, title, type, placeholder, model)
    .form-group
        label.col-sm-2.control-label(for='#{slug}')= title
        .col-sm-7
            input.input-sm.form-control(id='#{slug}', type='#{type}',[(ngModel)]="#{model}", placeholder='#{placeholder}')

```

Usage is pretty the same as you've learned in the previous sample.

```pug
// index.pug
include mixins/forms.pug
+input('firstName', 'First Name', 'text', 'John', 'customer.name')
+input('email', 'Email', 'email', 'j.doe@example.com', 'customer.email')

```

This will render

```html
<div class="form-group">
  <label for="firstName" class="col-sm-2 control-label">First Name</label>
  <div class="col-sm-7">
    <input id="firstName" type="text" [(ngModel)]="customer.name" placeholder="John" class="input-sm form-control"/>
  </div>
</div>
<div class="form-group">
  <label for="email" class="col-sm-2 control-label">Email</label>
  <div class="col-sm-7">
    <input id="email" type="email" [(ngModel)]="customer.email" placeholder="j.doe@example.com" class="input-sm form-control"/>
  </div>
</div>

```

The interesting part here is all those *Angular* related directives. See `[(ngModel)]` for example. Because *Pug* compiles to *HTML* during build time, we can pass around the actual bindings as strings and use *Pug* String interpolation to produce the final, *Angular* conform Markup.

## Combine mixin files

So far we've created a `icn` and a `input` mixin, both are located in different files `mixins/base.pug` and `mixins/forms.pug`, let's add `mixins/index.pug` to have a single file, containing all mixins.

```pug
// mixins/index.pug
include ./base.pug
include ./forms.pug

```

Now you can refactor your root `pug` file to just `include mixins/index.jade`, so you don't have to specify each mixin file.

## More complex input directives

The amount of *HTML* compared to the few lines of *Pug* is immersive. And the difference will grow even more if you create more powerful mixins. Let's add some nice icons to our input form.   
The sample shows the input we created a few seconds ago, it should still render without any image. So change the froms `mixin` to accept an additional icon argument:

```pug
// mixins/forms.pug
mixin input(slug, title, type, placeholder, model, icon)
  .form-group
    label.col-sm-2.control-label(for='#{slug}')= title
      .col-sm-7
        if(icon)
          .input-group
            span.input-group-addon
              +icn(icon)
        input.input-sm.form-control(id='#{slug}', type='#{type}', [(ngModel)]="#{model}", placeholder='#{placeholder}')

```

The indentation is essential here. The ending `input` node is exactly on the same level as the `if` statement. So it gets rendered no matter if there is an icon or not. Another important piece is the usage of `+icn(icon)`.

Yes, you're right were starting to nest multiple mixins. Imagine that power? Using this mixin is again simple. Change the `index.jade` to match the following.

```pug
// index.pug
include mixins/index.pug
+input('firstName', 'First Name', 'text', 'John', 'customer.name')
+input('email', 'Email', 'email', 'j.doe@example.com', 'customer.email', 'envelope-o')

```

Our `firstName` input remains without an icon. On the other-side will you find a nice looking envelope in front of the email input field. Once again, see the generated markup.

```html
<div class="form-group">
  <label for="firstName" class="col-sm-2 control-label">First Name</label>
  <div class="col-sm-7">
    <input id="firstName" type="text" [(ngModel)]="customer.name" placeholder="John" class="input-sm form-control"/>
  </div>
</div>
<div class="form-group">
  <label for="email" class="col-sm-2 control-label">Email</label>
  <div class="col-sm-7">
    <div class="input-group"><span class="input-group-addon"><i class="fa fa-envelope-o"></i></span></div>
    <input id="email" type="email" [(ngModel)]="customer.email" placeholder="j.doe@example.com" class="input-sm form-control"/>
  </div>
</div>

```

## Integration with Angular

First, let's take a look at a pure component responsible for rendering an edit form to allow users to change customer's data.

```typescript
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer';
@Component({
    templateUrl: 'detail.html',
    directives: [ROUTER_DIRECTIVES]
})
export class CustomerDetailComponent implements OnInit {

    private customer: Customer;

    constructor(
        private _customerService: CustomerService,
        private _router: Router,
        private _route: ActivatedRoute
        ) {
            this.customer = new Customer();
    }
    
    public ngOnInit() {
        let id = null;
        this._route.params.forEach((params: Params) => {
          id = +params['id'];
        });
        this._customerService.getById(id)
          .subscribe(c => this.customer = c);
    }
    
    public save(){
        this._customerService.update(this.customer)
            .subscribe(data=> this._router.navigate(['/customers/list']));
    }
}

```

This is a regular *Angular* component. There is no need for changing something here. The `templateUrl` remains `...detail.html`.

You may ask where all the magic happens. Well, it's inside of a `gulp task`.

> If you've never used gulp or need a refreshment, [check out my series of posts on Gulp]({% post_url 2015-10-08-frontend-build-series-introduction %}), it is worth reading it!

Once *Gulp.js* is up and running in your *Angular* project, there is only a single new dependency you've to install to have things you need.

```bash
npm install gulp-jade --save-dev

```

**With respect** to the common *Angular* project structure and **systemJS**, you can build HTML templates to the correct destination by using the following `gulp task`:

```javascript
gulp.task('private:build-ng2-templates', function(done){
    return gulp.src('src/templates/**/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('dist/templates'));
});

```

Hook up this task to the sequence of tasks being executed during a regular build, and you're done.

## Summary

I know many people bashing about *Pug*. However, I don't get why. (Most of the time those people were also bashing my beloved *CoffeeScript* in the past :D) However, in these days we're using *TypeScript* to make *JavaScript* work, *Less* or *Sass* to make *CSS* easier and less painful. So why not using *Pug* to be more productive in markup?

What's your opinion? Have you tried it with *Angular*? Do you have the same impressions I've shared here? Alternatively, may it adding too much complexity to your projects? **Leave a comment.**


