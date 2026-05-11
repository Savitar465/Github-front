
# ReviewPullRequestBody


## Properties

Name | Type
------------ | -------------
`decision` | [ReviewDecision](ReviewDecision.md)
`comment` | string

## Example

```typescript
import type { ReviewPullRequestBody } from ''

// TODO: Update the object below with actual values
const example = {
  "decision": null,
  "comment": null,
} satisfies ReviewPullRequestBody

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ReviewPullRequestBody
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


