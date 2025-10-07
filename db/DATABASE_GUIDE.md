# 🗄️ Zoodo Database - Complete Guide

## 📋 Overview
This guide explains your Zoodo Veterinary Platform database structure, how to explore it, and what each table contains.

## 🔍 How to Explore Your Database

### Quick Commands to View Tables:
```bash
# See all tables
psql -h localhost -p 5432 -U postgres -d zoodo -c "\dt"

# See users table
psql -h localhost -p 5432 -U postgres -d zoodo -c "SELECT * FROM users;"

# See row counts for all tables
psql -h localhost -p 5432 -U postgres -d zoodo -c "SELECT 'users' as table_name, COUNT(*) as count FROM users UNION ALL SELECT 'pets', COUNT(*) FROM pets UNION ALL SELECT 'veterinarians', COUNT(*) FROM veterinarians UNION ALL SELECT 'trainers', COUNT(*) FROM trainers UNION ALL SELECT 'hospitals', COUNT(*) FROM hospitals;"

# Save output to file (recommended for large results)
psql -h localhost -p 5432 -U postgres -d zoodo -c "SELECT * FROM users;" > users_output.txt
```

### Better Display Options:
```bash
# Use expanded display for better formatting
psql -h localhost -p 5432 -U postgres -d zoodo
# Then inside psql:
\x
SELECT * FROM users;
```

## 🏗️ Database Architecture

### How Tables Connect:
```
users (base table for ALL user types)
├── pet_owners (1:1 relationship)
│   └── pets (1:many - one owner can have multiple pets)
├── veterinarians (1:1 relationship)
├── trainers (1:1 relationship)
└── hospitals (1:1 relationship)

pets → appointments (1:many)
appointments → medical_records (1:many)
users → reviews (many:many for ratings)
```

### Key Design Principles:
- **Clean Separation**: Each user type has its own dedicated table
- **Shared Base**: Common user info stored in `users` table
- **Flexible Data**: JSONB fields for complex data (specializations, availability)
- **Performance**: Proper indexes on frequently queried columns

## 📊 Table Details

### 1. 👥 `users` - Base User Information
**Purpose**: Stores common information for ALL user types

**Key Fields**:
- `id` (UUID) - Primary key
- `username` (Unique) - Login username
- `email` (Unique) - User email
- `password_hash` - Encrypted password
- `first_name`, `last_name` - User's name
- `phone_number` - Contact number
- `address`, `city`, `state`, `country`, `postal_code` - Location
- `user_type` - Type: 'pet_owner', 'veterinarian', 'trainer', 'hospital', 'clinic', 'admin'
- `is_verified`, `is_active` - Account status
- `created_at`, `updated_at` - Timestamps

**Sample Query**:
```sql
SELECT username, email, user_type, is_verified FROM users WHERE user_type = 'veterinarian';
```

### 2. 🐕 `pets` - Pet Information
**Purpose**: Stores all pet data for pet owners

**Key Fields**:
- `id` (UUID) - Primary key
- `owner_id` (Foreign Key to users) - Pet owner
- `name` - Pet's name
- `species` - Dog, Cat, Bird, etc.
- `breed` - Specific breed
- `gender` - male, female, unknown
- `birthday` - Pet's birth date
- `age`, `age_unit` - Age in Years/Months/Days
- `weight`, `weight_unit` - Weight in Kgs/Gms
- `microchip` - Microchip number
- `sterilized` - Spay/neuter status
- `photo_url` - Pet photo

**Sample Query**:
```sql
SELECT p.name, p.species, p.breed, u.username as owner 
FROM pets p 
JOIN users u ON p.owner_id = u.id;
```

### 3. 👨‍⚕️ `veterinarians` - Veterinarian Professional Data
**Purpose**: Stores veterinarian-specific professional information

**Key Fields**:
- `id` (UUID) - Primary key
- `user_id` (Foreign Key to users) - Base user info
- `experience` - Years of experience
- `license_number` - Veterinary license
- `specializations[]` - Array of specializations
- `qualifications[]` - Array of degrees/certifications
- `offer_online_consultation` - Online service availability
- `offer_home_consultation` - Home visit availability
- `home_visit_radius` - Service radius in km
- `availability_schedule` (JSONB) - Working hours
- Document URLs: `license_proof_url`, `id_proof_url`, `degree_proof_url`, `profile_photo_url`

