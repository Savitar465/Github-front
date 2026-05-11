# UserControllerApi

All URIs are relative to *http://localhost:8081*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createUser**](UserControllerApi.md#createuser) | **POST** /v1/users | Register a new user |
| [**deleteUser**](UserControllerApi.md#deleteuser) | **DELETE** /v1/users/{userId} | Delete an existing user |
| [**editUser**](UserControllerApi.md#edituser) | **PUT** /v1/users/{userId} | Edit an existing user |
| [**getListUsers**](UserControllerApi.md#getlistusers) | **GET** /v1/users | Get paginated list of users |
| [**getUser**](UserControllerApi.md#getuser) | **GET** /v1/users/{userId} | Get details of a specific user |
| [**searchUsers**](UserControllerApi.md#searchusers) | **POST** /v1/users/search | Search users by filter |



## createUser

> UserResponse createUser(userRequest)

Register a new user

This endpoint allows the creation of a new user by providing the required data in the request body. If the operation is successful, it returns the details of the created user.

### Example

```ts
import {
  Configuration,
  UserControllerApi,
} from '';
import type { CreateUserRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UserControllerApi(config);

  const body = {
    // UserRequest | Data needed to create a new user
    userRequest: ...,
  } satisfies CreateUserRequest;

  try {
    const data = await api.createUser(body);
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
| **userRequest** | [UserRequest](UserRequest.md) | Data needed to create a new user | |

### Return type

[**UserResponse**](UserResponse.md)

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
| **201** | Successful operation. The user was created successfully. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deleteUser

> DeleteResponse deleteUser(userId)

Delete an existing user

This endpoint allows you to permanently delete a user. It is necessary to provide the &#x60;userId&#x60; parameter, which uniquely identifies the user you want to delete.

### Example

```ts
import {
  Configuration,
  UserControllerApi,
} from '';
import type { DeleteUserRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UserControllerApi(config);

  const body = {
    // string | Identifier of the user
    userId: userId_example,
  } satisfies DeleteUserRequest;

  try {
    const data = await api.deleteUser(body);
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
| **userId** | `string` | Identifier of the user | [Defaults to `undefined`] |

### Return type

[**DeleteResponse**](DeleteResponse.md)

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
| **200** | Successful operation. The user has been successfully deleted. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## editUser

> UserResponse editUser(userId, userRequest)

Edit an existing user

This endpoint allows you to update the details of a registered user. It is necessary to provide the &#x60;userId&#x60; parameter, which uniquely identifies the user to be edited.

### Example

```ts
import {
  Configuration,
  UserControllerApi,
} from '';
import type { EditUserRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UserControllerApi(config);

  const body = {
    // string | Unique identifier of the user
    userId: userId_example,
    // UserRequest | Data needed to edit an existing user
    userRequest: ...,
  } satisfies EditUserRequest;

  try {
    const data = await api.editUser(body);
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
| **userId** | `string` | Unique identifier of the user | [Defaults to `undefined`] |
| **userRequest** | [UserRequest](UserRequest.md) | Data needed to edit an existing user | |

### Return type

[**UserResponse**](UserResponse.md)

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
| **200** | Successful operation. The user was updated correctly. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getListUsers

> PageUserResponse getListUsers(pageSize, page)

Get paginated list of users

This endpoint allows you to retrieve a paginated list of registered users. It is mandatory to provide the &#x60;page&#x60; and &#x60;pageSize&#x60; parameters to control pagination.

### Example

```ts
import {
  Configuration,
  UserControllerApi,
} from '';
import type { GetListUsersRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UserControllerApi(config);

  const body = {
    // number | Number of records that will be displayed per page.
    pageSize: 56,
    // number | Number of the page you want to query.
    page: 56,
  } satisfies GetListUsersRequest;

  try {
    const data = await api.getListUsers(body);
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
| **pageSize** | `number` | Number of records that will be displayed per page. | [Defaults to `undefined`] |
| **page** | `number` | Number of the page you want to query. | [Defaults to `undefined`] |

### Return type

[**PageUserResponse**](PageUserResponse.md)

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
| **200** | Successful operation. The list of users was obtained successfully. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getUser

> UserResponse getUser(userId)

Get details of a specific user

This endpoint allows you to retrieve detailed information of a registered user. It is necessary to provide the &#x60;userId&#x60; parameter, which uniquely identifies the requested user.

### Example

```ts
import {
  Configuration,
  UserControllerApi,
} from '';
import type { GetUserRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UserControllerApi(config);

  const body = {
    // string | Unique identifier of the user (UUID)
    userId: userId_example,
  } satisfies GetUserRequest;

  try {
    const data = await api.getUser(body);
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
| **userId** | `string` | Unique identifier of the user (UUID) | [Defaults to `undefined`] |

### Return type

[**UserResponse**](UserResponse.md)

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
| **200** | Successful operation. The user was retrieved successfully. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## searchUsers

> PageUserResponse searchUsers(searchRequest)

Search users by filter

This endpoint allows you to search for users by filter. It is necessary to provide the &#x60;filter&#x60; parameter, which uniquely identifies the user to be filtered.

### Example

```ts
import {
  Configuration,
  UserControllerApi,
} from '';
import type { SearchUsersRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UserControllerApi(config);

  const body = {
    // SearchRequest | Data needed to search for users by filter
    searchRequest: ...,
  } satisfies SearchUsersRequest;

  try {
    const data = await api.searchUsers(body);
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
| **searchRequest** | [SearchRequest](SearchRequest.md) | Data needed to search for users by filter | |

### Return type

[**PageUserResponse**](PageUserResponse.md)

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
| **200** | Successful operation. The filtered users were retrieved correctly. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

