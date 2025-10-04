#!/bin/bash

# Test script for Zoodo Registration Endpoints
# Make sure your Spring Boot application is running on localhost:8080

BASE_URL="http://localhost:8080/api/register"

echo "Testing Zoodo Registration Endpoints..."
echo "=========================================="

# Test username availability check
echo "1. Testing username availability check..."
curl -X POST "$BASE_URL/username-check?username=testuser123" \
     -H "Content-Type: application/json" \
     | jq .

echo -e "\n"

# Test email availability check
echo "2. Testing email availability check..."
curl -X POST "$BASE_URL/email-check?email=test@example.com" \
     -H "Content-Type: application/json" \
     | jq .

echo -e "\n"

# Test pet owner registration
echo "3. Testing pet owner registration..."
curl -X POST "$BASE_URL/pet-owner" \
     -H "Content-Type: application/json" \
     -d '{
         "username": "petowner123",
         "firstName": "John",
         "lastName": "Doe",
         "email": "john.doe@example.com",
         "password": "password123",
         "phoneNumber": "+1234567890",
         "address": "123 Main St",
         "city": "Anytown",
         "state": "CA",
         "country": "USA",
         "postalCode": "12345",
         "pets": [
             {
                 "name": "Buddy",
                 "species": "Dog",
                 "breed": "Golden Retriever",
                 "gender": "male",
                 "birthday": "2020-01-15",
                 "age": 4,
                 "ageUnit": "Years",
                 "weight": 25.5,
                 "weightUnit": "Kgs",
                 "microchip": "CHIP123456",
                 "sterilized": "yes"
             }
         ]
     }' \
     | jq .

echo -e "\n"

# Test veterinarian license availability check
echo "4. Testing license availability check..."
curl -X GET "$BASE_URL/license-check/VET123456" \
     -H "Content-Type: application/json" \
     | jq .

echo -e "\n"

# Test veterinarian registration (without files for now)
echo "5. Testing veterinarian registration JSON structure..."
cat > vet_registration.json << 'EOF'
{
    "username": "dr.john.smith",
    "firstName": "John",
    "lastName": "Smith", 
    "email": "dr.smith@example.com",
    "password": "password123",
    "phoneNumber": "+1234567890",
    "address": "456 Oak Ave",
    "licenseNumber": "VET789012",
    "experience": 5,
    "specialization": ["General Veterinary Practice", "Surgery"],
    "qualifications": ["BVSc & AH", "MVSc"],
    "isAffiliated": false,
    "offerOnlineConsultation": true,
    "offerHomeVisits": true,
    "homeVisitRadius": 20
}
EOF

echo "JSON structure created for veterinarian registration."
echo "To test with files, use:"
echo "curl -X POST $BASE_URL/veterinarian \\"
echo "     -F 'registrationData=@vet_registration.json' \\"
echo "     -F 'licenseProof=@license.pdf' \\"
echo "     -F 'idProof=@id.pdf' \\"
echo "     -F 'degreeProof=@degree.pdf' \\"
echo "     -F 'profilePhoto=@photo.jpg'"

echo -e "\n"

# Test trainer registration JSON structure  
echo "6. Testing trainer registration JSON structure..."
cat > trainer_registration.json << 'EOF'
{
    "username": "trainer.jane.doe",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "trainer.doe@example.com", 
    "password": "password123",
    "phoneNumber": "+1234567890",
    "address": "789 Pine St",
    "experience": 3,
    "specialization": ["Basic Obedience Training", "Behavioral Modification"],
    "certifications": ["Certified Professional Dog Trainer (CPDT)"],
    "offerOnlineTraining": true,
    "offerHomeTraining": true,
    "homeTrainingRadius": 15,
    "hasAcademy": false
}
EOF

echo "JSON structure created for trainer registration."
echo "To test with files, use:"
echo "curl -X POST $BASE_URL/trainer \\"
echo "     -F 'registrationData=@trainer_registration.json' \\"
echo "     -F 'resume=@resume.pdf' \\"
echo "     -F 'profilePhoto=@photo.jpg'"

echo -e "\n"
echo "Testing complete! Check server logs for any errors."
echo "Clean up test files..."
rm -f vet_registration.json trainer_registration.json

echo "Done!"



