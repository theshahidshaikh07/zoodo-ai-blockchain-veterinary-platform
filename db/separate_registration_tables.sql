-- Separate Registration Tables for Zoodo Platform
-- This creates dedicated tables for each registration form capturing ALL data from start to end

-- ==============================================
-- 1. PET OWNER REGISTRATION TABLE
-- ==============================================
CREATE TABLE pet_owner_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Step 1: Basic Information (Required)
    username VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    
    -- Step 2: Address Information (Optional)
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'India',
    
    -- Step 3: Pet Information (Optional - can have multiple pets)
    -- Stored as JSONB array for flexibility
    pets_data JSONB DEFAULT '[]'::jsonb,
    
    -- Registration metadata
    registration_status VARCHAR(20) DEFAULT 'pending' CHECK (registration_status IN ('pending', 'completed', 'verified', 'rejected')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Link to main users table when registration is completed
    user_id UUID REFERENCES users(id) ON DELETE SET NULL
);

-- ==============================================
-- 2. VETERINARIAN REGISTRATION TABLE
-- ==============================================
CREATE TABLE veterinarian_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Step 1: Personal Information (Required)
    username VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    
    -- Step 2: Professional Details (Required)
    license_number VARCHAR(100) NOT NULL,
    experience INTEGER NOT NULL,
    specializations TEXT[] NOT NULL, -- Array of specializations
    other_specialization VARCHAR(255),
    qualifications TEXT[] NOT NULL, -- Array of qualifications
    other_qualification VARCHAR(255),
    is_affiliated BOOLEAN DEFAULT FALSE,
    
    -- Affiliation details (if affiliated)
    affiliated_facility_name VARCHAR(255),
    affiliated_type VARCHAR(50),
    other_facility_name VARCHAR(255),
    
    -- Step 3: Document Uploads (Required)
    license_proof_url VARCHAR(500),
    id_proof_url VARCHAR(500),
    degree_proof_url VARCHAR(500),
    profile_photo_url VARCHAR(500),
    
    -- Step 4: Service Details (Required)
    offer_online_consultation BOOLEAN DEFAULT FALSE,
    offer_home_consultation BOOLEAN DEFAULT FALSE,
    
    -- Home service address details
    home_service_same_as_personal BOOLEAN DEFAULT TRUE,
    home_service_street VARCHAR(255),
    home_service_city VARCHAR(100),
    home_service_zip VARCHAR(20),
    home_visit_radius INTEGER, -- in km
    
    -- Step 5: Availability Schedule (JSON format for flexibility)
    availability_schedule JSONB,
    
    -- Registration metadata
    registration_status VARCHAR(20) DEFAULT 'pending' CHECK (registration_status IN ('pending', 'under_review', 'approved', 'rejected')),
    verification_notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Link to main users table when registration is completed
    user_id UUID REFERENCES users(id) ON DELETE SET NULL
);

-- ==============================================
-- 3. TRAINER REGISTRATION TABLE
-- ==============================================
CREATE TABLE trainer_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Step 1: Personal Information (Required)
    username VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    
    -- Step 2: Professional Details (Required)
    experience INTEGER NOT NULL,
    specializations TEXT[] NOT NULL, -- Array of specializations
    other_specialization VARCHAR(255),
    certifications TEXT[] NOT NULL, -- Array of certifications
    other_certification VARCHAR(255),
    
    -- Document uploads
    resume_url VARCHAR(500),
    profile_photo_url VARCHAR(500),
    
    -- Step 3: Services (Required)
    offer_online_training BOOLEAN DEFAULT FALSE,
    
    -- Academy details (if has academy)
    has_academy BOOLEAN DEFAULT FALSE,
    academy_name VARCHAR(255),
    academy_street VARCHAR(255),
    academy_city VARCHAR(100),
    academy_state VARCHAR(100),
    academy_postal_code VARCHAR(20),
    academy_country VARCHAR(100),
    academy_phone VARCHAR(20),
    
    -- Step 4: Availability Schedule (JSON format for flexibility)
    availability_schedule JSONB,
    
    -- Registration metadata
    registration_status VARCHAR(20) DEFAULT 'pending' CHECK (registration_status IN ('pending', 'under_review', 'approved', 'rejected')),
    verification_notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Link to main users table when registration is completed
    user_id UUID REFERENCES users(id) ON DELETE SET NULL
);

-- ==============================================
-- 4. HOSPITAL/CLINIC REGISTRATION TABLE
-- ==============================================
CREATE TABLE hospital_clinic_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Step 1: Business Information (Required)
    account_type VARCHAR(20) NOT NULL CHECK (account_type IN ('hospital', 'clinic')),
    business_name VARCHAR(255) NOT NULL,
    
    -- Step 2: Contact & Address (Required)
    contact_person VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    
    -- Step 3: Compliance & Services (Required)
    facility_license_number VARCHAR(100) NOT NULL,
    govt_registration_number VARCHAR(100) NOT NULL,
    tax_id VARCHAR(100) NOT NULL,
    medical_director_name VARCHAR(100) NOT NULL,
    medical_director_license_number VARCHAR(100) NOT NULL,
    facility_license_document_url VARCHAR(500),
    
    -- Account credentials
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    
    -- Business services
    offer_online_consultation BOOLEAN DEFAULT FALSE,
    offer_clinic_hospital BOOLEAN DEFAULT TRUE,
    
    -- Business hours (JSON format for flexibility)
    business_hours JSONB,
    
    -- Registration metadata
    registration_status VARCHAR(20) DEFAULT 'pending' CHECK (registration_status IN ('pending', 'under_review', 'approved', 'rejected')),
    verification_notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Link to main users table when registration is completed
    user_id UUID REFERENCES users(id) ON DELETE SET NULL
);

