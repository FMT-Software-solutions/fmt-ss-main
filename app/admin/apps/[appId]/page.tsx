'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AdminHeader } from '../../components/AdminHeader';
import { StatsCard } from '../../components/StatsCard';
import { DataTable, Column, StatusBadge } from '../../components/DataTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Package,
  Download,
  Users,
  DollarSign,
  Star,
  Calendar,
  Activity,
  Settings,
  ArrowLeft,
  Edit,
  Trash2,
  Upload,
  Eye,
  AlertTriangle,
} from 'lucide-react';

// Mock app data
const getAppData = (appId: string) => {
  const apps = {
    'app-1': {
      id: 'app-1',
      name: 'TaskManager Pro',
      type: 'Desktop',
      status: 'Active',
      version: '2.1.0',
      description: 'A comprehensive task management application for teams and individuals.',
      category: 'Productivity',
      rating: 4.8,
      totalDownloads: 15420,
      totalSales: 1250,
      totalRevenue: 18750,
      activeUsers: 8429,
      createdAt: '2023-06-15',
      lastUpdated: '2024-01-15',
    },
    'app-2': {
      id: 'app-2',
      name: 'Analytics Dashboard',
      type: 'Web',
      status: 'Active',
      version: '1.5.2',
      description: 'Advanced analytics and reporting dashboard for business intelligence.',
      category: 'Analytics',
      rating: 4.6,
      totalDownloads: 12340,
      totalSales: 890,
      totalRevenue: 13350,
      activeUsers: 5234,
      createdAt: '2023-08-20',
      lastUpdated: '2024-01-12',
    },
  };
  return apps[appId as keyof typeof apps] || apps['app-1'];
};

// Mock versions data
const versionsData = [
  {
    id: '1',
    version: '2.1.0',
    releaseDate: '2024-01-15',
    status: 'Published',
    downloads: 2340,
    notes: 'Bug fixes and performance improvements',
    size: '45.2 MB',
  },
  {
    id: '2',
    version: '2.0.1',
    releaseDate: '2023-12-20',
    status: 'Published',
    downloads: 5680,
    notes: 'Security updates and minor fixes',
    size: '44.8 MB',
  },
  {
    id: '3',
    version: '2.0.0',
    releaseDate: '2023-11-15',
    status: 'Published',
    downloads: 7400,
    notes: 'Major release with new features',
    size: '44.5 MB',
  },
  {
    id: '4',
    version: '2.2.0',
    releaseDate: '2024-02-01',
    status: 'Draft',
    downloads: 0,
    notes: 'Upcoming release with AI features',
    size: '46.1 MB',
  },
];

// Mock organizations data
const organizationsData = [
  {
    id: '1',
    name: 'Acme Corporation',
    users: 45,
    plan: 'Enterprise',
    revenue: '$4,500',
    joinDate: '2023-08-15',
    status: 'Active',
  },
  {
    id: '2',
    name: 'TechStart Inc',
    users: 12,
    plan: 'Pro',
    revenue: '$1,200',
    joinDate: '2023-10-22',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Global Solutions',
    users: 78,
    plan: 'Enterprise',
    revenue: '$7,800',
    joinDate: '2023-07-10',
    status: 'Active',
  },
];

// Mock activity logs
const activityLogs = [
  {
    id: '1',
    action: 'Version 2.1.0 published',
    user: 'John Doe',
    timestamp: '2024-01-15 10:30:00',
    type: 'release',
  },
  {
    id: '2',
    action: 'Bug report #234 resolved',
    user: 'Jane Smith',
    timestamp: '2024-01-14 15:45:00',
    type: 'bug',
  },
  {
    id: '3',
    action: 'New organization added',
    user: 'Mike Johnson',
    timestamp: '2024-01-13 09:20:00',
    type: 'organization',
  },
  {
    id: '4',
    action: 'Performance metrics updated',
    user: 'System',
    timestamp: '2024-01-12 12:00:00',
    type: 'system',
  },
];

// Mock chart data
const downloadsChartData = [
  { name: 'Jan', downloads: 1200, activeUsers: 800 },
  { name: 'Feb', downloads: 1900, activeUsers: 1200 },
  { name: 'Mar', downloads: 1500, activeUsers: 1000 },
  { name: 'Apr', downloads: 2200, activeUsers: 1500 },
  { name: 'May', downloads: 1800, activeUsers: 1300 },
  { name: 'Jun', downloads: 2500, activeUsers: 1800 },
  { name: 'Jul', downloads: 2100, activeUsers: 1600 },
];

const revenueChartData = [
  { name: 'Jan', revenue: 2400 },
  { name: 'Feb', revenue: 1398 },
  { name: 'Mar', revenue: 9800 },
  { name: 'Apr', revenue: 3908 },
  { name: 'May', revenue: 4800 },
  { name: 'Jun', revenue: 3800 },
  { name: 'Jul', revenue: 4300 },
];

