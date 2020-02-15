---
title: Extend Kubernetes with Custom Resource Definitions and RBAC for ServiceAccounts
layout: post
permalink: custom-resource-definitions-with-rbac-for-serviceaccounts
published: true
tags: [Kubernetes]
excerpt: Define Custom Resource Definitions (CRDs) to get more out of Kubernetes. Learn to work with custom objects. Protect CRDs with RBAC and access them with ServiceAccounts
image: /chain.jpg
unsplash_user_name: Kaley Dykstra
unsplash_user_ref: kaleyloved
---

We can extend Kubernetes using Custom Resource Definitions (CRDs). By adding Custom Resource Definitions to Kubernetes, operators can use familiar concepts and tools like `kubectl` to deal with custom data. We can bring our schema and have it sitting next to first-class types like `Pod`, `Service`, and others. Kubernetes API Server takes care of the entire lifecycle of custom objects, which means once `CRDs` are deployed, we can create, modify, retrieve, and delete them. On top of that, we can create custom `Roles` and `ClusterRoles` to protect custom objects using RBAC.

---

For demonstration purposes, we create a cluster-wide Custom Resource Definition to store some metadata scoped to a tenant. To access those objects, we create a corresponding `ClusterRole` and allow a custom `ServiceAccount` to retrieve objects of our type by assigning a `ClusterRoleBinding` to it.

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Create the Custom Resource Definition](#create-the-custom-resource-definition)
- [Work with custom objects](#work-with-custom-objects)
- [Creating the ClusterRole](#creating-the-clusterrole)
- [Creating a dedicated Namespace](#creating-a-dedicated-namespace)
- [Creating the ServiceAccount](#creating-the-serviceaccount)
- [Check Authorization in behalf of the ServiceAccount I](#check-authorization-in-behalf-of-the-serviceaccount-i)
- [Create the ClusterRoleBinding](#create-the-clusterrolebinding)
- [Check Authorization in behalf of the ServiceAccount II](#check-authorization-in-behalf-of-the-serviceaccount-ii)
- [A note on Namespaced CRDs](#a-note-on-namespaced-crds)

## Create the Custom Resource Definition

Although Custom Resource Definitions are around for quite some time now, the first major API specification was released with Kubernetes `1.16.0`. This example assumes running a least a `1.16.0` Kubernetes Cluster, which means you can use the `apiextensions.k8s.io/v1` schema. If you are running a Kubernetes version older than `1.16.0`, you can still use Custom Resource Definitions. However, you have to use the `apiextensions.k8s.io/v1beta1` schema, which is not as powerful as `v1`, but it works! Consult the official [Kubernetes documentation here](https://kubernetes.io/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/#before-you-begin){:target="_blank"}, and spot the differences between `v1` and `v1beta1` of the CRD specification.

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: tenantconfigs.thns.com
spec:
  group: thns.com
  versions:
    - name: v1
      served: true
      storage: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                tenantId:
                  type: string
                  pattern: '^\d{0,5}$' # up to 5 integers
                category:
                  type: string
                  default: "Category A"
                isCanaryCustomer:
                  type: boolean
                  default: false
  scope: Cluster
  names:
    plural: tenantconfigs
    singular: tenantconfig
    kind: TenantConfig
    shortNames:
    - tc

```

Make yourself comfortable with the [specification](https://kubernetes.io/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/#specifying-a-structural-schema){:target="_blank"}. For example, see `spec.scope`, which is set to `Cluster` here. If you want to create a CustomResource in the scope of a Namespace, you have to provide `Namespaced` as value.

Deploy the Custom Resource Definition using `kubectl apply -f custom_resource_definition.yaml`

## Work with custom objects

Having our CRD deployed to Kubernetes, we can test it using `kubectl`. First, let's verify if Kubernetes knows our custom definition:

```bash
kubectl api-resources --api-group thns.com
NAME                   SHORTNAMES   APIGROUP         NAMESPACED   KIND
tenantconfigs          tc           thns.com         false        TenantConfig

```

Okay, Kubernetes knows the type `tenantconfig` or short `tc`. Let's go ahead and create a new object:

```yaml
# api version is matching combination of crd.spec.group and crd.spec.version
apiVersion: thns.com/v1
kind: TenantConfig
metadata:
  name: tenant-config-1
spec:
  tenantId: "1"
  category: "Category A"
  isCanaryCustomer: true

```

Deploy it to the cluster using `kubctl apply -f tenant_config_1.yaml`. Now we can retreive the list of all `TenantConfigs`.

```bash
kubectl get tc
NAME                 AGE
tenant-config-1      9s

```

We can also grab the original `yaml` as we can do with `Pods` or `Deployments`

```bash
kubectl get tc tenant-config-1 -o yaml

apiVersion: thns.com/v1
kind: TenantConfig
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"thns.com/v1","kind":"TenantConfig","metadata":{"annotations":{},"name":"tenant-config-1"},"spec":{"isCanaryCustomer":true,"category":"Category A","teanntId":"1"}}
  creationTimestamp: "2020-02-11T17:21:19Z"
  generation: 1
  name: tenant-config-1
  resourceVersion: "1719830"
  selfLink: /apis/thns.com/v1/tenantconfigs/tenant-config-1
  uid: 1ea1ee28-4cb8-11ea-bed4-6a2f834bc8e1
spec:
  isCanaryCustomer: true
  category: "Category A"
  tenantId: "1"

```

## Creating the ClusterRole

We created a cluster-wide CRD along with some custom objects. To allow other `Users` (or `ServiceAccounts`) interacting with those custom objects, we have to create a `ClusterRole` which specifies allowed operations for our custom Kubernetes API.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
    name: "thns.com:tenantconfig:reader"
rules:
    - apiGroups: ["thns.com"]
      resources: ["tenantconfigs"]
      verbs: ["get", "list", "watch"]

```

Deploy the `ClusterRole` to Kubernetes using `kubctl apply -f cluser_role.yaml`.

## Creating a dedicated Namespace

Although we created a cluster-wide Custom Resource Definition, we want to use ta custom `ServiceAccount` to verify authorization. Instead of messing up the default namespace, go ahead and create a new one.

```bash
kubectl create namespace thns
# namespace/thns created
```

## Creating the ServiceAccount

We can use `ServiceAccounts` to ensure Pods use tailored permissions to talk to Kubernetes API. To create a new `ServiceAccount`, we need just a few lines of `yaml`:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
    name: crdreader
    namespace: thns

```

Deploy the `ServiceAccount` to Kubernetes using `kubectl apply -f service_account.yaml`

## Check Authorization in behalf of the ServiceAccount I

Once the custom `ServiceAccount` is deployed, we can use `kubectl auth can-i` to verify if the `ServiceAccount` is able to get an object instance. `kubectl auth can-i` allows impersonation using the `--as` argument. To impersonate into a `ServiceAccount`, you have to use the full-qualified name of the `ServiceAccount`. The syntax for the full-qualified name is `system:serviceaccount:<namespace>:<serviceaccount>`.

At this point, the check should fail. However, execute:

```bash
kubectl auth can-i get tenantconfigs.thns.com --as=system:serviceaccount:thns:crdreader
# no

```

The verification fails because the `ClusterRole` is not yet assigned to the `ServiceAccount`. We can assign it using a `ClusterRoleBinding`.

## Create the ClusterRoleBinding

The `ClusterRoleBinding` acts as a relation between a `ClusterRole` and an identity in Kubernetes. In our case, it is the relationship to our `ServiceAccount`.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
    name: "thns.com:tenantconfig:cdreader-read"
roleRef:
    apiGroup: rbac.authorization.k8s.io
    kind: ClusterRole
    name: "thns.com:tenantconfig:reader"
subjects:
    - kind: ServiceAccount
      name: crdreader
      namespace: thns

```

Deploy the `ClusterRoleBinding` to your cluser using `kubectl apply -f cluster_role_binding.yaml`.

## Check Authorization in behalf of the ServiceAccount II

Having the `ClusterRoleBinding` created and deployed to Kubernetes, we can again invoke the `kubectl auth can-i` command to verify if the `ServiceAccount` is able to read custom objects.

```bash
kubectl auth can-i get tenantconfigs.thorsten-hans.com --as=system:serviceaccount:thns:crdreader
# yes

```

## A note on Namespaced CRDs

This article explained how to create a cluster-wide CRD and allow a custom `ServiceAccount` consuming custom objects of that type. If you want to create `namespaced` CRDs, you have to create a corresponding `Role` and `RoleBinding` instead of `ClusterRole` and `ClusterRoleBinding`.
