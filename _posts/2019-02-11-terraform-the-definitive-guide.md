---
title: Terraform - The definitive guide for Azure enthusiasts
layout: post
permalink: terraform-the-definitive-guide-for-azure-enthusiasts
published: true
tags: [Terraform,IaC]
excerpt: Do you want to know what Terraform is and how it can assist you with your day-to-day job? Then you have to read this guide on HashiCorp Terraform.
image: /terraform.jpg
unsplash_user_name:
unsplash_user_ref:
---

*Terraform* is a product in the *Infrastructure as Code (IaC)* space, it has been created by [HashiCorp](https://www.hashicorp.com/){:target="_blank"}. With *Terraform* you can use a single language to describe your infrastructure in code. This guide explains the core concepts of *Terraform* and essential basics that you need to spin up your first environments with *Terraform*.


- [What is Infrastructure as Code (IaC)](#what-is-infrastructure-as-code-iac)
- [What is Terraform](#what-is-terraform)
  - [Terraform Providers](#terraform-providers)
  - [The HashiCorp Configuration Language (HCL)](#the-hashicorp-configuration-language-hcl)
  - [Previewing changes](#previewing-changes)
- [Setting up Terraform](#setting-up-terraform)
  - [Terraform Extension for Code](#terraform-extension-for-code)
- [DataTypes in HCL](#datatypes-in-hcl)
  - [Booleans](#booleans)
  - [Strings](#strings)
  - [Lists](#lists)
  - [Maps](#maps)
- [How does a Terraform project looks like](#how-does-a-terraform-project-looks-like)
- [Variables in HCL](#variables-in-hcl)
  - [Referencing Variables](#referencing-variables)
- [Outputs in HCL](#outputs-in-hcl)
- [Overrides](#overrides)
- [The Azure Provider](#the-azure-provider)
  - [Authenticating against Azure AD](#authenticating-against-azure-ad)
  - [Creating your first Azure environment with Terraform](#creating-your-first-azure-environment-with-terraform)
- [The Terraform Lifecycle](#the-terraform-lifecycle)
- [Moifying terraformed environments](#moifying-terraformed-environments)
- [Understanding Terraform State](#understanding-terraform-state)
- [Teardown terraformed environments](#teardown-terraformed-environments)
- [Summary](#summary)


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

The installation can be verified by executing the `terraform` command. *Terraform* should now show all available `subcommands`

{% include image-caption.html imageurl="/assets/images/posts/2019/terraform-setup-verification.png"
title="A working Terraform installation" caption="A working Terraform installation" width="90%" %}

### Terraform Extension for Code

There is an extension for *Visual Studio Code* called [Terraform (by Mikael Olenfalk)](https://github.com/mauve/vscode-terraform.git){:target="_blank"}. Once installed Code is able to do *syntax highlighting*, *code completion*, *IntelliSense* and on top of that you can drill through your resouce graph using a nice visual tree.

## DataTypes in HCL

The introduction already mentioned that *HashiCorp Configuration Language (HCL)* is a fairly simple language. This simplicity continues when we dive deeper in *HCL DataTypes*. Currently *HCL* knows four different datatypes which you'll use to craft you scripts.

### Booleans

A `boolean` in *HCL* must have a value. The value can either be `true` or `false`

```hcl
variable "storace_account_enable_firewall" {
  type    = "boolean"
  default = true
}

```

### Strings
A `string` in *HCL* is either a single line of text or a text that spreads over multiple lines. The following snippet shows, how those two kinds of `string` can be defined:

```hcl
variable "single_line_string" {
  type    = "string"
  default = "value"
}

variable "multi_line_string" {
  type = "string"
  default = <<EOF
This value spreads 
over several lines.
EOF
}

```
When receiving `string` values, *HCL* inspects the value and converts it to a `number` or a `boolean` if possible. However, there are some important caveats that every *Terraform* user needs to know. You can read more about those [caveats here](https://www.terraform.io/docs/configuration/variables.html#booleans){:target="_blank"}.

### Lists

A `list` in *HCL* is a collection of `string` values which are indexed by `numbers`. Lists in *HCL* are *zero based* (so the first index of a list is always `0` in *HCL*). Basically, it's a typed JSON `Array`.

```hcl
variable "simple_list" {
  type    = "list"
  default = ["development", "staging", "production"]
}

```

### Maps

A `map` in *HCL* is a dictionary of `string` values, indexed by `string` keys. You can think of it as a regular JavaScript `object`. Defining a `map` looks like this:

```hcl
variable "custom_tags" {
  type      = "map"
  default   = {
    author  = "Thorsten"
    version = "1.0.0" 
  }
}

```

## How does a Terraform project looks like

*Terraform* projects are easy to understand. Basically every folder is a valid *Terraform* project if it contains at least a single `.tf` or `.tf.json` file. *(Yes you can write your scripts in plain old JSON but my advice is to stick with `.tf` files)* 

However, if you have multiple `.tf` files in a folder, files are processed in alphabetical order. While processing, `.tf` files are simply appended together. 

## Variables in HCL

In *Terraform* `variables` can be specified to make scripts more flexible and dynamic. Either variables are created in regular `.tf` scripts or in dedicated `.tf` files. There is no real best practice here, because each *Terraform* projects differs in both: size and complexity. 

Because of *Terraform's* implicit dependency resolutions, `variables` are always available, no matter where they end-up in the final script.

To keep things organized, we'll stard with a dedicated `variable` file. In such a situation, I choose names like `variables.tf`. `frontend-variables.tf` or `backend-variables.tf`.

A `variable` has a fairly simply schema in *HCL*.

```hcl
variable "storage_account_name" {
  type        = "string"
  default     = "thorstensstorage"
  description = "provide a unique name for the Storage Account"
}

variable "storage_account_location" {
  type        = "string"
  description = "name of the Azure datacenter where the Storage Account should be generated"
}

```

Every variable requires a value at runtime. There are **five ways** how the value of a variable could be specified in *Terraform*.

1. The actual value of the variable is provided by the `default` property as part of the variable definition as shown above for `storage_account_name`.
2. The variable `storage_account_location` has no `default` value. When `terraform apply` or `terraform plan` is executed, a simple wizard will ask for a value.
3. Actual variable values could also be specified using `Environment Variables`. This is an excellent approach for build servers or scenarios where *Terraform* scripts are applied without human interaction. `Environment Variables` are pulled if their name follows the schema `TF_VAR_{variable_name}` (`TF_VAR_storage_account_location` in this example)
4. Values can be specified by passing arguments to the `terraform apply` command. This approach is great for develpment time or -if required due to limitations- for unattended execution contexts such as build servers
5. The last and most convinient method to specify variable values are so-called `.tfvars` files. `.tfvars` files should never go to source control. In real world scenarios it's often required to pass some sort of sensitive data into *Terraform* scripts (Think of Service Principal credentials for example). My projects normally contain a `values.tfvars.template` file which is explicitly added to *git* and tells other teammates which values should be defined. Providing concrete values for the sample `variables` above could look like this.

```hcl
storage_account_name = "storagethorsten"
storage_account_location = "West Europe"

```
### Referencing Variables

Referencing variables in *Terraform* scripts is done by using the *Terraform* interpolation syntax. Both variables defined above are used in the following sample to provide essential metadata for an *Azure Storage Account*. The following script contains *HCL* keywords which weren't explained yet. Don't worry aboute those for now. The concept of using *variables* is essential for now.

```hcl
resource "azurerm_storage_account" "storageacc" {
  name                     = "exports${var.storage_account_name}"
  resource_group_name      = "thh"
  location                 = "${var.storage_account_location}"
  account_tier             = "Standard"
  account_replication_type = "GRS"
}

```

Execute `terraform plan` and see how runtime values are constructed by the interpolations.

{% include image-caption.html imageurl="/assets/images/posts/2019/terraform-guide-1.png"
title="Terraform plan - Interpolated configuration values" caption="Terraform plan - Interpolated configuration values" width="85%" %}

## Outputs in HCL

Every *Terraform* script has to read data from `resources` like *Connection Strings*, *IP addresses* or *DNS names* from items that are created as part of the script itself. This can be achieved using so called `outputs` in *HCL*. The definition syntax is quite similar to `variable` definitions. For smaller projects my advice is to put all outputs into a single file called `outputs.tf`. However, this pattern could become a bit A simple `output` which will grab the `primary access key` from the *Azure Storage Account* specified above.

```hcl
output "storage_account_access_key" {
  value       = "${azurerm_storage_account.storageacc.primary_access_key}"
  description = "The storage account's primary access key"
  sensitive   = false
}

```

The output's `value` is queried from the *Azure Storage Account*, once again the `resource` is referenced by interpolation. To identify the custom `resource`, the combination of the type `azurerm_storage_account` and the custom, unique name `storageacc` is used for identification. Once the `resource` is addressed, the *exported* property is referenced by name (here `primary_access_key`). 

Official provider documentation is providing a list of all exported attributes. Check the documentation of `azurerm_storage_account` [here](https://www.terraform.io/docs/providers/azurerm/r/storage_account.html#attributes-reference){:target="_blank"}.

Besides `description`, the `output` scheme defines another important property called `sensitive`. If an output is marked as sensitive, *Terraform* won't write the actual value to logs. `sensitive` is set to `false` in the definition above for demonstration purpose.

Execute the *Terraform* script using `terraform apply` and check the log messages for the `storage_account_access_key`

{% include image-caption.html imageurl="/assets/images/posts/2019/terraform-guide-2.png"
title="Terraform Outputs - printed by terraform apply" caption="Terraform Outputs - printed by terraform apply" %}

## Overrides

There

## The Azure Provider

### Authenticating against Azure AD

### Creating your first Azure environment with Terraform

## The Terraform Lifecycle

Having the first environment deployed to Azure, it's time to look at the other stages in the lifecycle of a *Terraform* project. As *Terraform* user, you'll always follow a simple, yet flexible lifecycle. 

If you look at the sample from the sections above, you may recognize that you made it through the entire lifecycle for a couple of times. Sure for demonstration purpose we skipped the testing and review stages. However, services like GitHub and Azure DevOps make setting up those stages really smooth. Being able to execute `terraform plan` at any point in time, you'll always know how the Azure environment will evolve if the current changes would be applied.

## Moifying terraformed environments

Until now, `resources` were only added to the overall architecture. All executions of `terraform plan` were showing logs like `1 to Add` or `3 to Add`. To cause a `modification` the existing *Azure App Service Plan* will be scaled from the `Basic` tier with a size of `B1` to the `Standard` tier with a new size of `S2`. 

Change the corresponding values in `values.tfvars`. The updated file should look similar to this one:

```hcl

```

Apply the changes to your Azure environment by executing `terraform apply -var-file=values.tfvars`


## Understanding Terraform State

## Teardown terraformed environments

At some point in time you want to *destroy* an environment that was created and maintained by *Terraform*. Perhaps a developer environment has to be deleted or a business decision requires a move from one cloud vendor to anthoer. In cases like those, `terraform destroy` will become you handy, tiny friend. 

Move into the project folder and execute `terraform destroy`. *Terraform* verify that the actual state of the environment still matches the local state. If so, the enviroment can be deleted. As always, you'll be presented with the *plan*, so you can review the potential changes and finally confirm the delition.

## Summary

I hope you enjoyed reading *Terraform - The definitive guide for Azure enthusiasts*. If you made it through the post, you gained a ton of knowledge about *Terraform* and you made some basic steps with the *Azure* Provider for Terraform. Having this introduction in place, I'll publish more advanced posts on *Terraform* and *Infrastructure as Code* in general over the next weeks and months. 

*Infrastructure as Code* is something every developer and IT-Pro should care about. Modern applications are way more complex than five years ago. Developers, teams and organizations are combining cloud services from different vendors to build the best user experience for their customers. With *IaC* and *Terraform* you can manage the jungle of services and keep the knowledge open and transparent. Moving on the *IaC* and/or *Terraform* way is not an easy task that a single person could achieve on a friday afternoon. 

If you need further assistance on that journey, reach out. I would be thrilled to help.