export default function AppDetails() {
  const params = useParams();
  const router = useRouter();
  const appId = params.appId as string;
  const app = getAppData(appId);
  const [activeTab, setActiveTab] = useState('overview');

  const statsData = [
    {
      title: 'Total Downloads',
      value: app.totalDownloads.toLocaleString(),
      description: 'All time downloads',
      icon: Download,
      trend: { value: 12.5, label: 'from last month', isPositive: true },
      color: 'blue' as const,
    },
    {
      title: 'Active Users',
      value: app.activeUsers.toLocaleString(),
      description: 'Monthly active users',
      icon: Users,
      trend: { value: 8.2, label: 'from last month', isPositive: true },
      color: 'green' as const,
    },
    {
      title: 'Total Revenue',
      value: `$${app.totalRevenue.toLocaleString()}`,
      description: 'All time revenue',
      icon: DollarSign,
      trend: { value: 15.3, label: 'from last month', isPositive: true },
      color: 'purple' as const,
    },
    {
      title: 'Rating',
      value: app.rating.toString(),
      description: 'Average user rating',
      icon: Star,
      trend: { value: 2.1, label: 'from last month', isPositive: true },
      color: 'yellow' as const,
    },
  ];

  const versionsColumns: Column<typeof versionsData[0]>[] = [
    {
      key: 'version',
      label: 'Version',
      sortable: true,
      render: (value) => <span className="font-mono font-medium">{value}</span>,
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
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'downloads',
      label: 'Downloads',
      sortable: true,
      render: (value) => value.toLocaleString(),
    },
    {
      key: 'size',
      label: 'Size',
    },
    {
      key: 'notes',
      label: 'Release Notes',
    },
  ];

  const organizationsColumns: Column<typeof organizationsData[0]>[] = [
    {
      key: 'name',
      label: 'Organization',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{value.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: 'users',
      label: 'Users',
      sortable: true,
    },
    {
      key: 'plan',
      label: 'Plan',
      render: (value) => <Badge variant="outline">{value}</Badge>,
    },
    {
      key: 'revenue',
      label: 'Revenue',
      sortable: true,
      render: (value) => <span className="font-medium text-green-600">{value}</span>,
    },
    {
      key: 'joinDate',
      label: 'Join Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  const activityColumns: Column<typeof activityLogs[0]>[] = [
    {
      key: 'action',
      label: 'Action',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <span>{value}</span>
        </div>
      ),
    },
    { key: 'user', label: 'User' },
    {
      key: 'timestamp',
      label: 'Timestamp',
      render: (value) => new Date(value).toLocaleString(),
    },
    {
      key: 'type',
      label: 'Type',
      render: (value) => <Badge variant="outline">{value}</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      <AdminHeader
        title={app.name}
        description={app.description}
        action={{
          label: 'Edit App',
          onClick: () => console.log('Edit app'),
          icon: Edit,
        }}
        breadcrumbs={[
          { label: 'Apps', href: '/admin/apps' },
          { label: app.name },
        ]}
      />

      {/* App Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  {app.name}
                  <StatusBadge status={app.status} />
                </CardTitle>
                <CardDescription>
                  {app.type} • {app.category} • v{app.version}
                </CardDescription>
              </div>
            </div>
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Apps
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="versions">Versions</TabsTrigger>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Downloads & Active Users</CardTitle>
                <CardDescription>Monthly trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={downloadsChartData as any}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="downloads"
                      stroke="#8884d8"
                      strokeWidth={2}
                      name="Downloads"
                    />
                    <Line
                      type="monotone"
                      dataKey="activeUsers"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      name="Active Users"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueChartData as any}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                      name="Revenue"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* App Details */}
          <Card>
            <CardHeader>
              <CardTitle>App Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span>{new Date(app.lastUpdated).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Version:</span>
                    <span className="font-mono">{app.version}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Sales:</span>
                    <span>{app.totalSales.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform:</span>
                    <span>{app.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span>{app.category}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="versions">
          <DataTable
            title="Version History"
            data={versionsData}
            columns={versionsColumns}
            searchable={false}
            actions={(version) => (
              <div className="flex items-center gap-2">
                {version.status === 'Draft' && (
                  <Button size="sm" variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Publish
                  </Button>
                )}
                <Button size="sm" variant="ghost">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            )}
          />
        </TabsContent>

        <TabsContent value="organizations">
          <DataTable
            title="Organizations & Users"
            data={organizationsData}
            columns={organizationsColumns}
            exportable={true}
          />
        </TabsContent>

        <TabsContent value="metrics">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Crash Rate</span>
                    <span className="text-green-600 font-medium">0.02%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Load Time</span>
                    <span className="font-medium">1.2s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Memory Usage</span>
                    <span className="font-medium">45MB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>User Satisfaction</span>
                    <span className="text-green-600 font-medium">94%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Daily Active Users</span>
                    <span className="font-medium">2,847</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Session Duration</span>
                    <span className="font-medium">12m 34s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Feature Adoption</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Retention Rate</span>
                    <span className="text-green-600 font-medium">85%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <DataTable
            title="Activity Logs"
            data={activityLogs}
            columns={activityColumns}
            searchable={false}
          />
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>App Settings</CardTitle>
                <CardDescription>Configure app-specific settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  General Settings
                </Button>
                <Button className="w-full" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  User Management
                </Button>
                <Button className="w-full" variant="outline">
                  <Package className="mr-2 h-4 w-4" />
                  Distribution
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>Irreversible actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete App
                </Button>
                <Button className="w-full" variant="outline">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Archive App
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}