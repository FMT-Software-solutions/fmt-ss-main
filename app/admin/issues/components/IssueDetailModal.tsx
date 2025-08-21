'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Clock, CheckCircle, XCircle, User, Calendar, Globe, Smartphone, Database, Code } from 'lucide-react';
import type { Issue } from '@/types/issues';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface IssueDetailModalProps {
  issue: Issue | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (issueId: string, status: Issue['status'], resolutionNotes?: string) => Promise<void>;
}

const severityColors = {
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const statusColors = {
  open: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  investigating: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

const statusIcons = {
  open: AlertCircle,
  investigating: Clock,
  resolved: CheckCircle,
  closed: XCircle,
};

export default function IssueDetailModal({ issue, open, onOpenChange, onUpdateStatus }: IssueDetailModalProps) {
  const [newStatus, setNewStatus] = useState<Issue['status'] | ''>('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  if (!issue) return null;

  const StatusIcon = statusIcons[issue.status];

  const handleStatusUpdate = async () => {
    if (!newStatus) {
      toast.error('Please select a status');
      return;
    }

    setUpdating(true);
    try {
      await onUpdateStatus(issue.id, newStatus, resolutionNotes || undefined);
      setNewStatus('');
      setResolutionNotes('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const renderMetadataValue = (value: any): string => {
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <StatusIcon className="h-5 w-5" />
            <DialogTitle className="flex-1">{issue.title}</DialogTitle>
            <Badge className={cn('text-xs', severityColors[issue.severity])}>
              {issue.severity}
            </Badge>
            <Badge className={cn('text-xs', statusColors[issue.status])}>
              {issue.status}
            </Badge>
          </div>
          <DialogDescription>
            Issue #{issue.id.slice(-8)} • {issue.category} • Created {formatDate(issue.created_at)}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="context">Context</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Issue Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {issue.description && (
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {issue.description}
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Issue Type</h4>
                    <Badge variant="outline">{issue.issue_type}</Badge>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Category</h4>
                    <Badge variant="outline">{issue.category}</Badge>
                  </div>
                  {issue.component && (
                    <div>
                      <h4 className="font-medium mb-2">Component</h4>
                      <Badge variant="outline">{issue.component}</Badge>
                    </div>
                  )}
                  {issue.user_action && (
                    <div>
                      <h4 className="font-medium mb-2">User Action</h4>
                      <Badge variant="outline">{issue.user_action}</Badge>
                    </div>
                  )}
                </div>

                {issue.error_message && (
                  <div>
                    <h4 className="font-medium mb-2">Error Message</h4>
                    <div className="bg-muted p-3 rounded-md">
                      <code className="text-sm">{issue.error_message}</code>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Technical Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {issue.stack_trace && (
                  <div>
                    <h4 className="font-medium mb-2">Stack Trace</h4>
                    <div className="bg-muted p-3 rounded-md max-h-60 overflow-y-auto">
                      <pre className="text-xs whitespace-pre-wrap">{issue.stack_trace}</pre>
                    </div>
                  </div>
                )}

                {issue.request_data && (
                  <div>
                    <h4 className="font-medium mb-2">Request Data</h4>
                    <div className="bg-muted p-3 rounded-md max-h-40 overflow-y-auto">
                      <pre className="text-xs">{renderMetadataValue(issue.request_data)}</pre>
                    </div>
                  </div>
                )}

                {issue.response_data && (
                  <div>
                    <h4 className="font-medium mb-2">Response Data</h4>
                    <div className="bg-muted p-3 rounded-md max-h-40 overflow-y-auto">
                      <pre className="text-xs">{renderMetadataValue(issue.response_data)}</pre>
                    </div>
                  </div>
                )}

                {issue.metadata && (
                  <div>
                    <h4 className="font-medium mb-2">Additional Metadata</h4>
                    <div className="bg-muted p-3 rounded-md max-h-40 overflow-y-auto">
                      <pre className="text-xs">{renderMetadataValue(issue.metadata)}</pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="context" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    User Context
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {issue.user_id && (
                    <div>
                      <span className="text-sm font-medium">User ID:</span>
                      <p className="text-sm text-muted-foreground">{issue.user_id}</p>
                    </div>
                  )}
                  {issue.session_id && (
                    <div>
                      <span className="text-sm font-medium">Session ID:</span>
                      <p className="text-sm text-muted-foreground">{issue.session_id}</p>
                    </div>
                  )}
                  {issue.organization_id && (
                    <div>
                      <span className="text-sm font-medium">Organization ID:</span>
                      <p className="text-sm text-muted-foreground">{issue.organization_id}</p>
                    </div>
                  )}
                  {issue.purchase_id && (
                    <div>
                      <span className="text-sm font-medium">Purchase ID:</span>
                      <p className="text-sm text-muted-foreground">{issue.purchase_id}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Environment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {issue.url && (
                    <div>
                      <span className="text-sm font-medium">URL:</span>
                      <p className="text-sm text-muted-foreground break-all">{issue.url}</p>
                    </div>
                  )}
                  {issue.user_agent && (
                    <div>
                      <span className="text-sm font-medium">User Agent:</span>
                      <p className="text-sm text-muted-foreground break-all">{issue.user_agent}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium">Created:</span>
                    <p className="text-sm text-muted-foreground">{formatDate(issue.created_at)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Last Updated:</span>
                    <p className="text-sm text-muted-foreground">{formatDate(issue.updated_at)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Update Issue Status</CardTitle>
                <CardDescription>
                  Change the status of this issue and add resolution notes if applicable.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium mb-2 block">New Status</label>
                    <Select value={newStatus} onValueChange={(value) => setNewStatus(value as Issue['status'])}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select new status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="investigating">Investigating</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Resolution Notes (Optional)</label>
                  <Textarea
                    placeholder="Add notes about the resolution or investigation..."
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleStatusUpdate} 
                    disabled={!newStatus || updating}
                  >
                    {updating ? 'Updating...' : 'Update Status'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setNewStatus('');
                      setResolutionNotes('');
                    }}
                  >
                    Reset
                  </Button>
                </div>

                {issue.resolution_notes && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-2">Previous Resolution Notes</h4>
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm whitespace-pre-wrap">{issue.resolution_notes}</p>
                      {issue.resolved_by && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Resolved by: {issue.resolved_by}
                        </p>
                      )}
                      {issue.resolved_at && (
                        <p className="text-xs text-muted-foreground">
                          Resolved at: {formatDate(issue.resolved_at)}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}