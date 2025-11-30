#!/bin/bash

echo "======================================"
echo "  E2E TESTING - COMPLETE APPLICATION"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASS=0
FAIL=0

# Helper function to check response
check_response() {
  local response=$1
  local expected_field=$2
  local test_name=$3

  if echo "$response" | grep -q "$expected_field"; then
    echo -e "${GREEN}✓${NC} $test_name"
    ((PASS++))
  else
    echo -e "${RED}✗${NC} $test_name"
    echo "   Response: $response"
    ((FAIL++))
  fi
}

# Helper to check HTTP code
check_http_code() {
  local code=$1
  local expected=$2
  local test_name=$3

  if [ "$code" = "$expected" ]; then
    echo -e "${GREEN}✓${NC} $test_name (HTTP $code)"
    ((PASS++))
  else
    echo -e "${RED}✗${NC} $test_name - Expected HTTP $expected, got $code"
    ((FAIL++))
  fi
}

echo -e "${YELLOW}=== 1. AUTH MODULE ===${NC}"
echo ""

# Test 1.1: Create Admin
echo "1.1 Creating admin user..."
ADMIN_CREATE=$(curl -s -X POST http://localhost:3000/api/test/create-admin \
  -H "Content-Type: application/json" \
  -d '{"email":"e2e_admin@test.com","password":"Admin@123","name":"E2E Admin"}')

if echo "$ADMIN_CREATE" | grep -q "id"; then
  check_response "$ADMIN_CREATE" "id" "Admin created"
elif echo "$ADMIN_CREATE" | grep -q "already exists"; then
  echo -e "${YELLOW}⚠${NC}  Admin already exists (using existing)"
else
  check_response "$ADMIN_CREATE" "id" "Admin creation"
fi

# Test 1.2: Admin Login
echo "1.2 Admin login..."
ADMIN_LOGIN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"e2e_admin@test.com","password":"Admin@123"}')

ADMIN_TOKEN=$(echo $ADMIN_LOGIN | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -n "$ADMIN_TOKEN" ]; then
  check_response "$ADMIN_LOGIN" "access_token" "Admin login successful"
else
  echo -e "${RED}✗${NC} Admin login failed - cannot continue"
  exit 1
fi

# Test 1.3: Admin /me endpoint
echo "1.3 Get admin profile..."
ADMIN_ME=$(curl -s -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $ADMIN_TOKEN")
check_response "$ADMIN_ME" "ADMIN" "Admin profile contains role"

# Test 1.4: Admin-only endpoint
echo "1.4 Access admin-only endpoint..."
ADMIN_ONLY=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X GET http://localhost:3000/api/auth/admin-only \
  -H "Authorization: Bearer $ADMIN_TOKEN")
HTTP_CODE=$(echo "$ADMIN_ONLY" | grep "HTTP_CODE" | cut -d: -f2)
check_http_code "$HTTP_CODE" "200" "Admin-only endpoint accessible"

echo ""
echo -e "${YELLOW}=== 2. SCHOOLS MODULE ===${NC}"
echo ""

