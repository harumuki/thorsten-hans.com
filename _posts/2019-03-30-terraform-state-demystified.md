---
title: Terraform - State demystified
layout: post
permalink: terraform-state-demystified
published: true
tags: [Terraform,IaC]
excerpt: State Management is critical in Terraform. This post provides an overview of what state is and how you should deal with it.
image: /mystical.jpg
unsplash_user_name: Robert V. Ruggiero
unsplash_user_ref: rvruggiero
---

*State Management* is essential in *Terraform*. This post explains what State in *Terraform* is, how it is mutated and how you should deal with it - no matter if you're a one-person show or part of a development team.

- [What is Terraform State](#what-is-terraform-state)
  - [Terraform’s State file](#terraforms-state-file)
  - [Tracking of outputs](#tracking-of-outputs)
  - [Querying State using CLI](#querying-state-using-cli)
  - [Visualizing Terraform Dependecy Graph](#visualizing-terraform-dependecy-graph)
- [Introducing State Backends](#introducing-state-backends)
  - [State Locking](#state-locking)
- [Conclusion](#conclusion)

Having *Terraform* displaying detailed previews before applying modifications to cloud platforms is amazing. To deliver such a great experience, *Terraform* uses the so-called *State*. This article will explain what *State* is, how it works and why it is mission-critical.

However, if you’re entirely new to *Terraform*, or if you want to refresh your existing *Terraform* knowledge, you should read [Terraform - The definitive guide for Azure enthusiasts](https://thorsten-hans.com/terraform-the-definitive-guide-for-azure-enthusiasts){:target=“blank”} first.

## What is Terraform State

The *State* is an essential building block of every *Terraform* project. First and foremost, it’s acting as a kind of database for the configuration of your *Terraform* project. All resources that are defined as part of your project are mapped to real-world things. Things like Services, Databases, Virtual Machines or whatever the cloud provider is offering. Because of supporting so many different and heterogeneous cloud offerings -with different APIs and concepts- it’s essential to have a unified data source. A data source that links your properties from the `.tf` files to the attributes offered by an actual cloud service.

No matter how many *Terraform* deployments you've already done, I bet you've recognized that *Terraform* somehow knows which resources have to be provisioned first and which operations can be executed in parallel. *Terraform* does a fantastic job in inspecting your project and making implicit dependency resolution. All resources are part of a single *dependency graph*. This *graph* describes the dependencies between all resources of your project. However, if you've described multiple independent resources, *Terraform* will be able to optimize the deployment by provisioning those in parallel. The *dependency graph* is stored in the *State* and acts as our data source. Implicit dependency resolution is excellent, but you still have full control over the *dependency graph*. You can explicitly control the dependencies of any resource using the `depends_on` meta property which is available on every resource type as shown in the following snippet.

```hcl
provider "azurerm" {
    version = "=1.22.0"
}

resource "azurerm_resource_group" "rgsample" {
    name     = "thh-terraform-state-rg"
    location = "westeurope"

    tags = {
        generator = "Terraform"
    }
}

resource "azurerm_managed_disk" "sample_disc" {
  resource_group_name  = "${azurerm_resource_group.rgsample.name}"
  location             = "${azurerm_resource_group.rgsample.location}"
  name                 = "thh-sample-disc"
  disk_size_gb         = "2"
  create_option        = "Empty"
  storage_account_type = "Standard_LRS"
  depends_on           = "${azurerm_resource_group.rgsample}"

  tags = {
    generator = "Terraform"
  }

}

```

Last but not least, the *State* acts as Cache to optimize performance. As part of every single `terraform plan` and `terraform apply` execution, *Terraform* has to query the *current state* from the cloud platform. This is quick if you're maintaining only a couple of resources. However, reading the *current state* of many resources could take some time. *Terraform* uses APIs exposed by the cloud vendor - such as *ARM APIs* if you're targeting *Azure*. So you rely on network, and you may encounter rate limiting issues. However, you can prevent *Terraform* from querying the state during `terraform plan` or `terraform apply` by adding the argument `-refresh=false`.

### Terraform’s State file

Having some basic understanding of *Terraform State* from a theoretical point of view, it's time to dig into the code. Let's start a small, new project to examine how *Terraform State* evolves. Within a new folder create a `main.tf` and add the following content:

```hcl
provider "azurerm" {
  version = "=1.22.0"
}

resource "azurerm_resource_group" "rgsample" {
  name     = "thh-terraform-state-rg"
  location = "westeurope"

  tags = {
    generator = "Terraform"
  }
}

```

So far, the project contains only a single *Azure Resource Group*. Go ahead and ensure the provider is downloaded and the project is initialized by invoking `terraform init` and provision it to *Azure* using `terraform apply`.

While *Terraform* is provisioning our *Resource Group*, we can already spot a new file in the project. The `terraform.tfstate` file. Look, it is just good old `JSON`. However, if you open the file before *Terraform* has successfully finished provisioning, the file won't contain the resource. Resources and their attribute values are written to the state-file only if *Terraform* successfully finishes the provisioning. Once finished, the `terraform.tfstate` file should look similar to this:

```json
{
    "version": 3,
    "terraform_version": "0.11.10",
    "serial": 1,
    "lineage": "00000000-0000-0000-0000-000000000000",
    "modules": [
        {
            "path": ["root"],
            "outputs": {},
            "resources": {
                "azurerm_resource_group.rgsample": {
                    "type": "azurerm_resource_group",
                    "depends_on": [],
                    "primary": {
                        "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/thh-terraform-state-rg",
                        "attributes": {
                            "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/thh-terraform-state-rg",
                            "location": "westeurope",
                            "name": "thh-terraform-state-rg",
                            "tags.%": "1",
                            "tags.generator": "Terraform"
                        },
                        "meta": {},
                        "tainted": false
                    },
                    "deposed": [],
                    "provider": "provider.azurerm"
                }
            },
            "depends_on": []
        }
    ]
}

```

It's not hard to spot the *Azure Resource Group* in the state file. However, it contains more Azure specific metadata compared to our `main.tf` file. The `serial` property at the beginning tells you, how many cycles you've already made in the current project. Any modifications made to the project that implies modifying the already existing deployment in the cloud results in incrementing the value of `serial`.

Extend the `main.tf` and add the *Azure Managed Disk* you've already seen in the very first snippet by using `azurerm_managed_disk` but this time, omit the `depends_on` property:

```hcl
resource "azurerm_managed_disk" "sample_disc" {
  resource_group_name  = "${azurerm_resource_group.rgsample.name}"
  location             = "${azurerm_resource_group.rgsample.location}"
  name                 = "thh-sample-disc"
  disk_size_gb         = "2"
  create_option        = "Empty"
  storage_account_type = "Standard_LRS"

  tags = {
    generator = "Terraform"
  }
}

```

Again, `apply` the modifications. *‌Terraform* will deploy the requested drive to your Resource Group. Once finished, open the state file. It should look similar to this:

```json
{
    "version": 3,
    "terraform_version": "0.11.10",
    "serial": 2,
    "lineage": "00000000-0000-0000-0000-000000000000",
    "modules": [
        {
            "path": ["root"],
            "outputs": {},
            "resources": {
                "azurerm_managed_disk.sample_disc": {
                    "type": "azurerm_managed_disk",
                    "depends_on": [
                        "azurerm_resource_group.rgsample"
                    ],
                    "primary": {
                        "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/thh-terraform-state-rg/providers/Microsoft.Compute/disks/thh-sample-disc",
                        "attributes": {
                            "create_option": "Empty",
                            "disk_size_gb": "2",
                            "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/thh-terraform-state-rg/providers/Microsoft.Compute/disks/thh-sample-disc",
                            "location": "westeurope",
                            "name": "thh-sample-disc",
                            "resource_group_name": "thh-terraform-state-rg",
                            "storage_account_type": "Standard_LRS",
                            "tags.%": "1",
                            "tags.generator": "Terraform",
                            "zones.#": "0"
                        },
                        "meta": {},
                        "tainted": false
                    },
                    "deposed": [],
                    "provider": "provider.azurerm"
                },
                "azurerm_resource_group.rgsample": {
                    // omitted because you saw it already above
                }
            },
            "depends_on": []
        }
    ]
}

```

Several things changed in the state file. First, the value of `serial` was incremented and second, the new *Azure Managed Disk* made it to the state file. If you take a closer look at the `azurerm_managed_disk.sample_disc` property in the JSON, you'll recognize the `depends_on` property which is automatically configured by *Terraform*.

Let's add another *Azure Managed Disk* (`Disc-2`) and compute its size by multiplying the size of the first disk (`Disc-1`) with `3`. `Disc-2` will technically depend on both resources, the *Azure Resource Group*, because that's the container for the disk and `Disc-1`, because the size of the new one will be calculated by using *Terraform's Interpolation Syntax* based on the size of `Disc-1`. Again, we want to verify how the *dependency graph* and the entire state file mutates.

```hcl
resource "azurerm_managed_disk" "sample_disc-2" {
  resource_group_name  = "${azurerm_resource_group.rgsample.name}"
  location             = "${azurerm_resource_group.rgsample.location}"
  name                 = "thh-sample-disc-2"
  disk_size_gb         = "${azurerm_managed_disk.sample_disc.disk_size_gb * 3}"
  create_option        = "Empty"
  storage_account_type = "Standard_LRS"

  tags = {
    generator = "Terraform"
  }
}

```

`apply` the modifications. *‌Terraform* will deploy the `Disc-2` to your Resource Group. Once finished, open the state file. It should look similar to this:

```json
{
    "version": 3,
    "terraform_version": "0.11.10",
    "serial": 3,
    "lineage": "00000000-0000-0000-0000-000000000000",
    "modules": [
        {
            "path": [ "root" ],
            "outputs": {},
            "resources": {
                "azurerm_managed_disk.sample_disc": {
                    "type": "azurerm_managed_disk",
                    "depends_on": [
                        "azurerm_resource_group.rgsample"
                    ],
                     // omitted because you saw it already above
                },
                "azurerm_managed_disk.sample_disc-2": {
                    "type": "azurerm_managed_disk",
                    "depends_on": [
                        "azurerm_managed_disk.sample_disc",
                        "azurerm_resource_group.rgsample"
                    ],
                    "primary": {
                        "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/thh-terraform-state-rg/providers/Microsoft.Compute/disks/thh-sample-disc-2",
                        "attributes": {
                            "create_option": "Empty",
                            "disk_size_gb": "6",
                            "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/thh-terraform-state-rg/providers/Microsoft.Compute/disks/thh-sample-disc-2",
                            "location": "westeurope",
                            "name": "thh-sample-disc-2",
                            "resource_group_name": "thh-terraform-state-rg",
                            "storage_account_type": "Standard_LRS",
                            "tags.%": "1",
                            "tags.generator": "Terraform",
                            "zones.#": "0"
                        },
                        "meta": {},
                        "tainted": false
                    },
                    "deposed": [],
                    "provider": "provider.azurerm"
                },
                "azurerm_resource_group.rgsample": {
                     // omitted because you saw it already above
                }
            },
            "depends_on": []
        }
    ]
}

```

`Disc-2` made it to the state file and *Terraform* was smart enough to realize that it depends on both, the *Azure Resource Group* and `Disc-1`.

### Tracking of outputs

Besides actual resources, *Outputs* are also tracked in the state file. To demonstrate and verify this, let's add three simple *Outputs* to our project. Add the following `HCL` code to `outputs.tf`

```hcl
output "resource-group-name" {
  value = "${azurerm_resource_group.rgsample.name}"
}

output "disc-1-id" {
  value = "${azurerm_managed_disk.sample_disc.id}"
}

output "disc-2-id" {
  value = "${azurerm_managed_disk.sample_disc-2.id}"
}

```

`Apply` the project once again. *Terraform* will read the actual state from the cloud. However, it won't make any modifications to your resources because nothing was changed. It'll print the *Outputs* to the console. However, the state file received another update.

```json
{
    "version": 3,
    "terraform_version": "0.11.10",
    "serial": 4,
    "lineage": "00000000-0000-0000-0000-000000000000",
    "modules": [
        {
            "path": ["root"],
            "outputs": {
                "disc-1-id": {
                    "sensitive": false,
                    "type": "string",
                    "value": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/thh-terraform-state-rg/providers/Microsoft.Compute/disks/thh-sample-disc"
                },
                "disc-2-id": {
                    "sensitive": false,
                    "type": "string",
                    "value": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/thh-terraform-state-rg/providers/Microsoft.Compute/disks/thh-sample-disc-2"
                },
                "resource-group-name": {
                    "sensitive": false,
                    "type": "string",
                    "value": "thh-terraform-state-rg"
                }
            },
            "resources": {
                 // omitted because you saw it already above
            }
        }
    ]
}

```

The `serial` property was incremented and the *Outputs* are now part of the state file. They're listed in `modules.outputs` and hold the current values which have been retrieved from *Azure*.

Now you've got an understanding of *Terraforms* state and how it's treated due to regular activities such as adding and mutating infrastructure components. Let's check out what else could be done with the state.

### Querying State using CLI

*Terraform* CLI could be used to examine the state of any resource. You can list the entire state by invoking `terraform state list` which will give you all resources of your project

```bash
terraform state list

azurerm_managed_disk.sample_disc
azurerm_managed_disk.sample_disc-2
azurerm_resource_group.rgsample

```

Familiar command line tools such as `grep` help you dealing with the list of state in bigger projects. For example, let's print all disks:

```bash
terraform state list | grep managed_disk

azurerm_managed_disk.sample_disc
azurerm_managed_disk.sample_disc-2

```

If you want more insights from a particular resource, use `terraform state show`:

```bash
terraform state show azurerm_managed_disk.sample_disc-2

id                   = /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/thh-terraform-state-rg/providers/Microsoft.Compute/disks/thh-sample-disc-2
create_option        = Empty
disk_size_gb         = 6
location             = westeurope
name                 = thh-sample-disc-2
resource_group_name  = thh-terraform-state-rg
storage_account_type = Standard_LRS
tags.%               = 1
tags.generator       = Terraform
zones.#              = 0

```

`terraform state` offers even more, there is the `pull` sub-command which returns the entire state of your project as `JSON`. This is handy if you combine the response with the small `jq` command line tool to traverse through the raw json. However, if you haven't installed `jq` on your machine, you can either get it by using `brew install jq` or by utilizing the package manager of your choice.

For example, let's query all *Output* values using `terraform pull` in combination with `jq`

```bash
terraform state pull | jq '.modules[0].outputs[].value'

"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/thh-terraform-state-rg/providers/Microsoft.Compute/disks/thh-sample-disc"
"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/thh-terraform-state-rg/providers/Microsoft.Compute/disks/thh-sample-disc-2"
"thh-terraform-state-rg"

```

### Visualizing Terraform Dependecy Graph

*Terraform* also allows visualizing the *Dependency Graph*. It's beneficial to have a visual representation of your entire infrastructure from time to time. You can generate such a visual representation using the `terrafrom graph` command. The `graph` command queries the current state and generates a `DOT` file which can be visualized using [GraphViz](https://www.graphviz.org/){:target="_blank"}. Once you've *GraphViz* installed, you can generate a visualization of your entire project using:

```bash
terraform graph | dot -Tpng > visualization.png
# or if you want an SVG
terraform graph | dot -Tsvg > visualization.svg

```

If you're just interested in the raw `dot` representation of your project, omit the second command (`dot`) and execute:

```bash
terraform graph

digraph {
    compound = "true"
    newrank = "true"
    subgraph "root" {
        "[root] meta.count-boundary (count boundary fixup)" -> "[root] output.disc-1-id"
        "[root] meta.count-boundary (count boundary fixup)" -> "[root] output.disc-2-id"
        "[root] meta.count-boundary (count boundary fixup)" -> "[root] output.resource-group-name"
        "[root] meta.count-boundary (count boundary fixup)" -> "[root] var.location"
    }
}

```

Take a look at the `PNG` or `SVG` file; it'll represent all resources, inputs, and outputs from your current project:

{% include image-caption.html imageurl="/assets/images/posts/2019/terraform-state-1.png"
title="Terraform project visualization" caption="Terraform project visualization" %}

## Introducing State Backends

If you're on a team and many people are working on a *Terraform* project, or if you're using *Terraform* on a build server such as *Azure DevOps*, the state has to be shared to track modifications from all distributed executions. *Terraform* uses so-called *State Backends* that allows you to use *Remote State*. *Terraform* supports different *State Backends* such as:

- Artifactory
- Google Cloud Storage
- Amazon S3
- Azure Blob Storage
- ...

The full list of all available *State Backends* is located [here](https://www.terraform.io/docs/backends/types/azurerm.html#docs-backends-types-standard){:target="_blank"}. Enabling a *State Backend* using *Azure Blob Storage* is fairly simple. Consider having an instance of *Azure Blob Storage* being available somewhere in the cloud; different authentication mechanisms can be used:

- Azure CLI or Service Principal
- Managed Service Identity
- Storage Account Access Key
- Storage Account associated SAS Token

For demonstration purpose, the following *State Backend* configuration uses the *Storage Account Access Key*. The `HCL` snippet goes to `main.tf`:

```hcl
terraform {
  backend "azurerm" {
    storage_account_name  = "terraformglobal"
    container_name        = "tfstate"
    key                   = "development.terraform.tfstate"
    access_key            = "<<YOUR_ACCESS_KEY>>"
  }
}

```

The backends `key` property specifies the name of the `Blob` in the *Azure Blob Storage Container* which is again configurable by the `container_name` property. Using *Azure Blob Storage* as *State Backend* gives you several benefits such as

- Centralized State Management
  - You will not lose your state file if a machine dies
- Azure Storage Accounts are encrypted, and you can add more governance using RBAC for example
- Terraform utilizes Azure Storage leases to ensure state locking

If the Backend is configured, you can execute `terraform apply` once again. *Terraform* will ask if you want to push the existing (local) state to the new backend and overwrite potential existing remote state. After answering the question with yes, you'll end up having your project migrated to rely on *Remote State*.

Take a look at your *Azure Storage Account*; you'll find the Remote State in the specified Blob Container.

{% include image-caption.html imageurl="/assets/images/posts/2019/terraform-state-2.png"
title="Remote State in Azure Blob Storage" caption="Remote State in Azure Blob Storage" %}

### State Locking

State locking is used to control write-operations on the state and to ensure that only one process modifies the state at one point in time. Not all *State Backends* support state locking. Luckily it's supported for *Azure Blob Storage* by using the previously referenced *Azure Blob Storage Lease* mechanism. State locking is applied automatically by *Terraform*.

There are some scenarios where the *Terraform* doesn't release the lock of the state file. This could happen if - for example - the `terraform` process gets terminated accidentally. (think of `killall -KILL terraform`). In those rare cases, you can release the lock manually using the *Azure Portal*, Azure CLI or by using the build in *Terraform* sub-command `force-unlock`. If you try to apply some changes with `terraform apply` and the remote state can't be logged, *Terraform* will print a `LOCK_ID` to the terminal. This `LOCK_ID` is used in combination with `force-unlock` to release the lock manually.

```bash
terraform force-unlock LOCK_ID
```

The `force-unlock` command should only be used when you can guarantee that no other - distributed - `terraform` process is actively mutating your cloud environment. If you release the state lock while a build-server or a colleague is actively modifying your environment, you may end up with having a corrupt state file.

## Conclusion

Knowing what state means in Terraform and how to deal with it is mission-critical. This article contains a bunch of information about state and state management in Terraform. Now that you've made it through the entire article go ahead and look at your own Terraform projects. Are you already using Remote state? My general advice is to enable remote state in every Terraform project which goes beyond demonstration or research purpose.
