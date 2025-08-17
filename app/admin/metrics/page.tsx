'use client';

import { useState, useEffect } from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { StatsCard } from '../components/StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import {
  Activity,
  Server,
  Zap,
  Mail,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Wifi,
  Database,
  Cpu,
  HardDrive,
  Users,
  Globe,
  RefreshCw,
} from 'lucide-react';

// Chart data interfaces
interface RealTimeData {
  time: string;
  apiCalls: number;
  responseTime: number;
  errorRate: number;
  activeUsers: number;
}

interface EmailMetricsData {
  date: string;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
}

interface SystemHealthData {
  name: string;
  value: number;
  color: string;
}

interface ErrorDistributionData {
  name: string;
  value: number;
  color: string;
}

interface GeographicData {
  region: string;
  users: number;
  percentage: number;
}

// Mock real-time data
const generateRealTimeData = () => {
  const now = new Date();
  const data = [];
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 1000);
    data.push({
      time: time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      apiCalls: Math.floor(Math.random() * 1000) + 500,
      responseTime: Math.floor(Math.random() * 200) + 50,
      errorRate: Math.random() * 5,
      activeUsers: Math.floor(Math.random() * 500) + 1000,
    });
  }
  return data;
};

// Mock API endpoints data
const apiEndpointsData = [
  {
    endpoint: '/api/auth/login',
    calls: 15420,
    avgResponseTime: 120,
    errorRate: 0.5,
    status: 'healthy',
  },
  {
    endpoint: '/api/users/profile',
    calls: 12340,
    avgResponseTime: 85,
    errorRate: 1.2,
    status: 'healthy',
  },
  {
    endpoint: '/api/apps/list',
    calls: 8950,
    avgResponseTime: 200,
    errorRate: 2.1,
    status: 'warning',
  },
  {
    endpoint: '/api/sales/transactions',
    calls: 6780,
    avgResponseTime: 350,
    errorRate: 0.8,
    status: 'healthy',
  },
  {
    endpoint: '/api/metrics/dashboard',
    calls: 5430,
    avgResponseTime: 450,
    errorRate: 5.2,
    status: 'critical',
  },
];

// Mock email metrics
const emailMetricsData = [
  { name: 'Jan', sent: 12400, delivered: 11890, opened: 8950, clicked: 2340 },
  { name: 'Feb', sent: 15600, delivered: 14980, opened: 11200, clicked: 2890 },
  { name: 'Mar', sent: 18900, delivered: 18100, opened: 13500, clicked: 3450 },
  { name: 'Apr', sent: 22100, delivered: 21200, opened: 15800, clicked: 4120 },
  { name: 'May', sent: 19800, delivered: 19000, opened: 14200, clicked: 3680 },
  { name: 'Jun', sent: 25300, delivered: 24200, opened: 18100, clicked: 4750 },
];

// Mock system health data
const systemHealthData = [
  { name: 'CPU Usage', value: 65, color: '#8884d8' },
  { name: 'Memory Usage', value: 78, color: '#82ca9d' },
  { name: 'Disk Usage', value: 45, color: '#ffc658' },
  { name: 'Network I/O', value: 32, color: '#ff7300' },
];

// Mock error distribution
const errorDistributionData = [
  { name: '4xx Errors', value: 65, color: '#ffc658' },
  { name: '5xx Errors', value: 25, color: '#ff7300' },
  { name: 'Timeouts', value: 10, color: '#8884d8' },
];

// Mock geographic data
const geographicData = [
  { region: 'North America', users: 45230, percentage: 42 },
  { region: 'Europe', users: 32100, percentage: 30 },
  { region: 'Asia Pacific', users: 21450, percentage: 20 },
  { region: 'South America', users: 5420, percentage: 5 },
  { region: 'Africa', users: 3200, percentage: 3 },
];

