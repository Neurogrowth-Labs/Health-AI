-- Migration script: Migrate from custom users table to Neon Auth
-- WARNING: This will delete all existing user data. Back up if needed.

-- Step 1: Drop dependent tables (in order of dependencies)
DROP TABLE IF EXISTS password_reset_otps CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Step 2: Drop old enums if they exist (will be recreated by Drizzle)
-- Note: subscription enums are new, so they won't exist yet

-- Step 3: Create new enums
DO $$ BEGIN
    CREATE TYPE subscription_status AS ENUM ('ACTIVE', 'INACTIVE', 'CANCELLED', 'PAST_DUE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_plan AS ENUM ('FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Step 4: Create user_profiles table (linked to neon_auth.users_sync)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES neon_auth.users_sync(id),
    role user_role NOT NULL DEFAULT 'PATIENT',
    practice VARCHAR(255),
    bio TEXT,
    virtual_chat_fee INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS user_profiles_user_id_idx ON user_profiles(user_id);

-- Step 5: Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES neon_auth.users_sync(id),
    plan subscription_plan NOT NULL DEFAULT 'FREE',
    status subscription_status NOT NULL DEFAULT 'ACTIVE',
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_stripe_customer_id_idx ON subscriptions(stripe_customer_id);

-- Step 6: Recreate appointments table with Neon Auth reference
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES neon_auth.users_sync(id),
    patient_id UUID NOT NULL REFERENCES neon_auth.users_sync(id),
    date VARCHAR(10) NOT NULL,
    time_str VARCHAR(5) NOT NULL,
    type appointment_type NOT NULL,
    status appointment_status NOT NULL DEFAULT 'PENDING',
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS appointments_doctor_id_idx ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS appointments_patient_id_idx ON appointments(patient_id);

-- Step 7: Recreate chat_messages table with Neon Auth reference
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES neon_auth.users_sync(id),
    text TEXT NOT NULL,
    is_ai BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS chat_messages_sender_id_idx ON chat_messages(sender_id);

-- Step 8: Recreate documents table with Neon Auth reference
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES neon_auth.users_sync(id),
    doctor_id UUID REFERENCES neon_auth.users_sync(id),
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    upload_date TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS documents_patient_id_idx ON documents(patient_id);
CREATE INDEX IF NOT EXISTS documents_doctor_id_idx ON documents(doctor_id);

-- Done! Now run the seed script to create profiles for existing Neon Auth users.
