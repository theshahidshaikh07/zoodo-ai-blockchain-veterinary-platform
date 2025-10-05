# Separate Registration Tables Implementation Guide

## Overview

This implementation creates separate database tables for each registration form type, capturing ALL data from start to end of the frontend registration process. This approach provides better data organization, easier management, and clearer separation of concerns.

## Database Tables Created

### 1. Pet Owner Registration Table (`pet_owner_registrations`)

**Captures all data from the 3-step pet owner registration form:**

- **Step 1 (Required)**: Basic info (username, firstName, lastName, email, passwordHash)
- **Step 2 (Optional)**: Address (addressLine1, addressLine2, city, state, postalCode, country)
- **Step 3 (Optional)**: Pet info stored as JSONB array (name, gender, species, breed, birthday, age, ageUnit, weight, weightUnit, microchip, sterilized)

**Key Features:**
- Stores pets data as JSONB for flexibility
- Registration status tracking (pending, completed, verified, rejected)
- Links to main users table when approved

### 2. Veterinarian Registration Table (`veterinarian_registrations`)

**Captures all data from the 5-step veterinarian registration form:**

- **Step 1 (Required)**: Personal info (username, firstName, lastName, email, passwordHash, phoneNumber, address)
- **Step 2 (Required)**: Professional details (licenseNumber, experience, specializations[], qualifications[], isAffiliated, affiliatedDetails)
- **Step 3 (Required)**: Document uploads (licenseProofUrl, idProofUrl, degreeProofUrl, profilePhotoUrl)
- **Step 4 (Required)**: Services (offerOnlineConsultation, offerHomeConsultation, homeServiceAddress, homeVisitRadius)
- **Step 5 (Required)**: Availability schedule stored as JSONB

**Key Features:**
- Separate tables for specializations and qualifications
- Comprehensive service and availability tracking
- Document URL storage for verification
- Registration status with verification notes

### 3. Trainer Registration Table (`trainer_registrations`)

**Captures all data from the 4-step trainer registration form:**

- **Step 1 (Required)**: Personal info (username, firstName, lastName, email, passwordHash, phoneNumber, address)
- **Step 2 (Required)**: Professional details (experience, specializations[], certifications[], resumeUrl, profilePhotoUrl)
- **Step 3 (Required)**: Services (offerOnlineTraining, academyDetails: hasAcademy, name, street, city, state, postalCode, country, phone)
- **Step 4 (Required)**: Availability schedule stored as JSONB

**Key Features:**
- Separate tables for specializations and certifications
- Academy details with complete address information
- Document URL storage
- Registration status tracking

### 4. Hospital/Clinic Registration Table (`hospital_clinic_registrations`)

**Captures all data from the 4-step hospital/clinic registration form:**

- **Step 1 (Required)**: Business info (accountType: hospital/clinic, businessName)
- **Step 2 (Required)**: Contact & Address (contactPerson, email, phoneNumber, address, city, state, country, postalCode)
- **Step 3 (Required)**: Compliance & Services (facilityLicenseNumber, govtRegistrationNumber, taxId, medicalDirectorName, medicalDirectorLicenseNumber, facilityLicenseDocumentUrl, username, passwordHash, businessServices, businessHours)
- **Step 4 (Required)**: Review & Submit

**Key Features:**
- Business hours stored as JSONB
- Complete compliance tracking
- Medical director information
- Registration status with verification notes

## Java Models Created

### 1. PetOwnerRegistration.java
- Complete model with all pet owner registration fields
- RegistrationStatus enum (PENDING, COMPLETED, VERIFIED, REJECTED)
- JSONB handling for pets data

### 2. VeterinarianRegistration.java
- Complete model with all veterinarian registration fields
- RegistrationStatus enum (PENDING, UNDER_REVIEW, APPROVED, REJECTED)
- Separate collections for specializations and qualifications

### 3. TrainerRegistration.java
- Complete model with all trainer registration fields
- RegistrationStatus enum (PENDING, UNDER_REVIEW, APPROVED, REJECTED)
- Academy details with complete address structure

### 4. HospitalClinicRegistration.java
- Complete model with all hospital/clinic registration fields
- AccountType enum (HOSPITAL, CLINIC)
- RegistrationStatus enum (PENDING, UNDER_REVIEW, APPROVED, REJECTED)

## Repository Interfaces Created

### 1. PetOwnerRegistrationRepository.java
- Standard CRUD operations
- Find by email, username, status
- Existence checks excluding specific IDs
- Location-based queries (city, country)

