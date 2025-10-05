# Test Pet Owner Registration with Pets
Write-Host "Testing Pet Owner Registration with Pets..." -ForegroundColor Green

$body = @'
{
  "username": "testpetowner999",
  "firstName": "Test",
  "lastName": "PetOwner",
  "email": "testpetowner999@example.com",
  "password": "password123",
  "phoneNumber": "1234567890",
  "address": "123 Pet Street, Pet City, PC 12345",
  "city": "Pet City",
  "state": "Pet State",
  "country": "India",
  "postalCode": "12345",
  "pets": [
    {
      "name": "Buddy",
      "species": "Dog",
      "breed": "Golden Retriever",
      "gender": "male",
      "birthday": "2020-03-15",
      "age": 4,
      "ageUnit": "Years",
      "weight": 25.5,
      "weightUnit": "Kgs",
      "microchip": "CHIP123456",
      "sterilized": "yes",
      "photoUrl": null
    },
    {
      "name": "Whiskers",
      "species": "Cat",
      "breed": "Persian",
      "gender": "female",
      "birthday": "2021-07-22",
      "age": 3,
      "ageUnit": "Years",
      "weight": 4.2,
      "weightUnit": "Kgs",
      "microchip": "CHIP789012",
      "sterilized": "yes",
      "photoUrl": null
    }
  ]
}
'@

$headers = @{
    "Content-Type" = "application/json"
    "Origin" = "http://localhost:3000"
}

Write-Host "Sending request to: http://localhost:8080/api/register/pet-owner" -ForegroundColor Yellow
Write-Host "Request body:" -ForegroundColor Yellow
Write-Host $body

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/register/pet-owner" -Method POST -Body $body -Headers $headers
    Write-Host "✅ SUCCESS: Pet owner registration with pets worked!" -ForegroundColor Green
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Green
    Write-Host $response.Content
} catch {
    Write-Host "❌ ERROR: Registration failed" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Red
    }
}

Write-Host "`nNow checking if pets were created in database..." -ForegroundColor Cyan
