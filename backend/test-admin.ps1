# Test script for Zoodo Admin Endpoints
# Make sure your Spring Boot application is running on localhost:8080

$baseUrl = "http://localhost:8080/api/admin"

Write-Host "Testing Zoodo Admin Endpoints..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Test admin login
Write-Host "1. Testing admin login..." -ForegroundColor Yellow
try {
    $loginData = @{
        usernameOrEmail = "admin"
        password = "admin"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/login" -Method POST -Body $loginData -ContentType "application/json"
    $token = $loginResponse.data.token
    Write-Host "Admin login successful! Token: $($token.Substring(0, 20))..." -ForegroundColor Green
} catch {
    Write-Host "Admin login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Set up headers with token
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Test get system stats
Write-Host "2. Testing system stats..." -ForegroundColor Yellow
try {
    $statsResponse = Invoke-RestMethod -Uri "$baseUrl/stats" -Method GET -Headers $headers
    $statsResponse | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error getting system stats: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test get all users
Write-Host "3. Testing get all users..." -ForegroundColor Yellow
try {
    $usersResponse = Invoke-RestMethod -Uri "$baseUrl/users?page=0&size=10" -Method GET -Headers $headers
    Write-Host "Total users: $($usersResponse.data.totalElements)" -ForegroundColor Green
    Write-Host "Users on this page: $($usersResponse.data.content.Count)" -ForegroundColor Green
    $usersResponse.data.content | ForEach-Object {
        Write-Host "  - $($_.firstName) $($_.lastName) ($($_.userType)) - $($_.status)" -ForegroundColor Gray
    }
} catch {
    Write-Host "Error getting users: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test get users with filters
Write-Host "4. Testing get users with filters..." -ForegroundColor Yellow
try {
    $filteredResponse = Invoke-RestMethod -Uri "$baseUrl/users?userType=veterinarian&status=active" -Method GET -Headers $headers
    Write-Host "Filtered veterinarians: $($filteredResponse.data.totalElements)" -ForegroundColor Green
} catch {
    Write-Host "Error getting filtered users: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test search users
Write-Host "5. Testing search users..." -ForegroundColor Yellow
try {
    $searchResponse = Invoke-RestMethod -Uri "$baseUrl/users?search=test" -Method GET -Headers $headers
    Write-Host "Search results: $($searchResponse.data.totalElements)" -ForegroundColor Green
} catch {
    Write-Host "Error searching users: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test export users
Write-Host "6. Testing export users..." -ForegroundColor Yellow
try {
    $exportResponse = Invoke-RestMethod -Uri "$baseUrl/users/export" -Method GET -Headers $headers
    Write-Host "Exported users: $($exportResponse.data.Count)" -ForegroundColor Green
} catch {
    Write-Host "Error exporting users: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

Write-Host "Admin testing complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To test in browser:" -ForegroundColor Cyan
Write-Host "1. Go to http://localhost:3000/admin-login" -ForegroundColor Gray
Write-Host "2. Login with admin/admin" -ForegroundColor Gray
Write-Host "3. View the admin dashboard with all users" -ForegroundColor Gray

Write-Host ""
Write-Host "Done!" -ForegroundColor Green
