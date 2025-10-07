-- =============================================
-- ZOODO DATABASE - INSERT TEST DATA
-- =============================================
-- This script inserts fresh test data into the clean database schema
-- =============================================

-- Clear any existing data first
TRUNCATE TABLE reviews CASCADE;
TRUNCATE TABLE medical_records CASCADE;
TRUNCATE TABLE appointments CASCADE;
TRUNCATE TABLE pets CASCADE;
TRUNCATE TABLE pet_owners CASCADE;
TRUNCATE TABLE veterinarians CASCADE;
TRUNCATE TABLE trainers CASCADE;
TRUNCATE TABLE hospitals CASCADE;
TRUNCATE TABLE users CASCADE;

-- =============================================
-- INSERT TEST USERS
-- =============================================

-- Pet Owners
INSERT INTO users (username, email, password_hash, first_name, last_name, phone_number, user_type, address, city, state, country, postal_code, is_verified) VALUES
('john.doe', 'john.doe@example.com', '$2a$10$encrypted_hash_here', 'John', 'Doe', '+1234567890', 'pet_owner', '123 Main St', 'New York', 'NY', 'USA', '10001', true),
('emma.wilson', 'emma.wilson@example.com', '$2a$10$encrypted_hash_here', 'Emma', 'Wilson', '+1234567891', 'pet_owner', '456 Oak Ave', 'Los Angeles', 'CA', 'USA', '90210', true),
('mike.chen', 'mike.chen@example.com', '$2a$10$encrypted_hash_here', 'Mike', 'Chen', '+1234567892', 'pet_owner', '789 Pine St', 'Chicago', 'IL', 'USA', '60601', true),
('sarah.johnson', 'sarah.johnson@example.com', '$2a$10$encrypted_hash_here', 'Sarah', 'Johnson', '+1234567893', 'pet_owner', '321 Elm St', 'Miami', 'FL', 'USA', '33101', true),
('david.brown', 'david.brown@example.com', '$2a$10$encrypted_hash_here', 'David', 'Brown', '+1234567894', 'pet_owner', '654 Maple Ave', 'Seattle', 'WA', 'USA', '98101', true);

-- Veterinarians
INSERT INTO users (username, email, password_hash, first_name, last_name, phone_number, user_type, address, city, state, country, postal_code, is_verified) VALUES
('dr.smith', 'dr.smith@example.com', '$2a$10$encrypted_hash_here', 'Dr. Sarah', 'Smith', '+1234567895', 'veterinarian', '456 Oak Ave', 'Los Angeles', 'CA', 'USA', '90210', true),
('dr.jones', 'dr.jones@example.com', '$2a$10$encrypted_hash_here', 'Dr. Michael', 'Jones', '+1234567896', 'veterinarian', '789 Pine St', 'Chicago', 'IL', 'USA', '60601', true),
('dr.garcia', 'dr.garcia@example.com', '$2a$10$encrypted_hash_here', 'Dr. Maria', 'Garcia', '+1234567897', 'veterinarian', '321 Hospital Blvd', 'Miami', 'FL', 'USA', '33101', true),
('dr.lee', 'dr.lee@example.com', '$2a$10$encrypted_hash_here', 'Dr. James', 'Lee', '+1234567898', 'veterinarian', '654 Maple Ave', 'Seattle', 'WA', 'USA', '98101', true);

-- Trainers
INSERT INTO users (username, email, password_hash, first_name, last_name, phone_number, user_type, address, city, state, country, postal_code, is_verified) VALUES
('trainer.john', 'trainer.john@example.com', '$2a$10$encrypted_hash_here', 'John', 'Wilson', '+1234567899', 'trainer', '789 Pine St', 'Chicago', 'IL', 'USA', '60601', true),
('trainer.lisa', 'trainer.lisa@example.com', '$2a$10$encrypted_hash_here', 'Lisa', 'Anderson', '+1234567900', 'trainer', '321 Elm St', 'Miami', 'FL', 'USA', '33101', true),
('trainer.mark', 'trainer.mark@example.com', '$2a$10$encrypted_hash_here', 'Mark', 'Taylor', '+1234567901', 'trainer', '654 Maple Ave', 'Seattle', 'WA', 'USA', '98101', true);

