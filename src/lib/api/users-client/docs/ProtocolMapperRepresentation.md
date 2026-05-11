
# ProtocolMapperRepresentation


## Properties

Name | Type
------------ | -------------
`id` | string
`name` | string
`protocol` | string
`protocolMapper` | string
`consentRequired` | boolean
`consentText` | string
`config` | { [key: string]: string; }

## Example

```typescript
import type { ProtocolMapperRepresentation } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "protocol": null,
  "protocolMapper": null,
  "consentRequired": null,
  "consentText": null,
  "config": null,
} satisfies ProtocolMapperRepresentation

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ProtocolMapperRepresentation
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


