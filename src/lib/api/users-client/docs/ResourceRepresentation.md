
# ResourceRepresentation


## Properties

Name | Type
------------ | -------------
`name` | string
`type` | string
`owner` | [ResourceOwnerRepresentation](ResourceOwnerRepresentation.md)
`ownerManagedAccess` | boolean
`displayName` | string
`attributes` | { [key: string]: Array&lt;string&gt;; }
`id` | string
`uris` | Set&lt;string&gt;
`scopes` | [Set&lt;ScopeRepresentation&gt;](ScopeRepresentation.md)
`iconUri` | string
`resourceScopes` | [Set&lt;ScopeRepresentation&gt;](ScopeRepresentation.md)
`uri` | string

## Example

```typescript
import type { ResourceRepresentation } from ''

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "type": null,
  "owner": null,
  "ownerManagedAccess": null,
  "displayName": null,
  "attributes": null,
  "id": null,
  "uris": null,
  "scopes": null,
  "iconUri": null,
  "resourceScopes": null,
  "uri": null,
} satisfies ResourceRepresentation

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ResourceRepresentation
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


