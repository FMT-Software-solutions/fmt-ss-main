'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { AlertCircle, Clock, CheckCircle, XCircle, Eye, Search, Filter, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { Issue } from '@/types/issues';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface IssueListProps {
  issues: Issue[];
  loading?: boolean;
  onIssueClick: (issue: Issue) => void;
  showFilters?: boolean;
}

type SortField = 'created_at' | 'severity' | 'status' | 'type';
type SortDirection = 'asc' | 'desc';

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200';
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200';
    case 'low':
      return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-200';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open':
      return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200';
    case 'investigating':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200';
    case 'resolved':
      return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200';
    case 'closed':
      return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'open':
      return <AlertCircle className="h-3 w-3" />;
    case 'investigating':
      return <Clock className="h-3 w-3" />;
    case 'resolved':
      return <CheckCircle className="h-3 w-3" />;
    case 'closed':
      return <XCircle className="h-3 w-3" />;
    default:
      return <AlertCircle className="h-3 w-3" />;
  }
};

const getSeverityPriority = (severity: string): number => {
  switch (severity) {
    case 'critical': return 4;
    case 'high': return 3;
    case 'medium': return 2;
    case 'low': return 1;
    default: return 0;
  }
};

const getStatusPriority = (status: string): number => {
  switch (status) {
    case 'open': return 4;
    case 'investigating': return 3;
    case 'resolved': return 2;
    case 'closed': return 1;
    default: return 0;
  }
};

export default function IssueList({ issues, loading, onIssueClick, showFilters = true }: IssueListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3" />;
    }
    return sortDirection === 'asc' ? 
      <ArrowUp className="h-3 w-3" /> : 
      <ArrowDown className="h-3 w-3" />;
  };

  const filteredAndSortedIssues = issues
    .filter(issue => {
      const matchesSearch = 
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (issue.description && issue.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (issue.user_id && issue.user_id.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
      const matchesSeverity = severityFilter === 'all' || issue.severity === severityFilter;
      const matchesType = typeFilter === 'all' || issue.issue_type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesSeverity && matchesType;
    })
    .sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
      switch (sortField) {
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case 'severity':
          aValue = getSeverityPriority(a.severity);
          bValue = getSeverityPriority(b.severity);
          break;
        case 'status':
          aValue = getStatusPriority(a.status);
          bValue = getStatusPriority(b.status);
          break;
        case 'type':
          aValue = a.issue_type;
          bValue = b.issue_type;
          break;
        default:
          return 0;
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const uniqueTypes = Array.from(new Set(issues.map(issue => issue.issue_type)));

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Issues</CardTitle>
          <CardDescription>Loading issues...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Issues ({filteredAndSortedIssues.length})</CardTitle>
        <CardDescription>
          Manage and track all system issues
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        {showFilters && (
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search issues by title, description, or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {(searchTerm || statusFilter !== 'all' || severityFilter !== 'all' || typeFilter !== 'all') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setSeverityFilter('all');
                    setTypeFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Issues Table */}
        {filteredAndSortedIssues.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No issues found</h3>
            <p className="text-muted-foreground">
              {issues.length === 0 
                ? "No issues have been reported yet." 
                : "Try adjusting your filters to see more results."}
            </p>
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-semibold"
                      onClick={() => handleSort('type')}
                    >
                      Type
                      {getSortIcon('type')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-semibold"
                      onClick={() => handleSort('severity')}
                    >
                      Severity
                      {getSortIcon('severity')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-semibold"
                      onClick={() => handleSort('status')}
                    >
                      Status
                      {getSortIcon('status')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-semibold"
                      onClick={() => handleSort('created_at')}
                    >
                      Created
                      {getSortIcon('created_at')}
                    </Button>
                  </TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedIssues.map((issue) => (
                  <TableRow 
                    key={issue.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onIssueClick(issue)}
                  >
                    <TableCell className="font-mono text-xs">
                      #{issue.id.slice(-6)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium line-clamp-1">{issue.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {issue.description}
                        </div>
                        {issue.user_id && (
                          <div className="text-xs text-muted-foreground">
                            User: {issue.user_id}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {issue.issue_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={cn('capitalize', getSeverityColor(issue.severity))}
                      >
                        {issue.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={cn('capitalize flex items-center gap-1 w-fit', getStatusColor(issue.status))}
                      >
                        {getStatusIcon(issue.status)}
                        {issue.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(issue.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onIssueClick(issue);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}