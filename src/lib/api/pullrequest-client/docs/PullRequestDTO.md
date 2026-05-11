
# PullRequestDTO


## Properties

Name | Type
------------ | -------------
`id` | string
`repoId` | string
`number` | number
`title` | string
`description` | string
`sourceBranch` | string
`targetBranch` | string
`author` | [AuthorSummary](AuthorSummary.md)
`status` | [PrStatus](PrStatus.md)
`hasConflicts` | boolean
`commitsCount` | number
`createdAt` | string
`updatedAt` | string
`mergedAt` | string

## Example

```typescript
import type { PullRequestDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "repoId": null,
  "number": null,
  "title": null,
  "description": null,
  "sourceBranch": null,
  "targetBranch": null,
  "author": null,
  "status": null,
  "hasConflicts": null,
  "commitsCount": null,
  "createdAt": null,
  "updatedAt": null,
  "mergedAt": null,
} satisfies PullRequestDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PullRequestDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


