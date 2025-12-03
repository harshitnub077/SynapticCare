# API Documentation - SynapticCare+

## Base URL
- **Development**: `http://localhost:5050/api/v1`
- **Production**: `https://your-domain.com/api/v1`

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Auth Endpoints

### POST /auth/signup
Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clx1234567890",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### POST /auth/login
Login to existing account.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clx1234567890",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

## Report Endpoints

### POST /reports
Upload a medical report (PDF or image).

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request Body (FormData):**
- `file`: PDF or image file (max 10MB)

**Response (201):**
```json
{
  "message": "Report uploaded successfully",
  "report": {
    "id": "clx9876543210",
    "filename": "blood_test.pdf",
    "status": "processing",
    "uploadedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### GET /reports
Get all reports for the authenticated user.

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `flagged` (optional): Filter flagged reports (true/false)

**Response (200):**
```json
{
  "reports": [
    {
      "id": "clx9876543210",
      "filename": "blood_test.pdf",
      "uploadedAt": "2024-01-15T10:30:00.000Z",
      "status": "done",
      "flags": {
        "abnormalities": [
          {
            "test": "hemoglobin",
            "value": 11.5,
            "unit": "g/dL",
            "status": "low",
            "normalRange": "12.0-15.5",
            "message": "hemoglobin is below normal range"
          }
        ]
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### GET /reports/:id
Get a specific report by ID.

**Headers:**
- `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "report": {
    "id": "clx9876543210",
    "filename": "blood_test.pdf",
    "uploadedAt": "2024-01-15T10:30:00.000Z",
    "status": "done",
    "extractedText": "Full extracted text from the report...",
    "parsedData": [
      {
        "test": "hemoglobin",
        "value": 11.5,
        "unit": "g/dL",
        "rawLine": "Hemoglobin: 11.5 g/dL"
      }
    ],
    "flags": {
      "abnormalities": [...],
      "aiInsights": {
        "summary": "Your hemoglobin levels are slightly below normal...",
        "concerns": ["Low hemoglobin may indicate anemia"],
        "recommendations": [
          "Increase iron-rich foods in diet",
          "Consider iron supplements",
          "Follow up with physician"
        ],
        "urgency": "medium",
        "disclaimer": "This is not medical advice. Please consult a healthcare professional."
      }
    }
  }
}
```

### DELETE /reports/:id
Delete a report.

**Headers:**
- `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Report deleted successfully"
}
```

---

## AI Assistant Endpoints

### POST /assistant/chat
Send a message to the AI health assistant.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "message": "What does my latest blood test mean?",
  "reportId": "clx9876543210"  // optional
}
```

**Response (200):**
```json
{
  "message": "Based on your blood test, your hemoglobin levels are slightly low at 11.5 g/dL. This could indicate mild anemia. I recommend increasing iron-rich foods like spinach, red meat, and lentils in your diet. Please consult your doctor for a proper diagnosis and treatment plan."
}
```

### GET /assistant/history
Get chat history.

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `limit` (optional): Number of messages (default: 50)

**Response (200):**
```json
{
  "messages": [
    {
      "id": "clx1111111111",
      "role": "user",
      "message": "What does my latest blood test mean?",
      "createdAt": "2024-01-15T11:00:00.000Z"
    },
    {
      "id": "clx2222222222",
      "role": "assistant",
      "message": "Based on your blood test...",
      "createdAt": "2024-01-15T11:00:05.000Z"
    }
  ]
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "message": "No token provided" 
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error",
  "error": "Error details"
}
```

---

## Rate Limiting
- **Auth endpoints**: 5 requests per minute
- **Other endpoints**: 100 requests per minute

## Notes
- All timestamps are in ISO 8601 format (UTC)
- File uploads limited to 10MB
- Supported file types: PDF, JPEG, PNG
- AI features require `OPENAI_API_KEY` configuration