**Sample Query**:
```sql
SELECT u.first_name, u.last_name, v.experience, v.specializations, v.offer_home_consultation
FROM veterinarians v
JOIN users u ON v.user_id = u.id
WHERE v.offer_home_consultation = true;
```

### 4. 🎓 `trainers` - Trainer Professional Data
**Purpose**: Stores trainer-specific professional information

**Key Fields**:
- `id` (UUID) - Primary key
- `user_id` (Foreign Key to users) - Base user info
- `experience` - Years of experience
- `specializations[]` - Array of training specializations
- `certifications[]` - Array of certifications
- `offer_home_training` - Home training availability
- `home_training_radius` - Service radius in km
- `has_academy` - Has training academy
- `academy_name` - Academy name
- `availability_schedule` (JSONB) - Working hours
- Document URLs: `resume_url`, `profile_photo_url`

**Sample Query**:
```sql
SELECT u.first_name, u.last_name, t.specializations, t.has_academy, t.academy_name
FROM trainers t
JOIN users u ON t.user_id = u.id
WHERE t.has_academy = true;
```

### 5. 🏥 `hospitals` - Hospital/Clinic Business Data
**Purpose**: Stores hospital/clinic business information

**Key Fields**:
- `id` (UUID) - Primary key
- `user_id` (Foreign Key to users) - Base user info
- `account_type` - 'hospital' or 'clinic'
- `business_name` - Hospital/clinic name
- `contact_person` - Main contact person
- `facility_license_number` - Business license
- `govt_registration_number` - Government registration
- `tax_id` - Tax identification
- `medical_director_name` - Medical director
- `medical_director_license_number` - Director's license
- `offer_online_consultation` - Online service availability
- `offer_clinic_hospital` - In-person service availability
- `is_verified` - Verification status

**Sample Query**:
```sql
SELECT h.business_name, h.contact_person, h.account_type, h.is_verified
FROM hospitals h
JOIN users u ON h.user_id = u.id
WHERE h.is_verified = true;
```

### 6. 📅 `appointments` - Appointment Management
**Purpose**: Manages appointments between pets and service providers

**Key Fields**:
- `id` (UUID) - Primary key
- `pet_id` (Foreign Key to pets) - Pet being treated
- `owner_id` (Foreign Key to users) - Pet owner
- `provider_id` (Foreign Key to users) - Service provider (vet/trainer)
- `appointment_type` - 'clinic', 'home_visit', 'teleconsultation', 'training'
- `appointment_date`, `start_time`, `end_time` - Scheduling
- `status` - 'scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled'
- `reason` - Appointment reason
- `diagnosis` - Medical diagnosis
- `treatment_plan` - Treatment details
- `prescription` - Prescribed medications
- `cost` - Appointment cost
- `payment_status` - 'pending', 'paid', 'refunded'

**Sample Query**:
```sql
SELECT p.name as pet_name, u1.username as owner, u2.username as provider, 
       a.appointment_type, a.appointment_date, a.status, a.cost
FROM appointments a
JOIN pets p ON a.pet_id = p.id
JOIN users u1 ON a.owner_id = u1.id
JOIN users u2 ON a.provider_id = u2.id
WHERE a.status = 'completed';
```

### 7. 📋 `medical_records` - Medical History
**Purpose**: Stores medical records for pets

**Key Fields**:
- `id` (UUID) - Primary key
- `pet_id` (Foreign Key to pets) - Pet
- `appointment_id` (Foreign Key to appointments) - Related appointment
- `record_type` - 'vaccination', 'checkup', 'surgery', 'treatment', 'lab_test', 'prescription'
- `title` - Record title
- `description` - Record description
- `diagnosis` - Medical diagnosis
- `treatment` - Treatment given
- `prescription` - Medications prescribed
- `lab_results` - Lab test results
- `file_urls[]` - Array of file URLs (X-rays, reports)
- `created_by` (Foreign Key to users) - Who created the record

