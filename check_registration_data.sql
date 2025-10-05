-- Check if veterinarian registration data is stored in database
-- Run this in your PostgreSQL database

-- 1. Check users table for veterinarian registrations
SELECT 
    id,
    username,
    email,
    first_name,
    last_name,
    user_type,
    phone,
    address,
    is_verified,
    is_active,
    created_at
FROM users 
WHERE user_type = 'veterinarian'
ORDER BY created_at DESC;

-- 2. Check veterinarians table for professional details
SELECT 
    v.id,
    v.license_number,
    v.experience,
    v.is_affiliated,
    v.affiliated_facility_name,
    v.offer_online_consultation,
    v.offer_home_visits,
    v.home_visit_radius,
    v.created_at,
    u.username,
    u.email
FROM veterinarians v
JOIN users u ON v.user_id = u.id
ORDER BY v.created_at DESC;

-- 3. Check if files were uploaded (file paths)
SELECT 
    v.id,
    v.license_proof_url,
    v.id_proof_url,
    v.degree_proof_url,
    v.profile_photo_url,
    u.username
FROM veterinarians v
JOIN users u ON v.user_id = u.id
WHERE v.license_proof_url IS NOT NULL
ORDER BY v.created_at DESC;

-- 4. Count total veterinarians registered
SELECT 
    COUNT(*) as total_veterinarians,
    COUNT(CASE WHEN is_verified = true THEN 1 END) as verified_veterinarians,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_veterinarians
FROM users 
WHERE user_type = 'veterinarian';

-- 5. Check recent registrations (last 24 hours)
SELECT 
    username,
    email,
    first_name,
    last_name,
    created_at,
    is_verified
FROM users 
WHERE user_type = 'veterinarian' 
AND created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
