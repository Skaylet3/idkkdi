#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

API_URL="http://localhost:3000/api"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  ANSWERS MODULE E2E TESTS${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Track stats
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

test_endpoint() {
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    local test_name="$1"
    local expected_code="$2"
    local actual_code="$3"

    if [ "$actual_code" -eq "$expected_code" ]; then
        echo -e "${GREEN}✓${NC} $test_name (HTTP $actual_code)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}✗${NC} $test_name (Expected: $expected_code, Got: $actual_code)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# ══════════════════════════════════════════════════════════════
# SETUP: Login and create test data
# ══════════════════════════════════════════════════════════════

echo -e "${YELLOW}[SETUP] Logging in as Admin...${NC}"
ADMIN_LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com", "password": "Admin@1234"}')
ADMIN_CODE=$(echo "$ADMIN_LOGIN_RESPONSE" | tail -n1)
ADMIN_TOKEN=$(echo "$ADMIN_LOGIN_RESPONSE" | sed '$d' | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$ADMIN_TOKEN" ]; then
    echo -e "${RED}✗ Failed to get admin token${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Admin logged in${NC}"

# Create school
echo -e "${YELLOW}[SETUP] Creating school...${NC}"
SCHOOL_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/schools" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Answer Test School", "address": "123 Test St"}')
SCHOOL_CODE=$(echo "$SCHOOL_RESPONSE" | tail -n1)
SCHOOL_ID=$(echo "$SCHOOL_RESPONSE" | sed '$d' | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
echo -e "${GREEN}✓ School created: $SCHOOL_ID${NC}"

# Create director
echo -e "${YELLOW}[SETUP] Creating director...${NC}"
DIRECTOR_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/directors" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"director.answers@test.com\", \"password\": \"Director@123\", \"name\": \"Answer Test Director\", \"schoolId\": \"$SCHOOL_ID\"}")
DIRECTOR_CODE=$(echo "$DIRECTOR_RESPONSE" | tail -n1)
echo -e "${GREEN}✓ Director created${NC}"

# Login as director
echo -e "${YELLOW}[SETUP] Logging in as Director...${NC}"
DIR_LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "director.answers@test.com", "password": "Director@123"}')
DIR_CODE=$(echo "$DIR_LOGIN_RESPONSE" | tail -n1)
DIR_TOKEN=$(echo "$DIR_LOGIN_RESPONSE" | sed '$d' | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
echo -e "${GREEN}✓ Director logged in${NC}"

# Create teacher 1
echo -e "${YELLOW}[SETUP] Creating teacher 1...${NC}"
TEACHER1_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/teachers" \
  -H "Authorization: Bearer $DIR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email": "teacher1.answers@test.com", "password": "Teacher@123", "name": "Test Teacher 1"}')
TEACHER1_CODE=$(echo "$TEACHER1_RESPONSE" | tail -n1)
TEACHER1_ID=$(echo "$TEACHER1_RESPONSE" | sed '$d' | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}✓ Teacher 1 created (ID: $TEACHER1_ID)${NC}"

# Create teacher 2
echo -e "${YELLOW}[SETUP] Creating teacher 2...${NC}"
TEACHER2_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/teachers" \
  -H "Authorization: Bearer $DIR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email": "teacher2.answers@test.com", "password": "Teacher@123", "name": "Test Teacher 2"}')
TEACHER2_CODE=$(echo "$TEACHER2_RESPONSE" | tail -n1)
TEACHER2_ID=$(echo "$TEACHER2_RESPONSE" | sed '$d' | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}✓ Teacher 2 created${NC}"

# Login as teacher 1
echo -e "${YELLOW}[SETUP] Logging in as Teacher 1...${NC}"
TEACHER1_LOGIN=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "teacher1.answers@test.com", "password": "Teacher@123"}')
T1_CODE=$(echo "$TEACHER1_LOGIN" | tail -n1)
TEACHER1_TOKEN=$(echo "$TEACHER1_LOGIN" | sed '$d' | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
echo -e "${GREEN}✓ Teacher 1 logged in${NC}"

# Login as teacher 2
echo -e "${YELLOW}[SETUP] Logging in as Teacher 2...${NC}"
TEACHER2_LOGIN=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "teacher2.answers@test.com", "password": "Teacher@123"}')
T2_CODE=$(echo "$TEACHER2_LOGIN" | tail -n1)
TEACHER2_TOKEN=$(echo "$TEACHER2_LOGIN" | sed '$d' | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
echo -e "${GREEN}✓ Teacher 2 logged in${NC}"

# Create event with questions
echo -e "${YELLOW}[SETUP] Creating event with questions...${NC}"
EVENT_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/events" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Answer Test Event",
    "description": "Event for testing answers",
    "isActive": true,
    "questions": [
      {"text": "How satisfied are you with the school facilities?", "type": "MULTIPLE_CHOICE", "order": 1},
      {"text": "What improvements would you suggest?", "type": "FREE_TEXT", "order": 2},
      {"text": "Do you recommend this school?", "type": "MULTIPLE_CHOICE", "order": 3}
    ]
  }')
EVENT_CODE=$(echo "$EVENT_RESPONSE" | tail -n1)
EVENT_ID=$(echo "$EVENT_RESPONSE" | sed '$d' | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}✓ Event created: $EVENT_ID${NC}"

# Get event with questions to extract question IDs
EVENT_DETAILS=$(curl -s -X GET "$API_URL/events/$EVENT_ID" \
  -H "Authorization: Bearer $TEACHER1_TOKEN")

Q1_ID=$(echo "$EVENT_DETAILS" | grep -o '"id":"[^"]*"' | sed -n '2p' | cut -d'"' -f4)
Q2_ID=$(echo "$EVENT_DETAILS" | grep -o '"id":"[^"]*"' | sed -n '3p' | cut -d'"' -f4)
Q3_ID=$(echo "$EVENT_DETAILS" | grep -o '"id":"[^"]*"' | sed -n '4p' | cut -d'"' -f4)

echo -e "${GREEN}✓ Question IDs extracted${NC}"
echo ""

# ══════════════════════════════════════════════════════════════
# CATEGORY 1: SUBMIT ANSWERS - HAPPY PATH
# ══════════════════════════════════════════════════════════════

echo -e "${BLUE}[1] Submit Answers - Happy Path${NC}"
echo ""

# Test 1.1: Teacher 1 submits valid bulk answers
SUBMIT1=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/answers/submit" \
  -H "Authorization: Bearer $TEACHER1_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"eventId\": \"$EVENT_ID\",
    \"answers\": [
      {\"questionId\": \"$Q1_ID\", \"selectedOption\": \"YES\"},
      {\"questionId\": \"$Q2_ID\", \"answerText\": \"Better library resources\"},
      {\"questionId\": \"$Q3_ID\", \"selectedOption\": \"YES\"}
    ]
  }")
CODE=$(echo "$SUBMIT1" | tail -n1)
test_endpoint "1.1 Teacher submits valid bulk answers" 201 "$CODE"

# Test 1.2: Teacher 2 submits valid bulk answers
SUBMIT2=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/answers/submit" \
  -H "Authorization: Bearer $TEACHER2_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"eventId\": \"$EVENT_ID\",
    \"answers\": [
      {\"questionId\": \"$Q1_ID\", \"selectedOption\": \"NO\"},
      {\"questionId\": \"$Q2_ID\", \"answerText\": \"More sports equipment\"},
      {\"questionId\": \"$Q3_ID\", \"selectedOption\": \"OPTION_50_50\"}
    ]
  }")
CODE=$(echo "$SUBMIT2" | tail -n1)
test_endpoint "1.2 Teacher 2 submits valid bulk answers" 201 "$CODE"

echo ""

# ══════════════════════════════════════════════════════════════
# CATEGORY 2: DUPLICATE PREVENTION
# ══════════════════════════════════════════════════════════════

echo -e "${BLUE}[2] Duplicate Submission Prevention${NC}"
echo ""

# Test 2.1: Teacher 1 tries to resubmit (should fail with 409)
RESUBMIT=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/answers/submit" \
  -H "Authorization: Bearer $TEACHER1_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"eventId\": \"$EVENT_ID\",
    \"answers\": [
      {\"questionId\": \"$Q1_ID\", \"selectedOption\": \"NO\"},
      {\"questionId\": \"$Q2_ID\", \"answerText\": \"Different answer\"},
      {\"questionId\": \"$Q3_ID\", \"selectedOption\": \"NO\"}
    ]
  }")
CODE=$(echo "$RESUBMIT" | tail -n1)
test_endpoint "2.1 Duplicate submission rejected" 409 "$CODE"

echo ""

# ══════════════════════════════════════════════════════════════
# CATEGORY 3: VALIDATION - INCOMPLETE ANSWERS
# ══════════════════════════════════════════════════════════════

echo -e "${BLUE}[3] Validation - Incomplete Answers${NC}"
echo ""

# Create a new event for validation tests
EVENT2_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/events" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Validation Test Event",
    "isActive": true,
    "questions": [
      {"text": "Q1", "type": "MULTIPLE_CHOICE", "order": 1},
      {"text": "Q2", "type": "FREE_TEXT", "order": 2}
    ]
  }')
EVENT2_ID=$(echo "$EVENT2_RESPONSE" | sed '$d' | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

EVENT2_DETAILS=$(curl -s -X GET "$API_URL/events/$EVENT2_ID" \
  -H "Authorization: Bearer $TEACHER1_TOKEN")
Q2_1_ID=$(echo "$EVENT2_DETAILS" | grep -o '"id":"[^"]*"' | sed -n '2p' | cut -d'"' -f4)
Q2_2_ID=$(echo "$EVENT2_DETAILS" | grep -o '"id":"[^"]*"' | sed -n '3p' | cut -d'"' -f4)

# Test 3.1: Submit with missing questions (only answer 1 of 2)
INCOMPLETE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/answers/submit" \
  -H "Authorization: Bearer $TEACHER1_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"eventId\": \"$EVENT2_ID\",
    \"answers\": [
      {\"questionId\": \"$Q2_1_ID\", \"selectedOption\": \"YES\"}
    ]
  }")
CODE=$(echo "$INCOMPLETE" | tail -n1)
test_endpoint "3.1 Missing questions rejected" 400 "$CODE"

# Test 3.2: Submit with invalid question ID
INVALID_Q=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/answers/submit" \
  -H "Authorization: Bearer $TEACHER1_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"eventId\": \"$EVENT2_ID\",
    \"answers\": [
      {\"questionId\": \"00000000-0000-0000-0000-000000000000\", \"selectedOption\": \"YES\"},
      {\"questionId\": \"$Q2_2_ID\", \"answerText\": \"Some text\"}
    ]
  }")
CODE=$(echo "$INVALID_Q" | tail -n1)
test_endpoint "3.2 Invalid question ID rejected" 400 "$CODE"

echo ""

# ══════════════════════════════════════════════════════════════
# CATEGORY 4: TEACHER HISTORY & ANSWERS
# ══════════════════════════════════════════════════════════════

echo -e "${BLUE}[4] Teacher History & Answers Retrieval${NC}"
echo ""

# Test 4.1: Teacher 1 views their history
HISTORY1=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/answers/my-history" \
  -H "Authorization: Bearer $TEACHER1_TOKEN")
CODE=$(echo "$HISTORY1" | tail -n1)
test_endpoint "4.1 Teacher views answer history" 200 "$CODE"

# Test 4.2: Teacher 1 views answers for specific event
MY_ANSWERS=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/answers/my-answers/$EVENT_ID" \
  -H "Authorization: Bearer $TEACHER1_TOKEN")
CODE=$(echo "$MY_ANSWERS" | tail -n1)
test_endpoint "4.2 Teacher views answers for specific event" 200 "$CODE"

# Test 4.3: Teacher 2 views their history (should have answers)
HISTORY2=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/answers/my-history" \
  -H "Authorization: Bearer $TEACHER2_TOKEN")
CODE=$(echo "$HISTORY2" | tail -n1)
test_endpoint "4.3 Teacher 2 views their history" 200 "$CODE"

echo ""

# ══════════════════════════════════════════════════════════════
# CATEGORY 5: DIRECTOR VIEWS SCHOOL RESULTS
# ══════════════════════════════════════════════════════════════

echo -e "${BLUE}[5] Director Views School Results${NC}"
echo ""

# Test 5.1: Director views their school's results for the event
SCHOOL_RESULTS=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/answers/school-results/$EVENT_ID" \
  -H "Authorization: Bearer $DIR_TOKEN")
CODE=$(echo "$SCHOOL_RESULTS" | tail -n1)
test_endpoint "5.1 Director views school results for event" 200 "$CODE"

# Test 5.2: Teacher tries to view school results (should fail with 403)
FORBIDDEN=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/answers/school-results/$EVENT_ID" \
  -H "Authorization: Bearer $TEACHER1_TOKEN")
CODE=$(echo "$FORBIDDEN" | tail -n1)
test_endpoint "5.2 Teacher forbidden from viewing school results" 403 "$CODE"

# Test 5.3: Director views specific teacher's complete history
TEACHER_HISTORY=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/answers/teacher-history/$TEACHER1_ID" \
  -H "Authorization: Bearer $DIR_TOKEN")
CODE=$(echo "$TEACHER_HISTORY" | tail -n1)
test_endpoint "5.3 Director views teacher's complete history" 200 "$CODE"

# Test 5.4: Director tries to view teacher from another school (should fail with 403)
# First create another school and teacher to test cross-school access
OTHER_SCHOOL_RESPONSE=$(curl -s -X POST "$API_URL/schools" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Other School", "address": "Other Address"}')
OTHER_SCHOOL_ID=$(echo "$OTHER_SCHOOL_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

OTHER_DIR_RESPONSE=$(curl -s -X POST "$API_URL/directors" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"other_director@test.com\",\"password\":\"Director@123\",\"name\":\"Other Director\",\"schoolId\":\"$OTHER_SCHOOL_ID\"}")
OTHER_DIR_ID=$(echo "$OTHER_DIR_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

OTHER_DIR_LOGIN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"other_director@test.com","password":"Director@123"}')
OTHER_DIR_TOKEN=$(echo "$OTHER_DIR_LOGIN" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

# Try to access teacher1 from the other director (should fail with 403)
CROSS_SCHOOL=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/answers/teacher-history/$TEACHER1_ID" \
  -H "Authorization: Bearer $OTHER_DIR_TOKEN")
CODE=$(echo "$CROSS_SCHOOL" | tail -n1)
test_endpoint "5.4 Director forbidden from viewing other school's teachers" 403 "$CODE"

echo ""

# ══════════════════════════════════════════════════════════════
# CATEGORY 6: AUTHORIZATION TESTS
# ══════════════════════════════════════════════════════════════

echo -e "${BLUE}[6] Authorization Tests${NC}"
echo ""

# Test 6.1: Submit without token
NO_TOKEN=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/answers/submit" \
  -H "Content-Type: application/json" \
  -d "{\"eventId\": \"$EVENT2_ID\", \"answers\": []}")
CODE=$(echo "$NO_TOKEN" | tail -n1)
test_endpoint "6.1 Submit without token rejected" 401 "$CODE"

# Test 6.2: Admin tries to submit answers (not a teacher)
ADMIN_SUBMIT=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/answers/submit" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"eventId\": \"$EVENT2_ID\", \"answers\": []}")
CODE=$(echo "$ADMIN_SUBMIT" | tail -n1)
test_endpoint "6.2 Admin cannot submit answers (wrong role)" 403 "$CODE"

# Test 6.3: Director tries to submit answers (not a teacher)
DIR_SUBMIT=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/answers/submit" \
  -H "Authorization: Bearer $DIR_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"eventId\": \"$EVENT2_ID\", \"answers\": []}")
CODE=$(echo "$DIR_SUBMIT" | tail -n1)
test_endpoint "6.3 Director cannot submit answers (wrong role)" 403 "$CODE"

echo ""

# ══════════════════════════════════════════════════════════════
# SUMMARY
# ══════════════════════════════════════════════════════════════

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  TEST SUMMARY${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "Total Tests:  ${TOTAL_TESTS}"
echo -e "${GREEN}Passed:       ${PASSED_TESTS}${NC}"
echo -e "${RED}Failed:       ${FAILED_TESTS}${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}  ✓ ALL TESTS PASSED!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit 0
else
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}  ✗ SOME TESTS FAILED${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit 1
fi
