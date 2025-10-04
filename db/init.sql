-- Zoodo Veterinary Platform Database Schema
-- PostgreSQL Database Initialization

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Base users table (all user types)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('pet_owner', 'veterinarian', 'trainer', 'hospital', 'clinic', 'admin')),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    rating DECIMAL(3, 2) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Veterinarian professional details
CREATE TABLE veterinarians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    license_number VARCHAR(100) NOT NULL,
    experience INTEGER,
    specializations TEXT[], -- Array of specializations
    qualifications TEXT[], -- Array of qualifications
    resume_url VARCHAR(500),
    profile_photo_url VARCHAR(500),
    license_proof_url VARCHAR(500),
    id_proof_url VARCHAR(500),
    degree_proof_url VARCHAR(500),
    is_affiliated BOOLEAN DEFAULT FALSE,
    affiliated_facility_name VARCHAR(255),
    affiliated_type VARCHAR(50),
    other_facility_name VARCHAR(255),
    -- Service details
    offer_online_consultation BOOLEAN DEFAULT FALSE,
    offer_home_visits BOOLEAN DEFAULT FALSE,
    home_service_address TEXT,
    home_service_same_as_personal BOOLEAN DEFAULT TRUE,
    home_service_street VARCHAR(255),
    home_service_city VARCHAR(100),
    home_service_zip VARCHAR(20),
    home_visit_radius INTEGER, -- in km
    -- Availability settings (JSON format for flexibility)
    availability_settings JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trainer professional details
CREATE TABLE trainers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    experience INTEGER,
    specializations TEXT[], -- Array of specializations
    certifications TEXT[], -- Array of certifications
    resume_url VARCHAR(500),
    profile_photo_url VARCHAR(500),
    -- Service details
    practice_type JSONB, -- {independent: boolean, trainingCenter: boolean, affiliated: boolean}
    offer_online_training BOOLEAN DEFAULT FALSE,
    offer_home_training BOOLEAN DEFAULT FALSE,
    offer_group_classes BOOLEAN DEFAULT FALSE,
    -- Independent practice details
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
    -- Academy details
    has_academy BOOLEAN DEFAULT FALSE,
    academy_name VARCHAR(255),
    academy_street VARCHAR(255),
    academy_city VARCHAR(100),
    academy_state VARCHAR(100),
    academy_postal_code VARCHAR(20),
    academy_country VARCHAR(100),
    academy_phone VARCHAR(20),
    -- Availability settings (JSON format for flexibility)
    availability_settings JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pet owners additional details (minimal since base user table covers most)
CREATE TABLE pet_owners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hospital/Clinic business details
CREATE TABLE hospitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(100) NOT NULL,
    account_type VARCHAR(20) NOT NULL CHECK (account_type IN ('hospital', 'clinic')),
    -- Business services
    offer_online_consultation BOOLEAN DEFAULT FALSE,
    offer_clinic_hospital BOOLEAN DEFAULT TRUE,
    -- Business hours (JSON format for flexibility)
    business_hours JSONB,
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

-- Pets table (capturing all pet data from registration)
CREATE TABLE pets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    species VARCHAR(50) NOT NULL,
    breed VARCHAR(100),
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'unknown')),
    birth_date DATE,
    age INTEGER,
    age_unit VARCHAR(10), -- Years, Months, Days
    weight DECIMAL(5, 2), -- in kg or gms based on weight_unit
    weight_unit VARCHAR(10), -- Kgs, Gms
    microchip_id VARCHAR(50),
    sterilized BOOLEAN,
    photo_url VARCHAR(500),
    blockchain_record_hash VARCHAR(255), -- Hash of medical records on blockchain
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments table
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
    blockchain_transaction_hash VARCHAR(255), -- For payment and record verification
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medical records table
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
    blockchain_hash VARCHAR(255) NOT NULL, -- Hash of the record on blockchain
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews and ratings table
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

-- Community events table
CREATE TABLE community_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('vaccination_drive', 'adoption_camp', 'wellness_checkup', 'training_session', 'fundraiser')),
    organizer_id UUID NOT NULL REFERENCES users(id),
    location TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    start_date DATE NOT NULL,
    start_time TIME,
    end_date DATE,
    end_time TIME,
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    cost DECIMAL(10, 2) DEFAULT 0.0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event registrations table
CREATE TABLE event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES community_events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pet_id UUID REFERENCES pets(id) ON DELETE SET NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
    UNIQUE(event_id, user_id)
);

