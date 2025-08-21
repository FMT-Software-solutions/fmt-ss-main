-- Create issues table for comprehensive error and issue tracking
CREATE TABLE IF NOT EXISTS issues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Issue identification
  issue_type VARCHAR(50) NOT NULL, -- 'error', 'warning', 'info', 'critical'
  severity VARCHAR(20) NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  category VARCHAR(100) NOT NULL, -- 'checkout', 'payment', 'provisioning', 'email', 'auth', etc.
  
  -- Issue details
  title VARCHAR(255) NOT NULL,
  description TEXT,
  error_message TEXT,
  stack_trace TEXT,
  
  -- Context information
  component VARCHAR(100), -- Component/page where issue occurred
  user_action VARCHAR(255), -- What the user was trying to do
  url VARCHAR(500), -- URL where issue occurred
  user_agent TEXT, -- Browser/device info
  
  -- User and session context
  user_id UUID, -- If user is authenticated
  session_id VARCHAR(255), -- Session identifier
  organization_id UUID REFERENCES organizations(id), -- If related to an organization
  purchase_id UUID REFERENCES purchases(id), -- If related to a purchase
  
  -- Request/response data
  request_data JSONB, -- Request payload that caused the issue
  response_data JSONB, -- Response data if available
  metadata JSONB, -- Additional context data
  
  -- Resolution tracking
  status VARCHAR(20) DEFAULT 'open', -- 'open', 'investigating', 'resolved', 'closed'
  resolution_notes TEXT,
  resolved_by VARCHAR(255), -- Admin/support person who resolved
  resolved_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_issues_issue_type ON issues(issue_type);
CREATE INDEX idx_issues_severity ON issues(severity);
CREATE INDEX idx_issues_category ON issues(category);
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_created_at ON issues(created_at);
CREATE INDEX idx_issues_user_id ON issues(user_id);
CREATE INDEX idx_issues_organization_id ON issues(organization_id);
CREATE INDEX idx_issues_purchase_id ON issues(purchase_id);
CREATE INDEX idx_issues_component ON issues(component);

-- Create composite indexes for common queries
CREATE INDEX idx_issues_status_severity ON issues(status, severity);
CREATE INDEX idx_issues_category_created_at ON issues(category, created_at DESC);
CREATE INDEX idx_issues_organization_status ON issues(organization_id, status) WHERE organization_id IS NOT NULL;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_issues_updated_at
    BEFORE UPDATE ON issues
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;

-- Policy for service role (full access)
CREATE POLICY "Service role can manage all issues" ON issues
  FOR ALL USING (auth.role() = 'service_role');

-- Policy for authenticated users (can only see their own issues)
CREATE POLICY "Users can view their own issues" ON issues
  FOR SELECT USING (auth.uid() = user_id);

-- Policy for admin users (assuming we have an admin role)
CREATE POLICY "Admin users can manage all issues" ON issues
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM organizations o
      WHERE o.id = (SELECT organization_id FROM auth.users WHERE id = auth.uid())
      AND o.is_admin = true
    )
  );

-- Add comments for documentation
COMMENT ON TABLE issues IS 'Comprehensive issue and error tracking table for the entire application';
COMMENT ON COLUMN issues.issue_type IS 'Type of issue: error, warning, info, critical';
COMMENT ON COLUMN issues.severity IS 'Severity level: low, medium, high, critical';
COMMENT ON COLUMN issues.category IS 'Category of issue: checkout, payment, provisioning, email, auth, etc.';
COMMENT ON COLUMN issues.component IS 'Component or page where the issue occurred';
COMMENT ON COLUMN issues.user_action IS 'Description of what the user was trying to do when the issue occurred';
COMMENT ON COLUMN issues.request_data IS 'JSON data of the request that caused the issue';
COMMENT ON COLUMN issues.response_data IS 'JSON data of the response if available';
COMMENT ON COLUMN issues.metadata IS 'Additional context data in JSON format';
COMMENT ON COLUMN issues.status IS 'Resolution status: open, investigating, resolved, closed';