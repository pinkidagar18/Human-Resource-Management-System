# API Endpoints - HRMS Lite

Complete API documentation for testing and integration.

## Base URL

**Local Development**: `http://localhost:5000/api`  
**Production**: `https://your-backend-url.onrender.com/api`

---

## Health Check

### Check API Status

**Endpoint**: `GET /health`

**Response**:
```json
{
  "success": true,
  "message": "HRMS Lite API is running",
  "timestamp": "2024-02-07T12:00:00.000Z"
}
```

**cURL**:
```bash
curl http://localhost:5000/api/health
```

---

## Employee Endpoints

### 1. Get All Employees

**Endpoint**: `GET /employees`

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "65c123...",
      "employeeId": "EMP001",
      "fullName": "John Doe",
      "email": "john.doe@company.com",
      "department": "Engineering",
      "createdAt": "2024-02-07T12:00:00.000Z",
      "updatedAt": "2024-02-07T12:00:00.000Z"
    }
  ]
}
```

**cURL**:
```bash
curl http://localhost:5000/api/employees
```

---

### 2. Get Single Employee

**Endpoint**: `GET /employees/:id`

**Parameters**:
- `id` (path) - MongoDB ObjectId

**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "65c123...",
    "employeeId": "EMP001",
    "fullName": "John Doe",
    "email": "john.doe@company.com",
    "department": "Engineering",
    "createdAt": "2024-02-07T12:00:00.000Z",
    "updatedAt": "2024-02-07T12:00:00.000Z"
  }
}
```

**Error (404)**:
```json
{
  "success": false,
  "message": "Employee not found"
}
```

**cURL**:
```bash
curl http://localhost:5000/api/employees/65c123...
```

---

### 3. Create Employee

**Endpoint**: `POST /employees`

**Request Body**:
```json
{
  "employeeId": "EMP001",
  "fullName": "John Doe",
  "email": "john.doe@company.com",
  "department": "Engineering"
}
```

**Validation Rules**:
- `employeeId`: Required, must be unique
- `fullName`: Required, not empty
- `email`: Required, valid email format
- `department`: Required, not empty

**Success Response (201)**:
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "_id": "65c123...",
    "employeeId": "EMP001",
    "fullName": "John Doe",
    "email": "john.doe@company.com",
    "department": "Engineering",
    "createdAt": "2024-02-07T12:00:00.000Z",
    "updatedAt": "2024-02-07T12:00:00.000Z"
  }
}
```

**Error Responses**:

**Validation Error (400)**:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Valid email is required",
      "param": "email",
      "location": "body"
    }
  ]
}
```

**Duplicate Employee ID (409)**:
```json
{
  "success": false,
  "message": "Employee ID already exists"
}
```

**cURL**:
```bash
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP001",
    "fullName": "John Doe",
    "email": "john.doe@company.com",
    "department": "Engineering"
  }'
```

---

### 4. Delete Employee

**Endpoint**: `DELETE /employees/:id`

**Parameters**:
- `id` (path) - MongoDB ObjectId

**Response (200)**:
```json
{
  "success": true,
  "message": "Employee deleted successfully"
}
```

**Error (404)**:
```json
{
  "success": false,
  "message": "Employee not found"
}
```

**Note**: This will also delete all attendance records for this employee.

**cURL**:
```bash
curl -X DELETE http://localhost:5000/api/employees/65c123...
```

---

## Attendance Endpoints

### 1. Get All Attendance Records

**Endpoint**: `GET /attendance`

**Query Parameters** (optional):
- `employeeId` - Filter by employee ID
- `date` - Filter by date (YYYY-MM-DD format)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "65c456...",
      "employeeId": "EMP001",
      "employeeName": "John Doe",
      "department": "Engineering",
      "date": "2024-02-07T00:00:00.000Z",
      "status": "Present",
      "createdAt": "2024-02-07T12:00:00.000Z"
    }
  ]
}
```

**cURL**:
```bash
# Get all attendance
curl http://localhost:5000/api/attendance

# Filter by employee
curl http://localhost:5000/api/attendance?employeeId=EMP001

# Filter by date
curl http://localhost:5000/api/attendance?date=2024-02-07

