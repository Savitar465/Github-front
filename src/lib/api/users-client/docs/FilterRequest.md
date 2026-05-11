
# FilterRequest


## Properties

Name | Type
------------ | -------------
`key` | string
`operator` | string
`fieldType` | string
`value` | any
`values` | Array&lt;any&gt;
`valueTo` | any

## Example

```typescript
import type { FilterRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "key": null,
  "operator": null,
  "fieldType": null,
  "value": null,
  "values": null,
  "valueTo": null,
} satisfies FilterRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as FilterRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


