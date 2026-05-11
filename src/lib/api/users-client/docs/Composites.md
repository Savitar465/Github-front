
# Composites


## Properties

Name | Type
------------ | -------------
`realm` | Set&lt;string&gt;
`client` | { [key: string]: Array&lt;string&gt;; }
`application` | { [key: string]: Array&lt;string&gt;; }

## Example

```typescript
import type { Composites } from ''

// TODO: Update the object below with actual values
const example = {
  "realm": null,
  "client": null,
  "application": null,
} satisfies Composites

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Composites
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