# Both filters
curl http://localhost:5000/api/attendance?employeeId=EMP001&date=2024-02-07
```

---

### 2. Get Employee Attendance

**Endpoint**: `GET /attendance/employee/:employeeId`

**Parameters**:
- `employeeId` (path) - Employee ID (e.g., EMP001)

**Response**:
```json
{
  "success": true,
  "data": {
    "employee": {
      "employeeId": "EMP001",
      "fullName": "John Doe",
      "department": "Engineering"
    },
    "summary": {
      "totalDays": 20,
      "presentDays": 18,
      "absentDays": 2
    },
    "records": [
      {
        "_id": "65c456...",
        "employeeId": "EMP001",
        "date": "2024-02-07T00:00:00.000Z",
        "status": "Present",
        "createdAt": "2024-02-07T12:00:00.000Z"
      }
    ]
  }
}
```

**Error (404)**:
```json
{
  "success": false,
  "message": "Employee not found"
}
```

**cURL**:
```bash
curl http://localhost:5000/api/attendance/employee/EMP001
```

---

### 3. Mark Attendance

**Endpoint**: `POST /attendance`

**Request Body**:
```json
{
  "employeeId": "EMP001",
  "date": "2024-02-07",
  "status": "Present"
}
```

**Validation Rules**:
- `employeeId`: Required, must exist in database
- `date`: Required, valid date format (YYYY-MM-DD or ISO 8601)
- `status`: Required, must be "Present" or "Absent"

**Success Response (201)** - New Record:
```json
{
  "success": true,
  "message": "Attendance marked successfully",
  "data": {
    "_id": "65c456...",
    "employeeId": "EMP001",
    "date": "2024-02-07T00:00:00.000Z",
    "status": "Present",
    "createdAt": "2024-02-07T12:00:00.000Z",
    "updatedAt": "2024-02-07T12:00:00.000Z"
  }
}
```

**Success Response (200)** - Updated Record:
```json
{
  "success": true,
  "message": "Attendance updated successfully",
  "data": {
    "_id": "65c456...",
    "employeeId": "EMP001",
    "date": "2024-02-07T00:00:00.000Z",
    "status": "Absent",
    "createdAt": "2024-02-07T12:00:00.000Z",
    "updatedAt": "2024-02-07T12:30:00.000Z"
  }
}
```

**Error Responses**:

**Employee Not Found (404)**:
```json
{
  "success": false,
  "message": "Employee not found"
}
```

**Validation Error (400)**:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Status must be Present or Absent",
      "param": "status",
      "location": "body"
    }
  ]
}
```

**cURL**:
```bash
curl -X POST http://localhost:5000/api/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP001",
    "date": "2024-02-07",
    "status": "Present"
  }'
```

---

### 4. Delete Attendance Record

**Endpoint**: `DELETE /attendance/:id`

**Parameters**:
- `id` (path) - MongoDB ObjectId

**Response (200)**:
```json
{
  "success": true,
  "message": "Attendance record deleted successfully"
}
```

**Error (404)**:
```json
{
  "success": false,
  "message": "Attendance record not found"
}
```

**cURL**:
```bash
curl -X DELETE http://localhost:5000/api/attendance/65c456...
```

---

## Dashboard Endpoints

### Get Dashboard Statistics

**Endpoint**: `GET /dashboard/stats`

**Response**:
```json
{
  "success": true,
  "data": {
    "totalEmployees": 25,
    "todayAttendance": {
      "present": 20,
      "absent": 3,
      "notMarked": 2
    },
    "departments": [
      {
        "name": "Engineering",
        "count": 10
      },
      {
        "name": "Marketing",
        "count": 8
      },
      {
        "name": "Sales",
        "count": 7
      }
    ]
  }
}
```

**cURL**:
```bash
curl http://localhost:5000/api/dashboard/stats
```

---

## Error Handling

All endpoints follow consistent error handling:

### HTTP Status Codes

- `200 OK` - Successful GET, DELETE, or UPDATE
- `201 Created` - Successful POST (resource created)
- `400 Bad Request` - Validation error
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate resource (e.g., Employee ID)
- `500 Internal Server Error` - Server error

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": []  // Optional, for validation errors
}
```

---

## Testing with Postman

Import these endpoints into Postman:

1. Create a new collection: "HRMS Lite API"
2. Set collection variable: `baseUrl` = `http://localhost:5000/api`
3. Add requests for each endpoint
4. Use `{{baseUrl}}/employees` format

---

## Rate Limiting

Currently, there are no rate limits on the API. In production, consider implementing:
- Per-IP rate limiting
- Per-endpoint rate limiting
- Authentication-based limits

---

## CORS Configuration

The API accepts requests from:
- `http://localhost:3000` (development)
- Your production frontend URL

Cross-origin requests are allowed with credentials.

---

## Best Practices

1. **Always validate input** on the client side before making requests
2. **Handle errors gracefully** in your frontend application
3. **Use appropriate HTTP methods**: GET for reading, POST for creating, DELETE for deleting
4. **Check response status** before processing data
5. **Implement loading states** while waiting for API responses

---

## Support

For issues or questions about the API:
1. Check this documentation first
2. Review the backend code in `/backend/routes`
3. Check server logs for errors
4. Refer to main README.md

---

**Last Updated**: February 2024
