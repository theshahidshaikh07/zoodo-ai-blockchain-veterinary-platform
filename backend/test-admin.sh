#!/bin/bash

# Test script for Zoodo Admin Endpoints
# Make sure your Spring Boot application is running on localhost:8080

BASE_URL="http://localhost:8080/api/admin"

echo "Testing Zoodo Admin Endpoints..."
echo "=========================================="

# Test admin login
echo "1. Testing admin login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "admin",
    "password": "admin"
  }')

if echo "$LOGIN_RESPONSE" | jq -e '.success' > /dev/null; then
  TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token')
  echo "Admin login successful! Token: ${TOKEN:0:20}..."
else
  echo "Admin login failed:"
  echo "$LOGIN_RESPONSE" | jq .
  exit 1
fi

echo -e "\n"

# Set up headers with token
HEADERS=(-H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json")

# Test get system stats
echo "2. Testing system stats..."
curl -s -X GET "$BASE_URL/stats" "${HEADERS[@]}" | jq .

echo -e "\n"

# Test get all users
echo "3. Testing get all users..."
USERS_RESPONSE=$(curl -s -X GET "$BASE_URL/users?page=0&size=10" "${HEADERS[@]}")
TOTAL_USERS=$(echo "$USERS_RESPONSE" | jq -r '.data.totalElements')
echo "Total users: $TOTAL_USERS"

echo "Users on this page:"
echo "$USERS_RESPONSE" | jq -r '.data.content[] | "  - \(.firstName) \(.lastName) (\(.userType)) - \(.status)"'

echo -e "\n"

# Test get users with filters
echo "4. Testing get users with filters..."
FILTERED_RESPONSE=$(curl -s -X GET "$BASE_URL/users?userType=veterinarian&status=active" "${HEADERS[@]}")
FILTERED_COUNT=$(echo "$FILTERED_RESPONSE" | jq -r '.data.totalElements')
echo "Filtered veterinarians: $FILTERED_COUNT"

echo -e "\n"

# Test search users
echo "5. Testing search users..."
SEARCH_RESPONSE=$(curl -s -X GET "$BASE_URL/users?search=test" "${HEADERS[@]}")
SEARCH_COUNT=$(echo "$SEARCH_RESPONSE" | jq -r '.data.totalElements')
echo "Search results: $SEARCH_COUNT"

echo -e "\n"

# Test export users
echo "6. Testing export users..."
EXPORT_RESPONSE=$(curl -s -X GET "$BASE_URL/users/export" "${HEADERS[@]}")
EXPORT_COUNT=$(echo "$EXPORT_RESPONSE" | jq -r '.data | length')
echo "Exported users: $EXPORT_COUNT"

echo -e "\n"

echo "Admin testing complete!"
echo ""
echo "To test in browser:"
echo "1. Go to http://localhost:3000/admin-login"
echo "2. Login with admin/admin"
echo "3. View the admin dashboard with all users"

echo ""
echo "Done!"
