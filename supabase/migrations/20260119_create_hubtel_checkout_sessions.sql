CREATE TABLE IF NOT EXISTS hubtel_checkout_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_reference TEXT NOT NULL UNIQUE,
  billing_details JSONB NOT NULL,
  items JSONB NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  is_existing_org BOOLEAN NOT NULL DEFAULT false,
  app_provisioning_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  organization_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hubtel_checkout_sessions_reference
ON hubtel_checkout_sessions(client_reference);

CREATE INDEX IF NOT EXISTS idx_hubtel_checkout_sessions_email
ON hubtel_checkout_sessions(organization_email);

CREATE OR REPLACE FUNCTION update_hubtel_checkout_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_hubtel_checkout_sessions_updatedAt
  BEFORE UPDATE ON hubtel_checkout_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_hubtel_checkout_sessions_updated_at();