-- Hospitals
INSERT INTO users (username, email, password_hash, first_name, last_name, phone_number, user_type, address, city, state, country, postal_code, is_verified) VALUES
('hospital.main', 'hospital.main@example.com', '$2a$10$encrypted_hash_here', 'Main', 'Veterinary Hospital', '+1234567902', 'hospital', '321 Hospital Blvd', 'Miami', 'FL', 'USA', '33101', true),
('clinic.paws', 'clinic.paws@example.com', '$2a$10$encrypted_hash_here', 'Paws & Claws', 'Clinic', '+1234567903', 'clinic', '654 Maple Ave', 'Seattle', 'WA', 'USA', '98101', true),
('hospital.central', 'hospital.central@example.com', '$2a$10$encrypted_hash_here', 'Central', 'Animal Hospital', '+1234567904', 'hospital', '789 Pine St', 'Chicago', 'IL', 'USA', '60601', true);

-- Admin
INSERT INTO users (username, email, password_hash, first_name, last_name, phone_number, user_type, address, city, state, country, postal_code, is_verified) VALUES
('admin', 'admin@zoodo.com', '$2a$10$encrypted_hash_here', 'System', 'Administrator', '+1234567905', 'admin', 'Admin Office', 'San Francisco', 'CA', 'USA', '94102', true);

-- =============================================
-- INSERT PET OWNER DATA
-- =============================================

INSERT INTO pet_owners (user_id) VALUES
((SELECT id FROM users WHERE username = 'john.doe')),
((SELECT id FROM users WHERE username = 'emma.wilson')),
((SELECT id FROM users WHERE username = 'mike.chen')),
((SELECT id FROM users WHERE username = 'sarah.johnson')),
((SELECT id FROM users WHERE username = 'david.brown'));

-- =============================================
-- INSERT PETS DATA
-- =============================================

INSERT INTO pets (owner_id, name, species, breed, gender, birthday, weight, weight_unit, microchip, sterilized) VALUES
-- John's pets
((SELECT id FROM users WHERE username = 'john.doe'), 'Buddy', 'Dog', 'Golden Retriever', 'male', '2020-03-15', 25.5, 'Kgs', 'CHIP123456', true),
((SELECT id FROM users WHERE username = 'john.doe'), 'Whiskers', 'Cat', 'Persian', 'female', '2019-07-22', 4.2, 'Kgs', 'CHIP789012', false),

-- Emma's pets
((SELECT id FROM users WHERE username = 'emma.wilson'), 'Max', 'Dog', 'German Shepherd', 'male', '2021-01-10', 30.0, 'Kgs', 'CHIP234567', true),
((SELECT id FROM users WHERE username = 'emma.wilson'), 'Luna', 'Cat', 'Maine Coon', 'female', '2020-05-18', 5.8, 'Kgs', 'CHIP345678', true),

-- Mike's pets
((SELECT id FROM users WHERE username = 'mike.chen'), 'Charlie', 'Dog', 'Labrador', 'male', '2019-11-03', 28.0, 'Kgs', 'CHIP456789', true),
((SELECT id FROM users WHERE username = 'mike.chen'), 'Bella', 'Cat', 'Siamese', 'female', '2021-02-14', 3.5, 'Kgs', 'CHIP567890', false),

-- Sarah's pets
((SELECT id FROM users WHERE username = 'sarah.johnson'), 'Rocky', 'Dog', 'Bulldog', 'male', '2020-08-25', 22.0, 'Kgs', 'CHIP678901', true),
((SELECT id FROM users WHERE username = 'sarah.johnson'), 'Mittens', 'Cat', 'British Shorthair', 'female', '2019-12-01', 4.5, 'Kgs', 'CHIP789012', true),

-- David's pets
((SELECT id FROM users WHERE username = 'david.brown'), 'Daisy', 'Dog', 'Beagle', 'female', '2021-04-12', 15.0, 'Kgs', 'CHIP890123', false),
((SELECT id FROM users WHERE username = 'david.brown'), 'Shadow', 'Cat', 'Ragdoll', 'male', '2020-09-30', 6.2, 'Kgs', 'CHIP901234', true);

-- =============================================
-- INSERT VETERINARIAN DATA
-- =============================================

