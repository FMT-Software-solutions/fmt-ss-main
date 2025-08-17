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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  CreditCard,
  Download,
  Calendar,
  Filter,
  FileText,
  Eye,
} from 'lucide-react';

// Mock sales data
const salesData = [
  {
    id: '1',
    transactionId: 'TXN-2024-001',
    app: 'TaskManager Pro',
    appType: 'Desktop',
    organization: 'Acme Corporation',
    customer: 'John Smith',
    amount: 149.99,
    currency: 'USD',
    status: 'Completed',
    paymentMethod: 'Credit Card',
    date: '2024-01-15T10:30:00Z',
    plan: 'Enterprise',
    licenses: 50,
    region: 'North America',
  },
  {
    id: '2',
    transactionId: 'TXN-2024-002',
    app: 'Analytics Dashboard',
    appType: 'Web',
    organization: 'TechStart Inc',
    customer: 'Sarah Johnson',
    amount: 79.99,
    currency: 'USD',
    status: 'Completed',
    paymentMethod: 'PayPal',
    date: '2024-01-14T15:45:00Z',
    plan: 'Pro',
    licenses: 10,
    region: 'Europe',
  },
  {
    id: '3',
    transactionId: 'TXN-2024-003',
    app: 'Mobile Tracker',
    appType: 'Mobile',
    organization: 'Global Solutions',
    customer: 'Mike Davis',
    amount: 199.99,
    currency: 'USD',
    status: 'Pending',
    paymentMethod: 'Bank Transfer',
    date: '2024-01-13T09:20:00Z',
    plan: 'Enterprise',
    licenses: 100,
    region: 'Asia Pacific',
  },
  {
    id: '4',
    transactionId: 'TXN-2024-004',
    app: 'TaskManager Pro',
    appType: 'Desktop',
    organization: 'StartupXYZ',
    customer: 'Emily Chen',
    amount: 29.99,
    currency: 'USD',
    status: 'Completed',
    paymentMethod: 'Credit Card',
    date: '2024-01-12T14:10:00Z',
    plan: 'Basic',
    licenses: 5,
    region: 'North America',
  },
  {
    id: '5',
    transactionId: 'TXN-2024-005',
    app: 'Analytics Dashboard',
    appType: 'Web',
    organization: 'Enterprise Corp',
    customer: 'Robert Wilson',
    amount: 299.99,
    currency: 'USD',
    status: 'Failed',
    paymentMethod: 'Credit Card',
    date: '2024-01-11T11:30:00Z',
    plan: 'Enterprise',
    licenses: 75,
    region: 'Europe',
  },
  {
    id: '6',
    transactionId: 'TXN-2024-006',
    app: 'Mobile Tracker',
    appType: 'Mobile',
    organization: 'Innovation Labs',
    customer: 'Lisa Anderson',
    amount: 59.99,
    currency: 'USD',
    status: 'Completed',
    paymentMethod: 'PayPal',
    date: '2024-01-10T16:45:00Z',
    plan: 'Pro',
    licenses: 15,
    region: 'North America',
  },
];

// Mock chart data
const revenueChartData = [
  { name: 'Jan', revenue: 12400, transactions: 45 },
  { name: 'Feb', revenue: 15600, transactions: 52 },
  { name: 'Mar', revenue: 18900, transactions: 61 },
  { name: 'Apr', revenue: 22100, transactions: 68 },
  { name: 'May', revenue: 19800, transactions: 59 },
  { name: 'Jun', revenue: 25300, transactions: 74 },
  { name: 'Jul', revenue: 28700, transactions: 82 },
];

const appRevenueData = [
  { name: 'TaskManager Pro', value: 45230, color: '#8884d8' },
  { name: 'Analytics Dashboard', value: 32100, color: '#82ca9d' },
  { name: 'Mobile Tracker', value: 28450, color: '#ffc658' },
  { name: 'Other Apps', value: 15220, color: '#ff7300' },
];

const paymentMethodData = [
  { name: 'Credit Card', value: 65, color: '#8884d8' },
  { name: 'PayPal', value: 25, color: '#82ca9d' },
  { name: 'Bank Transfer', value: 10, color: '#ffc658' },
];

