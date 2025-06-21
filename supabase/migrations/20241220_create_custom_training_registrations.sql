-- Create custom_training_registrations table
CREATE TABLE IF NOT EXISTS custom_training_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    training_id TEXT NOT NULL,
    training_slug TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    details JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_custom_training_registrations_training_slug 
ON custom_training_registrations(training_slug);

CREATE INDEX IF NOT EXISTS idx_custom_training_registrations_email 
ON custom_training_registrations(email);

CREATE INDEX IF NOT EXISTS idx_custom_training_registrations_status 
ON custom_training_registrations(status);

CREATE INDEX IF NOT EXISTS idx_custom_training_registrations_created_at 
ON custom_training_registrations(created_at);

-- Create unique constraint to prevent duplicate registrations
CREATE UNIQUE INDEX IF NOT EXISTS idx_custom_training_registrations_unique_email_training 
ON custom_training_registrations(email, training_slug);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_custom_training_registrations_updated_at
    BEFORE UPDATE ON custom_training_registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE custom_training_registrations IS 'Stores custom training registration data with flexible details in JSONB';
COMMENT ON COLUMN custom_training_registrations.training_id IS 'Sanity CMS training document ID';
COMMENT ON COLUMN custom_training_registrations.training_slug IS 'Training slug for easy reference';
COMMENT ON COLUMN custom_training_registrations.status IS 'Registration status: pending, confirmed, cancelled, completed';
COMMENT ON COLUMN custom_training_registrations.details IS 'Flexible storage for custom registration fields (about, experience, expectations, etc.)'; 