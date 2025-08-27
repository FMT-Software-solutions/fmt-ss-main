'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { issuesClient } from '@/services/issues/client';
import type { Issue } from '@/types/issues';
import { AlertTriangle, Download, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import IssueDetailModal from './IssueDetailModal';
import IssueList from './IssueList';
import IssueStats from './IssueStats';

interface IssuesClientProps {
  initialIssues: Issue[];
}

export default function IssuesClient({ initialIssues }: IssuesClientProps) {
  const [issues, setIssues] = useState<Issue[]>(initialIssues);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpdateIssueStatus = async (
    issueId: string,
    status: Issue['status'],
    resolutionNotes?: string
  ) => {
    try {
      const result = await issuesClient.updateIssueStatus(
        issueId,
        status,
        resolutionNotes
      );

      if (result.success) {
        // Update the issue in the local state
        setIssues((prev) =>
          prev.map((issue) =>
            issue.id === issueId
              ? {
                  ...issue,
                  status,
                  resolved_at:
                    status === 'resolved'
                      ? new Date().toISOString()
                      : issue.resolved_at,
                  resolution_notes: resolutionNotes || issue.resolution_notes,
                }
              : issue
          )
        );

        // Update selected issue if it's the one being updated
        if (selectedIssue?.id === issueId) {
          setSelectedIssue((prev) =>
            prev
              ? {
                  ...prev,
                  status,
                  resolved_at:
                    status === 'resolved'
                      ? new Date().toISOString()
                      : prev.resolved_at,
                  resolution_notes: resolutionNotes || prev.resolution_notes,
                }
              : null
          );
        }

        toast.success('Issue status updated successfully');
      } else {
        console.error('Failed to update issue status:', result.error);
        toast.error('Failed to update issue status');
      }
    } catch (error) {
      console.error('Failed to update issue status:', error);
      toast.error('Failed to update issue status');
    }
  };

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue);
  };

  const handleCloseModal = () => {
    setSelectedIssue(null);
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const result = await issuesClient.getIssues();
      if (result.success && result.issues) {
        setIssues(result.issues);
      } else {
        toast.error(result.error || 'Failed to load issues. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to refresh issues');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    try {
      const csvContent = [
        [
          'ID',
          'Title',
          'Type',
          'Severity',
          'Status',
          'Created At',
          'User ID',
          'Organization ID',
        ].join(','),
        ...issues.map((issue) =>
          [
            issue.id,
            `"${issue.title.replace(/"/g, '""')}"`,
            issue.issue_type,
            issue.severity,
            issue.status,
            issue.created_at,
            issue.user_id || '',
            issue.organization_id || '',
          ].join(',')
        ),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `issues-${new Date().toISOString().split('T')[0]}.csv`
      );
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Issues exported to CSV');
    } catch (error) {
      console.error('Failed to export CSV:', error);
      toast.error('Failed to export CSV');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-6 w-6 text-orange-500" />
          <h1 className="text-2xl font-bold">Issues Management</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats */}
      <IssueStats issues={issues} />

      {/* Issues Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="all">All Issues</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="investigating">Investigating</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <IssueList
            issues={issues}
            onIssueClick={handleIssueClick}
            showFilters={true}
          />
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <IssueList
            issues={issues}
            onIssueClick={handleIssueClick}
            showFilters={true}
          />
        </TabsContent>

        <TabsContent value="open" className="space-y-4">
          <IssueList
            issues={issues.filter((issue) => issue.status === 'open')}
            onIssueClick={handleIssueClick}
            showFilters={false}
          />
        </TabsContent>

        <TabsContent value="investigating" className="space-y-4">
          <IssueList
            issues={issues.filter((issue) => issue.status === 'investigating')}
            onIssueClick={handleIssueClick}
            showFilters={false}
          />
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          <IssueList
            issues={issues.filter((issue) => issue.status === 'resolved')}
            onIssueClick={handleIssueClick}
            showFilters={false}
          />
        </TabsContent>
      </Tabs>

      {/* Issue Detail Modal */}
      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          open={!!selectedIssue}
          onOpenChange={(open) => !open && handleCloseModal()}
          onUpdateStatus={handleUpdateIssueStatus}
        />
      )}
    </div>
  );
}
