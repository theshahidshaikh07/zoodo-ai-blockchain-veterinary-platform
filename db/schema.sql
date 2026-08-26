-- ╔══════════════════════════════════════════════════════════════════════╗
-- ║              ZOODO — PostgreSQL Database Schema v2                  ║
-- ║         AI-Powered Veterinary & Pet Services Platform               ║
-- ║                                                                      ║
-- ║  Covers: Pet Owners · All 8 Business Types · Verification ·         ║
-- ║          Appointments · Reviews · Payments · Notifications           ║
-- ╚══════════════════════════════════════════════════════════════════════╝

-- ─────────────────────────────────────────────────────────────────────────────
-- EXTENSIONS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";       -- UUID generation
CREATE EXTENSION IF NOT EXISTS "pg_trgm";          -- fuzzy text search (LIKE '%..%' optimisation)
CREATE EXTENSION IF NOT EXISTS "unaccent";         -- accent-insensitive search
CREATE EXTENSION IF NOT EXISTS "pgcrypto";         -- encryption helpers

-- ─────────────────────────────────────────────────────────────────────────────
-- CUSTOM ENUM TYPES
-- ─────────────────────────────────────────────────────────────────────────────

-- User roles (the 3 top-level roles)
CREATE TYPE user_role AS ENUM (
    'pet_owner',
    'business',
    'admin'
);

-- Business service categories (matches frontend exactly)
CREATE TYPE business_category AS ENUM (
    'veterinarian',
    'grooming',
    'trainer',
    'insurance',
    'shop',
    'ngo',
    'transport',
    'hotel'
);

-- Document verification states
CREATE TYPE doc_status AS ENUM (
    'not_started',    -- not yet uploaded
    'uploaded',       -- file received, pending review
    'under_review',   -- Zoodo team is reviewing
    'needs_action',   -- rejected, re-upload required
    'verified',       -- approved
    'expired'         -- previously verified, now expired
);

-- Account status
CREATE TYPE account_status AS ENUM (
    'active',
    'suspended',
    'pending_verification',
    'deleted'
);

-- Pet gender
CREATE TYPE pet_gender AS ENUM ('male', 'female', 'unknown');

-- Age units
CREATE TYPE age_unit AS ENUM ('days', 'months', 'years');

-- Weight units
CREATE TYPE weight_unit AS ENUM ('kg', 'lbs', 'g');

-- Health record types
CREATE TYPE health_record_type AS ENUM (
    'vaccination',
    'checkup',
    'surgery',
    'treatment',
    'lab_test',
    'prescription',
    'deworming',
    'dental',
    'other'
);

-- Appointment status
CREATE TYPE appointment_status AS ENUM (
    'pending',          -- submitted, awaiting business confirmation
    'confirmed',        -- business confirmed
    'in_progress',      -- ongoing (for boarding/training)
    'completed',        -- done
    'cancelled',        -- cancelled by owner or business
    'no_show'           -- owner didn't show up
);

-- Appointment mode
CREATE TYPE appointment_mode AS ENUM (
    'in_person',
    'home_visit',
    'teleconsultation',
    'boarding',
    'transport',
    'grooming',
    'training'
);

-- Price unit for business services
CREATE TYPE price_unit AS ENUM (
    'per_visit',
    'per_hour',
    'per_day',
    'per_night',
    'per_km',
    'flat'
);

-- Payment gateway
CREATE TYPE payment_gateway AS ENUM ('razorpay', 'stripe', 'upi', 'cash', 'other');

-- Payment status
CREATE TYPE payment_status AS ENUM (
    'pending',
    'paid',
    'failed',
    'refunded',
    'partially_refunded'
);

-- Notification types
CREATE TYPE notification_type AS ENUM (
    'appointment_reminder',
    'booking_confirmed',
    'booking_cancelled',
    'review_received',
    'verification_update',
    'system',
    'promotion'
);

-- Review visibility
CREATE TYPE review_status AS ENUM ('published', 'hidden', 'disputed');

-- OTP purpose
CREATE TYPE otp_purpose AS ENUM ('phone_verification', 'email_verification', 'password_reset');

-- ═════════════════════════════════════════════════════════════════════════════
--  SECTION 1 — CORE AUTH
-- ═════════════════════════════════════════════════════════════════════════════

