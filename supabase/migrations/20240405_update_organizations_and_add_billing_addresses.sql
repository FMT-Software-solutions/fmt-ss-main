-- Update organizations table with new columns
ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
ADD COLUMN IF NOT EXISTS verificationStatus text NOT NULL DEFAULT 'pending' CHECK (verificationStatus IN ('pending', 'verified', 'rejected')),
ADD COLUMN IF NOT EXISTS industry text,
ADD COLUMN IF NOT EXISTS website text,
ADD COLUMN IF NOT EXISTS notificationSettings jsonb DEFAULT '{"roleChanges": true, "securityAlerts": true, "appUpdates": true}'::jsonb,
ADD COLUMN IF NOT EXISTS branding jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS logoSettings jsonb DEFAULT '{}'::jsonb;

-- Create billing_addresses table
CREATE TABLE IF NOT EXISTS billing_addresses (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    street text NOT NULL,
    city text NOT NULL,
    state text NOT NULL,
    country text NOT NULL,
    postalCode text,
    isDefault boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_billing_addresses_organizationId ON billing_addresses(organization_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_organization_default_billing_address ON billing_addresses(organization_id) WHERE isDefault = true;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON billing_addresses
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

-- Create users table if not exists
CREATE TABLE IF NOT EXISTS users (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    email text NOT NULL UNIQUE,
    firstName text,
    lastName text,
    avatar text,
    phone text,
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    emailVerified boolean NOT NULL DEFAULT false,
    lastLoginAt timestamp with time zone,
    lastActiveAt timestamp with time zone,
    preferences jsonb DEFAULT '{"theme": "system", "notifications": {"email": true, "push": true, "inApp": true}}'::jsonb,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create organization_admins table if not exists
CREATE TABLE IF NOT EXISTS organization_admins (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role text NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
    status text NOT NULL DEFAULT 'invited' CHECK (status IN ('active', 'inactive', 'invited')),
    invitedBy uuid REFERENCES users(id),
    invitedAt timestamp with time zone DEFAULT timezone('utc'::text, now()),
    joinedAt timestamp with time zone,
    lastActiveAt timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    department text,
    position text,
    UNIQUE(organization_id, user_id)
);

-- Add indexes for users and organization_admins
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_organization_members_user_id ON organization_admins(user_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_organizationId ON organization_admins(organization_id);

-- Add triggers for updated_at
CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON organization_admins
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp(); 