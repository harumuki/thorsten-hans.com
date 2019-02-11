---
title: Terraform - The definitive guide for Azure
layout: post
permalink: terraform-the-definitive-guide-for-azure
published: true
tags: [Terraform,IaC]
excerpt: Do you want to know what Terraform is and how it can assist you with your day-to-day job? Then you have to read this guide on HashiCorp Terraform.
image: /terraform.jpg
unsplash_user_name:
unsplash_user_ref:
---

*Terraform* is a product in the *Infrastructure as Code (IaC)* space, it has been created by [HashiCorp](https://www.hashicorp.com/){:target="_blank"}. With *Terraform* you can use a single language to describe your infrastructure in code. This guide explains the core concepts of *Terraform* and essential basics that you need to spin up your first environments with *Terraform*.



* What is Infrastructure as Code (IaC)
* What is Terraform
  * Terraform Providers 
  * The HashiCorp Configuration Language (HCL)
  * Previewing changes
* Setting up Terraform
  * Terraform Extension for Code
* How does a Terraform project looks like
* Creating your first Azure environment with Terraform
* The Terraform Lifecycle
* Modifying terraformed environments
* Understanding Terraform State
* Teardown terraformed environments
* Summary


## What is Infrastructure as Code (IaC)

*Infrastructure as Code (IaC)* is the process of describing infrastructural components such as servers, services and databases using a programming language. Once all infrastructural requirements are described in code, that code can be stored in *source control*. 

*Source control* means that the infrastructure is *versioned*, *transparent*, *documented*, *testable*, *mutable* and *discoverable*. Once the first *version* is stored in *source control*, all team members see which infrastructure is required to bring a project alive. Everyone sees which configuration settings are required to make -for example- the database perform as good as expected. 

Changes done to the infrastructure exist as dedicated *commits* -or bigger changes as *pull requests*- and will be *reviewed* by peers before being merged into the latest version. Code is also easy to test and on top, *Continuous Integration (CI)* builds can execute existing tests automatically with no human interaction. Having tests means errors in the infratsructure configuration are spotted earlier.

In addition, having code in a repository is 100% more documentation as if all necessary information is stored in just one human brain. This is also a critical risk reduction for every project. *Let's elaborate on risk reduction a bit:* 

*Before Infrastructure as Code, John -the smart guy everyone has on his/her software projects- was responsible for maintaining the infrastructure. John gave his best to describe all essential infrastructure parts and their configuration values. However, modern software projects evolve over time. Services have to be added or removed from the overall architecture; things must be scaled dynamically and/or manually based on external events. So there is good chance that John has some critical information only in his head... Maybe has Tim -the guy who sits next to Tim- some tribal knowledge about the Redis configuration, but would you bet on it?*

*That said, everyone on the team knows John. Everyone trusts him. However, every teammate is afraid when John want's to take a couple of weeks off and go for vacation.*

Look at your current project and try to spot *John*. Everybody knows situations or constellations like these. To be clear: **It's not Johns fault**. It's the fact that the entire organization isn't using *IaC*. 

Having *Infrastructure as Code* would remove that cirtical path.


## What is Terraform

Now, knowing what *Infrastrcture as Code* is, it's time to look at *Terraform* itself. *Terraform* is -if you ask me- currently the best tool to implement *IaC*. And it doesn't matter if you're using *Azure*, *Azure Stack* or other vendors as target for your infrastructure. With *Terraform* you can create, modified and destroy environments safely and efficiently. 

For me, these are the three major benefits offered by *Terraform*: 

1. It works with almost every environment (On-Demand and On-Premises)
2. You've to learn only a single and simple language
3. Terraform can preview changes before applying them

Let's take a closer look to those three benefits now.

### Terraform Providers

*HashiCorp* created a small, yet powerful tool which can talk to numerous platforms using a flexible provider model. Vendors like *Microsoft* expose functionalities as APIs and the corresponding *Terraform* provider is responsible for making those APIs accessible to you. If you ask yourself which platforms *Terraform* is supporting, go and check the [list of providers](https://www.terraform.io/docs/providers/index.html){:target="_blank"}. 

Dealing with different APIs means each platform will support different feautres? 

**Yes**. Take *Azure Functions* as an example. You can quickly query information about an existing *Azure Functions* instance or create/modify/destroy another *Azure Function* instance using the  *AzureRM provider for Terraform*. However, if you talk to a local *VMWare Cluster*, you simply can't interact with *Azure Functions* because *VMWare* doesn't have a first class citizen of type *Azure Funciton*.   

### The HashiCorp Configuration Language (HCL)

The *HashiCorp Configuration Language (HCL)* is a small domain specific language which is based on *JSON*, but the *HashiCorp* team removed some language specific plumbings in order to make us a bit more productive by saving some keystrokes. 

On the other side, *Terraform* adds some powerful interpolation features to *HCL*, which you'll use and love everyday. You'll dive into *HCL* later in this guide. However, take the following short snippet as sneak-peek to see how *Terraform* scripts actually look like.

```hcl
resource "azurerm_redis_cache" "sample" {
  name                = "tf-redis-basic"
  location            = "${azurerm_resource_group.test.location}"
  resource_group_name = "${azurerm_resource_group.test.name}"
  capacity            = 0
  family              = "C"
  sku_name            = "Basic"
  enable_non_ssl_port = "${var.redis_enable_non_ssl}"
  tags                = "${local.all_tags}"
}

```

### Previewing changes

Being able to preview changes before they'll be applied to a platform is the biggest benefit offered by *Terraform* in day-to-day business. You can think of it as the `git status` of *IaC*. You describe your infrastructure in *HCL* and use the handy `terraform plan` command to see what would happen if that *Terraform* script gets **applied** to the chosen platform.

Besides those three major benefits, *Terraform* offers things like:

 - centralized state management
 - implicit dependency resolution
 - parallelization of execution
 - reusable modules
 - terraform module registry

and many more.

## Setting up Terraform

Setting up *Terraform* is quite smooth. *Terraform* can be used on every popular operating system. It can be downloaded directly from the [official website](https://www.terraform.io/downloads.html){:target="_blank"}. 

On *macOS* you can install it also using *homebrew* by executing `brew install terraform`.

On *Windows* you can install it using *chocolatey* by executing `choco install terraform`.

### Terraform Extension for Code

There is an extension for *Visual Studio Code* called [Terraform (by Mikael Olenfalk)](https://github.com/mauve/vscode-terraform.git){:target="_blank"}. Once installed Code is able to do *syntax highlighting*, *code completion*, *IntelliSense* and on top of that you can drill through your resouce graph using a nice visual tree.

## How does a Terraform project looks like

## Creating your first Azure environment with Terraform

## The Terraform Lifecycle

## Moifying terraformed environments

## Understanding Terraform State

## Teardown terraformed environments

## Summary
