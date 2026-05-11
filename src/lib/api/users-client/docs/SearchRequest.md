
# SearchRequest


## Properties

Name | Type
------------ | -------------
`filters` | [Array&lt;FilterRequest&gt;](FilterRequest.md)
`sorts` | [Array&lt;SortRequest&gt;](SortRequest.md)
`page` | number
`size` | number

## Example

```typescript
import type { SearchRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "filters": null,
  "sorts": null,
  "page": null,
  "size": null,
} satisfies SearchRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SearchRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


