-- Migration script to fix JSONB column type issue
-- This changes the availability_settings column from JSONB to TEXT

-- For veterinarians table
ALTER TABLE veterinarians ALTER COLUMN availability_settings TYPE TEXT;

-- For trainers table  
ALTER TABLE trainers ALTER COLUMN availability_settings TYPE TEXT;

-- For hospitals table
ALTER TABLE hospitals ALTER COLUMN business_hours TYPE TEXT;