export default function MetricsPage() {
  const [realTimeData, setRealTimeData] = useState(generateRealTimeData());
  const [timeRange, setTimeRange] = useState('24h');
  const [activeTab, setActiveTab] = useState('overview');
  const [isLive, setIsLive] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      setRealTimeData(generateRealTimeData());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  // Calculate current stats
  const currentData = realTimeData[realTimeData.length - 1];
  const previousData = realTimeData[realTimeData.length - 2];
  
  const apiCallsTrend = currentData && previousData ? 
    ((currentData.apiCalls - previousData.apiCalls) / previousData.apiCalls) * 100 : 0;
  
  const responseTimeTrend = currentData && previousData ? 
    ((currentData.responseTime - previousData.responseTime) / previousData.responseTime) * 100 : 0;

  const statsData = [
    {
      title: 'API Calls/min',
      value: currentData?.apiCalls.toLocaleString() || '0',
      description: 'Current rate',
      icon: Activity,
      trend: { value: Math.abs(apiCallsTrend), label: 'from last minute', isPositive: apiCallsTrend >= 0 },
      color: 'blue' as const,
    },
    {
      title: 'Avg Response Time',
      value: `${currentData?.responseTime || 0}ms`,
      description: 'Current average',
      icon: Clock,
      trend: { value: Math.abs(responseTimeTrend), label: 'from last minute', isPositive: responseTimeTrend <= 0 },
      color: responseTimeTrend <= 0 ? 'green' as const : 'red' as const,
    },
    {
      title: 'Error Rate',
      value: `${(currentData?.errorRate || 0).toFixed(2)}%`,
      description: 'Current rate',
      icon: AlertTriangle,
      trend: { value: 0.3, label: 'from last hour', isPositive: false },
      color: 'yellow' as const,
    },
    {
      title: 'Active Users',
      value: currentData?.activeUsers.toLocaleString() || '0',
      description: 'Currently online',
      icon: Users,
      trend: { value: 5.2, label: 'from last hour', isPositive: true },
      color: 'purple' as const,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Metrics & Monitoring"
        description="Real-time system performance and usage analytics"
        action={{
          label: isLive ? 'Pause Live Updates' : 'Resume Live Updates',
          onClick: () => setIsLive(!isLive),
          icon: isLive ? Clock : RefreshCw,
        }}
      />

      {/* Live Status Indicator */}
      <div className="flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
        <span className="text-sm text-muted-foreground">
          {isLive ? 'Live updates enabled' : 'Live updates paused'}
        </span>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32 ml-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">Last Hour</SelectItem>
            <SelectItem value="24h">Last 24 Hours</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="api">API Metrics</TabsTrigger>
          <TabsTrigger value="email">Email Metrics</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Real-time Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>API Calls & Response Time</CardTitle>
                <CardDescription>Real-time API performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={realTimeData as any}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="apiCalls"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                      name="API Calls"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="responseTime"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      name="Response Time (ms)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error Rate & Active Users</CardTitle>
                <CardDescription>System reliability metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={realTimeData as any}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="errorRate"
                      stroke="#ff7300"
                      strokeWidth={2}
                      name="Error Rate (%)"
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="activeUsers"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.3}
                      name="Active Users"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Error Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Error Distribution</CardTitle>
              <CardDescription>Breakdown of error types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={errorDistributionData as any}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {errorDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`${value}%`, 'Percentage']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-4">
                  {errorDistributionData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints Performance</CardTitle>
              <CardDescription>Detailed metrics for each API endpoint</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiEndpointsData.map((endpoint, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(endpoint.status)}
                      <div>
                        <div className="font-mono text-sm font-medium">{endpoint.endpoint}</div>
                        <div className="text-sm text-muted-foreground">
                          {endpoint.calls.toLocaleString()} calls
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-medium">{endpoint.avgResponseTime}ms</div>
                        <div className="text-muted-foreground">Avg Response</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-medium ${getStatusColor(endpoint.status)}`}>
                          {endpoint.errorRate}%
                        </div>
                        <div className="text-muted-foreground">Error Rate</div>
                      </div>
                      <Badge variant={endpoint.status === 'healthy' ? 'default' : 
                                   endpoint.status === 'warning' ? 'secondary' : 'destructive'}>
                        {endpoint.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Email Performance</CardTitle>
                <CardDescription>Email delivery and engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={emailMetricsData as any}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="sent"
                      stackId="1"
                      stroke="#8884d8"
                      fill="#8884d8"
                      name="Sent"
                    />
                    <Area
                      type="monotone"
                      dataKey="delivered"
                      stackId="2"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      name="Delivered"
                    />
                    <Area
                      type="monotone"
                      dataKey="opened"
                      stackId="3"
                      stroke="#ffc658"
                      fill="#ffc658"
                      name="Opened"
                    />
                    <Area
                      type="monotone"
                      dataKey="clicked"
                      stackId="4"
                      stroke="#ff7300"
                      fill="#ff7300"
                      name="Clicked"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Metrics Summary</CardTitle>
                <CardDescription>Current month performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Delivery Rate</span>
                    <span className="font-medium text-green-600">95.6%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Open Rate</span>
                    <span className="font-medium">24.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Click Rate</span>
                    <span className="font-medium">6.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Bounce Rate</span>
                    <span className="font-medium text-red-600">4.4%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Unsubscribe Rate</span>
                    <span className="font-medium">0.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>System Resources</CardTitle>
                <CardDescription>Current system utilization</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={systemHealthData as any}>
                    <RadialBar
                      minAngle={15}
                      label={{ position: 'insideStart', fill: '#fff' }}
                      background
                      clockWise
                      dataKey="value"
                    />
                    <Tooltip />
                  </RadialBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Infrastructure health overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Server className="h-4 w-4" />
                      <span>Web Servers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-green-600 font-medium">Healthy</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      <span>Database</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-green-600 font-medium">Healthy</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wifi className="h-4 w-4" />
                      <span>CDN</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="text-yellow-600 font-medium">Warning</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>Email Service</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-green-600 font-medium">Healthy</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geographic">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>User distribution by region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {geographicData.map((region, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{region.region}</div>
                        <div className="text-sm text-muted-foreground">
                          {region.users.toLocaleString()} users
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${region.percentage}%` }}
                        />
                      </div>
                      <span className="font-medium w-12 text-right">{region.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}