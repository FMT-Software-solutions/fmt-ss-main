ALTER TABLE purchases
ADD COLUMN IF NOT EXISTS payment_provider text,
ADD COLUMN IF NOT EXISTS payment_method text,
ADD COLUMN IF NOT EXISTS external_transaction_id text,
ADD COLUMN IF NOT EXISTS payment_details jsonb;
