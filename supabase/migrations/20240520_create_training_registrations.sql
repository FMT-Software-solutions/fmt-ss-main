-- Create training_registrations table
CREATE TABLE IF NOT EXISTS training_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  training_id TEXT NOT NULL,  -- Sanity _id for the training
  training_slug TEXT NOT NULL, -- Slug for easier querying
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  message TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled', 'attended')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Add indexes
CREATE INDEX idx_training_registrations_training_id ON training_registrations(training_id);
CREATE INDEX idx_training_registrations_training_slug ON training_registrations(training_slug);
CREATE INDEX idx_training_registrations_email ON training_registrations(email);
CREATE INDEX idx_training_registrations_status ON training_registrations(status);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_training_registrations_updatedAt
  BEFORE UPDATE ON training_registrations
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp(); 