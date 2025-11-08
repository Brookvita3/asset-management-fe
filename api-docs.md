# Asset Management API

This document lists the HTTP endpoints exposed by the Asset Management backend and the payloads expected by the frontend. All examples assume JSON requests/responses and a server running on `http://localhost:8080` unless stated otherwise.

## Conventions

- **Base URL:** `http://{host}:8080`
- **Media type:** `application/json`
- **Authentication:** Obtain a JWT by calling `POST /login` and include it on subsequent requests as `Authorization: Bearer <token>` (if security is enabled in your environment).
- **Envelope:** Every endpoint returns a `ResponseObject` in the shape below:

```json
{
  "message": "Human friendly summary",
  "data": { }
}
```

When validation fails the response uses HTTP `400` and `data` contains an array of field error strings.

## Authentication

### POST `/login`
Authenticate a user and fetch a JWT token.

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| email | body | string | ✅ | User email |
| password | body | string | ✅ | Plain text password |

**Request body**
```json
{
  "email": "admin@company.com",
  "password": "123456"
}
```

**Successful response (200)**
```json
{
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Assets
Base path: `/api/v1/assets`

### POST `/api/v1/assets`
Create a new asset record.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| code | string | ✅ | Unique asset code |
| name | string | ✅ | Asset name |
| typeId | number | ✅ | Foreign key to asset type |
| assignedTo | number | ✅ | User id to assign to (must exist) |
| purchaseDate | string (ISO date) | ❌ | e.g. `"2024-01-31"` |
| value | number | ❌ | Decimal value > 0 |
| status | string | ✅ | One of `IN_USE`, `IN_STOCK`, `RETIRED`, `REPAIR`, `LOST` |
| condition | string | ✅ | One of `GOOD`, `NEEDS_REPAIR`, `DAMAGED`, `LOST` |
| description | string | ❌ |

**Response (200)**
```json
{
  "message": "Asset created successfully"
}
```

### GET `/api/v1/assets/{id}`
Fetch a single asset.

**Response (200)**
```json
{
  "data": {
    "id": 12,
    "code": "AS-001",
    "name": "MacBook Pro",
    "type": "Laptop",
    "assignedTo": "Jane Doe",
    "purchaseDate": "2024-01-31",
    "value": 2499.99,
    "status": "IN_USE",
    "condition": "GOOD",
    "description": "16-inch developer machine",
    "createdBy": "Admin User",
    "createdAt": "2024-02-01T08:00:00Z"
  }
}
```

### GET `/api/v1/assets`
Return all assets.

```json
{
  "data": [
    { "...": "AssetResponse" },
    { "...": "AssetResponse" }
  ]
}
```

### PUT `/api/v1/assets/{id}`
Update an asset. Body matches `POST /api/v1/assets`. Response:
```json
{ "message": "Asset updated successfully" }
```

### DELETE `/api/v1/assets/{id}`
Remove an asset.
```json
{ "message": "Asset deleted successfully" }
```

### POST `/api/v1/assets/{id}/assign`
Assign an existing asset to a user and mark status `IN_USE`.

```json
{
  "userId": 5
}
```
Response `{"message": "Asset assigned successfully" }`.

### POST `/api/v1/assets/{id}/revoke`
Clear the current assignment and set status to `IN_STOCK`.

```json
{ "message": "Asset assignment revoked successfully" }
```

## Asset Types
Base path: `/asset-types`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/asset-types` | Create asset type |
| GET | `/asset-types/{id}` | Retrieve a type |
| GET | `/asset-types` | List all types |
| PUT | `/asset-types/{id}` | Update a type |
| DELETE | `/asset-types/{id}` | Remove a type |

`AssetTypeRequest` fields: `name` (string), `description` (string), `isActive` (boolean). Success responses follow the `ResponseObject` format with a descriptive `message`.

## Departments
Base path: `/api/v1/departments`

### POST `/api/v1/departments`
Create a department.
```json
{
  "name": "Engineering",
  "description": "Core product team",
  "managerId": 2,
  "isActive": true,
  "employeeCount": 35
}
```
Response: `{"message": "Department created successfully"}`.

### GET `/api/v1/departments/{id}`
Returns a `DepartmentResponse` (id, name, description, managerId, isActive, employeeCount, createdAt).

### GET `/api/v1/departments`
List all departments.

### PUT `/api/v1/departments/{id}`
Body matches create request. Response message: `"Department updated successfully"`.

### DELETE `/api/v1/departments/{id}`
`{"message": "Department deleted successfully"}`.

## Users
Base path: `/users`

| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/users` | List all users |
| GET | `/users/{id}` | Single user |
| GET | `/users/department/{departmentId}` | Users filtered by department |
| POST | `/users` | Create user |
| PUT | `/users/{id}` | Update user |
| DELETE | `/users/{id}` | Delete user |

### POST `/users`
```json
{
  "name": "Jane Doe",
  "email": "jane@company.com",
  "password": "123456",
  "role": "STAFF",
  "departmentId": 1
}
```

### GET `/users/department/{departmentId}` Response
```json
{
  "message": "Get users by department successful",
  "data": [
    {
      "id": 4,
      "name": "Jane Doe",
      "email": "jane@company.com",
      "departmentName": "Engineering",
      "role": "STAFF",
      "active": true
    }
  ]
}
```

## Chatbot
Base path: `/api/chatbot`

### POST `/api/chatbot/chat`
Send a message to the AI assistant.

| Parameter | In | Type | Required | Description |
|-----------|----|------|----------|-------------|
| userId | query | number | ✅ | The user initiating the chat |
| message | body | string | ✅ | User message content |
| role | body | string | ❌ | (Optional) override role, one of `ADMIN`, `MANAGER`, `STAFF` |

**Request**
```json
{
  "message": "List my currently assigned assets",
  "userId": 4,
  "role": "STAFF"
}
```

**Success response**
```json
{
  "message": "Chat thành công",
  "data": {
    "answer": "You currently hold asset AS-001",
    "success": true,
    "message": "Chat response generated successfully"
  }
}
```

### GET `/api/chatbot/history`
Query string `userId` is required. Response is an array of `ChatHistoryResponse` items (id, content, direction, timestamp, tokensUsed).

### GET `/api/chatbot/health`
Simple health check returning `{"data": "OK"}`.

## Reference Data

### Asset Status (`AssetStatus`)
`IN_USE`, `IN_STOCK`, `RETIRED`, `REPAIR`, `LOST`

### Asset Condition (`AssetCondition`)
`GOOD`, `NEEDS_REPAIR`, `DAMAGED`, `LOST`

### Asset History Actions (`AssetHistoryAction`)
`CREATED`, `ASSIGNED`, `EVALUATED`, `RECLAIMED`, `UPDATED`, `DELETED`

## Error Handling

- `400 Bad Request` — validation errors (see `message` and `data[]`).
- `404 Not Found` — entity does not exist (e.g., asset, user, department).
- `500 Internal Server Error` — unexpected exceptions, message contains a short description.

Always inspect the `message` field to display human-readable feedback in the frontend.
