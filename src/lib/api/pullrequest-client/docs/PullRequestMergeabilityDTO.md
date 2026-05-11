
# PullRequestMergeabilityDTO


## Properties

Name | Type
------------ | -------------
`prNumber` | number
`mergeable` | boolean
`hasConflicts` | boolean
`reason` | string

## Example

```typescript
import type { PullRequestMergeabilityDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "prNumber": null,
  "mergeable": null,
  "hasConflicts": null,
  "reason": null,
} satisfies PullRequestMergeabilityDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PullRequestMergeabilityDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


