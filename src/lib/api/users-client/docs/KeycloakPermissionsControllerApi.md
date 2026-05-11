# KeycloakPermissionsControllerApi

All URIs are relative to *http://localhost:8081*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getPermissions**](KeycloakPermissionsControllerApi.md#getpermissions) | **GET** /v1/keycloak/permissions/client/{clientUuid} | Gets list of client permissions |
| [**getPermissionsByRole**](KeycloakPermissionsControllerApi.md#getpermissionsbyrole) | **GET** /v1/keycloak/permissions/client/{clientUuid}/rol/{rolId} | Gets list of client permissions by role |
| [**updatePermission**](KeycloakPermissionsControllerApi.md#updatepermission) | **PUT** /v1/keycloak/permissions/client/{clientUuid}/permission/{permissionId} | Modifies a client permission |



## getPermissions

> Array&lt;PolicyRepresentation&gt; getPermissions(clientUuid, max, first)

Gets list of client permissions

Gets the list of permissions in Keycloak according to the client

### Example

```ts
import {
  Configuration,
  KeycloakPermissionsControllerApi,
} from '';
import type { GetPermissionsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new KeycloakPermissionsControllerApi(config);

  const body = {
    // string | Client UUID
    clientUuid: clientUuid_example,
    // number | Maximum number of permissions to return
    max: 56,
    // number | Index of the first permission to return
    first: 56,
  } satisfies GetPermissionsRequest;

  try {
    const data = await api.getPermissions(body);
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
| **max** | `number` | Maximum number of permissions to return | [Defaults to `undefined`] |
| **first** | `number` | Index of the first permission to return | [Defaults to `undefined`] |

### Return type

[**Array&lt;PolicyRepresentation&gt;**](PolicyRepresentation.md)

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
| **200** | Showing client permissions |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getPermissionsByRole

> Array&lt;PolicyRepresentation&gt; getPermissionsByRole(clientUuid, rolId)

Gets list of client permissions by role

Gets the list of permissions in Keycloak according to the client and the role

### Example

```ts
import {
  Configuration,
  KeycloakPermissionsControllerApi,
} from '';
import type { GetPermissionsByRoleRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new KeycloakPermissionsControllerApi(config);

  const body = {
    // string | Client UUID
    clientUuid: clientUuid_example,
    // string | Role ID
    rolId: rolId_example,
  } satisfies GetPermissionsByRoleRequest;

  try {
    const data = await api.getPermissionsByRole(body);
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
| **rolId** | `string` | Role ID | [Defaults to `undefined`] |

### Return type

[**Array&lt;PolicyRepresentation&gt;**](PolicyRepresentation.md)

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
| **200** | Showing client permissions by role |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## updatePermission

> object updatePermission(clientUuid, permissionId, rolLinkRequest)

Modifies a client permission

Modifies a client permission

### Example

```ts
import {
  Configuration,
  KeycloakPermissionsControllerApi,
} from '';
import type { UpdatePermissionRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new KeycloakPermissionsControllerApi(config);

  const body = {
    // string | Client UUID
    clientUuid: clientUuid_example,
    // string | Permission ID
    permissionId: permissionId_example,
    // Array<RolLinkRequest>
    rolLinkRequest: ...,
  } satisfies UpdatePermissionRequest;

  try {
    const data = await api.updatePermission(body);
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
| **permissionId** | `string` | Permission ID | [Defaults to `undefined`] |
| **rolLinkRequest** | `Array<RolLinkRequest>` |  | |

### Return type

**object**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`, `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **404** | Not Found |  -  |
| **400** | Bad Request |  -  |
| **410** | Gone |  -  |
| **409** | Conflict |  -  |
| **500** | Internal Server Error |  -  |
| **200** | Showing client permissions |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

