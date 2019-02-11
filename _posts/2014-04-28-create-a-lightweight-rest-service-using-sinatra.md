---
title: Create a lightweight REST service using Sinatra
layout: post
permalink: create-a-lightweight-rest-service-using-sinatra
redirect_from: /create-a-lightweight-rest-service-using-sinatra-44004ac02caf
published: true
tags: []
excerpt: null
image: /2014-04-28-create-a-lightweight-rest-service-using-sinatra.jpg
unsplash_user_ref: richie_lugo
unsplash_user_name: Richie Lugo
---

Exposing data using a REST service is an easy task which can be achieved using almost any programming language. In the past, I’ve used ASP.NET MVC WebApi to achieve this.

However, as soon as you’ve to run your service on different platforms, CLR isn’t the best option. Programming languages like Ruby and Python or Node.js are stronger when it comes to cross-platform support.

I love the Ruby syntax, and that’s why I’ll show how to build a small REST Service exposing tasks using Ruby’s Sinatra framework. Sinatra doesn’t require a fix or predefined project structure. I want to organize all the artifacts a little bit. That’s why I’ve chosen the following structure

{% include image-caption.html imageurl="/assets/images/posts/2014/sinatra-1.png" width="300"
title="Sinatra project structure" caption="Sinatra project structure" %}

First let’s review the model. I’ve built the model using ruby’s `datamapper` gem.

```ruby
#models/task.rb

class Task
	include DataMapper::Resource

		property :id, 					Serial
		property :title, 				String
		property :completed,		Boolean
		property :description,	String
end	
puts 'processed'

```

Next and perhaps most important part is, of course, the routing for the service.

```ruby
# routes/tasks.rb
get '/api/tasks' do
	Task.all.to_json
end

get '/api/tasks/:id' do
	t = Task.get(params[:id])
	if t.nil?
		halt 404
	end
	t.to_json
end

post '/api/tasks' do
	body = JSON.parse request.body.read
	t = Task.create(
		title: 		body['title'],
		director: body['director'],
		year:     body['year']
	)

	status 201
	t.to_json	
end

put '/api/tasks/:id' do
	body = JSON.parse request.body.read
	t = Task.get(params[:id])
	if t.nil?
		halt(404)
	end
	halt 500 unless Task.update(
		title: 			body['title'],
		director: 	body['director'],
		year:       body['year'] 
		)
	t.to_json
end

delete '/api/tasks/:id' do
	t = Task.get(params[:id])
	if t.nil?
			halt 404
  end
  halt 500 unless t.destroy
end

```

As you can see it’s pretty easy and straight forward to create all necessary kinds of routes for a universal REST service. Next, let’s review the main entry file

```ruby
# main.rb

# encoding: UTF-8
require 'json'
require 'sinatra'
require 'data_mapper'
require 'dm-migrations'

configure :development do
  DataMapper::Logger.new($stdout, :debug)
  DataMapper.setup(:default, ENV['DATABASE_URL'] || "sqlite3://#{Dir.pwd}/development.db")
end 

require './models/init' 
require './routes/init'

DataMapper.finalize

```

The `main.rb` itself is just loading all the dependencies. Right after that, the DataMapper is configured to work with my local sqlite3 database. Last important part is loading the init files from both subdirectories (models and routes). These init files are then again loading all specific models and routes.

## Installing the dependencies

First, you need of course ruby, gem and `sqlite3` itself on your system. There are plenty of samples and articles out there describing how to install all these components on any platform.

## Installing DataMapper

Installing DataMapper and the required adapter for sqlite3 is also straight forward. Go and check out [their website](http://datamapper.org){:traget="_blank"} for detailed installation instructions

## Using Bundler

Bundler is a dependency manager for ruby like `NuGet` for CLR or `npm` for Node.js. I use `gemrat` to automatically update the `gemfile` (defines all the dependencies) from the terminal.

```bash
gemrat json
gemrat sinatra
gemrat data_mapper
gemrat dm-sqlite-adapter

```

#### Automate things using a Rakefile

DataMapper is offering some great hooks for automating database generation or updating the database based on your model classes.

```ruby
require 'dm-migrations'

desc "List all routes"
task :routes do
  puts `grep '^[get|post|put|delete].*do$' routes/*.rb | sed 's/ do$//'`
end

desc "migrates the db"
task :migrate do
  require './main'
  DataMapper.auto_migrate!
end

desc "upgrades the db"
task :upgrade do
  require './main'
  DataMapper.auto_upgrade! 
end

```

## Starting the REST service

Starting the REST service can be done by executing the following command.

```bash
ruby main.rb

```

## Summary / SourceCode

As you can see things are straightforward in Ruby with Sinatra and DataMapper. To access the entire sample go and check my GitHub repository at [https://github.com/ThorstenHans/Sinatra.REST.Sample](https://github.com/ThorstenHans/Sinatra.REST.Sample){:traget="_blank"}.