# Test 2.1: Create School
echo "2.1 Creating school..."
SCHOOL=$(curl -s -X POST http://localhost:3000/api/schools \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"E2E Test School","address":"123 Test Street"}')

SCHOOL_ID=$(echo $SCHOOL | grep -o '"id":"[^"]*' | cut -d'"' -f4)
check_response "$SCHOOL" "E2E Test School" "School created"

# Test 2.2: List all schools
echo "2.2 List all schools..."
SCHOOLS_LIST=$(curl -s -X GET http://localhost:3000/api/schools \
  -H "Authorization: Bearer $ADMIN_TOKEN")
check_response "$SCHOOLS_LIST" "$SCHOOL_ID" "Schools list contains created school"

# Test 2.3: Get school by ID
echo "2.3 Get school by ID..."
SCHOOL_DETAIL=$(curl -s -X GET http://localhost:3000/api/schools/$SCHOOL_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN")
check_response "$SCHOOL_DETAIL" "E2E Test School" "School details retrieved"

# Test 2.4: Update school
echo "2.4 Update school..."
SCHOOL_UPDATE=$(curl -s -X PATCH http://localhost:3000/api/schools/$SCHOOL_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"E2E Updated School"}')
check_response "$SCHOOL_UPDATE" "E2E Updated School" "School updated"

echo ""
echo -e "${YELLOW}=== 3. DIRECTORS MODULE ===${NC}"
echo ""

# Test 3.1: Create Director
echo "3.1 Creating director..."
DIRECTOR=$(curl -s -X POST http://localhost:3000/api/directors \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"e2e_director@test.com\",\"password\":\"Director@123\",\"name\":\"E2E Director\",\"schoolId\":\"$SCHOOL_ID\"}")

DIRECTOR_ID=$(echo $DIRECTOR | grep -o '"id":"[^"]*' | cut -d'"' -f4)
check_response "$DIRECTOR" "e2e_director@test.com" "Director created"

# Test 3.2: Director Login
echo "3.2 Director login..."
DIRECTOR_LOGIN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"e2e_director@test.com","password":"Director@123"}')

DIRECTOR_TOKEN=$(echo $DIRECTOR_LOGIN | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
check_response "$DIRECTOR_LOGIN" "DIRECTOR" "Director login successful"
check_response "$DIRECTOR_LOGIN" "$SCHOOL_ID" "Director JWT contains schoolId"

# Test 3.3: List directors
echo "3.3 List all directors..."
DIRECTORS_LIST=$(curl -s -X GET http://localhost:3000/api/directors \
  -H "Authorization: Bearer $ADMIN_TOKEN")
check_response "$DIRECTORS_LIST" "$DIRECTOR_ID" "Directors list contains created director"

# Test 3.4: Get director by ID
echo "3.4 Get director by ID..."
DIRECTOR_DETAIL=$(curl -s -X GET http://localhost:3000/api/directors/$DIRECTOR_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN")
check_response "$DIRECTOR_DETAIL" "E2E Director" "Director details retrieved"

# Test 3.5: Update director
echo "3.5 Update director..."
DIRECTOR_UPDATE=$(curl -s -X PATCH http://localhost:3000/api/directors/$DIRECTOR_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"E2E Updated Director"}')
check_response "$DIRECTOR_UPDATE" "E2E Updated Director" "Director updated"

echo ""
echo -e "${YELLOW}=== 4. TEACHERS MODULE ===${NC}"
echo ""

# Test 4.1: Director creates teacher (auto-assign school)
echo "4.1 Director creates teacher..."
TEACHER=$(curl -s -X POST http://localhost:3000/api/teachers \
  -H "Authorization: Bearer $DIRECTOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"e2e_teacher@test.com","password":"Teacher@123","name":"E2E Teacher"}')

TEACHER_ID=$(echo $TEACHER | grep -o '"id":"[^"]*' | cut -d'"' -f4)
check_response "$TEACHER" "e2e_teacher@test.com" "Teacher created by director"

# Test 4.2: Director lists their teachers
echo "4.2 Director lists teachers..."
TEACHERS_LIST=$(curl -s -X GET http://localhost:3000/api/teachers \
  -H "Authorization: Bearer $DIRECTOR_TOKEN")
check_response "$TEACHERS_LIST" "$TEACHER_ID" "Director sees their teacher"

# Test 4.3: Teacher login
echo "4.3 Teacher login..."
TEACHER_LOGIN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"e2e_teacher@test.com","password":"Teacher@123"}')

TEACHER_TOKEN=$(echo $TEACHER_LOGIN | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
check_response "$TEACHER_LOGIN" "TEACHER" "Teacher login successful"
check_response "$TEACHER_LOGIN" "$SCHOOL_ID" "Teacher JWT contains schoolId"

# Test 4.4: Teacher cannot access /teachers endpoint
echo "4.4 Teacher denied access to /teachers..."
TEACHER_FORBIDDEN=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X GET http://localhost:3000/api/teachers \
  -H "Authorization: Bearer $TEACHER_TOKEN")
HTTP_CODE=$(echo "$TEACHER_FORBIDDEN" | grep "HTTP_CODE" | cut -d: -f2)
check_http_code "$HTTP_CODE" "403" "Teacher denied access (403)"

# Test 4.5: Update teacher
echo "4.5 Update teacher..."
TEACHER_UPDATE=$(curl -s -X PATCH http://localhost:3000/api/teachers/$TEACHER_ID \
  -H "Authorization: Bearer $DIRECTOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"E2E Updated Teacher"}')
check_response "$TEACHER_UPDATE" "E2E Updated Teacher" "Teacher updated"

# Test 4.6: Get teacher by ID
echo "4.6 Get teacher by ID..."
TEACHER_DETAIL=$(curl -s -X GET http://localhost:3000/api/teachers/$TEACHER_ID \
  -H "Authorization: Bearer $DIRECTOR_TOKEN")
check_response "$TEACHER_DETAIL" "E2E Updated Teacher" "Teacher details retrieved"

echo ""
echo -e "${YELLOW}=== 5. EVENTS MODULE ===${NC}"
echo ""

# Test 5.1: Admin creates event with questions
echo "5.1 Creating event with questions..."
EVENT=$(curl -s -X POST http://localhost:3000/api/events \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"E2E Test Event",
    "description":"End-to-end testing event",
    "isActive":true,
    "questions":[
      {"text":"How satisfied are you?","type":"FREE_TEXT","order":1},
      {"text":"Would you recommend?","type":"MULTIPLE_CHOICE","order":2},
      {"text":"Rate the service","type":"FREE_TEXT","order":3}
    ]
  }')

EVENT_ID=$(echo $EVENT | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
check_response "$EVENT" "E2E Test Event" "Event created with questions"

# Test 5.2: List all events
echo "5.2 List all events..."
EVENTS_LIST=$(curl -s -X GET http://localhost:3000/api/events \
  -H "Authorization: Bearer $ADMIN_TOKEN")
check_response "$EVENTS_LIST" "$EVENT_ID" "Events list contains created event"

# Test 5.3: Get event with questions
echo "5.3 Get event with questions..."
EVENT_DETAIL=$(curl -s -X GET http://localhost:3000/api/events/$EVENT_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN")
check_response "$EVENT_DETAIL" "How satisfied are you?" "Event details include questions"
check_response "$EVENT_DETAIL" "Would you recommend?" "All questions present"

# Test 5.4: Update event
echo "5.4 Update event..."
EVENT_UPDATE=$(curl -s -X PATCH http://localhost:3000/api/events/$EVENT_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"E2E Updated Event","isActive":false}')
check_response "$EVENT_UPDATE" "E2E Updated Event" "Event updated"

# Test 5.5: Teacher can view events
echo "5.5 Teacher views events..."
TEACHER_EVENTS=$(curl -s -X GET http://localhost:3000/api/events \
  -H "Authorization: Bearer $TEACHER_TOKEN")
check_response "$TEACHER_EVENTS" "$EVENT_ID" "Teacher can view events"

# Test 5.6: Director can view events
echo "5.6 Director views events..."
DIRECTOR_EVENTS=$(curl -s -X GET http://localhost:3000/api/events \
  -H "Authorization: Bearer $DIRECTOR_TOKEN")
check_response "$DIRECTOR_EVENTS" "$EVENT_ID" "Director can view events"

echo ""
echo -e "${YELLOW}=== 6. ROLE-BASED ACCESS CONTROL ===${NC}"
echo ""

# Test 6.1: Teacher cannot create schools
echo "6.1 Teacher denied school creation..."
TEACHER_SCHOOL=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST http://localhost:3000/api/schools \
  -H "Authorization: Bearer $TEACHER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Unauthorized School"}')
HTTP_CODE=$(echo "$TEACHER_SCHOOL" | grep "HTTP_CODE" | cut -d: -f2)
check_http_code "$HTTP_CODE" "403" "Teacher cannot create schools"

# Test 6.2: Teacher cannot create directors
echo "6.2 Teacher denied director creation..."
TEACHER_DIRECTOR=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST http://localhost:3000/api/directors \
  -H "Authorization: Bearer $TEACHER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"fake@test.com\",\"password\":\"Pass@123\",\"name\":\"Fake\",\"schoolId\":\"$SCHOOL_ID\"}")
HTTP_CODE=$(echo "$TEACHER_DIRECTOR" | grep "HTTP_CODE" | cut -d: -f2)
check_http_code "$HTTP_CODE" "403" "Teacher cannot create directors"

# Test 6.3: Teacher cannot create events
echo "6.3 Teacher denied event creation..."
TEACHER_EVENT=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST http://localhost:3000/api/events \
  -H "Authorization: Bearer $TEACHER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Unauthorized Event","questions":[]}')
HTTP_CODE=$(echo "$TEACHER_EVENT" | grep "HTTP_CODE" | cut -d: -f2)
check_http_code "$HTTP_CODE" "403" "Teacher cannot create events"

# Test 6.4: Director cannot create schools
echo "6.4 Director denied school creation..."
DIRECTOR_SCHOOL=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST http://localhost:3000/api/schools \
  -H "Authorization: Bearer $DIRECTOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Unauthorized School"}')
HTTP_CODE=$(echo "$DIRECTOR_SCHOOL" | grep "HTTP_CODE" | cut -d: -f2)
check_http_code "$HTTP_CODE" "403" "Director cannot create schools"

# Test 6.5: Director cannot create events
echo "6.5 Director denied event creation..."
DIRECTOR_EVENT=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST http://localhost:3000/api/events \
  -H "Authorization: Bearer $DIRECTOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Unauthorized Event","questions":[]}')
HTTP_CODE=$(echo "$DIRECTOR_EVENT" | grep "HTTP_CODE" | cut -d: -f2)
check_http_code "$HTTP_CODE" "403" "Director cannot create events"

# Test 6.6: Unauthenticated access denied
echo "6.6 Unauthenticated access denied..."
UNAUTH=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X GET http://localhost:3000/api/schools)
HTTP_CODE=$(echo "$UNAUTH" | grep "HTTP_CODE" | cut -d: -f2)
check_http_code "$HTTP_CODE" "401" "Unauthenticated access denied"

echo ""
echo -e "${YELLOW}=== 7. DATA VALIDATION ===${NC}"
echo ""

# Test 7.1: Invalid email format
echo "7.1 Reject invalid email..."
INVALID_EMAIL=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST http://localhost:3000/api/teachers \
  -H "Authorization: Bearer $DIRECTOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"notanemail","password":"Pass@123","name":"Test"}')
HTTP_CODE=$(echo "$INVALID_EMAIL" | grep "HTTP_CODE" | cut -d: -f2)
check_http_code "$HTTP_CODE" "400" "Invalid email rejected"

# Test 7.2: Short password
echo "7.2 Reject short password..."
SHORT_PASS=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST http://localhost:3000/api/teachers \
  -H "Authorization: Bearer $DIRECTOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"short","name":"Test"}')
HTTP_CODE=$(echo "$SHORT_PASS" | grep "HTTP_CODE" | cut -d: -f2)
check_http_code "$HTTP_CODE" "400" "Short password rejected (min 8 chars)"

# Test 7.3: Duplicate email
echo "7.3 Reject duplicate email..."
DUPLICATE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST http://localhost:3000/api/teachers \
  -H "Authorization: Bearer $DIRECTOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"e2e_teacher@test.com","password":"Pass@1234","name":"Duplicate"}')
HTTP_CODE=$(echo "$DUPLICATE" | grep "HTTP_CODE" | cut -d: -f2)
check_http_code "$HTTP_CODE" "409" "Duplicate email rejected"

# Test 7.4: Short name
echo "7.4 Reject short name..."
SHORT_NAME=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST http://localhost:3000/api/teachers \
  -H "Authorization: Bearer $DIRECTOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"short@test.com","password":"Pass@123","name":"A"}')
HTTP_CODE=$(echo "$SHORT_NAME" | grep "HTTP_CODE" | cut -d: -f2)
check_http_code "$HTTP_CODE" "400" "Short name rejected (min 2 chars)"

echo ""
echo -e "${YELLOW}=== 8. CLEANUP TESTS (DELETE) ===${NC}"
echo ""

# Test 8.1: Delete teacher
echo "8.1 Delete teacher..."
DELETE_TEACHER=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X DELETE http://localhost:3000/api/teachers/$TEACHER_ID \
  -H "Authorization: Bearer $DIRECTOR_TOKEN")
HTTP_CODE=$(echo "$DELETE_TEACHER" | grep "HTTP_CODE" | cut -d: -f2)
check_http_code "$HTTP_CODE" "204" "Teacher deleted"

# Test 8.2: Verify teacher deleted
echo "8.2 Verify teacher deleted..."
CHECK_DELETED=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X GET http://localhost:3000/api/teachers/$TEACHER_ID \
  -H "Authorization: Bearer $DIRECTOR_TOKEN")
HTTP_CODE=$(echo "$CHECK_DELETED" | grep "HTTP_CODE" | cut -d: -f2)
check_http_code "$HTTP_CODE" "404" "Deleted teacher returns 404"

# Test 8.3: Delete event
echo "8.3 Delete event..."
DELETE_EVENT=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X DELETE http://localhost:3000/api/events/$EVENT_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN")
HTTP_CODE=$(echo "$DELETE_EVENT" | grep "HTTP_CODE" | cut -d: -f2)
check_http_code "$HTTP_CODE" "204" "Event deleted"

# Test 8.4: Delete director
echo "8.4 Delete director..."
DELETE_DIRECTOR=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X DELETE http://localhost:3000/api/directors/$DIRECTOR_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN")
HTTP_CODE=$(echo "$DELETE_DIRECTOR" | grep "HTTP_CODE" | cut -d: -f2)
check_http_code "$HTTP_CODE" "204" "Director deleted"

# Test 8.5: Delete school
echo "8.5 Delete school..."
DELETE_SCHOOL=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X DELETE http://localhost:3000/api/schools/$SCHOOL_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN")
HTTP_CODE=$(echo "$DELETE_SCHOOL" | grep "HTTP_CODE" | cut -d: -f2)
check_http_code "$HTTP_CODE" "204" "School deleted"

echo ""
echo "======================================"
echo -e "         ${GREEN}TEST RESULTS${NC}"
echo "======================================"
echo -e "${GREEN}Passed: $PASS${NC}"
echo -e "${RED}Failed: $FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
  echo -e "${GREEN}✓ ALL TESTS PASSED!${NC}"
  exit 0
else
  echo -e "${RED}✗ SOME TESTS FAILED${NC}"
  exit 1
fi