-- ==============================================
-- INDEXES FOR PERFORMANCE
-- ==============================================

-- Pet Owner Registration indexes
CREATE INDEX idx_pet_owner_registrations_email ON pet_owner_registrations(email);
CREATE INDEX idx_pet_owner_registrations_username ON pet_owner_registrations(username);
CREATE INDEX idx_pet_owner_registrations_status ON pet_owner_registrations(registration_status);
CREATE INDEX idx_pet_owner_registrations_created_at ON pet_owner_registrations(created_at);

-- Veterinarian Registration indexes
CREATE INDEX idx_veterinarian_registrations_email ON veterinarian_registrations(email);
CREATE INDEX idx_veterinarian_registrations_username ON veterinarian_registrations(username);
CREATE INDEX idx_veterinarian_registrations_license ON veterinarian_registrations(license_number);
CREATE INDEX idx_veterinarian_registrations_status ON veterinarian_registrations(registration_status);
CREATE INDEX idx_veterinarian_registrations_created_at ON veterinarian_registrations(created_at);

-- Trainer Registration indexes
CREATE INDEX idx_trainer_registrations_email ON trainer_registrations(email);
CREATE INDEX idx_trainer_registrations_username ON trainer_registrations(username);
CREATE INDEX idx_trainer_registrations_status ON trainer_registrations(registration_status);
CREATE INDEX idx_trainer_registrations_created_at ON trainer_registrations(created_at);

-- Hospital/Clinic Registration indexes
CREATE INDEX idx_hospital_clinic_registrations_email ON hospital_clinic_registrations(email);
CREATE INDEX idx_hospital_clinic_registrations_username ON hospital_clinic_registrations(username);
CREATE INDEX idx_hospital_clinic_registrations_license ON hospital_clinic_registrations(facility_license_number);
CREATE INDEX idx_hospital_clinic_registrations_govt_reg ON hospital_clinic_registrations(govt_registration_number);
CREATE INDEX idx_hospital_clinic_registrations_tax_id ON hospital_clinic_registrations(tax_id);
CREATE INDEX idx_hospital_clinic_registrations_status ON hospital_clinic_registrations(registration_status);
CREATE INDEX idx_hospital_clinic_registrations_created_at ON hospital_clinic_registrations(created_at);

-- ==============================================
-- TRIGGERS FOR UPDATED_AT
-- ==============================================

-- Apply updated_at triggers to all registration tables
CREATE TRIGGER update_pet_owner_registrations_updated_at 
    BEFORE UPDATE ON pet_owner_registrations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_veterinarian_registrations_updated_at 
    BEFORE UPDATE ON veterinarian_registrations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trainer_registrations_updated_at 
    BEFORE UPDATE ON trainer_registrations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hospital_clinic_registrations_updated_at 
    BEFORE UPDATE ON hospital_clinic_registrations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- SAMPLE DATA FOR TESTING
-- ==============================================

-- Sample Pet Owner Registration
INSERT INTO pet_owner_registrations (
    username, first_name, last_name, email, password_hash,
    address_line1, city, state, postal_code, country,
    pets_data
) VALUES (
    'john_doe', 'John', 'Doe', 'john.doe@example.com', '$2a$10$encrypted_hash_here',
    '123 Main St', 'Mumbai', 'Maharashtra', '400001', 'India',
    '[
        {
            "name": "Buddy",
            "gender": "male",
            "species": "Dog",
            "breed": "Golden Retriever",
            "birthday": "2020-03-15",
            "age": 4,
            "ageUnit": "Years",
            "weight": 25.5,
            "weightUnit": "Kgs",
            "microchip": "123456789012345",
            "sterilized": "yes"
        }
    ]'::jsonb
);

-- Sample Veterinarian Registration
INSERT INTO veterinarian_registrations (
    username, first_name, last_name, email, password_hash, phone_number, address,
    license_number, experience, specializations, qualifications,
    offer_online_consultation, offer_home_consultation, home_visit_radius
) VALUES (
    'dr.sarah', 'Dr. Sarah', 'Wilson', 'dr.sarah@example.com', '$2a$10$encrypted_hash_here', '+1234567890', '456 Oak Ave, New York, NY 10001',
    'VET123456', 10, ARRAY['General Veterinary Practice', 'Surgery'], ARRAY['BVSc & AH', 'MVSc'],
    true, true, 50
);

-- Sample Trainer Registration
INSERT INTO trainer_registrations (
    username, first_name, last_name, email, password_hash, phone_number, address,
    experience, specializations, certifications,
    offer_online_training, has_academy, academy_name
) VALUES (
    'trainer.mike', 'Mike', 'Johnson', 'trainer.mike@example.com', '$2a$10$encrypted_hash_here', '+1234567891', '789 Pine St, Los Angeles, CA 90210',
    8, ARRAY['Behavioral Modification', 'Basic Obedience Training'], ARRAY['Certified Professional Dog Trainer (CPDT)'],
    true, true, 'Paws & Progress Academy'
);

-- Sample Hospital Registration
INSERT INTO hospital_clinic_registrations (
    account_type, business_name, contact_person, email, phone_number, address, city, state, country, postal_code,
    facility_license_number, govt_registration_number, tax_id, medical_director_name, medical_director_license_number,
    username, password_hash, offer_online_consultation, offer_clinic_hospital
) VALUES (
    'hospital', 'City Animal Care Hospital', 'Dr. Robert Smith', 'admin@cityanimalcare.com', '+1234567892', '321 Medical Plaza, Chicago, IL 60601', 'Chicago', 'Illinois', 'USA', '60601',
    'HOSP789012', 'GOV123456789', 'TAX987654321', 'Dr. Robert Smith', 'MD123456',
    'city_animal_care', '$2a$10$encrypted_hash_here', true, true
);