**Sample Query**:
```sql
SELECT p.name as pet_name, mr.record_type, mr.title, mr.diagnosis, 
       u.username as created_by, mr.created_at
FROM medical_records mr
JOIN pets p ON mr.pet_id = p.id
JOIN users u ON mr.created_by = u.id
ORDER BY mr.created_at DESC;
```

### 8. ⭐ `reviews` - Reviews and Ratings
**Purpose**: Allows users to review service providers

**Key Fields**:
- `id` (UUID) - Primary key
- `reviewer_id` (Foreign Key to users) - Who wrote the review
- `provider_id` (Foreign Key to users) - Who is being reviewed
- `appointment_id` (Foreign Key to appointments) - Related appointment
- `rating` - Rating from 1-5
- `comment` - Review text
- `is_verified` - Verified review status
- `created_at` - Review date

**Sample Query**:
```sql
SELECT u1.username as reviewer, u2.username as provider, 
       r.rating, r.comment, r.is_verified
FROM reviews r
JOIN users u1 ON r.reviewer_id = u1.id
JOIN users u2 ON r.provider_id = u2.id
WHERE r.rating >= 4;
```

## 🎯 Common Queries

### Find All Veterinarians Offering Home Visits:
```sql
SELECT u.first_name, u.last_name, u.city, v.home_visit_radius
FROM veterinarians v
JOIN users u ON v.user_id = u.id
WHERE v.offer_home_consultation = true;
```

### Get Pet Owner with Their Pets:
```sql
SELECT u.username, u.first_name, u.last_name, 
       p.name as pet_name, p.species, p.breed
FROM users u
JOIN pets p ON u.id = p.owner_id
WHERE u.user_type = 'pet_owner';
```

### Find Appointments for a Specific Pet:
```sql
SELECT a.appointment_date, a.appointment_type, a.status, 
       u.username as provider_name
FROM appointments a
JOIN users u ON a.provider_id = u.id
WHERE a.pet_id = (SELECT id FROM pets WHERE name = 'Buddy');
```

### Get Hospital Statistics:
```sql
SELECT h.business_name, h.account_type, h.is_verified,
       COUNT(a.id) as total_appointments
FROM hospitals h
LEFT JOIN appointments a ON h.user_id = a.provider_id
GROUP BY h.id, h.business_name, h.account_type, h.is_verified;
```

## 🚀 Database Features

### Performance Optimizations:
- **UUID Primary Keys** - Globally unique identifiers
- **Indexes** - On frequently queried columns (email, username, user_type)
- **Foreign Key Constraints** - Ensure data integrity
- **Automatic Timestamps** - Track record creation and updates

### Data Types:
- **JSONB** - For complex data like availability schedules
- **Arrays** - For multi-value fields like specializations
- **Enums** - For controlled values like user types
- **UUID** - For unique identifiers

### Security Features:
- **Password Hashing** - Encrypted password storage
- **Verification System** - User and business verification
- **Active Status** - Account activation/deactivation

## 📝 Maintenance Commands

### Backup Database:
```bash
pg_dump -h localhost -p 5432 -U postgres -d zoodo > zoodo_backup.sql
```

### Restore Database:
```bash
psql -h localhost -p 5432 -U postgres -d zoodo < zoodo_backup.sql
```

### Check Database Size:
```sql
SELECT pg_size_pretty(pg_database_size('zoodo'));
```

### View Table Sizes:
```sql
SELECT schemaname,tablename,pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## 🎉 Summary

Your Zoodo database is well-structured with:
- ✅ **9 main tables** covering all user types and business logic
- ✅ **Clean relationships** between users, pets, appointments, and records
- ✅ **Flexible data storage** using JSONB and arrays
- ✅ **Performance optimizations** with proper indexing
- ✅ **Data integrity** with foreign key constraints
- ✅ **Scalable design** for future enhancements

The database is ready for your application to use with proper user registration, pet management, appointment scheduling, and medical record keeping!
