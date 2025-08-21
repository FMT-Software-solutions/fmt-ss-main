import { issuesServer } from '@/services/issues/server';
import { AlertTriangle } from 'lucide-react';
import { Issue } from '@/types/issues';
import IssuesClient from './components/IssuesClient';

export default async function IssuesPage() {
  let issues: Issue[] = [];
  let error = null;

  try {
    const result = await issuesServer.getIssues();
    if (result.success && result.issues) {
      issues = result.issues;
    } else {
      error = result.error || 'Failed to load issues. Please try again.';
    }
  } catch (err) {
    console.error('Failed to load issues:', err);
    error = 'Failed to load issues. Please try again.';
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-red-600">Error Loading Issues</h3>
            <p className="text-gray-600 mt-2">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return <IssuesClient initialIssues={issues} />;
}