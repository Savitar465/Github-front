
# ResourceServerRepresentation


## Properties

Name | Type
------------ | -------------
`id` | string
`clientId` | string
`name` | string
`allowRemoteResourceManagement` | boolean
`policyEnforcementMode` | string
`resources` | [Array&lt;ResourceRepresentation&gt;](ResourceRepresentation.md)
`policies` | [Array&lt;PolicyRepresentation&gt;](PolicyRepresentation.md)
`scopes` | [Array&lt;ScopeRepresentation&gt;](ScopeRepresentation.md)
`decisionStrategy` | string

## Example

```typescript
import type { ResourceServerRepresentation } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "clientId": null,
  "name": null,
  "allowRemoteResourceManagement": null,
  "policyEnforcementMode": null,
  "resources": null,
  "policies": null,
  "scopes": null,
  "decisionStrategy": null,
} satisfies ResourceServerRepresentation

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ResourceServerRepresentation
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


