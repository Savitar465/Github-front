# KeycloakRolesControllerApi

All URIs are relative to *http://localhost:8081*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getClientRoles**](KeycloakRolesControllerApi.md#getclientroles) | **GET** /v1/keycloak/roles/client/{clientUuid} | Gets list of client roles |
| [**getRealmRoles**](KeycloakRolesControllerApi.md#getrealmroles) | **GET** /v1/keycloak/roles/realm | Gets list of roles from the realm |
| [**getRole**](KeycloakRolesControllerApi.md#getrole) | **GET** /v1/keycloak/roles/{rolId} | Gets client role |



## getClientRoles

> Array&lt;RoleRepresentation&gt; getClientRoles(clientUuid, max, first)

Gets list of client roles

Gets the list of roles in Keycloak according to the client

### Example

```ts
import {
  Configuration,
  KeycloakRolesControllerApi,
} from '';
import type { GetClientRolesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new KeycloakRolesControllerApi(config);

  const body = {
    // string | Client UUID
    clientUuid: clientUuid_example,
    // number | Maximum number of roles to return
    max: 56,
    // number | Index of the first role to return
    first: 56,
  } satisfies GetClientRolesRequest;

  try {
    const data = await api.getClientRoles(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **clientUuid** | `string` | Client UUID | [Defaults to `undefined`] |
| **max** | `number` | Maximum number of roles to return | [Defaults to `undefined`] |
| **first** | `number` | Index of the first role to return | [Defaults to `undefined`] |

### Return type

[**Array&lt;RoleRepresentation&gt;**](RoleRepresentation.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`, `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **404** | Not Found |  -  |
| **400** | Bad Request |  -  |
| **410** | Gone |  -  |
| **409** | Conflict |  -  |
| **500** | Internal Server Error |  -  |
| **200** | Showing client roles |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getRealmRoles

> Array&lt;RoleRepresentation&gt; getRealmRoles(max, first)

Gets list of roles from the realm

Gets the list of roles in Keycloak according to the configured realm

### Example

```ts
import {
  Configuration,
  KeycloakRolesControllerApi,
} from '';
import type { GetRealmRolesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new KeycloakRolesControllerApi(config);

  const body = {
    // number | Maximum number of roles to return
    max: 56,
    // number | Index of the first role to return
    first: 56,
  } satisfies GetRealmRolesRequest;

  try {
    const data = await api.getRealmRoles(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **max** | `number` | Maximum number of roles to return | [Defaults to `undefined`] |
| **first** | `number` | Index of the first role to return | [Defaults to `undefined`] |

### Return type

[**Array&lt;RoleRepresentation&gt;**](RoleRepresentation.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`, `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **404** | Not Found |  -  |
| **400** | Bad Request |  -  |
| **410** | Gone |  -  |
| **409** | Conflict |  -  |
| **500** | Internal Server Error |  -  |
| **200** | Showing roles from the realm |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getRole

> RoleRepresentation getRole(rolId)

Gets client role

Gets a specific role from Keycloak by its ID

### Example

```ts
import {
  Configuration,
  KeycloakRolesControllerApi,
} from '';
import type { GetRoleRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new KeycloakRolesControllerApi(config);

  const body = {
    // string | ID of the role to get
    rolId: rolId_example,
  } satisfies GetRoleRequest;

  try {
    const data = await api.getRole(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **rolId** | `string` | ID of the role to get | [Defaults to `undefined`] |

### Return type

[**RoleRepresentation**](RoleRepresentation.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`, `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **404** | Not Found |  -  |
| **400** | Bad Request |  -  |
| **410** | Gone |  -  |
| **409** | Conflict |  -  |
| **500** | Internal Server Error |  -  |
| **200** | Showing client role |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