### 2. VeterinarianRegistrationRepository.java
- Standard CRUD operations
- Find by email, username, license number, status
- Specialization and qualification queries
- Service-based queries (online consultation, home visits)

### 3. TrainerRegistrationRepository.java
- Standard CRUD operations
- Find by email, username, status
- Specialization and certification queries
- Academy-based queries (name, city, state, country)

### 4. HospitalClinicRegistrationRepository.java
- Standard CRUD operations
- Find by email, username, license numbers, tax ID, status
- Business information queries
- Compliance tracking queries

## Service Classes Created

### 1. PetOwnerRegistrationService.java
- Complete registration management
- Approval process that creates user accounts
- Rejection with reason tracking
- Update operations with validation

## Controller Classes Created

### 1. PetOwnerRegistrationController.java
- RESTful API endpoints for pet owner registrations
- CRUD operations
- Approval/rejection endpoints
- Status-based queries
- Location-based queries

## Key Benefits of This Approach

### 1. **Complete Data Capture**
- Every field from every step of each registration form is captured
- No data loss during the registration process
- JSONB storage for complex nested data (pets, availability schedules, business hours)

### 2. **Better Organization**
- Separate tables for each registration type
- Clear separation of concerns
- Easier to maintain and extend

### 3. **Flexible Data Storage**
- JSONB for complex data structures
- Separate collection tables for arrays
- Support for optional fields

### 4. **Registration Workflow Management**
- Status tracking throughout the process
- Approval/rejection workflow
- Verification notes and comments

### 5. **Data Integrity**
- Unique constraints on email and username
- Foreign key relationships to main users table
- Proper validation and error handling

## Database Schema Features

### Indexes for Performance
- Email and username indexes on all tables
- Status-based indexes
- License number indexes for verification
- Location-based indexes

### Triggers
- Automatic updated_at timestamp updates
- Consistent with existing schema

### Sample Data
- Test data for all registration types
- Realistic examples for development and testing

## API Endpoints Structure

### Pet Owner Registration Endpoints
```
POST   /api/registrations/pet-owner              # Create registration
PUT    /api/registrations/pet-owner/{id}         # Update registration
GET    /api/registrations/pet-owner/{id}         # Get by ID
GET    /api/registrations/pet-owner/email/{email} # Get by email
GET    /api/registrations/pet-owner/username/{username} # Get by username
GET    /api/registrations/pet-owner/status/{status} # Get by status
GET    /api/registrations/pet-owner/active       # Get active registrations
POST   /api/registrations/pet-owner/{id}/approve # Approve registration
POST   /api/registrations/pet-owner/{id}/reject  # Reject registration
DELETE /api/registrations/pet-owner/{id}         # Delete registration
GET    /api/registrations/pet-owner/city/{city}  # Get by city
GET    /api/registrations/pet-owner/country/{country} # Get by country
```

## Next Steps

### 1. Complete Service Classes
- Create VeterinarianRegistrationService
- Create TrainerRegistrationService  
- Create HospitalClinicRegistrationService

### 2. Complete Controller Classes
- Create VeterinarianRegistrationController
- Create TrainerRegistrationController
- Create HospitalClinicRegistrationController

### 3. Frontend Integration
- Update frontend to use new registration endpoints
- Handle the new data structure
- Implement proper error handling

### 4. Admin Dashboard Integration
- Create admin interfaces for managing registrations
- Approval/rejection workflows
- Registration status tracking

### 5. Testing
- Unit tests for all services
- Integration tests for all endpoints
- End-to-end testing of registration flows

## Migration Strategy

### 1. Database Migration
- Run the separate_registration_tables.sql script
- This creates new tables without affecting existing data

### 2. Backend Deployment
- Deploy new models, repositories, services, and controllers
- New endpoints will be available alongside existing ones

### 3. Frontend Updates
- Update registration forms to use new endpoints
- Maintain backward compatibility during transition

### 4. Data Migration (Optional)
- If needed, migrate existing registration data to new tables
- This can be done gradually or all at once

## Conclusion

This implementation provides a robust, scalable, and maintainable solution for handling different types of user registrations. Each registration type has its own dedicated table that captures all the data from the frontend forms, making it easy to manage, query, and extend the system as needed.

The separation of concerns allows for:
- Independent development and testing of each registration type
- Easier maintenance and debugging
- Better performance through targeted queries
- Clearer data relationships and constraints
- Flexible approval workflows for each user type