export default function SalesPage() {
  const [filteredData, setFilteredData] = useState(salesData);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Calculate stats
  const totalRevenue = salesData
    .filter(sale => sale.status === 'Completed')
    .reduce((sum, sale) => sum + sale.amount, 0);
  
  const totalTransactions = salesData.length;
  const completedTransactions = salesData.filter(sale => sale.status === 'Completed').length;
  const pendingTransactions = salesData.filter(sale => sale.status === 'Pending').length;
  const averageOrderValue = completedTransactions > 0 ? totalRevenue / completedTransactions : 0;

  const statsData = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      description: 'All time revenue',
      icon: DollarSign,
      trend: { value: 12.5, label: 'from last month', isPositive: true },
      color: 'green' as const,
    },
    {
      title: 'Total Transactions',
      value: totalTransactions.toString(),
      description: 'All transactions',
      icon: ShoppingCart,
      trend: { value: 8.2, label: 'from last month', isPositive: true },
      color: 'blue' as const,
    },
    {
      title: 'Completed Sales',
      value: completedTransactions.toString(),
      description: 'Successful transactions',
      icon: CreditCard,
      trend: { value: 15.3, label: 'from last month', isPositive: true },
      color: 'purple' as const,
    },
    {
      title: 'Average Order Value',
      value: `$${averageOrderValue.toFixed(2)}`,
      description: 'Per transaction',
      icon: TrendingUp,
      trend: { value: 5.7, label: 'from last month', isPositive: true },
      color: 'yellow' as const,
    },
  ];

  const filterOptions = [
    {
      key: 'app',
      label: 'App',
      type: 'select' as const,
      options: Array.from(new Set(salesData.map(sale => sale.app))).map(app => ({ label: app, value: app })),
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: Array.from(new Set(salesData.map(sale => sale.status))).map(status => ({ label: status, value: status })),
    },
    {
      key: 'paymentMethod',
      label: 'Payment Method',
      type: 'select' as const,
      options: Array.from(new Set(salesData.map(sale => sale.paymentMethod))).map(method => ({ label: method, value: method })),
    },
    {
      key: 'region',
      label: 'Region',
      type: 'select' as const,
      options: Array.from(new Set(salesData.map(sale => sale.region))).map(region => ({ label: region, value: region })),
    },
  ];

  const handleFilter = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
    
    let filtered = salesData;
    
    // Apply filters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(sale => 
          sale[key as keyof typeof sale]?.toString().toLowerCase().includes(value.toLowerCase())
        );
      }
    });
    
    setFilteredData(filtered);
  };

  const salesColumns: Column<typeof salesData[0]>[] = [
    {
      key: 'transactionId',
      label: 'Transaction ID',
      render: (value) => <span className="font-mono text-sm">{value}</span>,
    },
    {
      key: 'app',
      label: 'App',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">{row.appType}</div>
        </div>
      ),
    },
    {
      key: 'organization',
      label: 'Customer',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{value.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-muted-foreground">{row.customer}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (value, row) => (
        <div className="text-right">
          <div className="font-medium">${value.toFixed(2)}</div>
          <div className="text-sm text-muted-foreground">{row.currency}</div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'paymentMethod',
      label: 'Payment',
      render: (value) => <Badge variant="outline">{value}</Badge>,
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (value) => (
        <div className="text-sm">
          <div>{new Date(value).toLocaleDateString()}</div>
          <div className="text-muted-foreground">{new Date(value).toLocaleTimeString()}</div>
        </div>
      ),
    },
    {
      key: 'licenses',
      label: 'Licenses',
      sortable: true,
      render: (value, row) => (
        <div className="text-center">
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">{row.plan}</div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Sales & Transactions"
        description="Monitor sales performance and transaction history"
        action={{
          label: 'Export Report',
          onClick: () => console.log('Export sales report'),
          icon: Download,
        }}
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue and transaction count</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                  name="Revenue ($)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="transactions"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="Transactions"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by App</CardTitle>
            <CardDescription>Distribution of revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={appRevenueData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {appRevenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {appRevenueData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">${item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Distribution of payment methods used</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={paymentMethodData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: any) => [`${value}%`, 'Usage']} />
                <Bar dataKey="value" fill="#8884d8" minPointSize={5} />
              </BarChart>
            </ResponsiveContainer>
            <div className="space-y-4">
              {paymentMethodData.map((item, index) => (
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

      {/* Filters and Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Detailed view of all sales transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <FilterBar
            onFilter={handleFilter}
            filters={filterOptions}
            searchPlaceholder="Search transactions..."
          />
          
          <div className="mt-6">
            <DataTable
              data={filteredData}
              columns={salesColumns}
              searchable={false}
              exportable={true}
              actions={(sale) => (
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}