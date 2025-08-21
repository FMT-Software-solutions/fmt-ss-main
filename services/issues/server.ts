import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import type { IssueData, Issue } from '@/types/issues';

class IssuesServerService {
  /**
   * Log an issue from server-side components or API routes
   */
  async logIssue(issueData: IssueData): Promise<{ success: boolean; error?: string; issue?: Issue }> {
    try {
      const supabase = await createClient();
      
      // Get current user if available
      const { data: { user } } = await supabase.auth.getUser();
      
      // Get request headers for additional context
      const headersList = await headers();
      const userAgent = headersList.get('user-agent') || undefined;
      const referer = headersList.get('referer') || undefined;
      const xForwardedFor = headersList.get('x-forwarded-for') || undefined;
      const xRealIp = headersList.get('x-real-ip') || undefined;
      
      // Enhance issue data with server-side context
      const enhancedData: IssueData = {
        ...issueData,
        user_id: user?.id || issueData.user_id,
        url: issueData.url || referer,
        user_agent: issueData.user_agent || userAgent,
        metadata: {
          ...issueData.metadata,
          timestamp: new Date().toISOString(),
          server_side: true,
          ip_address: xForwardedFor || xRealIp,
          referer,
          headers: {
            'user-agent': userAgent,
            'x-forwarded-for': xForwardedFor,
            'x-real-ip': xRealIp
          }
        }
      };

      const { data, error } = await supabase
        .from('issues')
        .insert([enhancedData])
        .select()
        .single();

      if (error) {
        console.error('Failed to log issue:', error);
        return { success: false, error: error.message };
      }

      return { success: true, issue: data };
    } catch (error) {
      console.error('Error logging issue:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  /**
   * Log an API error
   */
  async logApiError(
    error: Error | string,
    endpoint: string,
    method: string,
    requestData?: Record<string, any>,
    responseData?: Record<string, any>,
    statusCode?: number
  ): Promise<{ success: boolean; error?: string }> {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const stackTrace = typeof error === 'object' && error.stack ? error.stack : undefined;

    return this.logIssue({
      issue_type: 'error',
      severity: statusCode && statusCode >= 500 ? 'critical' : 'high',
      category: 'api',
      title: `API Error: ${method} ${endpoint}`,
      description: `API endpoint failed with status ${statusCode || 'unknown'}`,
      error_message: errorMessage,
      stack_trace: stackTrace,
      component: `API:${endpoint}`,
      user_action: `${method} request to ${endpoint}`,
      request_data: requestData,
      response_data: responseData,
      metadata: {
        endpoint,
        method,
        status_code: statusCode
      }
    });
  }

  /**
   * Log a database error
   */
  async logDatabaseError(
    error: Error | string,
    operation: string,
    table?: string,
    query?: string,
    data?: Record<string, any>
  ): Promise<{ success: boolean; error?: string }> {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const stackTrace = typeof error === 'object' && error.stack ? error.stack : undefined;

    return this.logIssue({
      issue_type: 'error',
      severity: 'high',
      category: 'database',
      title: `Database Error: ${operation}`,
      description: `Database operation failed${table ? ` on table: ${table}` : ''}`,
      error_message: errorMessage,
      stack_trace: stackTrace,
      component: 'Database',
      user_action: operation,
      request_data: data,
      metadata: {
        operation,
        table,
        query
      }
    });
  }

  /**
   * Log an app provisioning error
   */
  async logProvisioningError(
    error: Error | string,
    appId: string,
    appName: string,
    organizationId?: string,
    purchaseId?: string,
    provisioningData?: Record<string, any>
  ): Promise<{ success: boolean; error?: string }> {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const stackTrace = typeof error === 'object' && error.stack ? error.stack : undefined;

    return this.logIssue({
      issue_type: 'critical',
      severity: 'critical',
      category: 'provisioning',
      title: `App Provisioning Failed: ${appName}`,
      description: `Failed to provision app ${appName} (${appId})`,
      error_message: errorMessage,
      stack_trace: stackTrace,
      component: 'AppProvisioning',
      user_action: `Provisioning app: ${appName}`,
      organization_id: organizationId,
      purchase_id: purchaseId,
      request_data: provisioningData,
      metadata: {
        app_id: appId,
        app_name: appName
      }
    });
  }

  /**
   * Log an email sending error
   */
  async logEmailError(
    error: Error | string,
    emailType: string,
    recipient: string,
    organizationId?: string,
    purchaseId?: string,
    emailData?: Record<string, any>
  ): Promise<{ success: boolean; error?: string }> {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const stackTrace = typeof error === 'object' && error.stack ? error.stack : undefined;

    return this.logIssue({
      issue_type: 'error',
      severity: 'high',
      category: 'email',
      title: `Email Sending Failed: ${emailType}`,
      description: `Failed to send ${emailType} email to ${recipient}`,
      error_message: errorMessage,
      stack_trace: stackTrace,
      component: 'EmailService',
      user_action: `Sending ${emailType} email`,
      organization_id: organizationId,
      purchase_id: purchaseId,
      request_data: emailData,
      metadata: {
        email_type: emailType,
        recipient
      }
    });
  }

  /**
   * Log a purchase processing error
   */
  async logPurchaseError(
    error: Error | string,
    stage: string,
    organizationId?: string,
    purchaseId?: string,
    purchaseData?: Record<string, any>
  ): Promise<{ success: boolean; error?: string }> {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const stackTrace = typeof error === 'object' && error.stack ? error.stack : undefined;

    return this.logIssue({
      issue_type: 'critical',
      severity: 'critical',
      category: 'purchase',
      title: `Purchase Processing Error: ${stage}`,
      description: `Purchase failed at stage: ${stage}`,
      error_message: errorMessage,
      stack_trace: stackTrace,
      component: 'PurchaseProcessor',
      user_action: `Processing purchase at stage: ${stage}`,
      organization_id: organizationId,
      purchase_id: purchaseId,
      request_data: purchaseData,
      metadata: {
        purchase_stage: stage
      }
    });
  }

  /**
   * Get all issues with filtering options
   */
  async getIssues(options: {
    limit?: number;
    offset?: number;
    category?: string;
    severity?: string;
    status?: string;
    user_id?: string;
    organization_id?: string;
    purchase_id?: string;
    start_date?: string;
    end_date?: string;
  } = {}): Promise<{ success: boolean; issues?: Issue[]; total?: number; error?: string }> {
    try {
      const supabase = await createClient();
      
      let query = supabase
        .from('issues')
        .select('*', { count: 'exact' });

      // Apply filters
      if (options.category) {
        query = query.eq('category', options.category);
      }
      if (options.severity) {
        query = query.eq('severity', options.severity);
      }
      if (options.status) {
        query = query.eq('status', options.status);
      }
      if (options.user_id) {
        query = query.eq('user_id', options.user_id);
      }
      if (options.organization_id) {
        query = query.eq('organization_id', options.organization_id);
      }
      if (options.purchase_id) {
        query = query.eq('purchase_id', options.purchase_id);
      }
      if (options.start_date) {
        query = query.gte('created_at', options.start_date);
      }
      if (options.end_date) {
        query = query.lte('created_at', options.end_date);
      }

      // Apply pagination
      query = query
        .order('created_at', { ascending: false })
        .range(options.offset || 0, (options.offset || 0) + (options.limit || 50) - 1);

      const { data, error, count } = await query;

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, issues: data, total: count || 0 };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  /**
   * Update issue status
   */
  async updateIssueStatus(
    issueId: string,
    status: 'open' | 'investigating' | 'resolved' | 'closed',
    resolutionNotes?: string,
    resolvedBy?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = await createClient();
      
      const updateData: any = { status };
      
      if (status === 'resolved' || status === 'closed') {
        updateData.resolved_at = new Date().toISOString();
        if (resolutionNotes) updateData.resolution_notes = resolutionNotes;
        if (resolvedBy) updateData.resolved_by = resolvedBy;
      }

      const { error } = await supabase
        .from('issues')
        .update(updateData)
        .eq('id', issueId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }
}

// Export singleton instance
export const issuesServer = new IssuesServerService();
export default issuesServer;