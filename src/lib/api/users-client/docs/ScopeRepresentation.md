
# ScopeRepresentation


## Properties

Name | Type
------------ | -------------
`id` | string
`name` | string
`iconUri` | string
`policies` | [Array&lt;PolicyRepresentation&gt;](PolicyRepresentation.md)
`resources` | [Array&lt;ResourceRepresentation&gt;](ResourceRepresentation.md)
`displayName` | string

## Example

```typescript
import type { ScopeRepresentation } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "iconUri": null,
  "policies": null,
  "resources": null,
  "displayName": null,
} satisfies ScopeRepresentation

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ScopeRepresentation
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