INSERT INTO veterinarians (user_id, experience, license_number, specializations, qualifications, offer_online_consultation, offer_home_consultation, home_visit_radius, license_proof_url, profile_photo_url) VALUES
((SELECT id FROM users WHERE username = 'dr.smith'), 10, 'VET123456', ARRAY['General Veterinary Practice', 'Surgery'], ARRAY['BVSc & AH', 'MVSc'], true, true, 50, 'https://example.com/license.pdf', 'https://example.com/photo.jpg'),
((SELECT id FROM users WHERE username = 'dr.jones'), 8, 'VET234567', ARRAY['Emergency Medicine', 'Internal Medicine'], ARRAY['DVM', 'Diplomate ACVIM'], true, false, 0, 'https://example.com/license2.pdf', 'https://example.com/photo2.jpg'),
((SELECT id FROM users WHERE username = 'dr.garcia'), 12, 'VET345678', ARRAY['Dermatology', 'Allergy'], ARRAY['DVM', 'Diplomate ACVD'], true, true, 30, 'https://example.com/license3.pdf', 'https://example.com/photo3.jpg'),
((SELECT id FROM users WHERE username = 'dr.lee'), 6, 'VET456789', ARRAY['Orthopedics', 'Physical Therapy'], ARRAY['DVM', 'Certified in Canine Rehabilitation'], false, true, 40, 'https://example.com/license4.pdf', 'https://example.com/photo4.jpg');

-- =============================================
-- INSERT TRAINER DATA
-- =============================================

INSERT INTO trainers (user_id, experience, specializations, certifications, offer_home_training, home_training_radius, has_academy, academy_name, resume_url, profile_photo_url) VALUES
((SELECT id FROM users WHERE username = 'trainer.john'), 8, ARRAY['Behavioral Modification', 'Basic Obedience Training'], ARRAY['Certified Professional Dog Trainer (CPDT)'], true, 30, true, 'Paws & Progress Academy', 'https://example.com/resume.pdf', 'https://example.com/photo.jpg'),
((SELECT id FROM users WHERE username = 'trainer.lisa'), 5, ARRAY['Puppy Training', 'Socialization'], ARRAY['Certified Dog Trainer (CDT)', 'Puppy Training Specialist'], true, 25, false, NULL, 'https://example.com/resume2.pdf', 'https://example.com/photo2.jpg'),
((SELECT id FROM users WHERE username = 'trainer.mark'), 10, ARRAY['Advanced Obedience', 'Agility Training'], ARRAY['Master Dog Trainer (MDT)', 'Agility Instructor Certification'], false, 0, true, 'Elite Canine Academy', 'https://example.com/resume3.pdf', 'https://example.com/photo3.jpg');

-- =============================================
-- INSERT HOSPITAL DATA
-- =============================================

INSERT INTO hospitals (user_id, account_type, business_name, contact_person, facility_license_number, govt_registration_number, tax_id, medical_director_name, medical_director_license_number, offer_online_consultation, offer_clinic_hospital) VALUES
((SELECT id FROM users WHERE username = 'hospital.main'), 'hospital', 'Main Veterinary Hospital', 'Dr. Robert Johnson', 'HOSP123456', 'GOV123456', 'TAX123456', 'Dr. Robert Johnson', 'MD123456', true, true),
((SELECT id FROM users WHERE username = 'clinic.paws'), 'clinic', 'Paws & Claws Clinic', 'Dr. Emily Davis', 'CLIN234567', 'GOV234567', 'TAX234567', 'Dr. Emily Davis', 'MD234567', true, true),
((SELECT id FROM users WHERE username = 'hospital.central'), 'hospital', 'Central Animal Hospital', 'Dr. Michael Wilson', 'HOSP345678', 'GOV345678', 'TAX345678', 'Dr. Michael Wilson', 'MD345678', false, true);

-- =============================================
-- INSERT APPOINTMENTS DATA
-- =============================================

INSERT INTO appointments (pet_id, owner_id, provider_id, appointment_type, appointment_date, start_time, end_time, status, reason, cost, payment_status) VALUES
-- Completed appointments
((SELECT id FROM pets WHERE name = 'Buddy'), (SELECT id FROM users WHERE username = 'john.doe'), (SELECT id FROM users WHERE username = 'dr.smith'), 'clinic', '2024-01-15', '10:00:00', '11:00:00', 'completed', 'Annual checkup', 150.00, 'paid'),
((SELECT id FROM pets WHERE name = 'Max'), (SELECT id FROM users WHERE username = 'emma.wilson'), (SELECT id FROM users WHERE username = 'dr.jones'), 'clinic', '2024-01-18', '14:00:00', '15:00:00', 'completed', 'Vaccination', 120.00, 'paid'),
((SELECT id FROM pets WHERE name = 'Charlie'), (SELECT id FROM users WHERE username = 'mike.chen'), (SELECT id FROM users WHERE username = 'dr.garcia'), 'home_visit', '2024-01-20', '16:00:00', '17:00:00', 'completed', 'Skin allergy treatment', 180.00, 'paid'),

