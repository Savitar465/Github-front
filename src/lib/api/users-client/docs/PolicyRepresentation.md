
# PolicyRepresentation


## Properties

Name | Type
------------ | -------------
`id` | string
`name` | string
`description` | string
`type` | string
`policies` | Set&lt;string&gt;
`resources` | Set&lt;string&gt;
`scopes` | Set&lt;string&gt;
`logic` | string
`decisionStrategy` | string
`owner` | string
`resourcesData` | [Set&lt;ResourceRepresentation&gt;](ResourceRepresentation.md)
`scopesData` | [Set&lt;ScopeRepresentation&gt;](ScopeRepresentation.md)
`config` | { [key: string]: string; }

## Example

```typescript
import type { PolicyRepresentation } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "description": null,
  "type": null,
  "policies": null,
  "resources": null,
  "scopes": null,
  "logic": null,
  "decisionStrategy": null,
  "owner": null,
  "resourcesData": null,
  "scopesData": null,
  "config": null,
} satisfies PolicyRepresentation

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PolicyRepresentation
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


