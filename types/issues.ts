export interface IssueData {
  issue_type: 'error' | 'warning' | 'info' | 'critical';
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  title: string;
  description?: string;
  error_message?: string;
  stack_trace?: string;
  component?: string;
  user_action?: string;
  url?: string;
  user_agent?: string;
  user_id?: string;
  session_id?: string;
  organization_id?: string;
  purchase_id?: string;
  request_data?: Record<string, any>;
  response_data?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface Issue extends IssueData {
  id: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  resolution_notes?: string;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}