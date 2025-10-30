# API Documentation

## Base URL

```
http://localhost:8000/api/v1
```

## Authentication

All endpoints (except login and register) require JWT authentication.

### Headers

```
Authorization: Bearer {access_token}
Content-Type: application/json
```

## Endpoints

### Authentication

#### Register User

```http
POST /auth/register
```

**Request Body:**
```json
{
  "username": "string",
  "email": "user@example.com",
  "password": "string",
  "full_name": "string",
  "role": "operator"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "username": "string",
  "email": "user@example.com",
  "full_name": "string",
  "role": "operator",
  "is_active": true
}
```

#### Login

```http
POST /auth/login
```

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "string",
  "refresh_token": "string",
  "token_type": "bearer"
}
```

#### Refresh Token

```http
POST /auth/refresh
```

**Request Body:**
```json
{
  "refresh_token": "string"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "string",
  "refresh_token": "string",
  "token_type": "bearer"
}
```

#### Get Current User

```http
GET /auth/me
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "username": "string",
  "email": "user@example.com",
  "full_name": "string",
  "role": "operator",
  "is_active": true
}
```

---

### Companies

#### List Companies

```http
GET /companies?skip=0&limit=100
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "MineCore Ltd",
    "contact_email": "contact@minecore.com",
    "contact_phone": "+1234567890",
    "created_at": "2025-10-20T12:00:00",
    "updated_at": "2025-10-20T12:00:00"
  }
]
```

#### Create Company

```http
POST /companies
```

**Required Role:** Manager or Admin

**Request Body:**
```json
{
  "name": "string",
  "contact_email": "contact@company.com",
  "contact_phone": "+1234567890"
}
```

**Response:** `201 Created`

#### Get Company

```http
GET /companies/{company_id}
```

**Response:** `200 OK`

#### Update Company

```http
PUT /companies/{company_id}
```

**Required Role:** Manager or Admin

**Request Body:**
```json
{
  "name": "string",
  "contact_email": "contact@company.com",
  "contact_phone": "+1234567890"
}
```

**Response:** `200 OK`

#### Delete Company

```http
DELETE /companies/{company_id}
```

**Required Role:** Admin

**Response:** `204 No Content`

---

### Dispatches

#### List Dispatches

```http
GET /dispatches?skip=0&limit=100&status_filter=outstanding&company_id=1
```

**Query Parameters:**
- `skip` (optional): Number of records to skip
- `limit` (optional): Maximum records to return
- `status_filter` (optional): Filter by status (outstanding/returned)
- `company_id` (optional): Filter by company ID

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "project_id": 1,
    "drillhole_id": 1,
    "company_id": 1,
    "dispatch_date": "2025-10-20T08:00:00",
    "hq_boxes": 10,
    "nq_boxes": 5,
    "driver": "John Doe",
    "technician": "Jane Smith",
    "samples_collected": 50,
    "sample_type": "core",
    "status": "outstanding",
    "return_date": null,
    "returned_hq": null,
    "returned_nq": null,
    "return_condition": null,
    "return_notes": null,
    "created_at": "2025-10-20T08:00:00",
    "updated_at": "2025-10-20T08:00:00",
    "project_name": "Project Alpha",
    "drillhole_name": "DH001",
    "company_name": "MineCore Ltd",
    "days_out": 5,
    "is_match": null
  }
]
```

#### Create Dispatch

```http
POST /dispatches
```

**Request Body:**
```json
{
  "project_id": 1,
  "drillhole_id": 1,
  "company_id": 1,
  "hq_boxes": 10,
  "nq_boxes": 5,
  "driver": "John Doe",
  "technician": "Jane Smith",
  "samples_collected": 50,
  "sample_type": "core",
  "dispatch_date": "2025-10-20T08:00:00"
}
```

**Response:** `201 Created`

#### Get Outstanding Dispatches

```http
GET /dispatches/outstanding
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "project_name": "Project Alpha",
    "drillhole_name": "DH001",
    "company_name": "MineCore Ltd",
    "dispatch_date": "2025-10-20T08:00:00",
    "hq_boxes": 10,
    "nq_boxes": 5,
    "days_out": 5,
    "driver": "John Doe",
    "technician": "Jane Smith"
  }
]
```

#### Get Dispatch

```http
GET /dispatches/{dispatch_id}
```

