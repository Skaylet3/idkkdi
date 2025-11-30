# Auth Endpoints Documentation

## Authentication System

Complete JWT-based authentication with role-based access control.

---

## Endpoints

### 1. Login

**POST** `/api/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "admin@test.com",
  "password": "Admin@1234"
}
```

**Success Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@test.com",
    "name": "Test Admin",
    "role": "ADMIN",
    "schoolId": null
  }
}
```

**Error Response (401):**
```json
{
  "message": "Invalid credentials",
  "error": "Unauthorized",
  "statusCode": 401
}
```

---

### 2. Get Current User

**GET** `/api/auth/me`

Get currently authenticated user information.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "message": "Authenticated successfully",
  "user": {
    "userId": "uuid",
    "email": "admin@test.com",
    "role": "ADMIN",
    "schoolId": null,
    "iat": 1764246790,
    "exp": 1764333190
  }
}
```

**Error Response (401):**
```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

---

### 3. Admin-Only Endpoint (Example)

**GET** `/api/auth/admin-only`

Test endpoint - only accessible by ADMIN role.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "message": "Admin access granted",
  "user": {
    "userId": "uuid",
    "email": "admin@test.com",
    "role": "ADMIN"
  }
}
```

**Error Response (403):**
```json
{
  "message": "Insufficient permissions",
  "error": "Forbidden",
  "statusCode": 403
}
```

---

## JWT Token Details

- **Algorithm:** HS256
- **Expiration:** 24 hours
- **Secret:** From `JWT_SECRET` env variable

**Payload Structure:**
```json
{
  "userId": "string",
  "email": "string",
  "role": "ADMIN" | "DIRECTOUR" | "TEACHER",
  "schoolId": "string | undefined",
  "iat": "number",
  "exp": "number"
}
```

---

## Using Protected Endpoints

### Step 1: Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com", "password": "Admin@1234"}'
```

### Step 2: Save the Token
Copy the `access_token` from response.

### Step 3: Use Token in Requests
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <your_access_token>"
```

---

## Guards & Decorators

### Available Guards
- `JwtAuthGuard` - Validates JWT token
- `RolesGuard` - Checks user role

### Usage Example
```typescript
@Get('protected')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'DIRECTOUR')
async protectedRoute(@CurrentUser() user: JwtPayload) {
  return { user };
}
```

### Decorators
- `@Roles(...roles)` - Define required roles
- `@CurrentUser()` - Get JWT payload from request

---

## Role Hierarchy

| Role | Access Level |
|------|-------------|
| ADMIN | Full system access |
| DIRECTOUR | School management |
| TEACHER | Limited to own data |

---

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (insufficient permissions) |
| 400 | Bad Request (validation failed) |
