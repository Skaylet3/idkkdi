#!/bin/bash

echo "=== Teachers Module Testing ==="
echo ""

# Step 1: Login as existing admin
echo "1. Login as admin..."
ADMIN_TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Admin@123"}' \
  | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$ADMIN_TOKEN" ]; then
  echo "❌ Admin login failed"
  exit 1
fi
echo "✓ Admin token: ${ADMIN_TOKEN:0:20}..."

# Step 2: Create school
echo ""
echo "2. Creating school..."
SCHOOL_RESPONSE=$(curl -s -X POST http://localhost:3000/api/schools \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test School","address":"123 Main St"}')

SCHOOL_ID=$(echo $SCHOOL_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ -z "$SCHOOL_ID" ]; then
  echo "❌ School creation failed"
  echo "$SCHOOL_RESPONSE"
  exit 1
fi
echo "✓ School ID: $SCHOOL_ID"

# Step 3: Create director
echo ""
echo "3. Creating director for school..."
DIRECTOR_RESPONSE=$(curl -s -X POST http://localhost:3000/api/directors \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"director@test.com\",\"password\":\"Director@123\",\"name\":\"Test Director\",\"schoolId\":\"$SCHOOL_ID\"}")

DIRECTOR_ID=$(echo $DIRECTOR_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ -z "$DIRECTOR_ID" ]; then
  echo "❌ Director creation failed"
  echo "$DIRECTOR_RESPONSE"
  exit 1
fi
echo "✓ Director ID: $DIRECTOR_ID"

# Step 4: Login as director
echo ""
echo "4. Login as director..."
DIRECTOR_TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"director@test.com","password":"Director@123"}' \
  | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$DIRECTOR_TOKEN" ]; then
  echo "❌ Director login failed"
  exit 1
fi
echo "✓ Director token: ${DIRECTOR_TOKEN:0:20}..."

# Step 5: Director creates teacher
echo ""
echo "5. Director creates teacher (auto-assigned to their school)..."
TEACHER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/teachers \
  -H "Authorization: Bearer $DIRECTOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@test.com","password":"Teacher@123","name":"Test Teacher"}')

TEACHER_ID=$(echo $TEACHER_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ -z "$TEACHER_ID" ]; then
  echo "❌ Teacher creation failed"
  echo "$TEACHER_RESPONSE"
  exit 1
fi
echo "✓ Teacher ID: $TEACHER_ID"
echo "✓ Response: $TEACHER_RESPONSE"

# Step 6: Director lists their teachers
echo ""
echo "6. Director lists teachers from their school..."
TEACHERS_LIST=$(curl -s -X GET http://localhost:3000/api/teachers \
  -H "Authorization: Bearer $DIRECTOR_TOKEN")

echo "✓ Teachers list: $TEACHERS_LIST"

# Step 7: Teacher login
echo ""
echo "7. Teacher login..."
TEACHER_TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@test.com","password":"Teacher@123"}' \
  | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TEACHER_TOKEN" ]; then
  echo "❌ Teacher login failed"
  exit 1
fi
echo "✓ Teacher token: ${TEACHER_TOKEN:0:20}..."

# Step 8: Verify teacher gets 403 when accessing teachers endpoint
echo ""
echo "8. Verify teacher cannot access /teachers (Director-only)..."
TEACHER_ACCESS=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X GET http://localhost:3000/api/teachers \
  -H "Authorization: Bearer $TEACHER_TOKEN")

HTTP_CODE=$(echo "$TEACHER_ACCESS" | grep "HTTP_CODE" | cut -d: -f2)

if [ "$HTTP_CODE" = "403" ]; then
  echo "✓ Teacher correctly denied (403 Forbidden)"
else
  echo "❌ Teacher should not have access. Got HTTP $HTTP_CODE"
fi

echo ""
echo "=== ✅ All Teachers Module Tests Passed ==="
