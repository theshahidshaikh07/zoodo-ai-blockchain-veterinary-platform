# Test script for Zoodo Registration Endpoints
# Make sure your Spring Boot application is running on localhost:8080

$baseUrl = "http://localhost:8080/api/register"

Write-Host "Testing Zoodo Registration Endpoints..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Test username availability check
Write-Host "1. Testing username availability check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/username-check?username=testuser123" -Method POST -ContentType "application/json"
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test email availability check
Write-Host "2. Testing email availability check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/email-check?email=test@example.com" -Method POST -ContentType "application/json"
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test pet owner registration
Write-Host "3. Testing pet owner registration..." -ForegroundColor Yellow
$petOwnerData = @{
    username = "petowner123"
    firstName = "John"
    lastName = "Doe"
    email = "john.doe@example.com"
    password = "password123"
    phoneNumber = "+1234567890"
    address = "123 Main St"
    city = "Anytown"
    state = "CA"
    country = "USA"
    postalCode = "12345"
    pets = @(
        @{
            name = "Buddy"
            species = "Dog"
            breed = "Golden Retriever"
            gender = "male"
            birthday = "2020-01-15"
            age = 4
            ageUnit = "Years"
            weight = 25.5
            weightUnit = "Kgs"
            microchip = "CHIP123456"
            sterilized = "yes"
        }
    )
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/pet-owner" -Method POST -Body $petOwnerData -ContentType "application/json"
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test veterinarian license availability check
Write-Host "4. Testing license availability check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/license-check/VET123456" -Method GET
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

Write-Host "Testing complete! Check server logs for any errors." -ForegroundColor Green
Write-Host ""
Write-Host "To test veterinarian registration with files:" -ForegroundColor Cyan
Write-Host "Use Postman or curl with form-data multipart:" -ForegroundColor Gray
Write-Host "- registrationData: JSON string" -ForegroundColor Gray
Write-Host "- licenseProof: file upload" -ForegroundColor Gray
Write-Host "- idProof: file upload" -ForegroundColor Gray
Write-Host "- degreeProof: file upload" -ForegroundColor Gray
Write-Host "- profilePhoto: file upload" -ForegroundColor Gray

Write-Host ""
Write-Host "Done!" -ForegroundColor Green



