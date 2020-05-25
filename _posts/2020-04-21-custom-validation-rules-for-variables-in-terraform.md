---
title: Custom Validation Rules for Variables in Terraform
layout: post
permalink: custom-validation-rules-for-variables-in-terraform
published: true
tags: 
  - Terraform
  - Infrastructure as Code
excerpt: Learn how to harden your Terraform projects using custom validation rules for input variables. The feature is still experimental. However, it looks promising and may help you!
image: /terraform.jpg
unsplash_user_name: Elaine Casap
unsplash_user_ref: ecasap
---

In Terraform, we use *Variables* to make projects configurable and to reduce code duplication. We can harden variables, by applying individual validations to them.

Obviously, providers like [the official Azure Provider](https://www.terraform.io/docs/providers/azurerm/index.html){:target="_blank"} come with validations on resource attributes. For example, consider describing an instance of [Azure Container Registry (ACR)](https://azure.microsoft.com/en-us/services/container-registry/){:target="_blank"}.  

ACR has several `required` attributes, which must be provided by consumers. If consumers forget specifying a `required` attribute, Terraform will not try to provision it. Instead, the operation will fail and report a corresponding error message to the user, as shown in figure 1.

{% include image-caption.html imageurl="/assets/images/posts/2020/terraform-custom-validation-rules-1.png"
title="Terraform - Required property value is empty" caption="Terraform - Required property value is empty" %}
 
Another great example for custom validation is the `sku` property. You have to set the value of `sku` either to `Basic`, `Standard`, `Premium`. The provider will accept no other values. If consumers provide a different value, Terraform will again produce a meaningful error message and stop the execution.

{% include image-caption.html imageurl="/assets/images/posts/2020/terraform-custom-validation-rules-2.png"
title="Terraform - Invalid property value provided" caption="Terraform - Invalid property value provided" %}

Having critical properties being protected with built-in validation logic is fantastic. However, sometimes you may want to use different validation logic in the scope of your project, which is an excellent scenario for *custom validations*.

## Custom Validation Rules in Terraform

Consider the previously explained  `sku` property on a resource of type `azurerm_container_registry`. Technically, it accepts one of the three values mentioned before. In the scope of our fictive project, only services with an SKU of `Standard` or `Premium` are allowed. To achieve this, we will use a custom validation.

Custom validations are currently flagged as **experimental feature**, which means you have to turn them on explicitly in the context of your project. To do so, update your `terraform` block and add support for the experimental feature:

```hcl
terraform {
  experiments = [variable_validation]
}

```

To specify the `sku`, we start with a simple Terraform variable. 

```hcl
variable "acr_sku" {
  type = string
  description = "Azure Container Registry SKU"
}

```

The variable is used in the  `azurerm_container_registry`  resource, to set `sku`:

```hcl
resource "azurerm_resource_group" "main" {
  name     = "rg-main"
  location = "westeruope"
}

resource "azurerm_container_registry" "acr" {
  name                = "thnsblogdemo"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = var.acr_sku
}

```

---

Having such a configuration, consumers can specify the desired SKU by providing a value for `acr_sku`. For example, an explicit specification as part of `terraform apply` could look like this:

```bash
terraform apply -var acr_sku="Standard"

```

To prevent users from specifying `Basic` , we can now add custom validation logic to the variable:

```hcl
variable "acr_sku" {
  type = string
  description = "Azure Container Registry SKU"

  validation {
    condition     = var.acr_sku == "Standard" || var.acr_sku == "Premium"
    error_message = "Sorry, but we only accept ACRs on Standard or Premium SKU."
  }
}

```

Terraform CLI will present your custom `error_message` if the condition evaluates to `false`. 

At the moment, you can access the hosting variable within your validation logic; you are not able to take another variable into consideration to provide even complex validation. 

If consumers specify `Basic` as value for `acr_sku` now, Terraform will display the custom error message, as shown in figure 3.

{% include image-caption.html imageurl="/assets/images/posts/2020/terraform-custom-validation-rules-3.png"
title="Terraform - Custom validation rule" caption="Terraform - Custom validation rule" %}

Have you already used custom validations in Terraform projects? What is your opinion about the current state? Leave a comment and let us talk about it. Also, make sure that you have subscribed to my newsletter to get an instant ping when new articles are published here.