-- ─── users ───────────────────────────────────────────────────────────────────
-- Single source of truth for all user types.
-- Extended profile data lives in pet_owner_profiles or business_profiles.
CREATE TABLE users (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username            VARCHAR(100) UNIQUE NOT NULL,
    email               VARCHAR(255) UNIQUE NOT NULL,
    password_hash       VARCHAR(255),             -- NULL when using OAuth only
    first_name          VARCHAR(100) NOT NULL,
    last_name           VARCHAR(100) NOT NULL,
    phone_number        VARCHAR(20),
    user_type           VARCHAR(20) NOT NULL,     -- Matches UserType enum values
    address             VARCHAR(500),
    city                VARCHAR(100),
    state               VARCHAR(100),
    country             VARCHAR(100) DEFAULT 'India',
    postal_code         VARCHAR(20),
    is_verified         BOOLEAN NOT NULL DEFAULT FALSE,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,

    -- OAuth (Google etc.) & Activity
    google_id           VARCHAR(255) UNIQUE,
    last_login_at       TIMESTAMPTZ,
    deleted_at          TIMESTAMPTZ,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  users                IS 'Base table for all user types — pet owners, businesses, admins.';
COMMENT ON COLUMN users.password_hash  IS 'Bcrypt hash. NULL only for pure OAuth users.';
COMMENT ON COLUMN users.google_id      IS 'Google sub claim from OAuth token.';

-- ─── refresh_tokens ──────────────────────────────────────────────────────────
-- Rotating JWT refresh tokens for secure session management.
CREATE TABLE refresh_tokens (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  VARCHAR(255) UNIQUE NOT NULL,  -- SHA-256 hash of the token
    device_info TEXT,                           -- browser/OS/device fingerprint
    ip_address  INET,
    expires_at  TIMESTAMPTZ NOT NULL,
    revoked_at  TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE refresh_tokens IS 'Rotating JWT refresh tokens. Old tokens are revoked on rotation.';

-- ─── otp_codes ───────────────────────────────────────────────────────────────
CREATE TABLE otp_codes (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    purpose     otp_purpose NOT NULL,
    target      VARCHAR(255) NOT NULL,          -- phone number or email
    code_hash   VARCHAR(255) NOT NULL,          -- bcrypt hash of the 6-digit code
    attempts    INTEGER NOT NULL DEFAULT 0,
    max_attempts INTEGER NOT NULL DEFAULT 5,
    expires_at  TIMESTAMPTZ NOT NULL,
    used_at     TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_otp_attempts CHECK (attempts <= max_attempts)
);

COMMENT ON TABLE otp_codes IS 'OTP codes for phone/email verification and password reset.';

-- ═════════════════════════════════════════════════════════════════════════════
--  SECTION 2 — PET OWNER
-- ═════════════════════════════════════════════════════════════════════════════

-- ─── pet_owner_profiles ──────────────────────────────────────────────────────
-- Extended profile data that pet owners fill in their Settings.
CREATE TABLE pet_owner_profiles (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Location
    address     TEXT,
    city        VARCHAR(100),
    state       VARCHAR(100),
    pincode     VARCHAR(20),
    country     VARCHAR(100) NOT NULL DEFAULT 'India',

    -- Emergency contact
    emergency_contact_name  VARCHAR(150),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relation VARCHAR(50),   -- e.g. 'Spouse', 'Parent'

    -- Notification preferences (stored as JSONB for flexibility)
    notification_prefs  JSONB NOT NULL DEFAULT '{
        "appointments": true,
        "health_tips": true,
        "offers": false,
        "community": true,
        "email": true,
        "push": true,
        "sms": false
    }',

    -- Privacy
    profile_visibility  VARCHAR(10) NOT NULL DEFAULT 'private'
        CHECK (profile_visibility IN ('public', 'private')),

    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE pet_owner_profiles IS 'Extended profile data for pet owners — location, emergency contact, prefs.';

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
-- VETERINARIANS TABLE
-- =============================================
CREATE TABLE veterinarians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    experience INTEGER,
    license_number VARCHAR(100) NOT NULL,
    specializations TEXT[],
    other_specialization VARCHAR(255),
    qualifications TEXT[],
    other_qualification VARCHAR(255),
    license_proof_url VARCHAR(500),
    id_proof_url VARCHAR(500),
    degree_proof_url VARCHAR(500),
    resume_url VARCHAR(500),
    profile_photo_url VARCHAR(500),
    is_affiliated BOOLEAN DEFAULT FALSE,
    affiliated_facility_name VARCHAR(255),
    affiliation_type VARCHAR(50),
    other_facility_name VARCHAR(255),
    offer_home_consultation BOOLEAN DEFAULT FALSE,
    offer_online_consultation BOOLEAN DEFAULT FALSE,
    independent_service_address TEXT,
    independent_service_same_as_personal BOOLEAN DEFAULT TRUE,
    independent_service_street VARCHAR(255),
    independent_service_city VARCHAR(100),
    independent_service_zip VARCHAR(20),
    home_visit_radius INTEGER,
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
    specializations TEXT[],
    other_specialization VARCHAR(255),
    certifications TEXT[],
    other_certification VARCHAR(255),
    resume_url VARCHAR(500),
    profile_photo_url VARCHAR(500),
    practice_type JSONB,
    offer_home_training BOOLEAN DEFAULT FALSE,
    independent_service_address TEXT,
    independent_service_same_as_personal BOOLEAN DEFAULT TRUE,
    independent_service_street VARCHAR(255),
    independent_service_city VARCHAR(100),
    independent_service_zip VARCHAR(20),
    home_training_radius INTEGER,
    has_training_center BOOLEAN DEFAULT FALSE,
    training_center_name VARCHAR(255),
    training_center_address TEXT,
    training_center_offer_in_person BOOLEAN DEFAULT FALSE,
    affiliated_facility_name VARCHAR(255),
    affiliation_type VARCHAR(50),
    has_academy BOOLEAN DEFAULT FALSE,
    academy_name VARCHAR(255),
    academy_street VARCHAR(255),
    academy_city VARCHAR(100),
    academy_state VARCHAR(100),
    academy_postal_code VARCHAR(20),
    academy_country VARCHAR(100),
    academy_phone VARCHAR(20),
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
    offer_online_consultation BOOLEAN DEFAULT FALSE,
    offer_clinic_hospital BOOLEAN DEFAULT TRUE,
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

-- ─── pets ─────────────────────────────────────────────────────────────────────
CREATE TABLE pets (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Identity
    name            VARCHAR(100) NOT NULL,
    species         VARCHAR(50)  NOT NULL,          -- 'Dog', 'Cat', 'Bird', or custom
    custom_species  VARCHAR(100),                   -- filled when species = 'Other'
    breed           VARCHAR(100),
    gender          pet_gender NOT NULL DEFAULT 'unknown',

    -- Age / DOB
    birthday        DATE,
    age             INTEGER CHECK (age >= 0),
    age_unit        age_unit NOT NULL DEFAULT 'years',

    -- Physical
    weight          NUMERIC(6,2) CHECK (weight > 0),
    weight_unit     weight_unit NOT NULL DEFAULT 'kg',
    color           VARCHAR(100),

    -- Medical basics
    sterilized          BOOLEAN,
    microchip           VARCHAR(50),
    blood_type          VARCHAR(20),        -- e.g. 'DEA 1.1 Positive' for dogs

    -- Media
    photo_url       TEXT,

    -- Notes
    notes           TEXT,

    -- Status
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,  -- false = deceased/rehomed

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_pet_species_custom CHECK (
        species != 'Other' OR custom_species IS NOT NULL
    )
);

COMMENT ON TABLE pets IS 'Pet profiles owned by pet_owner users.';
COMMENT ON COLUMN pets.birthday IS 'When set, age is computed from this. age column is manual override.';
COMMENT ON COLUMN pets.is_active IS 'FALSE for deceased or rehomed pets — kept for record history.';

-- ─── pet_health_records ───────────────────────────────────────────────────────
CREATE TABLE pet_health_records (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id          UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    record_type     health_record_type NOT NULL,

    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    diagnosis       TEXT,
    treatment       TEXT,
    prescription    TEXT,

    -- Who performed this
    performed_by_user_id    UUID REFERENCES users(id) ON DELETE SET NULL,  -- vet/trainer user
    performed_by_name       VARCHAR(150),  -- free-text if not on platform
    facility_name           VARCHAR(255),

    -- Dates
    performed_at    DATE NOT NULL,
    next_due_at     DATE,   -- for vaccinations, deworming, checkups

    -- Files (X-rays, lab reports, prescription images)
    file_urls       TEXT[],

    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE pet_health_records IS 'Health events for a pet — vaccinations, checkups, surgeries, etc.';
COMMENT ON COLUMN pet_health_records.next_due_at IS 'For recurring records like vaccinations — triggers reminder.';

-- ═════════════════════════════════════════════════════════════════════════════
--  SECTION 3 — BUSINESS
-- ═════════════════════════════════════════════════════════════════════════════

-- ─── business_profiles ───────────────────────────────────────────────────────
-- One business_profile per business user. Categories is an array so a
-- grooming spa that also does boarding can select both.
CREATE TABLE business_profiles (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Branding
    business_name   VARCHAR(255) NOT NULL,
    legal_name      VARCHAR(255),           -- legal registered name (may differ)
    categories      business_category[] NOT NULL,
    description     TEXT,
    logo_url        TEXT,
    cover_photo_url TEXT,

    -- Public contact
    public_phone    VARCHAR(20),
    public_email    VARCHAR(255),
    website         TEXT,

    -- Location
    address         TEXT,
    city            VARCHAR(100),
    state           VARCHAR(100),
    pincode         VARCHAR(20),
    country         VARCHAR(100) NOT NULL DEFAULT 'India',
    latitude        NUMERIC(10,7),
    longitude       NUMERIC(10,7),

    -- Hours (JSONB for flexibility)
    -- Format: {"mon": {"open": "09:00", "close": "18:00", "closed": false}, ...}
    operating_hours JSONB,

    -- Tax & Legal
    gst_number      VARCHAR(20),
    pan_number      VARCHAR(10),

    -- Payout
    bank_account_number  TEXT,     -- stored encrypted at app layer
    bank_name            VARCHAR(100),
    ifsc_code            VARCHAR(11),
    account_holder_name  VARCHAR(150),
    upi_id               VARCHAR(100),

    -- Verification state
    is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
    verified_at     TIMESTAMPTZ,
    verified_by     UUID REFERENCES users(id) ON DELETE SET NULL,

    -- Listing state
    is_listed       BOOLEAN NOT NULL DEFAULT FALSE,  -- goes true only after verification

    -- Cached rating (updated via trigger after each review)
    rating          NUMERIC(3,2) CHECK (rating >= 1 AND rating <= 5),
    review_count    INTEGER NOT NULL DEFAULT 0,

    -- Notifications preferences
    notification_prefs  JSONB NOT NULL DEFAULT '{
        "new_booking": true,
        "booking_cancelled": true,
        "review_received": true,
        "verification_update": true,
        "promotions": false
    }',

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_business_categories_not_empty CHECK (array_length(categories, 1) > 0)
);

COMMENT ON TABLE  business_profiles    IS 'Core profile for all business users across all 8 service categories.';
COMMENT ON COLUMN business_profiles.categories IS 'Array of service categories. A business can have multiple.';
COMMENT ON COLUMN business_profiles.is_listed   IS 'Only TRUE after verification is complete. Controls public visibility.';
COMMENT ON COLUMN business_profiles.rating      IS 'Cached average. Updated by trigger on reviews insert/update.';

-- ─── business_documents ──────────────────────────────────────────────────────
-- One row per document per business. The doc_key identifies the document type
-- (e.g. 'vcin', 'gst', 'shop_est') and matches the frontend verification checklist.
CREATE TABLE business_documents (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id     UUID NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,

    doc_key         VARCHAR(50)  NOT NULL,  -- e.g. 'vcin', 'gst', 'drug_license'
    doc_label       VARCHAR(255) NOT NULL,  -- human-readable label
    category        business_category,     -- NULL = common doc, not category-specific
    is_required     BOOLEAN NOT NULL DEFAULT TRUE,

    -- File
    file_url        TEXT,
    file_name       VARCHAR(255),
    file_size_bytes INTEGER,
    mime_type       VARCHAR(100),

    -- Status & review
    status          doc_status NOT NULL DEFAULT 'not_started',
    rejection_reason TEXT,
    reviewed_by     UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at     TIMESTAMPTZ,

    -- Expiry (for licenses)
    expires_at      DATE,

    submitted_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Each business can only have one row per doc_key
    CONSTRAINT uq_biz_doc_key UNIQUE (business_id, doc_key)
);

COMMENT ON TABLE  business_documents IS 'Verification documents per business. One row per doc type.';
COMMENT ON COLUMN business_documents.doc_key    IS 'Internal key matching the frontend verification checklist (e.g. vcin, gst, shop_est).';
COMMENT ON COLUMN business_documents.category   IS 'NULL for common docs. Set for category-specific docs.';
COMMENT ON COLUMN business_documents.expires_at IS 'For licenses with expiry — triggers re-verification reminder.';

-- ─── business_document_history ───────────────────────────────────────────────
-- Full audit trail of every status change for a document.
CREATE TABLE business_document_history (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id     UUID NOT NULL REFERENCES business_documents(id) ON DELETE CASCADE,
    from_status     doc_status,
    to_status       doc_status NOT NULL,
    changed_by      UUID REFERENCES users(id) ON DELETE SET NULL,
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE business_document_history IS 'Immutable audit log of document status transitions.';

-- ─── business_services ───────────────────────────────────────────────────────
-- Individual services offered by a business (e.g. "Full grooming – ₹500")
CREATE TABLE business_services (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id     UUID NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
    category        business_category NOT NULL,

    name            VARCHAR(255) NOT NULL,
    description     TEXT,

    -- Pricing
    price_from      NUMERIC(10,2),
    price_to        NUMERIC(10,2),      -- NULL = fixed price (same as price_from)
    price_unit      price_unit NOT NULL DEFAULT 'per_visit',
    currency        CHAR(3) NOT NULL DEFAULT 'INR',

    -- Duration
    duration_minutes SMALLINT,

    -- Availability
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,

    display_order   SMALLINT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_service_price_range CHECK (
        price_to IS NULL OR price_to >= price_from
    )
);

COMMENT ON TABLE business_services IS 'Service catalogue entries for a business listing.';

-- ─── business_photos ─────────────────────────────────────────────────────────
CREATE TABLE business_photos (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id     UUID NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
    url             TEXT NOT NULL,
    caption         VARCHAR(255),
    is_cover        BOOLEAN NOT NULL DEFAULT FALSE,
    display_order   SMALLINT NOT NULL DEFAULT 0,
    uploaded_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE business_photos IS 'Photo gallery for a business listing.';

-- ═════════════════════════════════════════════════════════════════════════════
--  SECTION 4 — APPOINTMENTS & BOOKINGS
-- ═════════════════════════════════════════════════════════════════════════════

-- ─── appointments ─────────────────────────────────────────────────────────────
CREATE TABLE appointments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id          UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    provider_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    appointment_date TIMESTAMPTZ NOT NULL,
    status          VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
    appointment_type VARCHAR(50) NOT NULL,
    notes           TEXT,
    diagnosis       TEXT,
    prescription    TEXT,
    payment_status  VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    payment_amount  DOUBLE PRECISION,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  appointments         IS 'Bookings between pet owners and businesses.';
-- ═════════════════════════════════════════════════════════════════════════════
--  SECTION 5 — PAYMENTS
-- ═════════════════════════════════════════════════════════════════════════════

CREATE TABLE payments (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id          UUID REFERENCES appointments(id) ON DELETE SET NULL,
    payer_id                UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    receiver_business_id    UUID REFERENCES business_profiles(id) ON DELETE SET NULL,

    amount                  NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    currency                CHAR(3) NOT NULL DEFAULT 'INR',
    platform_fee            NUMERIC(10,2) NOT NULL DEFAULT 0,
    business_payout         NUMERIC(10,2),   -- amount - platform_fee

    gateway                 payment_gateway NOT NULL,
    gateway_order_id        VARCHAR(255),
    gateway_payment_id      VARCHAR(255) UNIQUE,
    gateway_refund_id       VARCHAR(255),

    status                  payment_status NOT NULL DEFAULT 'pending',
    failure_reason          TEXT,

    paid_at                 TIMESTAMPTZ,
    refunded_at             TIMESTAMPTZ,
    refund_amount           NUMERIC(10,2),

    metadata                JSONB,   -- raw gateway webhook payload

    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE payments IS 'Payment records for each appointment transaction.';

-- ═════════════════════════════════════════════════════════════════════════════
--  SECTION 6 — REVIEWS
-- ═════════════════════════════════════════════════════════════════════════════

CREATE TABLE reviews (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id  UUID UNIQUE REFERENCES appointments(id) ON DELETE SET NULL, -- one review per appointment
    reviewer_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_id     UUID NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,

    rating          SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment         TEXT,

    -- Business reply
    reply_comment   TEXT,
    reply_at        TIMESTAMPTZ,

    status          review_status NOT NULL DEFAULT 'published',
    hidden_reason   TEXT,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_review_reviewer_business UNIQUE (reviewer_id, business_id, appointment_id)
);

COMMENT ON TABLE  reviews          IS 'Customer reviews on businesses. One per appointment.';
COMMENT ON COLUMN reviews.reply_comment IS 'Business owner response to the review.';

-- Trigger: update cached rating on business_profiles after each review change
CREATE OR REPLACE FUNCTION refresh_business_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE business_profiles
    SET
        rating       = (SELECT AVG(rating)   FROM reviews WHERE business_id = COALESCE(NEW.business_id, OLD.business_id) AND status = 'published'),
        review_count = (SELECT COUNT(*)      FROM reviews WHERE business_id = COALESCE(NEW.business_id, OLD.business_id) AND status = 'published'),
        updated_at   = NOW()
    WHERE id = COALESCE(NEW.business_id, OLD.business_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_refresh_rating_on_insert
    AFTER INSERT ON reviews
    FOR EACH ROW EXECUTE FUNCTION refresh_business_rating();

CREATE TRIGGER trg_refresh_rating_on_update
    AFTER UPDATE OF rating, status ON reviews
    FOR EACH ROW EXECUTE FUNCTION refresh_business_rating();

CREATE TRIGGER trg_refresh_rating_on_delete
    AFTER DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION refresh_business_rating();

-- ═════════════════════════════════════════════════════════════════════════════
--  SECTION 7 — NOTIFICATIONS
-- ═════════════════════════════════════════════════════════════════════════════

CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type            notification_type NOT NULL,
    title           VARCHAR(255) NOT NULL,
    body            TEXT,
    -- Contextual data (appointment_id, business_id, etc.)
    data            JSONB,
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    read_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE notifications IS 'In-app notifications. Data JSONB holds deep-link context.';

-- ═════════════════════════════════════════════════════════════════════════════
--  SECTION 8 — ADMIN AUDIT LOG
-- ═════════════════════════════════════════════════════════════════════════════

CREATE TABLE admin_audit_log (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id        UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    action          VARCHAR(100) NOT NULL,    -- e.g. 'VERIFY_DOCUMENT', 'SUSPEND_USER'
    target_type     VARCHAR(50),              -- e.g. 'business_document', 'user'
    target_id       UUID,
    notes           TEXT,
    ip_address      INET,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE admin_audit_log IS 'Immutable log of all admin actions for accountability.';

-- ═════════════════════════════════════════════════════════════════════════════
--  SECTION 9 — INDEXES
-- ═════════════════════════════════════════════════════════════════════════════

-- users
CREATE INDEX idx_users_email           ON users(email);
CREATE INDEX idx_users_username        ON users(username);
CREATE INDEX idx_users_user_type       ON users(user_type);
CREATE INDEX idx_users_is_active       ON users(is_active);
CREATE INDEX idx_users_google_id       ON users(google_id) WHERE google_id IS NOT NULL;
CREATE INDEX idx_users_deleted_at      ON users(deleted_at) WHERE deleted_at IS NULL;

-- refresh_tokens
CREATE INDEX idx_refresh_tokens_user   ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_hash   ON refresh_tokens(token_hash);
CREATE INDEX idx_refresh_tokens_expiry ON refresh_tokens(expires_at);

-- otp_codes
CREATE INDEX idx_otp_user              ON otp_codes(user_id);
CREATE INDEX idx_otp_expiry            ON otp_codes(expires_at);

-- pet_owner_profiles
CREATE INDEX idx_pop_user              ON pet_owner_profiles(user_id);

-- pets
CREATE INDEX idx_pets_owner            ON pets(owner_id);
CREATE INDEX idx_pets_species          ON pets(species);
CREATE INDEX idx_pets_active           ON pets(owner_id) WHERE is_active = TRUE;
CREATE INDEX idx_pets_name_trgm        ON pets USING gin(name gin_trgm_ops);

-- pet_health_records
CREATE INDEX idx_phr_pet               ON pet_health_records(pet_id);
CREATE INDEX idx_phr_type              ON pet_health_records(record_type);
CREATE INDEX idx_phr_next_due          ON pet_health_records(next_due_at) WHERE next_due_at IS NOT NULL;

-- business_profiles
CREATE INDEX idx_biz_user              ON business_profiles(user_id);
CREATE INDEX idx_biz_city              ON business_profiles(city);
CREATE INDEX idx_biz_listed            ON business_profiles(is_listed, is_verified);
CREATE INDEX idx_biz_rating            ON business_profiles(rating DESC NULLS LAST);
CREATE INDEX idx_biz_name_trgm         ON business_profiles USING gin(business_name gin_trgm_ops);
-- GIN index for array containment queries: WHERE 'grooming' = ANY(categories)
CREATE INDEX idx_biz_categories        ON business_profiles USING gin(categories);
-- Geo proximity queries (requires PostGIS for full support — this covers basic lat/lon filtering)
CREATE INDEX idx_biz_geo               ON business_profiles(latitude, longitude)
    WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- business_documents
CREATE INDEX idx_bdoc_business         ON business_documents(business_id);
CREATE INDEX idx_bdoc_status           ON business_documents(status);
CREATE INDEX idx_bdoc_expiry           ON business_documents(expires_at) WHERE expires_at IS NOT NULL;

-- business_services
CREATE INDEX idx_bsvc_business         ON business_services(business_id);
CREATE INDEX idx_bsvc_active           ON business_services(business_id) WHERE is_active = TRUE;

-- business_photos
CREATE INDEX idx_bphoto_business       ON business_photos(business_id);

-- appointments
CREATE INDEX idx_appt_pet              ON appointments(pet_id);
CREATE INDEX idx_appt_date             ON appointments(appointment_date);
CREATE INDEX idx_appt_status           ON appointments(status);
CREATE INDEX idx_appt_provider_date    ON appointments(provider_id, appointment_date);

-- payments
CREATE INDEX idx_pay_appointment       ON payments(appointment_id);
CREATE INDEX idx_pay_payer             ON payments(payer_id);
CREATE INDEX idx_pay_gateway_id        ON payments(gateway_payment_id) WHERE gateway_payment_id IS NOT NULL;

-- reviews
CREATE INDEX idx_rev_business          ON reviews(business_id);
CREATE INDEX idx_rev_reviewer          ON reviews(reviewer_id);
CREATE INDEX idx_rev_status            ON reviews(business_id, status);

-- notifications
CREATE INDEX idx_notif_user            ON notifications(user_id);
CREATE INDEX idx_notif_unread          ON notifications(user_id) WHERE is_read = FALSE;
CREATE INDEX idx_notif_type            ON notifications(type);

-- ═════════════════════════════════════════════════════════════════════════════
--  SECTION 10 — AUTO updated_at TRIGGER
-- ═════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_pop_updated_at
    BEFORE UPDATE ON pet_owner_profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_pets_updated_at
    BEFORE UPDATE ON pets FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_phr_updated_at
    BEFORE UPDATE ON pet_health_records FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_biz_updated_at
    BEFORE UPDATE ON business_profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_bdoc_updated_at
    BEFORE UPDATE ON business_documents FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_bsvc_updated_at
    BEFORE UPDATE ON business_services FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_appt_updated_at
    BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_pay_updated_at
    BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_rev_updated_at
    BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ═════════════════════════════════════════════════════════════════════════════
--  SECTION 11 — UTILITY FUNCTIONS
-- ═════════════════════════════════════════════════════════════════════════════

-- Calculate human-readable age from birthday
CREATE OR REPLACE FUNCTION calculate_pet_age(birthday DATE)
RETURNS TEXT AS $$
DECLARE
    days   INTEGER;
    months INTEGER;
BEGIN
    IF birthday IS NULL THEN RETURN NULL; END IF;
    days := CURRENT_DATE - birthday;
    IF days < 0 THEN RETURN 'Invalid DOB'; END IF;
    IF days < 30  THEN RETURN days || ' day'   || CASE WHEN days  = 1 THEN '' ELSE 's' END; END IF;
    months := FLOOR(days / 30.44);
    IF months < 12 THEN RETURN months || ' month' || CASE WHEN months = 1 THEN '' ELSE 's' END; END IF;
    RETURN FLOOR(months / 12) || ' year' || CASE WHEN FLOOR(months / 12) = 1 THEN '' ELSE 's' END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION calculate_pet_age IS 'Returns human-readable age string from a DATE of birth.';

-- Profile completion score for pet owners (0–100)
CREATE OR REPLACE FUNCTION get_pet_owner_completion(p_user_id UUID)
RETURNS SMALLINT AS $$
DECLARE
    score   SMALLINT := 0;
    u       users%ROWTYPE;
    prof    pet_owner_profiles%ROWTYPE;
    pet_cnt INTEGER;
BEGIN
    SELECT * INTO u    FROM users              WHERE id = p_user_id;
    SELECT * INTO prof FROM pet_owner_profiles WHERE user_id = p_user_id;
    SELECT COUNT(*) INTO pet_cnt FROM pets     WHERE owner_id = p_user_id AND is_active = TRUE;

    IF u.first_name IS NOT NULL AND u.last_name IS NOT NULL THEN score := score + 15; END IF;
    IF u.is_verified                                         THEN score := score + 15; END IF;
    IF u.phone_number IS NOT NULL                            THEN score := score + 20; END IF;
    IF prof.address IS NOT NULL AND prof.city IS NOT NULL    THEN score := score + 15; END IF;
    IF prof.emergency_contact_name IS NOT NULL               THEN score := score + 15; END IF;
    IF pet_cnt > 0                                           THEN score := score + 20; END IF;

    RETURN LEAST(score, 100);
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_pet_owner_completion IS 'Returns profile completion score (0-100) for a pet owner.';

-- Business verification score: required docs verified / total required docs
CREATE OR REPLACE FUNCTION get_business_verification_score(p_business_id UUID)
RETURNS NUMERIC AS $$
DECLARE
    total_req   INTEGER;
    verified    INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_req FROM business_documents WHERE business_id = p_business_id AND is_required = TRUE;
    SELECT COUNT(*) INTO verified  FROM business_documents WHERE business_id = p_business_id AND is_required = TRUE AND status = 'verified';
    IF total_req = 0 THEN RETURN 0; END IF;
    RETURN ROUND((verified::NUMERIC / total_req) * 100, 1);
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_business_verification_score IS 'Returns % of required documents verified for a business.';

-- ═════════════════════════════════════════════════════════════════════════════
--  SECTION 12 — VIEWS
-- ═════════════════════════════════════════════════════════════════════════════

-- Public business listing view (used by search/browse pages)
CREATE OR REPLACE VIEW v_business_listing AS
SELECT
    bp.id,
    bp.business_name,
    bp.categories,
    bp.description,
    bp.logo_url,
    bp.cover_photo_url,
    bp.city,
    bp.state,
    bp.country,
    bp.latitude,
    bp.longitude,
    bp.public_phone,
    bp.website,
    bp.operating_hours,
    bp.rating,
    bp.review_count,
    bp.is_verified,
    bp.is_listed,
    get_business_verification_score(bp.id) AS verification_score,
    u.email AS owner_email,
    u.first_name || ' ' || u.last_name AS owner_name,
    bp.created_at
FROM business_profiles bp
JOIN users u ON u.id = bp.user_id
WHERE u.is_active = TRUE
  AND u.deleted_at IS NULL;

COMMENT ON VIEW v_business_listing IS 'Public-facing business listing with owner info and verification score.';

-- Pet owner summary with pet count and profile completion
CREATE OR REPLACE VIEW v_pet_owner_summary AS
SELECT
    u.id,
    u.username,
    u.email,
    u.first_name,
    u.last_name,
    u.phone_number,
    u.is_verified,
    pop.city,
    pop.state,
    pop.country,
    pop.emergency_contact_name,
    pop.notification_prefs,
    pop.profile_visibility,
    COUNT(p.id) FILTER (WHERE p.is_active = TRUE) AS active_pet_count,
    get_pet_owner_completion(u.id) AS profile_completion,
    u.created_at
FROM users u
LEFT JOIN pet_owner_profiles pop ON pop.user_id = u.id
LEFT JOIN pets p ON p.owner_id = u.id
WHERE u.user_type = 'pet_owner'
  AND u.is_active = TRUE
  AND u.deleted_at IS NULL
GROUP BY u.id, pop.id;

COMMENT ON VIEW v_pet_owner_summary IS 'Pet owner dashboard summary with completion score and pet count.';

-- Pets with computed age string
CREATE OR REPLACE VIEW v_pets_with_age AS
SELECT
    p.*,
    calculate_pet_age(p.birthday) AS computed_age,
    u.first_name || ' ' || u.last_name AS owner_name
FROM pets p
JOIN users u ON u.id = p.owner_id
WHERE p.is_active = TRUE;

COMMENT ON VIEW v_pets_with_age IS 'Active pets with human-readable computed age.';

-- Upcoming appointments (next 30 days) for easy dashboard queries
CREATE OR REPLACE VIEW v_upcoming_appointments AS
SELECT
    a.*,
    u_provider.first_name || ' ' || u_provider.last_name AS provider_name,
    p.name AS pet_name,
    p.species AS pet_species,
    u_owner.first_name || ' ' || u_owner.last_name AS owner_name
FROM appointments a
JOIN users          u_provider ON u_provider.id = a.provider_id
LEFT JOIN pets      p  ON p.id  = a.pet_id
JOIN users          u_owner ON u_owner.id = p.owner_id
WHERE a.appointment_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
  AND a.status IN ('PENDING', 'CONFIRMED');

COMMENT ON VIEW v_upcoming_appointments IS 'Appointments in the next 30 days with joined context.';

-- ═════════════════════════════════════════════════════════════════════════════
--  SECTION 13 — SEED DATA (minimal, for development)
-- ═════════════════════════════════════════════════════════════════════════════

-- NOTE: passwords below are bcrypt hashes of 'Zoodo@123' — change before production.
-- Generate with: SELECT crypt('Zoodo@123', gen_salt('bf', 12));

INSERT INTO users (user_type, email, is_verified, username, password_hash, first_name, last_name, phone_number, is_active)
VALUES
    ('admin',      'admin@zoodo.com',        TRUE, '@zoodo_admin',   '$2a$12$PLACEHOLDER_HASH', 'Zoodo',     'Admin',    NULL,           TRUE),
    ('pet_owner',  'riya@example.com',        TRUE, '@riya_sharma',   '$2a$12$PLACEHOLDER_HASH', 'Riya',      'Sharma',   '+919800000001', TRUE),
    ('pet_owner',  'arjun@example.com',       TRUE, '@arjun_mehta',   '$2a$12$PLACEHOLDER_HASH', 'Arjun',     'Mehta',    '+919800000002', TRUE),
    ('business',   'pawsclinic@example.com',  TRUE, '@paws_clinic',   '$2a$12$PLACEHOLDER_HASH', 'Dr. Priya', 'Nair',     '+919800000003', TRUE),
    ('business',   'happygrooming@example.com',TRUE,'@happy_groom',   '$2a$12$PLACEHOLDER_HASH', 'Karan',     'Verma',    '+919800000004', TRUE)
ON CONFLICT DO NOTHING;

-- Pet owner profiles
INSERT INTO pet_owner_profiles (user_id, address, city, state, pincode, emergency_contact_name, emergency_contact_phone)
SELECT id, '12 MG Road', 'Bengaluru', 'Karnataka', '560001', 'Rohan Sharma', '+919800000099'
FROM users WHERE username = '@riya_sharma'
ON CONFLICT DO NOTHING;

INSERT INTO pet_owner_profiles (user_id, address, city, state, pincode)
SELECT id, '45 Andheri West', 'Mumbai', 'Maharashtra', '400053'
FROM users WHERE username = '@arjun_mehta'
ON CONFLICT DO NOTHING;

-- Sample pets
INSERT INTO pets (owner_id, name, species, breed, gender, birthday, weight, weight_unit, sterilized)
SELECT u.id, 'Mochi', 'Dog', 'Shih Tzu', 'female', '2021-06-10', 4.5, 'kg', TRUE
FROM users u WHERE u.username = '@riya_sharma'
ON CONFLICT DO NOTHING;

INSERT INTO pets (owner_id, name, species, breed, gender, birthday, weight, weight_unit, sterilized)
SELECT u.id, 'Shadow', 'Cat', 'Bombay', 'male', '2020-11-22', 3.8, 'kg', FALSE
FROM users u WHERE u.username = '@arjun_mehta'
ON CONFLICT DO NOTHING;

-- Business profiles
INSERT INTO business_profiles (user_id, business_name, categories, description, city, state, pincode, public_phone)
SELECT
    u.id,
    'Paws & Care Veterinary Clinic',
    ARRAY['veterinarian']::business_category[],
    'A full-service small animal clinic providing expert medical care for dogs, cats, birds, and exotic pets.',
    'Bengaluru', 'Karnataka', '560001', '+919800000003'
FROM users u WHERE u.username = '@paws_clinic'
ON CONFLICT DO NOTHING;

INSERT INTO business_profiles (user_id, business_name, categories, description, city, state, pincode, public_phone)
SELECT
    u.id,
    'Happy Tails Grooming & Spa',
    ARRAY['grooming', 'hotel']::business_category[],
    'Premium grooming, bath & blowdry, and overnight boarding for your beloved pets.',
    'Bengaluru', 'Karnataka', '560080', '+919800000004'
FROM users u WHERE u.username = '@happy_groom'
ON CONFLICT DO NOTHING;

-- Verification documents for vet clinic
INSERT INTO business_documents (business_id, doc_key, doc_label, category, is_required, status)
SELECT bp.id, unnested.doc_key, unnested.doc_label, unnested.cat::business_category, unnested.req, 'not_started'::doc_status
FROM business_profiles bp
JOIN users u ON u.id = bp.user_id
CROSS JOIN (
     VALUES
        ('phone_verified',  'Phone Number (OTP)', NULL,            TRUE),
        ('business_address','Business Address Proof', NULL,        TRUE),
        ('logo_photos',     'Business Logo & Photos (3+)', NULL,   TRUE),
        ('bank_account',    'Bank Account / UPI', NULL,            TRUE),
        ('gst',             'GST Registration', NULL,              FALSE),
        ('vcin',            'Veterinary Council Registration (VCIN)', 'veterinarian', TRUE),
        ('degree',          'Degree Certificate (BVSc & AH)', 'veterinarian', TRUE),
        ('clinical_est',    'Clinical Establishment Certificate', 'veterinarian', TRUE),
        ('practice_license','Practicing License', 'veterinarian',  TRUE)
     ) AS unnested(doc_key, doc_label, cat, req)
WHERE u.username = '@paws_clinic'
ON CONFLICT (business_id, doc_key) DO NOTHING;
