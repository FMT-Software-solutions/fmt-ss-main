'use client';

import { AdminHeader } from '../components/AdminHeader';
import { StatsCard } from '../components/StatsCard';
import { DataTable, Column } from '../components/DataTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  SafeLineChart,
  SafeAreaChart,
  SafePieChart,
  Line,
  Area,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from '../components/ChartWrapper';
import {
  Package,
  DollarSign,
  Download,
  Users,
  TrendingUp,
  Activity,
  Eye,
} from 'lucide-react';

// Mock data
const statsData = [
  {
    title: 'Total Apps',
    value: '24',
    description: 'Active applications',
    icon: Package,
    trend: { value: 12, label: 'from last month', isPositive: true },
    color: 'blue' as const,
  },
  {
    title: 'Total Sales',
    value: '$45,231',
    description: 'Revenue this month',
    icon: DollarSign,
    trend: { value: 8.2, label: 'from last month', isPositive: true },
    color: 'green' as const,
  },
  {
    title: 'Total Downloads',
    value: '12,543',
    description: 'Downloads this month',
    icon: Download,
    trend: { value: 15.3, label: 'from last month', isPositive: true },
    color: 'purple' as const,
  },
  {
    title: 'Active Users',
    value: '8,429',
    description: 'Monthly active users',
    icon: Users,
    trend: { value: 2.1, label: 'from last month', isPositive: false },
    color: 'yellow' as const,
  },
];

const recentActivity = [
  {
    id: '1',
    action: 'New app published',
    app: 'TaskManager Pro',
    user: 'John Doe',
    timestamp: '2 minutes ago',
    type: 'publish',
  },
  {
    id: '2',
    action: 'Version updated',
    app: 'DataSync Tool',
    user: 'Jane Smith',
    timestamp: '15 minutes ago',
    type: 'update',
  },
  {
    id: '3',
    action: 'New purchase',
    app: 'Analytics Dashboard',
    user: 'Mike Johnson',
    timestamp: '1 hour ago',
    type: 'purchase',
  },
  {
    id: '4',
    action: 'Bug report filed',
    app: 'Mobile Sync',
    user: 'Sarah Wilson',
    timestamp: '2 hours ago',
    type: 'bug',
  },
  {
    id: '5',
    action: 'Training completed',
    app: 'React Workshop',
    user: 'David Brown',
    timestamp: '3 hours ago',
    type: 'training',
  },
];

const topApps = [
  {
    id: '1',
    name: 'TaskManager Pro',
    type: 'Desktop',
    downloads: 2543,
    revenue: '$12,450',
    rating: 4.8,
    status: 'Active',
  },
  {
    id: '2',
    name: 'Analytics Dashboard',
    type: 'Web',
    downloads: 1876,
    revenue: '$8,920',
    rating: 4.6,
    status: 'Active',
  },
  {
    id: '3',
    name: 'Mobile Sync',
    type: 'Mobile',
    downloads: 1432,
    revenue: '$6,780',
    rating: 4.4,
    status: 'Active',
  },
  {
    id: '4',
    name: 'DataSync Tool',
    type: 'Desktop',
    downloads: 987,
    revenue: '$4,560',
    rating: 4.2,
    status: 'Active',
  },
];

const chartData = [
  { name: 'Jan', downloads: 4000, revenue: 2400, users: 2400 },
  { name: 'Feb', downloads: 3000, revenue: 1398, users: 2210 },
  { name: 'Mar', downloads: 2000, revenue: 9800, users: 2290 },
  { name: 'Apr', downloads: 2780, revenue: 3908, users: 2000 },
  { name: 'May', downloads: 1890, revenue: 4800, users: 2181 },
  { name: 'Jun', downloads: 2390, revenue: 3800, users: 2500 },
  { name: 'Jul', downloads: 3490, revenue: 4300, users: 2100 },
];

const appTypeData = [
  { name: 'Desktop', value: 45, color: '#0088FE' },
  { name: 'Web', value: 35, color: '#00C49F' },
  { name: 'Mobile', value: 20, color: '#FFBB28' },
];

const activityColumns: Column<typeof recentActivity[0]>[] = [
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
  { key: 'app', label: 'App' },
  { key: 'user', label: 'User' },
  {
    key: 'type',
    label: 'Type',
    render: (value) => {
      const colors = {
        publish: 'bg-green-100 text-green-800',
        update: 'bg-blue-100 text-blue-800',
        purchase: 'bg-purple-100 text-purple-800',
        bug: 'bg-red-100 text-red-800',
        training: 'bg-yellow-100 text-yellow-800',
      };
      return (
        <Badge className={colors[value as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
          {value}
        </Badge>
      );
    },
  },
  { key: 'timestamp', label: 'Time' },
];

const topAppsColumns: Column<typeof topApps[0]>[] = [
  { key: 'name', label: 'App Name' },
  {
    key: 'type',
    label: 'Type',
    render: (value) => <Badge variant="outline">{value}</Badge>,
  },
  { key: 'downloads', label: 'Downloads' },
  { key: 'revenue', label: 'Revenue' },
  {
    key: 'rating',
    label: 'Rating',
    render: (value) => (
      <div className="flex items-center gap-1">
        <span>{value}</span>
        <span className="text-yellow-500">★</span>
      </div>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: (value) => <Badge>{value}</Badge>,
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Dashboard"
        description="Welcome to your admin dashboard. Here's an overview of your applications and performance."
        action={{
          label: 'View Reports',
          onClick: () => console.log('View reports'),
          icon: TrendingUp,
        }}
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Downloads & Revenue Chart */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Downloads & Revenue Trend</CardTitle>
            <CardDescription>Monthly performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <SafeLineChart data={chartData}>
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
                  dataKey="revenue"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="Revenue"
                />
              </SafeLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* App Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>App Types</CardTitle>
            <CardDescription>Distribution by platform</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <SafePieChart>
                <Pie
                  data={appTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {appTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </SafePieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {appTypeData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions across your applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg border">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.app} • {activity.user}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {activity.timestamp}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                <Eye className="mr-2 h-4 w-4" />
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Apps */}
        <DataTable
          title="Top Performing Apps"
          data={topApps}
          columns={topAppsColumns}
          searchable={false}
        />
      </div>

      {/* User Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
          <CardDescription>Monthly active users trend</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <SafeAreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.3}
                name="Active Users"
              />
            </SafeAreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}