-- Scheduled appointments
((SELECT id FROM pets WHERE name = 'Whiskers'), (SELECT id FROM users WHERE username = 'john.doe'), (SELECT id FROM users WHERE username = 'dr.smith'), 'home_visit', '2024-02-05', '14:00:00', '15:00:00', 'scheduled', 'Vaccination', 200.00, 'pending'),
((SELECT id FROM pets WHERE name = 'Luna'), (SELECT id FROM users WHERE username = 'emma.wilson'), (SELECT id FROM users WHERE username = 'dr.lee'), 'clinic', '2024-02-08', '11:00:00', '12:00:00', 'scheduled', 'Physical therapy session', 160.00, 'pending'),
((SELECT id FROM pets WHERE name = 'Bella'), (SELECT id FROM users WHERE username = 'mike.chen'), (SELECT id FROM users WHERE username = 'dr.jones'), 'clinic', '2024-02-10', '09:00:00', '10:00:00', 'scheduled', 'Dental cleaning', 220.00, 'pending'),

-- Training appointments
((SELECT id FROM pets WHERE name = 'Rocky'), (SELECT id FROM users WHERE username = 'sarah.johnson'), (SELECT id FROM users WHERE username = 'trainer.john'), 'training', '2024-02-12', '15:00:00', '16:00:00', 'scheduled', 'Behavioral training session', 100.00, 'pending'),
((SELECT id FROM pets WHERE name = 'Daisy'), (SELECT id FROM users WHERE username = 'david.brown'), (SELECT id FROM users WHERE username = 'trainer.lisa'), 'training', '2024-02-15', '10:00:00', '11:00:00', 'scheduled', 'Puppy training class', 80.00, 'pending');

-- =============================================
-- INSERT MEDICAL RECORDS DATA
-- =============================================

INSERT INTO medical_records (pet_id, appointment_id, record_type, title, description, diagnosis, treatment, prescription, created_by) VALUES
-- Medical records for completed appointments
((SELECT id FROM pets WHERE name = 'Buddy'), (SELECT id FROM appointments WHERE reason = 'Annual checkup'), 'checkup', 'Annual Health Checkup', 'Routine annual examination including blood work and physical exam', 'Healthy - all parameters normal', 'No treatment needed', 'Continue current diet and exercise routine', (SELECT id FROM users WHERE username = 'dr.smith')),
((SELECT id FROM pets WHERE name = 'Max'), (SELECT id FROM appointments WHERE reason = 'Vaccination'), 'vaccination', 'DHPP Vaccination', 'Annual DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza) vaccination', 'Healthy for vaccination', 'DHPP vaccine administered', 'Monitor for any adverse reactions for 24 hours', (SELECT id FROM users WHERE username = 'dr.jones')),
((SELECT id FROM pets WHERE name = 'Charlie'), (SELECT id FROM appointments WHERE reason = 'Skin allergy treatment'), 'treatment', 'Skin Allergy Treatment', 'Treatment for seasonal skin allergies with itching and redness', 'Atopic dermatitis - seasonal allergies', 'Antihistamine injection and topical treatment', 'Continue antihistamine for 7 days, apply topical cream twice daily', (SELECT id FROM users WHERE username = 'dr.garcia')),

-- Additional medical records
((SELECT id FROM pets WHERE name = 'Luna'), NULL, 'vaccination', 'Rabies Vaccination', 'Annual rabies vaccination', 'Healthy for vaccination', 'Rabies vaccine administered', 'Monitor for any reactions', (SELECT id FROM users WHERE username = 'dr.smith')),
((SELECT id FROM pets WHERE name = 'Bella'), NULL, 'checkup', 'Pre-surgery Checkup', 'Pre-operative examination for upcoming spay surgery', 'Healthy and cleared for surgery', 'Pre-surgery blood work completed', 'Fast for 12 hours before surgery', (SELECT id FROM users WHERE username = 'dr.jones')),
((SELECT id FROM pets WHERE name = 'Rocky'), NULL, 'treatment', 'Dental Cleaning', 'Professional dental cleaning and examination', 'Mild tartar buildup, no dental disease', 'Professional cleaning performed', 'Continue daily teeth brushing', (SELECT id FROM users WHERE username = 'dr.garcia'));

