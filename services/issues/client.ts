'use client';

import { createClient } from '@/lib/supabase/browser';
import type { IssueData, Issue } from '@/types/issues';

class IssuesClientService {
  private supabase = createClient();

  /**
   * Log an issue from client-side components
   */
  async logIssue(issueData: IssueData): Promise<{ success: boolean; error?: string; issue?: Issue }> {
    try {
      // Get current user if available
      const { data: { user } } = await this.supabase.auth.getUser();
      
      // Enhance issue data with client-side context
      const enhancedData: IssueData = {
        ...issueData,
        user_id: user?.id || issueData.user_id,
        url: issueData.url || (typeof window !== 'undefined' ? window.location.href : undefined),
        user_agent: issueData.user_agent || (typeof navigator !== 'undefined' ? navigator.userAgent : undefined),
        session_id: issueData.session_id || this.generateSessionId(),
        metadata: {
          ...issueData.metadata,
          timestamp: new Date().toISOString(),
          client_side: true,
          viewport: typeof window !== 'undefined' ? {
            width: window.innerWidth,
            height: window.innerHeight
          } : undefined
        }
      };

      const { data, error } = await this.supabase
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
   * Log a checkout error
   */
  async logCheckoutError(
    error: Error | string,
    component: string,
    userAction: string,
    additionalData?: Record<string, any>
  ): Promise<{ success: boolean; error?: string }> {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const stackTrace = typeof error === 'object' && error.stack ? error.stack : undefined;

    return this.logIssue({
      issue_type: 'error',
      severity: 'high',
      category: 'checkout',
      title: `Checkout Error in ${component}`,
      description: `Error occurred during: ${userAction}`,
      error_message: errorMessage,
      stack_trace: stackTrace,
      component,
      user_action: userAction,
      metadata: additionalData
    });
  }

  /**
   * Log a payment error
   */
  async logPaymentError(
    error: Error | string,
    paymentData?: Record<string, any>,
    userAction?: string
  ): Promise<{ success: boolean; error?: string }> {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const stackTrace = typeof error === 'object' && error.stack ? error.stack : undefined;

    return this.logIssue({
      issue_type: 'critical',
      severity: 'critical',
      category: 'payment',
      title: 'Payment Processing Error',
      description: `Payment failed: ${userAction || 'Unknown action'}`,
      error_message: errorMessage,
      stack_trace: stackTrace,
      component: 'PaymentProcessor',
      user_action: userAction || 'Processing payment',
      request_data: paymentData
    });
  }

  /**
   * Log a form validation error
   */
  async logValidationError(
    fieldName: string,
    validationMessage: string,
    formData?: Record<string, any>,
    component?: string
  ): Promise<{ success: boolean; error?: string }> {
    return this.logIssue({
      issue_type: 'warning',
      severity: 'medium',
      category: 'validation',
      title: `Form Validation Error: ${fieldName}`,
      description: validationMessage,
      component: component || 'FormComponent',
      user_action: `Validating field: ${fieldName}`,
      request_data: formData
    });
  }

  /**
   * Log a general application error
   */
  async logAppError(
    error: Error | string,
    component: string,
    category: string = 'general',
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    additionalData?: Record<string, any>
  ): Promise<{ success: boolean; error?: string }> {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const stackTrace = typeof error === 'object' && error.stack ? error.stack : undefined;

    return this.logIssue({
      issue_type: 'error',
      severity,
      category,
      title: `Application Error in ${component}`,
      error_message: errorMessage,
      stack_trace: stackTrace,
      component,
      metadata: additionalData
    });
  }

  /**
   * Get issues for the current user
   */
  async getUserIssues(limit: number = 50): Promise<{ success: boolean; issues?: Issue[]; error?: string }> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { data, error } = await this.supabase
        .from('issues')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, issues: data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  /**
   * Get all issues (admin only)
   */
  async getIssues(filters?: {
    status?: string;
    severity?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ success: boolean; issues?: Issue[]; total?: number; error?: string }> {
    try {
      let query = this.supabase
        .from('issues')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters?.severity && filters.severity !== 'all') {
        query = query.eq('severity', filters.severity);
      }
      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      // Apply pagination
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      if (filters?.offset) {
        query = query.range(filters.offset, (filters.offset + (filters.limit || 50)) - 1);
      }

      // Order by created_at descending
      query = query.order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, issues: data || [], total: count || 0 };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  /**
   * Update issue status (admin only)
   */
  async updateIssueStatus(
    issueId: string, 
    status: Issue['status'], 
    resolutionNotes?: string
  ): Promise<{ success: boolean; issue?: Issue; error?: string }> {
    try {
      const updateData: Partial<Issue> = {
        status,
        updated_at: new Date().toISOString()
      };

      if (resolutionNotes) {
        updateData.resolution_notes = resolutionNotes;
      }

      if (status === 'resolved' || status === 'closed') {
        updateData.resolved_at = new Date().toISOString();
      }

      const { data, error } = await this.supabase
        .from('issues')
        .update(updateData)
        .eq('id', issueId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, issue: data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  /**
   * Generate a session ID for tracking
   */
  private generateSessionId(): string {
    if (typeof window !== 'undefined') {
      // Try to get existing session ID from sessionStorage
      let sessionId = sessionStorage.getItem('app_session_id');
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('app_session_id', sessionId);
      }
      return sessionId;
    }
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const issuesClient = new IssuesClientService();
export default issuesClient;