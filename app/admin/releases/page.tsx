'use client';

import { useState } from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { StatsCard } from '../components/StatsCard';
import { DataTable, Column, StatusBadge } from '../components/DataTable';
import { FilterBar } from '../components/FilterBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Package,
  Upload,
  Download,
  Calendar,
  GitBranch,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  RotateCcw,
  Plus,
} from 'lucide-react';

// Mock releases data
const releasesData = [
  {
    id: '1',
    app: 'TaskManager Pro',
    appType: 'Desktop',
    version: '2.2.0',
    status: 'Draft',
    releaseDate: null,
    scheduledDate: '2024-02-01',
    downloads: 0,
    size: '46.1 MB',
    notes: 'Major update with AI-powered task suggestions and improved performance',
    author: 'John Doe',
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-22T15:45:00Z',
    features: ['AI Task Suggestions', 'Performance Improvements', 'New Dashboard'],
    bugFixes: 5,
    breaking: false,
  },
  {
    id: '2',
    app: 'Analytics Dashboard',
    appType: 'Web',
    version: '1.6.0',
    status: 'Published',
    releaseDate: '2024-01-18T09:00:00Z',
    scheduledDate: '2024-01-18',
    downloads: 1250,
    size: '12.3 MB',
    notes: 'Enhanced reporting capabilities and new chart types',
    author: 'Jane Smith',
    createdAt: '2024-01-10T14:20:00Z',
    updatedAt: '2024-01-18T09:00:00Z',
    features: ['New Chart Types', 'Enhanced Reporting', 'Export Improvements'],
    bugFixes: 8,
    breaking: false,
  },
  {
    id: '3',
    app: 'Mobile Tracker',
    appType: 'Mobile',
    version: '3.1.0',
    status: 'Published',
    releaseDate: '2024-01-15T12:00:00Z',
    scheduledDate: '2024-01-15',
    downloads: 3420,
    size: '28.7 MB',
    notes: 'Location tracking improvements and battery optimization',
    author: 'Mike Johnson',
    createdAt: '2024-01-05T11:15:00Z',
    updatedAt: '2024-01-15T12:00:00Z',
    features: ['Location Tracking', 'Battery Optimization', 'Offline Mode'],
    bugFixes: 12,
    breaking: true,
  },
  {
    id: '4',
    app: 'TaskManager Pro',
    appType: 'Desktop',
    version: '2.1.1',
    status: 'Published',
    releaseDate: '2024-01-10T16:30:00Z',
    scheduledDate: '2024-01-10',
    downloads: 5680,
    size: '45.8 MB',
    notes: 'Critical bug fixes and security updates',
    author: 'John Doe',
    createdAt: '2024-01-08T09:45:00Z',
    updatedAt: '2024-01-10T16:30:00Z',
    features: [],
    bugFixes: 15,
    breaking: false,
  },
  {
    id: '5',
    app: 'Analytics Dashboard',
    appType: 'Web',
    version: '1.7.0',
    status: 'Draft',
    releaseDate: null,
    scheduledDate: '2024-02-15',
    downloads: 0,
    size: '13.1 MB',
    notes: 'Real-time data streaming and advanced filters',
    author: 'Jane Smith',
    createdAt: '2024-01-25T13:20:00Z',
    updatedAt: '2024-01-26T10:15:00Z',
    features: ['Real-time Streaming', 'Advanced Filters', 'Custom Widgets'],
    bugFixes: 3,
    breaking: false,
  },
  {
    id: '6',
    app: 'Mobile Tracker',
    appType: 'Mobile',
    version: '3.0.2',
    status: 'Rollback',
    releaseDate: '2024-01-05T14:00:00Z',
    scheduledDate: '2024-01-05',
    downloads: 890,
    size: '28.2 MB',
    notes: 'Rolled back due to critical performance issues',
    author: 'Mike Johnson',
    createdAt: '2024-01-02T16:30:00Z',
    updatedAt: '2024-01-06T11:20:00Z',
    features: ['Performance Updates'],
    bugFixes: 6,
    breaking: false,
  },
];