-- =============================================
-- INSERT REVIEWS DATA
-- =============================================

INSERT INTO reviews (reviewer_id, provider_id, appointment_id, rating, comment, is_verified) VALUES
-- Reviews for veterinarians
((SELECT id FROM users WHERE username = 'john.doe'), (SELECT id FROM users WHERE username = 'dr.smith'), (SELECT id FROM appointments WHERE reason = 'Annual checkup'), 5, 'Excellent service! Dr. Smith was very thorough and caring. Buddy loved the visit!', true),
((SELECT id FROM users WHERE username = 'emma.wilson'), (SELECT id FROM users WHERE username = 'dr.jones'), (SELECT id FROM appointments WHERE reason = 'Vaccination'), 4, 'Dr. Jones was professional and efficient. Max was comfortable throughout the visit.', true),
((SELECT id FROM users WHERE username = 'mike.chen'), (SELECT id FROM users WHERE username = 'dr.garcia'), (SELECT id FROM appointments WHERE reason = 'Skin allergy treatment'), 5, 'Dr. Garcia is amazing! She quickly diagnosed Charlie''s skin issue and provided effective treatment.', true),

-- Reviews for trainers
((SELECT id FROM users WHERE username = 'sarah.johnson'), (SELECT id FROM users WHERE username = 'trainer.john'), NULL, 5, 'John is an excellent trainer! Rocky has improved so much in just a few sessions.', true),
((SELECT id FROM users WHERE username = 'david.brown'), (SELECT id FROM users WHERE username = 'trainer.lisa'), NULL, 4, 'Lisa is great with puppies. Daisy is learning basic commands quickly.', true),

-- Reviews for hospitals
((SELECT id FROM users WHERE username = 'john.doe'), (SELECT id FROM users WHERE username = 'hospital.main'), NULL, 5, 'Main Veterinary Hospital has excellent facilities and caring staff. Highly recommended!', true),
((SELECT id FROM users WHERE username = 'emma.wilson'), (SELECT id FROM users WHERE username = 'clinic.paws'), NULL, 4, 'Paws & Claws Clinic is clean and well-organized. The staff is friendly and professional.', true);

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Show inserted data summary
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Pet Owners', COUNT(*) FROM pet_owners
UNION ALL
SELECT 'Pets', COUNT(*) FROM pets
UNION ALL
SELECT 'Veterinarians', COUNT(*) FROM veterinarians
UNION ALL
SELECT 'Trainers', COUNT(*) FROM trainers
UNION ALL
SELECT 'Hospitals', COUNT(*) FROM hospitals
UNION ALL
SELECT 'Appointments', COUNT(*) FROM appointments
UNION ALL
SELECT 'Medical Records', COUNT(*) FROM medical_records
UNION ALL
SELECT 'Reviews', COUNT(*) FROM reviews;

-- =============================================
-- COMPLETION MESSAGE
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'TEST DATA INSERTION COMPLETED SUCCESSFULLY!';
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'Comprehensive test data has been inserted:';
    RAISE NOTICE '- 5 Pet Owners (john.doe, emma.wilson, mike.chen, sarah.johnson, david.brown)';
    RAISE NOTICE '- 4 Veterinarians (dr.smith, dr.jones, dr.garcia, dr.lee)';
    RAISE NOTICE '- 3 Trainers (trainer.john, trainer.lisa, trainer.mark)';
    RAISE NOTICE '- 3 Hospitals/Clinics (hospital.main, clinic.paws, hospital.central)';
    RAISE NOTICE '- 1 Admin (admin)';
    RAISE NOTICE '- 10 Pets (Buddy, Whiskers, Max, Luna, Charlie, Bella, Rocky, Mittens, Daisy, Shadow)';
    RAISE NOTICE '- 8 Appointments (3 completed, 5 scheduled)';
    RAISE NOTICE '- 6 Medical Records';
    RAISE NOTICE '- 7 Reviews';
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'You can now test all features with this comprehensive data!';
    RAISE NOTICE '=============================================';
END $$;
