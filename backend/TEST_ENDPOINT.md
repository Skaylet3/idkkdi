# Test Endpoint Documentation

## Create Admin Account

**Endpoint:** `POST /api/test/create-admin`

**Description:** Creates a new admin user account with hashed password.

### Request Body

```json
{
  "email": "admin@example.com",
  "password": "YourPassword123",
  "name": "Admin Name"
}
```

### Validation Rules

- `email`: Must be a valid email address (required)
- `password`: Minimum 8 characters (required)
- `name`: Non-empty string (required)

### Success Response (201)

```json
{
  "message": "Admin account created successfully",
  "admin": {
    "id": "uuid",
    "email": "admin@example.com",
    "name": "Admin Name",
    "role": "ADMIN",
    "createdAt": "2025-11-27T12:20:52.188Z"
  }
}
```

### Error Responses

**409 Conflict** - Email already exists:
```json
{
  "message": "User with this email already exists",
  "error": "Conflict",
  "statusCode": 409
}
```

**400 Bad Request** - Validation error:
```json
{
  "message": ["email must be an email", "password must be longer than or equal to 8 characters"],
  "error": "Bad Request",
  "statusCode": 400
}
```

### Example Usage with cURL

```bash
curl -X POST http://localhost:3000/api/test/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Admin@1234",
    "name": "Test Admin"
  }'
```

### Example Usage with Postman

1. Method: `POST`
2. URL: `http://localhost:3000/api/test/create-admin`
3. Headers:
   - `Content-Type`: `application/json`
4. Body (raw JSON):
   ```json
   {
     "email": "admin@test.com",
     "password": "Admin@1234",
     "name": "Test Admin"
   }
   ```

### Notes

- Password is automatically hashed using bcrypt (10 rounds) before storage
- The endpoint does not require authentication (it's for testing/setup purposes)
- Email uniqueness is enforced at the database level
- The role is automatically set to `ADMIN`