// Mock chart data
const releaseActivityData = [
  { name: 'Jan', releases: 8, downloads: 15420 },
  { name: 'Feb', releases: 6, downloads: 12340 },
  { name: 'Mar', releases: 10, downloads: 18900 },
  { name: 'Apr', releases: 7, downloads: 14200 },
  { name: 'May', releases: 9, downloads: 16800 },
  { name: 'Jun', releases: 12, downloads: 22100 },
  { name: 'Jul', releases: 8, downloads: 19500 },
];

const releaseTypeData = [
  { name: 'Major', count: 15, color: '#8884d8' },
  { name: 'Minor', count: 32, color: '#82ca9d' },
  { name: 'Patch', count: 48, color: '#ffc658' },
];

export default function ReleasesPage() {
  const [filteredData, setFilteredData] = useState(releasesData);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedRelease, setSelectedRelease] = useState<typeof releasesData[0] | null>(null);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [rollbackDialogOpen, setRollbackDialogOpen] = useState(false);
  const [publishNotes, setPublishNotes] = useState('');
  const [rollbackReason, setRollbackReason] = useState('');

  // Calculate stats
  const totalReleases = releasesData.length;
  const draftReleases = releasesData.filter(release => release.status === 'Draft').length;
  const publishedReleases = releasesData.filter(release => release.status === 'Published').length;
  const totalDownloads = releasesData
    .filter(release => release.status === 'Published')
    .reduce((sum, release) => sum + release.downloads, 0);

  const statsData = [
    {
      title: 'Total Releases',
      value: totalReleases.toString(),
      description: 'All releases',
      icon: Package,
      trend: { value: 8.5, label: 'from last month', isPositive: true },
      color: 'blue' as const,
    },
    {
      title: 'Draft Releases',
      value: draftReleases.toString(),
      description: 'Pending releases',
      icon: Clock,
      trend: { value: 12.3, label: 'from last month', isPositive: true },
      color: 'yellow' as const,
    },
    {
      title: 'Published Releases',
      value: publishedReleases.toString(),
      description: 'Live releases',
      icon: CheckCircle,
      trend: { value: 5.7, label: 'from last month', isPositive: true },
      color: 'green' as const,
    },
    {
      title: 'Total Downloads',
      value: totalDownloads.toLocaleString(),
      description: 'All published releases',
      icon: Download,
      trend: { value: 18.9, label: 'from last month', isPositive: true },
      color: 'purple' as const,
    },
  ];

  const filterOptions = [
    {
      key: 'app',
      label: 'App',
      type: 'select' as const,
      options: Array.from(new Set(releasesData.map(release => release.app))).map(app => ({ label: app, value: app })),
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: Array.from(new Set(releasesData.map(release => release.status))).map(status => ({ label: status, value: status })),
    },
    {
      key: 'appType',
      label: 'App Type',
      type: 'select' as const,
      options: Array.from(new Set(releasesData.map(release => release.appType))).map(type => ({ label: type, value: type })),
    },
  ];

  const handleFilter = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
    
    let filtered = releasesData;
    
    // Apply filters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(release => 
          release[key as keyof typeof release]?.toString().toLowerCase().includes(value.toLowerCase())
        );
      }
    });
    
    setFilteredData(filtered);
  };

  const handlePublish = (release: typeof releasesData[0]) => {
    setSelectedRelease(release);
    setPublishDialogOpen(true);
  };

  const handleRollback = (release: typeof releasesData[0]) => {
    setSelectedRelease(release);
    setRollbackDialogOpen(true);
  };

  const confirmPublish = () => {
    if (selectedRelease) {
      console.log('Publishing release:', selectedRelease.id, 'Notes:', publishNotes);
      // Here you would typically make an API call to publish the release
    }
    setPublishDialogOpen(false);
    setPublishNotes('');
    setSelectedRelease(null);
  };

  const confirmRollback = () => {
    if (selectedRelease) {
      console.log('Rolling back release:', selectedRelease.id, 'Reason:', rollbackReason);
      // Here you would typically make an API call to rollback the release
    }
    setRollbackDialogOpen(false);
    setRollbackReason('');
    setSelectedRelease(null);
  };

  const releasesColumns: Column<typeof releasesData[0]>[] = [
    {
      key: 'app',
      label: 'App',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-muted-foreground">{row.appType}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'version',
      label: 'Version',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-mono font-medium">{value}</div>
          {row.breaking && (
            <Badge variant="destructive" className="text-xs mt-1">
              Breaking
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'releaseDate',
      label: 'Release Date',
      sortable: true,
      render: (value, row) => (
        <div className="text-sm">
          {value ? (
            <>
              <div>{new Date(value).toLocaleDateString()}</div>
              <div className="text-muted-foreground">{new Date(value).toLocaleTimeString()}</div>
            </>
          ) : (
            <>
              <div className="text-muted-foreground">Scheduled:</div>
              <div>{new Date(row.scheduledDate).toLocaleDateString()}</div>
            </>
          )}
        </div>
      ),
    },
    {
      key: 'downloads',
      label: 'Downloads',
      sortable: true,
      render: (value) => value > 0 ? value.toLocaleString() : '-',
    },
    {
      key: 'size',
      label: 'Size',
    },
    {
      key: 'author',
      label: 'Author',
      render: (value) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">{value.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm">{value}</span>
        </div>
      ),
    },
    {
      key: 'features',
      label: 'Features',
      render: (value) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 2).map((feature: string, index: number) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {feature}
            </Badge>
          ))}
          {value.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{value.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Version Release Management"
        description="Manage app releases, deployments, and rollbacks"
        action={{
          label: 'New Release',
          onClick: () => console.log('Create new release'),
          icon: Plus,
        }}
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Release Activity</CardTitle>
            <CardDescription>Monthly releases and downloads</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width={"100%"} height={300}>
              <ComposedChart data={releaseActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar
                  yAxisId="left"
                  dataKey="releases"
                  fill="#8884d8"
                  name="Releases"
                  minPointSize={5}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="downloads"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="Downloads"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Release Types</CardTitle>
            <CardDescription>Distribution of release types</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width={"100%"} height={300}>
              <BarChart data={releaseTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" minPointSize={5} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {releaseTypeData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Releases Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Releases</CardTitle>
          <CardDescription>Manage and monitor all app releases</CardDescription>
        </CardHeader>
        <CardContent>
          <FilterBar
            onFilter={handleFilter}
            filters={filterOptions}
            searchPlaceholder="Search releases..."
          />
          
          <div className="mt-6">
            <DataTable
              data={filteredData}
              columns={releasesColumns}
              searchable={false}
              exportable={true}
              actions={(release) => (
                <div className="flex items-center gap-2">
                  {release.status === 'Draft' && (
                    <Button 
                      size="sm" 
                      onClick={() => handlePublish(release)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Publish
                    </Button>
                  )}
                  {release.status === 'Published' && (
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleRollback(release)}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Rollback
                    </Button>
                  )}
                  <Button size="sm" variant="ghost">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Publish Dialog */}
      <Dialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publish Release</DialogTitle>
            <DialogDescription>
              Are you sure you want to publish {selectedRelease?.app} v{selectedRelease?.version}?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="publish-notes">Release Notes (Optional)</Label>
              <Textarea
                id="publish-notes"
                placeholder="Add any additional notes for this release..."
                value={publishNotes}
                onChange={(e) => setPublishNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPublishDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmPublish} className="bg-green-600 hover:bg-green-700">
              <Upload className="mr-2 h-4 w-4" />
              Publish Release
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rollback Dialog */}
      <Dialog open={rollbackDialogOpen} onOpenChange={setRollbackDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rollback Release</DialogTitle>
            <DialogDescription>
              Are you sure you want to rollback {selectedRelease?.app} v{selectedRelease?.version}?
              This will remove the release from production.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rollback-reason">Rollback Reason *</Label>
              <Textarea
                id="rollback-reason"
                placeholder="Please provide a reason for rolling back this release..."
                value={rollbackReason}
                onChange={(e) => setRollbackReason(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRollbackDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmRollback} 
              variant="destructive"
              disabled={!rollbackReason.trim()}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Rollback Release
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}