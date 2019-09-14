---
title: Six golden rules of Infrastructure as Code (IaC)
layout: post
permalink: six-golden-rules-of-infrastructure-as-code-iac
published: true
tags: [IaC]
excerpt: In this post I share my six golden rules for Infrastructure as Code (IaC) projects.
image: /six.jpg
unsplash_user_name: Clem Onojeghuo
unsplash_user_ref: clemono2
---

Infrastructure as Code (IaC) is the process of describing all required infrastructure (such as servers, services or databases) to run your service or application. In this article, I want to share my six golden rules of Infrastructure as Code.

Over the past couple of years, IaC gained a lot of traction; more and more people are interested in persisting all their infrastructure-related knowledge in code to collaborate on it and establish a common understanding of it and get rid of that critical project risk. However, IaC solutions should be treated like every other primary part of your solution and follow some rules. I've seen many IaC solutions and compiled the following six rules, which will help you building robust Infrastructure as Code solutions for your projects.

<hr/>

## 1. All manual tasks are bad

Tools like *HashiCorp's Terraform* can be used to provision and mutate infrastructure resources like servers, services, and databases. However, you may discover things or configurations which can't be scripted using a tool like *Terraform*. Consider using other technologies like shell-scripts, *PowerShell*, or simple batch-files to achieve the requirement instead of mutating things manually. 

## 2. Every script belongs to source control

There is no exception. Treat your IaC solution like any other first-class citizen code. Everything belongs to your source control. Besides putting code into source control, you should also pick a good branching strategy. For us, the "traditional" git-flow works fine. Combined with regular code-reviews, you can ensure good code quality.

## 3. Ensure everyone understands the tools and languages

It's great if you're already using tools and scripts to create and maintain your infrastructure. Unfortunately, it is useless if your teammates don't understand the code you've written or don't know how to use the tools you've used. Expect the unexpected. Expect your infrastructure to fail on the first day of your vacation.

## 4. Code isn't documentation enough

Having all your infrastructure described in code is excellent and better documentation as an outdated wiki page. But you should add code documentation to your IaC scripts. Describe the purpose of every script. Document critical parts of your scripts. If your scripts are relying on inputs such as arguments or environment variables, add examples to the repository and demonstrate how to use the scripts.

## 5. Simulate failovers regularly

Crafting your infrastructure using code is an easy task if you do it at the beginning or the end of a project. However, you'll get most of it, if your IaC evolves with your project. It's not only the most beneficial way of doing IaC, but it's also the hardest. Your team should schedule failover tests regularly where you use your IaC to spin up an entirely new environment and deploy your application bits there to ensure everything works without human interaction. Having this task on your definition of done (DoD), you'll discover problems early and ensure that your IaC solution matches the required infrastructure.

## 6. Deal with sensitive data in IaC code and logs securely

Building cloud-native or distributed applications comes with the requirement of dealing with sensitive data such as passwords, connection strings or regular secrets. Putting such values as plain text into IaC code is a huge security vector and should be avoided. Once you've removed all the sensitive configuration data from your code, go one step further and guarantee that none of the sensitive values is written to logs. Cloud vendors such as Microsoft offer services like *Azure Key Vault* to store and consume sensitive data and when using tools like *Terraform* you can explicitly mark variables as sensitive to prevent those from being written to logs or outputs. 

<hr/>

Have you discovered other rules that are worth sharing when it comes to IaC solutions? Reach out and help to compile a great list of rules that others can use to build rock-solid IaC solutions.
