'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock, CheckCircle, XCircle, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import type { Issue } from '@/types/issues';
import { cn } from '@/lib/utils';

interface IssueStatsProps {
  issues: Issue[];
  loading?: boolean;
}

interface StatsData {
  total: number;
  open: number;
  investigating: number;
  resolved: number;
  closed: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  recentlyCreated: number;
  recentlyResolved: number;
}

const getStatsFromIssues = (issues: Issue[]): StatsData => {
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  return {
    total: issues.length,
    open: issues.filter(i => i.status === 'open').length,
    investigating: issues.filter(i => i.status === 'investigating').length,
    resolved: issues.filter(i => i.status === 'resolved').length,
    closed: issues.filter(i => i.status === 'closed').length,
    critical: issues.filter(i => i.severity === 'critical').length,
    high: issues.filter(i => i.severity === 'high').length,
    medium: issues.filter(i => i.severity === 'medium').length,
    low: issues.filter(i => i.severity === 'low').length,
    recentlyCreated: issues.filter(i => new Date(i.created_at) > last24Hours).length,
    recentlyResolved: issues.filter(i => 
      i.status === 'resolved' && 
      i.resolved_at && 
      new Date(i.resolved_at) > last24Hours
    ).length,
  };
};

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend, 
  trendValue, 
  className 
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
  className?: string;
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-red-600" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-green-600" />;
      default:
        return <Activity className="h-3 w-3 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-red-600';
      case 'down':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trend && trendValue !== undefined && (
          <div className="flex items-center gap-1 mt-1">
            {getTrendIcon()}
            <span className={cn('text-xs', getTrendColor())}>
              {trendValue > 0 ? '+' : ''}{trendValue} (24h)
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function IssueStats({ issues, loading }: IssueStatsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = getStatsFromIssues(issues);
  const activeIssues = stats.open + stats.investigating;
  const resolvedRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;
  const criticalRate = stats.total > 0 ? Math.round((stats.critical / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Primary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Issues"
          value={stats.total}
          icon={Activity}
          description="All time issues"
        />
        <StatCard
          title="Active Issues"
          value={activeIssues}
          icon={AlertCircle}
          description="Open + Investigating"
          className={activeIssues > 0 ? 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950' : ''}
        />
        <StatCard
          title="Resolved Rate"
          value={resolvedRate}
          icon={CheckCircle}
          description={`${resolvedRate}% of all issues`}
          className={resolvedRate > 80 ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950' : ''}
        />
        <StatCard
          title="Critical Issues"
          value={stats.critical}
          icon={AlertCircle}
          description={`${criticalRate}% of total`}
          className={stats.critical > 0 ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950' : ''}
        />
      </div>

      {/* Status Breakdown */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Open"
          value={stats.open}
          icon={AlertCircle}
          description="Needs attention"
          trend={stats.recentlyCreated > stats.recentlyResolved ? 'up' : 'down'}
          trendValue={stats.recentlyCreated}
        />
        <StatCard
          title="Investigating"
          value={stats.investigating}
          icon={Clock}
          description="Being worked on"
        />
        <StatCard
          title="Resolved"
          value={stats.resolved}
          icon={CheckCircle}
          description="Fixed issues"
          trend={stats.recentlyResolved > 0 ? 'down' : 'neutral'}
          trendValue={stats.recentlyResolved}
        />
        <StatCard
          title="Closed"
          value={stats.closed}
          icon={XCircle}
          description="Completed"
        />
      </div>

      {/* Severity Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Severity Distribution</CardTitle>
          <CardDescription>
            Breakdown of issues by severity level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm font-medium">Critical</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{stats.critical}</div>
                <div className="text-xs text-muted-foreground">
                  {stats.total > 0 ? Math.round((stats.critical / stats.total) * 100) : 0}%
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-sm font-medium">High</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{stats.high}</div>
                <div className="text-xs text-muted-foreground">
                  {stats.total > 0 ? Math.round((stats.high / stats.total) * 100) : 0}%
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm font-medium">Medium</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{stats.medium}</div>
                <div className="text-xs text-muted-foreground">
                  {stats.total > 0 ? Math.round((stats.medium / stats.total) * 100) : 0}%
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium">Low</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{stats.low}</div>
                <div className="text-xs text-muted-foreground">
                  {stats.total > 0 ? Math.round((stats.low / stats.total) * 100) : 0}%
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {(stats.recentlyCreated > 0 || stats.recentlyResolved > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity (24h)</CardTitle>
            <CardDescription>
              Issues created and resolved in the last 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium">New Issues</span>
                </div>
                <Badge variant={stats.recentlyCreated > 0 ? 'destructive' : 'secondary'}>
                  {stats.recentlyCreated}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Resolved</span>
                </div>
                <Badge variant={stats.recentlyResolved > 0 ? 'default' : 'secondary'}>
                  {stats.recentlyResolved}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}