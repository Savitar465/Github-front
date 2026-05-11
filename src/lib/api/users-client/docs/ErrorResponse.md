
# ErrorResponse


## Properties

Name | Type
------------ | -------------
`timestamp` | Date
`code` | number
`status` | string
`message` | string
`stackTrace` | string
`data` | any

## Example

```typescript
import type { ErrorResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "timestamp": null,
  "code": null,
  "status": null,
  "message": null,
  "stackTrace": null,
  "data": null,
} satisfies ErrorResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ErrorResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


