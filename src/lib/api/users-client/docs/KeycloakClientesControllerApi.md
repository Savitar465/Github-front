# KeycloakClientesControllerApi

All URIs are relative to *http://localhost:8081*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getClients**](KeycloakClientesControllerApi.md#getclients) | **GET** /v1/keycloak/clients | Gets list of clients |



## getClients

> Array&lt;ClientRepresentation&gt; getClients(max, first)

Gets list of clients

Gets the list of clients in Keycloak according to the configured realm

### Example

```ts
import {
  Configuration,
  KeycloakClientesControllerApi,
} from '';
import type { GetClientsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new KeycloakClientesControllerApi(config);

  const body = {
    // number | Maximum number of clients to return
    max: 56,
    // number | Index of the first client to return
    first: 56,
  } satisfies GetClientsRequest;

  try {
    const data = await api.getClients(body);
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
| **max** | `number` | Maximum number of clients to return | [Defaults to `undefined`] |
| **first** | `number` | Index of the first client to return | [Defaults to `undefined`] |

### Return type

[**Array&lt;ClientRepresentation&gt;**](ClientRepresentation.md)

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
| **200** | Showing clients |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