-- AI recommendations table
CREATE TABLE ai_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pet_id UUID REFERENCES pets(id) ON DELETE SET NULL,
    recommendation_type VARCHAR(50) NOT NULL CHECK (recommendation_type IN ('symptom_analysis', 'doctor_recommendation', 'trainer_recommendation', 'care_routine', 'diet_suggestion')),
    symptoms TEXT,
    analysis_result TEXT,
    recommended_providers UUID[], -- Array of recommended provider IDs
    care_instructions TEXT,
    diet_recommendations TEXT,
    urgency_level VARCHAR(20) CHECK (urgency_level IN ('low', 'medium', 'high', 'emergency')),
    confidence_score DECIMAL(3, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blockchain transactions table
CREATE TABLE blockchain_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_hash VARCHAR(255) UNIQUE NOT NULL,
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('medical_record', 'payment', 'appointment', 'review')),
    entity_id UUID NOT NULL, -- ID of the related entity (appointment, medical record, etc.)
    entity_type VARCHAR(50) NOT NULL,
    block_number INTEGER,
    gas_used INTEGER,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_location ON users(latitude, longitude);
CREATE INDEX idx_veterinarians_user_id ON veterinarians(user_id);
CREATE INDEX idx_trainers_user_id ON trainers(user_id);
CREATE INDEX idx_pet_owners_user_id ON pet_owners(user_id);
CREATE INDEX idx_hospitals_user_id ON hospitals(user_id);
CREATE INDEX idx_hospitals_facility_license ON hospitals(facility_license_number);
CREATE INDEX idx_hospitals_govt_registration ON hospitals(govt_registration_number);
CREATE INDEX idx_hospitals_tax_id ON hospitals(tax_id);
CREATE INDEX idx_pets_owner ON pets(owner);
CREATE INDEX idx_appointments_pet_id ON appointments(pet_id);
CREATE INDEX idx_appointments_provider_id ON appointments(provider_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_medical_records_pet_id ON medical_records(pet_id);
CREATE INDEX idx_reviews_provider_id ON reviews(provider_id);
CREATE INDEX idx_community_events_location ON community_events(latitude, longitude);
CREATE INDEX idx_community_events_date ON community_events(start_date);
CREATE INDEX idx_blockchain_transactions_hash ON blockchain_transactions(transaction_hash);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_veterinarians_updated_at BEFORE UPDATE ON veterinarians FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trainers_updated_at BEFORE UPDATE ON trainers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pet_owners_updated_at BEFORE UPDATE ON pet_owners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hospitals_updated_at BEFORE UPDATE ON hospitals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON pets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medical_records_updated_at BEFORE UPDATE ON medical_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_community_events_updated_at BEFORE UPDATE ON community_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO users (username, email, password_hash, first_name, last_name, phone, user_type, address, city, state, country, postal_code, is_verified) VALUES
('dr.smith', 'dr.smith@zoodo.com', '$2a$10$encrypted_hash_here', 'Dr. Sarah', 'Smith', '+1234567890', 'veterinarian', '123 Main St', 'New York', 'NY', 'USA', '10001', true),
('trainer.john', 'trainer.john@zoodo.com', '$2a$10$encrypted_hash_here', 'John', 'Wilson', '+1234567891', 'trainer', '456 Oak Ave', 'Los Angeles', 'CA', 'USA', '90210', true),
('owner.mary', 'owner.mary@zoodo.com', '$2a$10$encrypted_hash_here', 'Mary', 'Johnson', '+1234567892', 'pet_owner', '789 Pine St', 'Chicago', 'IL', 'USA', '60601', true);

-- Insert sample veterinarian professional details
INSERT INTO veterinarians (user_id, license_number, experience, specializations, qualifications, offer_online_consultation, offer_home_visits, home_visit_radius) VALUES
((SELECT id FROM users WHERE username = 'dr.smith'), 'VET123456', 10, ARRAY['General Veterinary Practice', 'Surgery'], ARRAY['BVSc & AH', 'MVSc'], true, true, 50);

-- Insert sample trainer professional details  
INSERT INTO trainers (user_id, experience, specializations, certifications, offer_online_training, offer_home_training, home_training_radius, has_academy, academy_name) VALUES
((SELECT id FROM users WHERE username = 'trainer.john'), 8, ARRAY['Behavioral Modification', 'Basic Obedience Training'], ARRAY['Certified Professional Dog Trainer (CPDT)'], true, true, 30, true, 'Paws & Progress Academy');

-- Insert sample pet owner details
INSERT INTO pet_owners (user_id) VALUES
((SELECT id FROM users WHERE username = 'owner.mary'));

-- Insert sample pets
INSERT INTO pets (owner, name, species, breed, gender, birth_date, weight, weight_unit) VALUES
((SELECT id FROM users WHERE username = 'owner.mary'), 'Buddy', 'Dog', 'Golden Retriever', 'male', '2020-03-15', 25.5, 'Kgs'),
((SELECT id FROM users WHERE username = 'owner.mary'), 'Whiskers', 'Cat', 'Persian', 'female', '2019-07-22', 4.2, 'Kgs');
