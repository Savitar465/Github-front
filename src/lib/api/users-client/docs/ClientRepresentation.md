
# ClientRepresentation


## Properties

Name | Type
------------ | -------------
`id` | string
`clientId` | string
`name` | string
`description` | string
`type` | string
`rootUrl` | string
`adminUrl` | string
`baseUrl` | string
`surrogateAuthRequired` | boolean
`enabled` | boolean
`alwaysDisplayInConsole` | boolean
`clientAuthenticatorType` | string
`secret` | string
`registrationAccessToken` | string
`defaultRoles` | Array&lt;string&gt;
`redirectUris` | Array&lt;string&gt;
`webOrigins` | Array&lt;string&gt;
`notBefore` | number
`bearerOnly` | boolean
`consentRequired` | boolean
`standardFlowEnabled` | boolean
`implicitFlowEnabled` | boolean
`directAccessGrantsEnabled` | boolean
`serviceAccountsEnabled` | boolean
`authorizationServicesEnabled` | boolean
`directGrantsOnly` | boolean
`publicClient` | boolean
`frontchannelLogout` | boolean
`protocol` | string
`attributes` | { [key: string]: string; }
`authenticationFlowBindingOverrides` | { [key: string]: string; }
`fullScopeAllowed` | boolean
`nodeReRegistrationTimeout` | number
`registeredNodes` | { [key: string]: number; }
`protocolMappers` | [Array&lt;ProtocolMapperRepresentation&gt;](ProtocolMapperRepresentation.md)
`clientTemplate` | string
`useTemplateConfig` | boolean
`useTemplateScope` | boolean
`useTemplateMappers` | boolean
`defaultClientScopes` | Array&lt;string&gt;
`optionalClientScopes` | Array&lt;string&gt;
`authorizationSettings` | [ResourceServerRepresentation](ResourceServerRepresentation.md)
`access` | { [key: string]: boolean; }
`origin` | string

## Example

```typescript
import type { ClientRepresentation } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "clientId": null,
  "name": null,
  "description": null,
  "type": null,
  "rootUrl": null,
  "adminUrl": null,
  "baseUrl": null,
  "surrogateAuthRequired": null,
  "enabled": null,
  "alwaysDisplayInConsole": null,
  "clientAuthenticatorType": null,
  "secret": null,
  "registrationAccessToken": null,
  "defaultRoles": null,
  "redirectUris": null,
  "webOrigins": null,
  "notBefore": null,
  "bearerOnly": null,
  "consentRequired": null,
  "standardFlowEnabled": null,
  "implicitFlowEnabled": null,
  "directAccessGrantsEnabled": null,
  "serviceAccountsEnabled": null,
  "authorizationServicesEnabled": null,
  "directGrantsOnly": null,
  "publicClient": null,
  "frontchannelLogout": null,
  "protocol": null,
  "attributes": null,
  "authenticationFlowBindingOverrides": null,
  "fullScopeAllowed": null,
  "nodeReRegistrationTimeout": null,
  "registeredNodes": null,
  "protocolMappers": null,
  "clientTemplate": null,
  "useTemplateConfig": null,
  "useTemplateScope": null,
  "useTemplateMappers": null,
  "defaultClientScopes": null,
  "optionalClientScopes": null,
  "authorizationSettings": null,
  "access": null,
  "origin": null,
} satisfies ClientRepresentation

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ClientRepresentation
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


