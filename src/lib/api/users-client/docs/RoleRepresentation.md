
# RoleRepresentation


## Properties

Name | Type
------------ | -------------
`id` | string
`name` | string
`description` | string
`scopeParamRequired` | boolean
`composite` | boolean
`composites` | [Composites](Composites.md)
`clientRole` | boolean
`containerId` | string
`attributes` | { [key: string]: Array&lt;string&gt;; }

## Example

```typescript
import type { RoleRepresentation } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "description": null,
  "scopeParamRequired": null,
  "composite": null,
  "composites": null,
  "clientRole": null,
  "containerId": null,
  "attributes": null,
} satisfies RoleRepresentation

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RoleRepresentation
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


