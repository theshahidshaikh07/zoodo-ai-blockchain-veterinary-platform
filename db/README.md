# Zoodo Database - Clean Schema Documentation

## Overview
This document describes the new clean database schema for the Zoodo Veterinary Platform. The schema is designed to match the frontend registration forms exactly and provide a clean, organized structure for all user types.

## Database Structure

### Core Tables

#### 1. `users` - Base User Information
Contains common fields for all user types:
- `id` (UUID, Primary Key)
- `username` (Unique)
- `email` (Unique)
- `password_hash`
- `first_name`, `last_name`
- `phone_number`
- `address`, `city`, `state`, `country`, `postal_code`
- `user_type` (pet_owner, veterinarian, trainer, hospital, clinic, admin)
- `is_verified`, `is_active`
- `created_at`, `updated_at`

#### 2. `pet_owners` - Pet Owner Specific Data
Simple table that references the base user:
- `id` (UUID, Primary Key)
- `user_id` (Foreign Key to users)
- `created_at`, `updated_at`

#### 3. `pets` - Pet Information
Stores all pet data collected from pet owner registration:
- `id` (UUID, Primary Key)
- `owner_id` (Foreign Key to users)
- `name`, `gender`, `species`, `breed`
- `birthday`, `age`, `age_unit`
- `weight`, `weight_unit`
- `microchip`, `sterilized`
- `photo_url`
- `created_at`, `updated_at`

#### 4. `veterinarians` - Veterinarian Professional Data
Contains all veterinarian-specific information:
- `id` (UUID, Primary Key)
- `user_id` (Foreign Key to users)
- `experience`, `license_number`
- `specializations[]`, `other_specialization`
- `qualifications[]`, `other_qualification`
- Document URLs: `license_proof_url`, `id_proof_url`, `degree_proof_url`, `profile_photo_url`
- Affiliation details: `is_affiliated`, `affiliated_facility_name`, `affiliation_type`, `other_facility_name`
- Independent services: `offer_home_consultation`, `offer_online_consultation`, service address fields, `home_visit_radius`
- `availability_schedule` (JSONB)

#### 5. `trainers` - Trainer Professional Data
Contains all trainer-specific information:
- `id` (UUID, Primary Key)
- `user_id` (Foreign Key to users)
- `experience`
- `specializations[]`, `other_specialization`
- `certifications[]`, `other_certification`
- Document URLs: `resume_url`, `profile_photo_url`
- Practice type: `practice_type` (JSONB)
- Independent services: `offer_home_training`, service address fields, `home_training_radius`
- Training center: `has_training_center`, `training_center_name`, `training_center_address`, center service options
- Affiliated details: `affiliated_facility_name`, `affiliation_type`
- Academy details: `has_academy`, academy address fields, `academy_phone`
- `availability_schedule` (JSONB)

#### 6. `hospitals` - Hospital/Clinic Business Data
Contains all hospital/clinic-specific information:
- `id` (UUID, Primary Key)
- `user_id` (Foreign Key to users)
- `account_type` (hospital or clinic)
- `business_name`, `contact_person`
- Business services: `offer_online_consultation`, `offer_clinic_hospital`
- Compliance: `facility_license_number`, `govt_registration_number`, `tax_id`
- Medical director: `medical_director_name`, `medical_director_license_number`
- `facility_license_document_url`
- `is_verified`, `is_active`
- `created_at`, `updated_at`

### Supporting Tables

#### 7. `appointments` - Appointment Management
- Links pets, owners, and service providers
- Tracks appointment details, status, and payment

#### 8. `medical_records` - Medical History
- Stores medical records for pets
- Links to appointments and providers

#### 9. `reviews` - Reviews and Ratings
- Allows users to review service providers
- Links to appointments for verification

## Key Features

### 1. Clean Separation
- Each user type has its own dedicated table
- Base user information is shared through the `users` table
- No complex inheritance or polymorphic relationships

### 2. Frontend Form Alignment
- Database fields match frontend form fields exactly
- Arrays are used for multi-select fields (specializations, certifications)
- JSONB is used for complex nested data (availability schedules, business hours)

### 3. Flexible Data Storage
- JSONB fields for complex data structures
- Array fields for multi-value selections
- Proper indexing for performance

### 4. Data Integrity
- Foreign key constraints ensure data consistency
- Check constraints validate enum values
- Unique constraints prevent duplicates

## Migration Instructions

### Option 1: Fresh Start (Recommended)
1. Drop your existing database
2. Create a new database
3. Run `clean_init.sql`

### Option 2: Migration
1. Backup your existing data
2. Run `migration_to_clean_schema.sql`
3. This will drop existing tables and create the new schema

## Usage Examples

### Pet Owner Registration
```sql
-- 1. Create base user
INSERT INTO users (username, email, password_hash, first_name, last_name, phone_number, user_type, address, city, state, country, postal_code)
VALUES ('john.doe', 'john@example.com', 'hashed_password', 'John', 'Doe', '+1234567890', 'pet_owner', '123 Main St', 'New York', 'NY', 'USA', '10001');

-- 2. Create pet owner record
INSERT INTO pet_owners (user_id) VALUES ((SELECT id FROM users WHERE username = 'john.doe'));

-- 3. Add pets
INSERT INTO pets (owner_id, name, species, breed, gender, birthday, weight, weight_unit)
VALUES ((SELECT id FROM users WHERE username = 'john.doe'), 'Buddy', 'Dog', 'Golden Retriever', 'male', '2020-03-15', 25.5, 'Kgs');
```

### Veterinarian Registration
```sql
-- 1. Create base user
INSERT INTO users (username, email, password_hash, first_name, last_name, phone_number, user_type, address, city, state, country, postal_code)
VALUES ('dr.smith', 'dr.smith@example.com', 'hashed_password', 'Dr. Sarah', 'Smith', '+1234567890', 'veterinarian', '123 Main St', 'New York', 'NY', 'USA', '10001');

-- 2. Create veterinarian professional record
INSERT INTO veterinarians (user_id, experience, license_number, specializations, qualifications, offer_online_consultation, offer_home_consultation, home_visit_radius)
VALUES ((SELECT id FROM users WHERE username = 'dr.smith'), 10, 'VET123456', ARRAY['General Practice', 'Surgery'], ARRAY['BVSc', 'MVSc'], true, true, 50);
```

## Next Steps

1. **Update Backend Models**: Modify Java entity classes to match the new schema
2. **Update Controllers**: Modify registration endpoints to work with the new structure
3. **Test Registration**: Test all registration flows with the new database
4. **Implement OAuth**: Add OAuth integration after the basic registration is working

## Benefits of This Schema

1. **Clean and Organized**: Each user type has its own dedicated table
2. **Frontend Aligned**: Database structure matches frontend forms exactly
3. **Scalable**: Easy to add new fields or user types
4. **Maintainable**: Clear separation of concerns
5. **Performance**: Proper indexing and efficient queries
6. **Flexible**: JSONB fields allow for complex data without schema changes
