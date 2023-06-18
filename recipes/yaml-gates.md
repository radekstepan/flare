# Adjusting YAML gates

This recipe demonstrate how to adjust YAML gates for feature deployment.

We'll begin with a simple example of activating a feature in an integration setting.

```yaml
"feature/new":
  eval: "IsEnv"
  conditions:
    - id: IsEnv
      operation: include
      kind: context
      path: env
      value:
        - inte
```

In the given `Context` below, "feature/new" will evaluate to true.

```json
{
  "env": "inte", // or "us", "eu" etc.
  "stage": "release", // or "hotfix"
  "user": "danny",
  "company": "acme",
  "isProAccount": true
}
```

## Staging

We can also extend this support to a staging environment:

```diff
  "feature/new":
-   eval: "IsEnv"
+   eval: "IsEnv || IsStage"
    conditions:
      - id: IsEnv
        operation: include
        kind: context
        path: env
        value:
          - inte
+     - id: IsStage
+       operation: include
+       kind: context
+       path: stage
+       value:
+         - release
+         - hotfix
```

## Users

YAML gates can be modified to enable features for specified users.

Consider the following example on how to implement this functionality:

```diff
  "feature/new":
-   eval: "IsEnv || IsStage"
+   eval: "IsEnv || IsStage || IsUser"
    conditions:
      - id: IsEnv
        operation: include
        kind: context
        path: env
        value:
          - inte
+     - id: IsUser
+       operation: include
+       kind: context
+       path: user
+       value:
+         - danny
+         - alex
```

In this scenario, the "feature/new" will evaluate to true if the `Context` user is either "danny" or "alex".

### Excluding Users

There can be instances where you might want to exclude certain users from accessing a new feature. YAML gates can be tailored to allow this.

For example, if you want to exclude the user "alex" from accessing the "feature/new", you can adjust the YAML gates as follows:

```diff
  "feature/new":
-   eval: "IsEnv || IsStage || IsUser"
+   eval: "IsEnv || IsStage || IsUser && IsNotExcludedUser"
    conditions:
      - id: IsUser
        operation: include
        kind: context
        path: user
        value:
          - danny
          - alex
+     - id: IsNotExcludedUser
+       operation: exclude
+       kind: context
+       path: user
+       value:
+         - alex
```

In this example, the condition `IsNotExcludedUser` ensures that the "feature/new" will not evaluate to true if the `Context` user is "alex", even if the other conditions are met. This effectively excludes "alex" from the new feature.

### A note on operator precedence

Flare translates the `Gate` eval statement into JavaScript logical operators. Here's how `IsStage`, `IsUser`, and `IsNotExcludedUser` might be evaluated.

First, without parentheses:

```javascript
const IsStage = true; // Suppose the stage is release or hotfix
const IsUser = false; // Suppose the user is not 'danny'
const IsNotExcludedUser = true; // Suppose the user is not 'alex'

console.log(IsStage || IsUser && IsNotExcludedUser);
```

In this case, even though `||` appears before `&&` in the expression, `&&` will be evaluated first due to higher precedence. So `IsUser && IsNotExcludedUser` is `false && true`, which evaluates to `false`. Then `IsStage || false` is `true || false`, which is `true`. 

Now, if we include parentheses to specify the order of operations:

```javascript
const IsStage = true; 
const IsUser = false;
const IsNotExcludedUser = true; 

console.log((IsStage || IsUser) && IsNotExcludedUser);
```

Here, `IsStage || IsUser` is `true || false`, which evaluates to `true` because the parentheses cause this expression to be evaluated first. Then, `true && IsNotExcludedUser` is `true && true`, which is `true`.

The use of parentheses in this context makes the order of operations more clear and predictable, thus preventing possible misunderstandings or unexpected results.

## Companies

YAML gates can be modified to enable features for specified companies.

Here's how you can customize the YAML gates to implement this functionality:

```diff
  "feature/new":
-   eval: "IsEnv || IsStage || IsUser"
+   eval: "IsEnv || IsStage || IsUser || IsCompany"
    conditions:
      - id: IsEnv
        operation: include
        kind: context
        path: env
        value:
          - inte
+     - id: IsCompany
+       operation: include
+       kind: context
+       path: company
+       value:
+         - acme
+         - globex
```

In this context, "feature/new" will evaluate to true if the `Context` company is either "acme" or "globex".

## Account types

For the deployment of features for users with a pro account, you can incorporate a new condition to the YAML gates:

```diff
  "feature/new":
-   eval: "IsEnv || IsStage || IsUser || IsCompany"
+   eval: "IsEnv || IsStage || IsUser || IsCompany || IsProAccount"
    conditions:
      - id: IsEnv
        operation: include
        kind: context
        path: env
        value:
          - inte
+     - id: IsProAccount
+       operation: equals
+       kind: context
+       path: isProAccount
+       value:
+         - true
```

In this example, "feature/new" will evaluate to true if the `Context` has `isProAccount` set to true.
