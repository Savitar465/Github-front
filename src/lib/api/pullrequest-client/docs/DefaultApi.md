# DefaultApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createPullRequest**](DefaultApi.md#createpullrequest) | **POST** /v1/repos/{owner}/{repo}/pulls |  |
| [**createPullRequestComment**](DefaultApi.md#createpullrequestcomment) | **POST** /v1/repos/{owner}/{repo}/pulls/{prNumber}/comments |  |
| [**getPullRequest**](DefaultApi.md#getpullrequest) | **GET** /v1/repos/{owner}/{repo}/pulls/{prNumber} |  |
| [**getPullRequestMergeability**](DefaultApi.md#getpullrequestmergeability) | **GET** /v1/repos/{owner}/{repo}/pulls/{prNumber}/mergeability |  |
| [**listPullRequestComments**](DefaultApi.md#listpullrequestcomments) | **GET** /v1/repos/{owner}/{repo}/pulls/{prNumber}/comments |  |
| [**listPullRequests**](DefaultApi.md#listpullrequests) | **GET** /v1/repos/{owner}/{repo}/pulls |  |
| [**mergePullRequest**](DefaultApi.md#mergepullrequest) | **POST** /v1/repos/{owner}/{repo}/pulls/{prNumber}/merge |  |
| [**reviewPullRequest**](DefaultApi.md#reviewpullrequest) | **PATCH** /v1/repos/{owner}/{repo}/pulls/{prNumber}/review |  |



## createPullRequest

> PullRequestDTO createPullRequest(owner, repo, createPullRequestBody)



Crea un pull request entre dos ramas. RF07.1

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { CreatePullRequestRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: smithy.api.httpBearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // string
    owner: owner_example,
    // string
    repo: repo_example,
    // CreatePullRequestBody
    createPullRequestBody: ...,
  } satisfies CreatePullRequestRequest;

  try {
    const data = await api.createPullRequest(body);
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
| **owner** | `string` |  | [Defaults to `undefined`] |
| **repo** | `string` |  | [Defaults to `undefined`] |
| **createPullRequestBody** | [CreatePullRequestBody](CreatePullRequestBody.md) |  | |

### Return type

[**PullRequestDTO**](PullRequestDTO.md)

### Authorization

[smithy.api.httpBearerAuth](../README.md#smithy.api.httpBearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | CreatePullRequest 201 response |  -  |
| **400** | BadRequestError 400 response |  -  |
| **401** | UnauthorizedError 401 response |  -  |
| **403** | ForbiddenError 403 response |  -  |
| **404** | NotFoundError 404 response |  -  |
| **409** | ConflictError 409 response |  -  |
| **500** | InternalServerError 500 response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## createPullRequestComment

> PullRequestCommentDTO createPullRequestComment(owner, repo, prNumber, createPullRequestCommentBody)



Agrega un comentario general o por linea a un pull request.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { CreatePullRequestCommentRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: smithy.api.httpBearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // string
    owner: owner_example,
    // string
    repo: repo_example,
    // number
    prNumber: 8.14,
    // CreatePullRequestCommentBody
    createPullRequestCommentBody: ...,
  } satisfies CreatePullRequestCommentRequest;

  try {
    const data = await api.createPullRequestComment(body);
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
| **owner** | `string` |  | [Defaults to `undefined`] |
| **repo** | `string` |  | [Defaults to `undefined`] |
| **prNumber** | `number` |  | [Defaults to `undefined`] |
| **createPullRequestCommentBody** | [CreatePullRequestCommentBody](CreatePullRequestCommentBody.md) |  | |

### Return type

[**PullRequestCommentDTO**](PullRequestCommentDTO.md)

### Authorization

[smithy.api.httpBearerAuth](../README.md#smithy.api.httpBearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | CreatePullRequestComment 201 response |  -  |
| **400** | BadRequestError 400 response |  -  |
| **401** | UnauthorizedError 401 response |  -  |
| **403** | ForbiddenError 403 response |  -  |
| **404** | NotFoundError 404 response |  -  |
| **500** | InternalServerError 500 response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getPullRequest

> PullRequestDTO getPullRequest(owner, repo, prNumber)



Obtiene el detalle de un pull request.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { GetPullRequestRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: smithy.api.httpBearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // string
    owner: owner_example,
    // string
    repo: repo_example,
    // number
    prNumber: 8.14,
  } satisfies GetPullRequestRequest;

  try {
    const data = await api.getPullRequest(body);
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
| **owner** | `string` |  | [Defaults to `undefined`] |
| **repo** | `string` |  | [Defaults to `undefined`] |
| **prNumber** | `number` |  | [Defaults to `undefined`] |

### Return type

[**PullRequestDTO**](PullRequestDTO.md)

### Authorization

[smithy.api.httpBearerAuth](../README.md#smithy.api.httpBearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | GetPullRequest 200 response |  -  |
| **401** | UnauthorizedError 401 response |  -  |
| **403** | ForbiddenError 403 response |  -  |
| **404** | NotFoundError 404 response |  -  |
| **500** | InternalServerError 500 response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getPullRequestMergeability

> PullRequestMergeabilityDTO getPullRequestMergeability(owner, repo, prNumber)



Evalua conflictos y mergeabilidad antes de merge. RF07.3

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { GetPullRequestMergeabilityRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: smithy.api.httpBearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // string
    owner: owner_example,
    // string
    repo: repo_example,
    // number
    prNumber: 8.14,
  } satisfies GetPullRequestMergeabilityRequest;

  try {
    const data = await api.getPullRequestMergeability(body);
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
| **owner** | `string` |  | [Defaults to `undefined`] |
| **repo** | `string` |  | [Defaults to `undefined`] |
| **prNumber** | `number` |  | [Defaults to `undefined`] |

### Return type

[**PullRequestMergeabilityDTO**](PullRequestMergeabilityDTO.md)

### Authorization

[smithy.api.httpBearerAuth](../README.md#smithy.api.httpBearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | GetPullRequestMergeability 200 response |  -  |
| **401** | UnauthorizedError 401 response |  -  |
| **403** | ForbiddenError 403 response |  -  |
| **404** | NotFoundError 404 response |  -  |
| **500** | InternalServerError 500 response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listPullRequestComments

> ListPullRequestCommentsBody listPullRequestComments(owner, repo, prNumber)



Lista comentarios de un pull request.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ListPullRequestCommentsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: smithy.api.httpBearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // string
    owner: owner_example,
    // string
    repo: repo_example,
    // number
    prNumber: 8.14,
  } satisfies ListPullRequestCommentsRequest;

  try {
    const data = await api.listPullRequestComments(body);
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
| **owner** | `string` |  | [Defaults to `undefined`] |
| **repo** | `string` |  | [Defaults to `undefined`] |
| **prNumber** | `number` |  | [Defaults to `undefined`] |

### Return type

[**ListPullRequestCommentsBody**](ListPullRequestCommentsBody.md)

### Authorization

[smithy.api.httpBearerAuth](../README.md#smithy.api.httpBearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | ListPullRequestComments 200 response |  -  |
| **401** | UnauthorizedError 401 response |  -  |
| **403** | ForbiddenError 403 response |  -  |
| **404** | NotFoundError 404 response |  -  |
| **500** | InternalServerError 500 response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listPullRequests

> ListPullRequestsBody listPullRequests(owner, repo, status)



Lista los pull requests del repositorio. RF07

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ListPullRequestsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: smithy.api.httpBearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // string
    owner: owner_example,
    // string
    repo: repo_example,
    // PrStatus (optional)
    status: ...,
  } satisfies ListPullRequestsRequest;

  try {
    const data = await api.listPullRequests(body);
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
| **owner** | `string` |  | [Defaults to `undefined`] |
| **repo** | `string` |  | [Defaults to `undefined`] |
| **status** | `PrStatus` |  | [Optional] [Defaults to `undefined`] [Enum: open, closed, merged] |

### Return type

[**ListPullRequestsBody**](ListPullRequestsBody.md)

### Authorization

[smithy.api.httpBearerAuth](../README.md#smithy.api.httpBearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | ListPullRequests 200 response |  -  |
| **401** | UnauthorizedError 401 response |  -  |
| **403** | ForbiddenError 403 response |  -  |
| **404** | NotFoundError 404 response |  -  |
| **500** | InternalServerError 500 response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## mergePullRequest

> PullRequestDTO mergePullRequest(owner, repo, prNumber, mergePullRequestBody)



Ejecuta merge de un pull request aprobado y sin conflictos.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { MergePullRequestRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: smithy.api.httpBearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // string
    owner: owner_example,
    // string
    repo: repo_example,
    // number
    prNumber: 8.14,
    // MergePullRequestBody
    mergePullRequestBody: ...,
  } satisfies MergePullRequestRequest;

  try {
    const data = await api.mergePullRequest(body);
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
| **owner** | `string` |  | [Defaults to `undefined`] |
| **repo** | `string` |  | [Defaults to `undefined`] |
| **prNumber** | `number` |  | [Defaults to `undefined`] |
| **mergePullRequestBody** | [MergePullRequestBody](MergePullRequestBody.md) |  | |

### Return type

[**PullRequestDTO**](PullRequestDTO.md)

### Authorization

[smithy.api.httpBearerAuth](../README.md#smithy.api.httpBearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | MergePullRequest 200 response |  -  |
| **400** | BadRequestError 400 response |  -  |
| **401** | UnauthorizedError 401 response |  -  |
| **403** | ForbiddenError 403 response |  -  |
| **404** | NotFoundError 404 response |  -  |
| **409** | ConflictError 409 response |  -  |
| **422** | UnprocessableEntityError 422 response |  -  |
| **500** | InternalServerError 500 response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## reviewPullRequest

> PullRequestDTO reviewPullRequest(owner, repo, prNumber, reviewPullRequestBody)



Aprueba o solicita cambios en un pull request. RF07.2

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ReviewPullRequestRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: smithy.api.httpBearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // string
    owner: owner_example,
    // string
    repo: repo_example,
    // number
    prNumber: 8.14,
    // ReviewPullRequestBody
    reviewPullRequestBody: ...,
  } satisfies ReviewPullRequestRequest;

  try {
    const data = await api.reviewPullRequest(body);
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
| **owner** | `string` |  | [Defaults to `undefined`] |
| **repo** | `string` |  | [Defaults to `undefined`] |
| **prNumber** | `number` |  | [Defaults to `undefined`] |
| **reviewPullRequestBody** | [ReviewPullRequestBody](ReviewPullRequestBody.md) |  | |

### Return type

[**PullRequestDTO**](PullRequestDTO.md)

### Authorization

[smithy.api.httpBearerAuth](../README.md#smithy.api.httpBearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | ReviewPullRequest 200 response |  -  |
| **400** | BadRequestError 400 response |  -  |
| **401** | UnauthorizedError 401 response |  -  |
| **403** | ForbiddenError 403 response |  -  |
| **404** | NotFoundError 404 response |  -  |
| **500** | InternalServerError 500 response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

