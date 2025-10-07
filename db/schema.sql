-- Zoodo Veterinary Platform - Clean Database Schema
-- PostgreSQL Database Initialization
-- This schema is designed to match the frontend registration forms exactly

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- BASE USERS TABLE (Common fields for all users)
-- =============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    postal_code VARCHAR(20),
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('pet_owner', 'veterinarian', 'trainer', 'hospital', 'clinic', 'admin')),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- PET OWNERS TABLE
-- =============================================
CREATE TABLE pet_owners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- PETS TABLE (for pet owners)
-- =============================================
CREATE TABLE pets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'unknown')),
    species VARCHAR(50) NOT NULL,
    breed VARCHAR(100),
    birthday DATE,
    age INTEGER,
    age_unit VARCHAR(10) CHECK (age_unit IN ('Years', 'Months', 'Days')),
    weight DECIMAL(5, 2),
    weight_unit VARCHAR(10) CHECK (weight_unit IN ('Kgs', 'Gms')),
    microchip VARCHAR(50),
    sterilized BOOLEAN,
    photo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- VETERINARIANS TABLE
-- =============================================
CREATE TABLE veterinarians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    experience INTEGER,
    license_number VARCHAR(100) NOT NULL,
    specializations TEXT[], -- Array of specializations
    other_specialization VARCHAR(255),
    qualifications TEXT[], -- Array of qualifications
    other_qualification VARCHAR(255),
    license_proof_url VARCHAR(500),
    id_proof_url VARCHAR(500),
    degree_proof_url VARCHAR(500),
    profile_photo_url VARCHAR(500),
    is_affiliated BOOLEAN DEFAULT FALSE,
    affiliated_facility_name VARCHAR(255),
    affiliation_type VARCHAR(50),
    other_facility_name VARCHAR(255),
    -- Independent services
    offer_home_consultation BOOLEAN DEFAULT FALSE,
    offer_online_consultation BOOLEAN DEFAULT FALSE,
    independent_service_address TEXT,
    independent_service_same_as_personal BOOLEAN DEFAULT TRUE,
    independent_service_street VARCHAR(255),
    independent_service_city VARCHAR(100),
    independent_service_zip VARCHAR(20),
    home_visit_radius INTEGER, -- in km
    -- Availability settings (JSON format)
    availability_schedule JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TRAINERS TABLE
-- =============================================
CREATE TABLE trainers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    experience INTEGER,
    specializations TEXT[], -- Array of specializations
    other_specialization VARCHAR(255),
    certifications TEXT[], -- Array of certifications
    other_certification VARCHAR(255),
    resume_url VARCHAR(500),
    profile_photo_url VARCHAR(500),
    -- Practice type
    practice_type JSONB, -- {independent: boolean, trainingCenter: boolean, affiliated: boolean}
    -- Independent services
    offer_home_training BOOLEAN DEFAULT FALSE,
    independent_service_address TEXT,
    independent_service_same_as_personal BOOLEAN DEFAULT TRUE,
    independent_service_street VARCHAR(255),
    independent_service_city VARCHAR(100),
    independent_service_zip VARCHAR(20),
    home_training_radius INTEGER, -- in km
    -- Training center details
    has_training_center BOOLEAN DEFAULT FALSE,
    training_center_name VARCHAR(255),
    training_center_address TEXT,
    training_center_offer_in_person BOOLEAN DEFAULT FALSE,
    -- Affiliated details
    affiliated_facility_name VARCHAR(255),
    affiliation_type VARCHAR(50),
    -- Academy details
    has_academy BOOLEAN DEFAULT FALSE,
    academy_name VARCHAR(255),
    academy_street VARCHAR(255),
    academy_city VARCHAR(100),
    academy_state VARCHAR(100),
    academy_postal_code VARCHAR(20),
    academy_country VARCHAR(100),
    academy_phone VARCHAR(20),
    -- Availability settings (JSON format)
    availability_schedule JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- HOSPITALS/CLINICS TABLE
-- =============================================
CREATE TABLE hospitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_type VARCHAR(20) NOT NULL CHECK (account_type IN ('hospital', 'clinic')),
    business_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(100) NOT NULL,
    -- Business services
    offer_online_consultation BOOLEAN DEFAULT FALSE,
    offer_clinic_hospital BOOLEAN DEFAULT TRUE,
    -- Compliance details
    facility_license_number VARCHAR(100) NOT NULL,
    govt_registration_number VARCHAR(100) NOT NULL,
    tax_id VARCHAR(100) NOT NULL,
    medical_director_name VARCHAR(100) NOT NULL,
    medical_director_license_number VARCHAR(100) NOT NULL,
    facility_license_document_url VARCHAR(500),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- APPOINTMENTS TABLE
-- =============================================
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    appointment_type VARCHAR(50) NOT NULL CHECK (appointment_type IN ('clinic', 'home_visit', 'teleconsultation', 'training')),
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    reason TEXT,
    symptoms TEXT,
    diagnosis TEXT,
    treatment_plan TEXT,
    prescription TEXT,
    cost DECIMAL(10, 2),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- MEDICAL RECORDS TABLE