**Response:** `200 OK`

#### Update Dispatch

```http
PUT /dispatches/{dispatch_id}
```

**Request Body:**
```json
{
  "hq_boxes": 12,
  "nq_boxes": 6,
  "driver": "John Doe",
  "technician": "Jane Smith",
  "samples_collected": 55,
  "sample_type": "assay"
}
```

**Response:** `200 OK`

#### Process Return

```http
POST /dispatches/{dispatch_id}/return
```

**Request Body:**
```json
{
  "returned_hq": 10,
  "returned_nq": 5,
  "return_condition": "Good",
  "return_notes": "All boxes in good condition",
  "return_date": "2025-10-25T14:00:00"
}
```

**Response:** `200 OK`

#### Delete Dispatch

```http
DELETE /dispatches/{dispatch_id}
```

**Response:** `204 No Content`

---

### Reports

#### Dashboard Statistics

```http
GET /reports/dashboard
```

**Response:** `200 OK`
```json
{
  "inventory": {
    "base": {
      "hq": 100,
      "nq": 100
    },
    "outstanding": {
      "hq": 25,
      "nq": 15
    },
    "available": {
      "hq": 75,
      "nq": 85
    }
  },
  "dispatches": {
    "total": 50,
    "outstanding": 10,
    "returned": 40,
    "match_rate": 92.5
  },
  "samples": {
    "total": 2500,
    "outstanding": 500
  }
}
```

#### Reconciliation Report

```http
GET /reports/reconciliation
```

**Response:** `200 OK`
```json
{
  "outstanding": [
    {
      "id": 1,
      "project": "Project Alpha",
      "drillhole": "DH001",
      "company": "MineCore Ltd",
      "dispatch_date": "2025-10-20T08:00:00",
      "hq_boxes": 10,
      "nq_boxes": 5,
      "days_out": 5,
      "driver": "John Doe",
      "technician": "Jane Smith"
    }
  ],
  "discrepancies": [
    {
      "id": 2,
      "project": "Project Beta",
      "drillhole": "DH002",
      "company": "GoldTech Mining",
      "dispatch_date": "2025-10-15T08:00:00",
      "return_date": "2025-10-18T14:00:00",
      "hq_dispatched": 10,
      "hq_returned": 9,
      "hq_difference": -1,
      "nq_dispatched": 5,
      "nq_returned": 5,
      "nq_difference": 0,
      "notes": "One HQ box damaged"
    }
  ]
}
```

#### Analytics

```http
GET /reports/analytics
```

**Response:** `200 OK`
```json
{
  "by_company": [
    {
      "company": "MineCore Ltd",
      "dispatches": 20,
      "samples": 1000
    },
    {
      "company": "GoldTech Mining",
      "dispatches": 15,
      "samples": 750
    }
  ],
  "by_sample_type": [
    {
      "sample_type": "core",
      "dispatches": 25
    },
    {
      "sample_type": "assay",
      "dispatches": 15
    }
  ]
}
```

#### Export to CSV

```http
GET /reports/export
```

**Response:** `200 OK`
```
Content-Type: text/csv
Content-Disposition: attachment; filename=dispatches_export.csv

ID,Project,Drillhole,Company,Dispatch Date,HQ Boxes,NQ Boxes,...
1,Project Alpha,DH001,MineCore Ltd,2025-10-20T08:00:00,10,5,...
```

---

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "detail": "Could not validate credentials"
}
```

### 403 Forbidden
```json
{
  "detail": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 409 Conflict
```json
{
  "detail": "Resource already exists"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. Consider implementing rate limiting in production.

## Pagination

List endpoints support pagination via `skip` and `limit` query parameters:

- `skip`: Number of records to skip (default: 0)
- `limit`: Maximum records to return (default: 20, max: 100)

## Filtering

Dispatch endpoints support filtering:

- `status_filter`: Filter by dispatch status
- `company_id`: Filter by company ID

## Sorting

Results are sorted by:

- **Dispatches**: `dispatch_date` descending (newest first)
- **Outstanding**: `dispatch_date` ascending (oldest first)

---

## WebSocket Support

WebSocket support for real-time updates is not currently implemented but can be added using FastAPI's WebSocket support.

## Versioning

API is versioned via URL path: `/api/v1/`

Future versions will use `/api/v2/`, etc.

