---
title: Azure Container Registry Unleashed – Authentication, Identity Access Management and Content-Trust
layout: post
permalink: azure-container-registry-unleashed-authentication-iam-contenttrust
published: true
tags: [Azure,Docker,Azure Container Registry]
excerpt: 'In part two of Azure Container Registry Unleashed you will dive into Authentication, Identity Access Management and Content-Trust'
image: /acr-unleashed.jpg
unsplash_user_name: Thais Morais
unsplash_user_ref: tata_morais
---

This is the second part of Azure Container Registry Unleashed. Today, we will go one step further and talk about Authentication (AuthN), Identity Access Management (IAM) and Content-Trust in the scope of ACR. To be a bit more precisely, this post contains the following sections:

- [ACR Authentication](#acr-authentication)
- [ACR Identity Access Management](#acr-identity-access-management)
  - [IAM for AAD Users and Groups](#iam-for-aad-users-and-groups)
  - [IAM for Service Principals](#iam-for-service-principals)
- [What is Content-Trust in ACR and Docker](#what-is-content-trust-in-acr-and-docker)
  - [Configure Content-Trust in ACR](#configure-content-trust-in-acr)
  - [Configure Docker CLI for Content-Trust](#configure-docker-cli-for-content-trust)
    - [Configure Content-Trust globally](#configure-content-trust-globally)
    - [Configure Content-Trust explicitly](#configure-content-trust-explicitly)
  - [Content-Trust by example](#content-trust-by-example)
    - [Pushing a signed image with system wide Content-Trust](#pushing-a-signed-image-with-system-wide-content-trust)
    - [Pushing a signed image with contextual Content-Trust](#pushing-a-signed-image-with-contextual-content-trust)
  - [Content-Trust Key Management](#content-trust-key-management)
  - [ACR Content-Trust pitfalls](#acr-content-trust-pitfalls)
  - [Docker Content-Trust pitfalls](#docker-content-trust-pitfalls)
  - [Further information on Content-Trust](#further-information-on-content-trust)
- [The Azure Container Registry Unleashed series](#the-azure-container-registry-unleashed-series)
- [What is next](#what-is-next)

## ACR Authentication

As mentioned in the first post of the series, Azure Container Registry integrates seamlessly with Azure Active Directory (AAD) and offers several ways to authenticate. Basically, you should differentiate between user-involved authentication and headless authentication, which is typically issued by a service in service-to-service scenarios. Having all authentication calls separated into those two categorie, finding the correct authentication-pattern becomes easier.

The story for the first category is told quickly. If a user wants to access ACR, he/she must authenticate against AAD using their AAD account.

Headless authentication is achieved either by using Service Principals (SP) or by leveraging a Managed Service Identity (MSI). Unfortunately, not all Azure services support Managed Service Identity. However, if they support MSI, you should use MSI to authenticate against ACR instead of SPs because an MSI is managed automatically by AAD and you don’t need to pass around identifiers and passwords.  

## ACR Identity Access Management

Identity Access Management (IAM) is how RBAC (Role Based Access Control) is referred to in Azure. Identity Access Management allows you to attach roles to an identity on a resource.
Where an identity is something like an AAD User, a AAD Group, a Service Principal or a Managed Service Identitie; A resource is something like an Azure Subscription, an Azure Resource Group or an Azure service.

ACR offers a bunch of built in roles, that you can use to implement common authorization scenarios such as the least privileged principle. The most prominent ACR roles are

- **AcrDelete** - can delete Images and artefacts from ACR
- **AcrPull** - can pull Images and artefacts from ACR
- **AcrPush** - can push and pull images and artefacts from ACR
- **AcrImageSigner** - can sign images
- **Reader** - can pull images, access ACR via Portal, Azure CLI and others
- **Contributor** - can delete, push and pull images and artefacts from ACR and modify policies
- **Owner** - can do everything in ACR, only exception is signing images

Because RBAC is a global Azure thing, you manage RBAC using the `az role` command and its sub-commands.

On top of that, the Azure Container Registry team released [authorization on repository level as preview](https://azure.microsoft.com/en-us/blog/azure-container-registry-preview-of-repository-scoped-permissions/){:target="_blank"} a couple of days ago. We will cover this definetly in a dedicated post on ACR.

### IAM for AAD Users and Groups

For example, consider having a set of random AAD users that you want to put into a single AAD group called *Developers*. Users of that AAD group should be able to push and pull Docker Images from our ACR instance. You can configure ACR to support this by executing

```bash
# read Identifier from ACR
$ACR_ID=$(az acr show -n unleashed -o tsv --query id)

# Create a new AAD Group and store its Id in GROUP_ID
$GROUP_ID=$(az ad group create --display-name Developers --mail-nickname Developers -o tsv --query objectId)

# Add all AAD Users to Developers group
az ad user list --query '[].{ObjectId:objectId}' -o tsv | xargs -I ‘{}’ az ad group member add -g Developers –member-id ‘{}’

# Create Role assignment (role AcrPush for AAD Group Developers on ACR)
az role assignment create --scope $ACR_ID --role AcrPush --assignee $GROUP_ID

```

If you want to assign a role to a single AAD account, you can use the same approach. The following snippet assigns the `AcrPull` role to John Doe:

```bash
# read Identifier from ACR
$ACR_ID=$(az acr show -n unleashed -o tsv --query id)

# find John Doe and grab his AAD Objcet Id
$USER_ID=$(az ad user list --filter "DisplayName eq 'John Doe'" -o tsv --query '[0].objectId')

# Create role assignment (role AcrPull for AAD User John Doe on ACR)
az role assignment create --scope $ACR_ID --role AcrPull --assignee $USER_ID

```

### IAM for Service Principals

Typical scenarios for authorizing a Service Principal to access Azure Container Registry instances are automated builds. In Azure DevOps, you can configure so-called “Service Connections” to connect Azure DevOps with ACR using the Azure DevOps administrative user interface. Under the hood, it is technically just a plain Service Principal with corresponding Role Assignments.

You can create a similar integration for a custom build solution or any other service that lacks MSI by using a custom Service Principal and manually assign corresponding roles to the SP.

```bash
# create a service principal
$ACR_ID=$(az acr show -n unleashed -o tsv --query id)
az ad sp create-for-rbac --name acr-unleashed-push-and-pull --skip-assignment -o json

{
  "appId": "11111111-1111-1111-1111-111111111111",
  "displayName": "acr-unleashed-push-and-pull",
  "name": "http://acr-unleashed-push-and-pull",
  "password": "00000000-0000-0000-0000-000000000000",
  "tenant": "00000000-0000-0000-0000-000000000000"
}

# Create Role assignment (role AcrPush for Service Principal on ACR)
az role assignment create --scope $ACR_IR --role AcrPush --assignee 11111111-1111-1111-1111-111111111111

```

## What is Content-Trust in ACR and Docker

Content-Trust allows you to verify the source and integrity of Docker Images. From security- and operations perspective, you can guarantee that all Docker Images - that enter your environment - are consumed from a trusted origin (ACR) and have not been modified since they were published.

On top of that, you can configure your Docker CLI to pull only signed Images. Once enabled, the CLI will verify the origin before pulling the requested Image. Once downloaded to the local system, the integrity is verified. Unsigned images, modified images and images from untrusted origins will be rejected from the local Docker client and won’t find its way into your infrastructure anymore.

As image publisher, you can sign Docker Images before uploading them to a Docker Registry.

### Configure Content-Trust in ACR

You can turn on Content-Trust in ACR using the `config content-trust`, alternatively, you can enable it directly in Azure Portal

```bash
# enable Content-Trust for our ACR instance
az acr config content-trust update -r unleashed --status enabled

```

Additionally, the `AcrImageSigner` role has to be assigned to an AAD user, an AAD group or a Service Principal. For demonstration purpose, lets assign the role to a new Service Principal. Once assigned, we will re-login to ACR using that Service Principal.

```bash
# read Identifier from ACR
$ACR_ID=$(az acr show -n unleashed -o tsv --query id)

# create a service principal
az ad sp create-for-rbac --name acr-image-signer --skip-assignment -o json

{
  "appId": "22222222-2222-2222-2222-222222222222",
  "displayName": "acr-image-signer",
  "name": "http://acr-image-signer",
  "password": "00000000-0000-0000-0000-000000000000",
  "tenant": "00000000-0000-0000-0000-000000000000"
}


# Create role assignment (role AcrImageSinger for the Service Principal on ACR)
az role assignment create --scope $ACR_ID --role AcrImageSigner --assignee 22222222-2222-2222-2222-222222222222

# login to ACR again to ensure proper tokens are stored locally
# also required if the SP was existing before!!

az acr login -n unleashed -u 22222222-2222-2222-2222-222222222222 \
  -p 00000000-0000-0000-0000-000000000000

```

### Configure Docker CLI for Content-Trust

Your local docker installation must also be configured to use Content-Trust. In Docker you can enable Content-Trust either system-wide, or you specify it conditionally by appending corresponding arguments to your `docker` commands. I prefer enabling Content-Trust globally. That said you may want turn it off when pulling unsigned, but trusted images from other registries.

#### Configure Content-Trust globally

You can enable Content-Trust globally by setting the `DOCKER_CONTENT_TRUST` environment variable in your shell profile (eg. Bash or ZSH).

```bash
# enable Content-Trust globally when using bash
echo 'export DOCKER_CONTENT_TRUST=1' >> ~/.bash_profile
source ~/.bash_profile
```

Alternatively, you can enable it just for the lifetime of your current shell instance by executing:

```bash
# set it for the current shell session
export DOCKER_CONTENT_TRUST=1
```

If you want to *(or have to)* disable Content-Trust for a command (such as pulling an unsigned Docker Image), you have to append the `--disable-content-trust` argument to your command.

```bash
# disable content-trust to pull an unsigned image from Docker Hub
docker pull --disable-content-trust thorstenhans/helm3
# or be even more explicitly
docker pull --disable-content-trust=true thorstenhans/helm3

Using default tag: latest
latest: Pulling from thorstenhans/helm3
3c9020349340: Pull complete
965c4dd9ceac: Pull complete
f3bc04369b8e: Pull complete
1e93a5913d0d: Pull complete
00076bf216b4: Pull complete
78faf4fba2fe: Pull complete
Digest: sha256:7a22c55a063981ad118e9b1a54784ca3f0cfba5269c1a21713c3f8825cb73db6
Status: Downloaded newer image for thorstenhans/helm3:latest
docker.io/thorstenhans/helm3:latest
```

#### Configure Content-Trust explicitly

If you want to enable Content-Trust only when interacting with our ACR instance, you have to append `--disable-content-trust=false` to your docker command like shown below.

```bash
# enable Content-Trust explicitly

# build Docker Image
docker build . --disable-content-trust=false -f Sample.Dockerfile -t unleashed.azurecr.io/foo:bar

# Push Docker Image
docker push --disable-content-trust=false unleahed.azurecr.io/foo:bar

```

### Content-Trust by example

Having Content-Trust configured on both ends (ACR and local Docker CLI), we can give it a try.

When you want to push your first signed Image to ACR, two signing keys will be generated. First, a so called **root key** is generated. Which acts as parent for all **repository keys**. For each key, you must specify a passphrase (and remember it or store it in your password manager...). Those keys, together with all required image layers, will be pushed and stored in your ACR instance.

#### Pushing a signed image with system wide Content-Trust

```bash
echo 'FROM nginx:alpine' > SigningDemo.Dockerfile
docker build . -f SigningDemo.Dockerfile -t unleashed.azurecr.io/signed:1
docker push unleashed.azurecr.io/signed:1

The push refers to repository [unleashed.azurecr.io/signed]
f4cef7054e83: Mounted from nginx
77cae8ab23bf: Mounted from node
1: digest: sha256:2993f9c9a619cde706ae0e34a1a91eb9cf5225182b6b76eb637392d2ce816538 size: 739
Signing and pushing trust metadata
Enter passphrase for new root key with ID 81332b9:
Repeat passphrase for new root key with ID 81332b9:
Enter passphrase for new repository key with ID a0c51b2:
Repeat passphrase for new repository key with ID a0c51b2:
Finished initializing "unleashed.azurecr.io/signed"
Successfully signed unleashed.azurecr.io/signed:1

```

#### Pushing a signed image with contextual Content-Trust

```bash
echo 'FROM nginx:alpine' > SingingDemo.Dockerfile
docker build . -f SigningDemo.Dockerfile --disable-content-trust=false -t unleashed.azurecr.io/signed:1

docker push --disable-content-trust=false unleashed.azurecr.io/signed:1

The push refers to repository [unleashed.azurecr.io/signed]
f4cef7054e83: Mounted from nginx
77cae8ab23bf: Mounted from node
1: digest: sha256:2993f9c9a619cde706ae0e34a1a91eb9cf5225182b6b76eb637392d2ce816538 size: 739
Signing and pushing trust metadata
Enter passphrase for new root key with ID 81332b9:
Repeat passphrase for new root key with ID 81332b9:
Enter passphrase for new repository key with ID a0c51b2:
Repeat passphrase for new repository key with ID a0c51b2:
Finished initializing "unleashed.azurecr.io/signed"
Successfully signed unleashed.azurecr.io/signed:1

```

### Content-Trust Key Management

Please backup your local signing keys securely, if you lose your root key, you won't be able to upload a new tag for a signed image in ACR and there is no way to recover this. The only solution is to disable and re-enable Content-Trust on ACR, which results in losing all trust data!

Additional [information about key management is available in Docker documentation](https://docs.docker.com/engine/security/trust/trust_key_mng/){:target="_blank"}.

### ACR Content-Trust pitfalls

Although Content-Trust is enabled quickly, there are several pitfalls that you should be aware of, when rolling out ACR Content-Trust.

Currently, it is not possible to assign `AcrImageSigner` role to an Subscription Administrator (users having roles like `Service Administrator` or `Co-Administrator`). [See corresponding issue on GitHub](https://github.com/Azure/acr/issues/278#issuecomment-540310507){:target="_blank"}. You should user either an alternative account or a dedicated Service Principal.

If you assign the `AcrImageSigner` role to your user account or to the Service Principal you are currently using in Azure CLI, you have to execute `az acr login` again in order to update your local tokens.

### Docker Content-Trust pitfalls

If you enabled Content-Trust globally on your system, you will encounter issues when trying to pull unsigned images from public Docker Hub or other registries. Remember, your system will only accept signed images when Content-Trust is enabled.

However, you can disable Content-Trust for certain commands by appending the `--disable-content-trust` flag to commands like `docker pull`. If you - for example - try to pull an unsigned image from public docker hub, the operation will fail.

You have to disable content-trust explicitly in order to pull that image.

```bash
docker pull thorstenhans/helm3

Using default tag: latest
Error: remote trust data does not exist for docker.io/thorstenhans/helm3: notary.docker.io does not have trust data for docker.io/thorstenhans/helm3

docker pull thorstenhans/helm3 --disable-content-trust

Using default tag: latest
latest: Pulling from thorstenhans/helm3
3c9020349340: Pull complete
965c4dd9ceac: Pull complete
f3bc04369b8e: Pull complete
1e93a5913d0d: Pull complete
00076bf216b4: Pull complete
78faf4fba2fe: Pull complete
Digest: sha256:7a22c55a063981ad118e9b1a54784ca3f0cfba5269c1a21713c3f8825cb73db6
Status: Downloaded newer image for thorstenhans/helm3:latest
docker.io/thorstenhans/helm3:latest

```

### Further information on Content-Trust

The official Docker documentation [hosts a great guide and conceptual introduction on Content-Trust](https://docs.docker.com/engine/security/trust/content_trust/){:target="_blank"}. It is worth reading to understand all the insights and nitty-gritty details of Content-Trust.

## The Azure Container Registry Unleashed series

- [Part 1 - Introduction and Geo Replication]({%post_url 2019-11-19-azure-container-registry-unleashed-acr-up-and-running %}){:target="_blank"}
- [Part 2 - Authentication, IAM and Content Trust]({%post_url 2019-11-21-azure-container-registry-unleashed-authentication-iam-and-contenttrust %}){:target="_blank"}
- [Part 3 - Integrate ACR and Azure Monitor]({%post_url 2019-11-26-azure-container-registry-unleashed-integrate-acr-and-azure-monitor %}){:target="_blank"}
- [Part 4 - Webhooks]({%post_url 2019-12-04-azure-container-registry-unleashed-webhooks %}){:target="_blank"}
- [Part 5 - Tasks]({%post_url 2020-02-05-azure-container-registry-unleashed-tasks %}){:target="_blank"}

## What is next

Before we dived into Content-Trust to verify the origin and integrity of images, we looked at essential things such as Authentication mechanisms and Identity Access Management for ACR. The next part of *Azure Container Registry Unleashed* will guide you through the process of integrating ACR with Azure Monitor.

You can subscribe to my blog newsletter and get automatically notified once the next article has been published. That’s the best way to stay current and never miss an article.