-- =============================================
CREATE TABLE medical_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    record_type VARCHAR(50) NOT NULL CHECK (record_type IN ('vaccination', 'checkup', 'surgery', 'treatment', 'lab_test', 'prescription')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    diagnosis TEXT,
    treatment TEXT,
    prescription TEXT,
    lab_results TEXT,
    file_urls TEXT[], -- Array of file URLs (X-rays, lab reports, etc.)
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- REVIEWS AND RATINGS TABLE
-- =============================================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_pet_owners_user_id ON pet_owners(user_id);
CREATE INDEX idx_pets_owner_id ON pets(owner_id);
CREATE INDEX idx_veterinarians_user_id ON veterinarians(user_id);
CREATE INDEX idx_veterinarians_license_number ON veterinarians(license_number);
CREATE INDEX idx_trainers_user_id ON trainers(user_id);
CREATE INDEX idx_hospitals_user_id ON hospitals(user_id);
CREATE INDEX idx_hospitals_facility_license ON hospitals(facility_license_number);
CREATE INDEX idx_hospitals_govt_registration ON hospitals(govt_registration_number);
CREATE INDEX idx_hospitals_tax_id ON hospitals(tax_id);
CREATE INDEX idx_appointments_pet_id ON appointments(pet_id);
CREATE INDEX idx_appointments_provider_id ON appointments(provider_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_medical_records_pet_id ON medical_records(pet_id);
CREATE INDEX idx_reviews_provider_id ON reviews(provider_id);

-- =============================================
-- CREATE UPDATED_AT TRIGGER FUNCTION
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pet_owners_updated_at BEFORE UPDATE ON pet_owners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON pets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_veterinarians_updated_at BEFORE UPDATE ON veterinarians FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trainers_updated_at BEFORE UPDATE ON trainers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hospitals_updated_at BEFORE UPDATE ON hospitals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medical_records_updated_at BEFORE UPDATE ON medical_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SAMPLE DATA FOR TESTING
-- =============================================
INSERT INTO users (username, email, password_hash, first_name, last_name, phone_number, user_type, address, city, state, country, postal_code, is_verified) VALUES
('dr.smith', 'dr.smith@zoodo.com', '$2a$10$encrypted_hash_here', 'Dr. Sarah', 'Smith', '+1234567890', 'veterinarian', '123 Main St', 'New York', 'NY', 'USA', '10001', true),
('trainer.john', 'trainer.john@zoodo.com', '$2a$10$encrypted_hash_here', 'John', 'Wilson', '+1234567891', 'trainer', '456 Oak Ave', 'Los Angeles', 'CA', 'USA', '90210', true),
('owner.mary', 'owner.mary@zoodo.com', '$2a$10$encrypted_hash_here', 'Mary', 'Johnson', '+1234567892', 'pet_owner', '789 Pine St', 'Chicago', 'IL', 'USA', '60601', true),
('hospital.main', 'hospital.main@zoodo.com', '$2a$10$encrypted_hash_here', 'Main', 'Veterinary Hospital', '+1234567893', 'hospital', '321 Hospital Blvd', 'Miami', 'FL', 'USA', '33101', true);

-- Insert sample veterinarian professional details
INSERT INTO veterinarians (user_id, experience, license_number, specializations, qualifications, offer_online_consultation, offer_home_consultation, home_visit_radius) VALUES
((SELECT id FROM users WHERE username = 'dr.smith'), 10, 'VET123456', ARRAY['General Veterinary Practice', 'Surgery'], ARRAY['BVSc & AH', 'MVSc'], true, true, 50);

-- Insert sample trainer professional details  
INSERT INTO trainers (user_id, experience, specializations, certifications, offer_home_training, home_training_radius, has_academy, academy_name) VALUES
((SELECT id FROM users WHERE username = 'trainer.john'), 8, ARRAY['Behavioral Modification', 'Basic Obedience Training'], ARRAY['Certified Professional Dog Trainer (CPDT)'], true, true, 30, true, 'Paws & Progress Academy');

-- Insert sample pet owner details
INSERT INTO pet_owners (user_id) VALUES
((SELECT id FROM users WHERE username = 'owner.mary'));

-- Insert sample hospital details
INSERT INTO hospitals (user_id, account_type, business_name, contact_person, facility_license_number, govt_registration_number, tax_id, medical_director_name, medical_director_license_number, offer_online_consultation, offer_clinic_hospital) VALUES
((SELECT id FROM users WHERE username = 'hospital.main'), 'hospital', 'Main Veterinary Hospital', 'Dr. Robert Johnson', 'HOSP123456', 'GOV123456', 'TAX123456', 'Dr. Robert Johnson', 'MD123456', true, true);

-- Insert sample pets
INSERT INTO pets (owner_id, name, species, breed, gender, birthday, weight, weight_unit) VALUES
((SELECT id FROM users WHERE username = 'owner.mary'), 'Buddy', 'Dog', 'Golden Retriever', 'male', '2020-03-15', 25.5, 'Kgs'),
((SELECT id FROM users WHERE username = 'owner.mary'), 'Whiskers', 'Cat', 'Persian', 'female', '2019-07-22', 4.2, 'Kgs');
