'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CreditCard,
  DollarSign,
  Download,
  Eye,
  FileText,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AdminHeader } from '../components/AdminHeader';
import { Column, DataTable, StatusBadge } from '../components/DataTable';
import { FilterBar } from '../components/FilterBar';
import { StatsCard } from '../components/StatsCard';

// Mock sales data
const salesData = [
  {
    id: '1',
    transactionId: 'TXN-2024-001',
    app: 'TaskManager Pro',
    appType: 'Desktop',
    organization: 'Acme Corporation',
    customer: 'John Smith',
    amount: 1599,
    currency: 'GHS',
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
    amount: 1799,
    currency: 'GHS',
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
    amount: 1299,
    currency: 'GHS',
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
    amount: 2999,
    currency: 'GHS',
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
    amount: 2567,
    currency: 'GHS',
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
    amount: 1599,
    currency: 'GHS',
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
  const [hubtelReference, setHubtelReference] = useState('');
  const [hubtelStatus, setHubtelStatus] = useState<any | null>(null);
  const [hubtelError, setHubtelError] = useState<string | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [manualApps, setManualApps] = useState<
    Array<{ id: string; title: string; price: number }>
  >([]);
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [manualQuantities, setManualQuantities] = useState<
    Record<string, number>
  >({});
  const [manualBillingDetails, setManualBillingDetails] = useState({
    organizationName: '',
    organizationEmail: '',
    phoneNumber: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    },
  });
  const [manualIsExistingOrg, setManualIsExistingOrg] = useState(false);
  const [manualTotal, setManualTotal] = useState('');
  const [manualTotalAmount, setManualTotalAmount] = useState(0);
  const [manualPurchase, setManualPurchase] = useState<any | null>(null);
  const [manualOrganizationId, setManualOrganizationId] = useState('');
  const [manualClientReference, setManualClientReference] = useState('');
  const [manualClientReferenceInput, setManualClientReferenceInput] = useState(
    ''
  );
  const [manualItems, setManualItems] = useState<Array<any>>([]);
  const [manualProvisioningDetails, setManualProvisioningDetails] = useState<
    Record<
      string,
      { name?: string; useSameEmailAsAdmin: boolean; userEmail?: string }
    >
  >({});
  const [manualStatus, setManualStatus] = useState<string | null>(null);
  const [manualError, setManualError] = useState<string | null>(null);
  const [isCreatingPurchase, setIsCreatingPurchase] = useState(false);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Calculate stats
  const totalRevenue = salesData
    .filter((sale) => sale.status === 'Completed')
    .reduce((sum, sale) => sum + sale.amount, 0);

  const totalTransactions = salesData.length;
  const completedTransactions = salesData.filter(
    (sale) => sale.status === 'Completed'
  ).length;
  const pendingTransactions = salesData.filter(
    (sale) => sale.status === 'Pending'
  ).length;
  const averageOrderValue =
    completedTransactions > 0 ? totalRevenue / completedTransactions : 0;

  useEffect(() => {
    const loadApps = async () => {
      try {
        const response = await fetch('/api/admin/manual-purchases/apps');
        const data = await response.json();
        if (!response.ok) {
          setManualError(data?.error || 'Failed to load apps');
          return;
        }
        setManualApps(data?.apps || []);
      } catch (error) {
        setManualError(
          error instanceof Error ? error.message : 'Failed to load apps'
        );
      }
    };

    loadApps();
  }, []);

  const statsData = [
    {
      title: 'Total Revenue',
      value: `GHS${totalRevenue.toLocaleString()}`,
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
      value: `GHS${averageOrderValue.toFixed(2)}`,
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
      options: Array.from(
        new Set(salesData.map((sale) => sale.app))
      ).map((app) => ({ label: app, value: app })),
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: Array.from(
        new Set(salesData.map((sale) => sale.status))
      ).map((status) => ({ label: status, value: status })),
    },
    {
      key: 'paymentMethod',
      label: 'Payment Method',
      type: 'select' as const,
      options: Array.from(
        new Set(salesData.map((sale) => sale.paymentMethod))
      ).map((method) => ({ label: method, value: method })),
    },
    {
      key: 'region',
      label: 'Region',
      type: 'select' as const,
      options: Array.from(
        new Set(salesData.map((sale) => sale.region))
      ).map((region) => ({ label: region, value: region })),
    },
  ];

  const handleFilter = (newFilters: Record<string, any>) => {
    setFilters(newFilters);

    let filtered = salesData;

    // Apply filters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((sale) =>
          sale[key as keyof typeof sale]
            ?.toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        );
      }
    });

    setFilteredData(filtered);
  };

  const handleHubtelStatusCheck = async () => {
    const reference = hubtelReference.trim();
    if (!reference) {
      setHubtelError('Client reference is required.');
      setHubtelStatus(null);
      return;
    }

    setIsCheckingStatus(true);
    setHubtelError(null);
    setHubtelStatus(null);
    try {
      const response = await fetch('/api/payments/hubtel/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clientReference: reference }),
      });
      const result = await response.json();
      if (!response.ok) {
        setHubtelError(result?.error || 'Failed to fetch status.');
      } else {
        setHubtelStatus(result);
      }
    } catch (error) {
      setHubtelError(
        error instanceof Error ? error.message : 'Failed to fetch status.'
      );
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleCopyRaw = async () => {
    if (!hubtelStatus) {
      return;
    }
    const text = JSON.stringify(hubtelStatus, null, 2);
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  const handleManualBillingFieldChange = (
    field: keyof typeof manualBillingDetails,
    value: string
  ) => {
    setManualBillingDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleManualAddressChange = (
    field: keyof typeof manualBillingDetails.address,
    value: string
  ) => {
    setManualBillingDetails((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const handleManualAppToggle = (appId: string, checked: boolean) => {
    setSelectedAppIds((prev) => {
      if (checked) {
        return prev.includes(appId) ? prev : [...prev, appId];
      }
      return prev.filter((id) => id !== appId);
    });
    setManualQuantities((prev) => ({
      ...prev,
      [appId]: prev[appId] ?? 1,
    }));
  };

  const handleManualQuantityChange = (appId: string, value: string) => {
    const quantity = Number(value);
    if (Number.isNaN(quantity) || quantity <= 0) {
      return;
    }
    setManualQuantities((prev) => ({
      ...prev,
      [appId]: quantity,
    }));
  };

  const handleProvisioningUseSameChange = (appId: string, checked: boolean) => {
    setManualProvisioningDetails((prev) => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        useSameEmailAsAdmin: checked,
        userEmail: checked
          ? manualBillingDetails.organizationEmail
          : prev[appId]?.userEmail,
      },
    }));
  };

  const handleProvisioningEmailChange = (appId: string, value: string) => {
    setManualProvisioningDetails((prev) => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        userEmail: value,
      },
    }));
  };

  const selectedApps = manualApps.filter((app) =>
    selectedAppIds.includes(app.id)
  );

  const computedTotal = selectedApps.reduce((sum, app) => {
    const quantity = manualQuantities[app.id] || 1;
    return sum + app.price * quantity;
  }, 0);

  const resolvedManualTotal =
    manualTotal.trim().length > 0 ? Number(manualTotal) : computedTotal;
  const safeResolvedManualTotal = Number.isFinite(resolvedManualTotal)
    ? resolvedManualTotal
    : 0;

  const handleCreateManualPurchase = async () => {
    setManualError(null);
    setManualStatus(null);

    if (!manualBillingDetails.organizationName.trim()) {
      setManualError('Organization name is required.');
      return;
    }
    if (!manualBillingDetails.organizationEmail.trim()) {
      setManualError('Organization email is required.');
      return;
    }
    if (!manualBillingDetails.address.street.trim()) {
      setManualError('Street address is required.');
      return;
    }
    if (!manualBillingDetails.address.city.trim()) {
      setManualError('City is required.');
      return;
    }
    if (!manualBillingDetails.address.state.trim()) {
      setManualError('State is required.');
      return;
    }
    if (!manualBillingDetails.address.country.trim()) {
      setManualError('Country is required.');
      return;
    }
    if (selectedAppIds.length === 0) {
      setManualError('Select at least one app.');
      return;
    }
    if (Number.isNaN(resolvedManualTotal) || resolvedManualTotal <= 0) {
      setManualError('Enter a valid total amount.');
      return;
    }

    setIsCreatingPurchase(true);
    try {
      const items = selectedApps.map((app) => ({
        productId: app.id,
        quantity: manualQuantities[app.id] || 1,
        price: app.price,
        title: app.title,
      }));

      const response = await fetch('/api/admin/manual-purchases/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          billingDetails: manualBillingDetails,
          items,
          total: safeResolvedManualTotal,
          isExistingOrg: manualIsExistingOrg,
          clientReference: manualClientReferenceInput.trim() || undefined,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        setManualError(result?.error || 'Failed to create purchase record.');
        return;
      }

      setManualPurchase(result.purchase);
      setManualOrganizationId(result.organizationId || '');
      setManualClientReference(result.clientReference || '');
      setManualItems(items);
      setManualProvisioningDetails(result.provisioningDrafts || {});
      setManualTotalAmount(safeResolvedManualTotal);
      setManualStatus('Purchase created. Review provisioning details next.');
    } catch (error) {
      setManualError(
        error instanceof Error
          ? error.message
          : 'Failed to create purchase record.'
      );
    } finally {
      setIsCreatingPurchase(false);
    }
  };

  const handleProvisionApps = async () => {
    if (!manualOrganizationId) {
      setManualError('Create a purchase record first.');
      return;
    }
    setManualError(null);
    setManualStatus(null);
    setIsProvisioning(true);
    try {
      const response = await fetch('/api/admin/manual-purchases/provision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organizationId: manualOrganizationId,
          billingDetails: manualBillingDetails,
          appProvisioningDetails: manualProvisioningDetails,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        setManualError(result?.error || 'Provisioning failed.');
        return;
      }
      setManualStatus('Provisioning completed.');
    } catch (error) {
      setManualError(
        error instanceof Error ? error.message : 'Provisioning failed.'
      );
    } finally {
      setIsProvisioning(false);
    }
  };

  const handleSendManualEmail = async () => {
    if (manualItems.length === 0) {
      setManualError('Create a purchase record first.');
      return;
    }
    setManualError(null);
    setManualStatus(null);
    setIsSendingEmail(true);
    try {
      const response = await fetch('/api/admin/manual-purchases/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          billingDetails: manualBillingDetails,
          items: manualItems,
          total: manualTotalAmount || safeResolvedManualTotal,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        setManualError(result?.error || 'Failed to send email.');
        return;
      }
      setManualStatus('Confirmation email sent.');
    } catch (error) {
      setManualError(
        error instanceof Error ? error.message : 'Failed to send email.'
      );
    } finally {
      setIsSendingEmail(false);
    }
  };

  const hubtelDetails =
    hubtelStatus?.data?.Data?.[0] || hubtelStatus?.data?.data?.[0] || null;
  const hubtelResponseCode =
    hubtelStatus?.data?.ResponseCode || hubtelStatus?.data?.responseCode;

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
          <div className="font-medium">
            {row.currency}
            {value.toFixed(2)}
          </div>
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
          <div className="text-muted-foreground">
            {new Date(value).toLocaleTimeString()}
          </div>
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
      />

      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="status">Transaction Status Check</TabsTrigger>
        </TabsList>
        <TabsContent value="sales" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statsData.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>
                  Monthly revenue and transaction count
                </CardDescription>
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
                    <Tooltip
                      formatter={(value: any) => [
                        `$${value.toLocaleString()}`,
                        'Revenue',
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {appRevenueData.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">
                        GHS{item.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Distribution of payment methods used
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={paymentMethodData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: any) => [`${value}%`, 'Usage']}
                    />
                    <Bar dataKey="value" fill="#8884d8" minPointSize={5} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="space-y-4">
                  {paymentMethodData.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
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

          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                Detailed view of all sales transactions
              </CardDescription>
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
        </TabsContent>
        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Payment Status Check</CardTitle>
              <CardDescription>
                Lookup payment status by client reference
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-end">
                <div className="w-full space-y-2">
                  <Label htmlFor="hubtel-client-reference">
                    Client Reference
                  </Label>
                  <Input
                    id="hubtel-client-reference"
                    value={hubtelReference}
                    onChange={(event) => setHubtelReference(event.target.value)}
                    placeholder="Enter client reference"
                  />
                </div>
                <Button
                  onClick={handleHubtelStatusCheck}
                  disabled={isCheckingStatus}
                >
                  {isCheckingStatus ? 'Checking...' : 'Check Status'}
                </Button>
              </div>
              {hubtelError ? (
                <div className="mt-4 text-sm text-destructive">
                  {hubtelError}
                </div>
              ) : null}
              {hubtelStatus ? (
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Summary</div>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        Status:
                        <Badge
                          variant="outline"
                          className={
                            hubtelDetails?.TransactionStatus === 'Success'
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-destructive text-destructive-foreground'
                          }
                        >
                          {hubtelDetails?.TransactionStatus ||
                            hubtelDetails?.InvoiceStatus ||
                            'Unknown'}
                        </Badge>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="mt-4 grid gap-3 text-sm">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground">
                          Client Reference
                        </span>
                        <span className="font-medium">
                          {hubtelDetails?.ClientReference ||
                            hubtelDetails?.clientReference ||
                            hubtelReference}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground">
                          Response Code
                        </span>
                        <span className="font-medium">
                          {hubtelResponseCode || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="font-medium">
                          {hubtelDetails?.CurrencyCode || 'GHS'}{' '}
                          {typeof hubtelDetails?.TransactionAmount === 'number'
                            ? hubtelDetails.TransactionAmount.toFixed(2)
                            : hubtelDetails?.TransactionAmount || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground">Fees</span>
                        <span className="font-medium">
                          {typeof hubtelDetails?.Fee === 'number'
                            ? hubtelDetails.Fee.toFixed(2)
                            : hubtelDetails?.Fee || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground">
                          Amount After Fees
                        </span>
                        <span className="font-medium">
                          {typeof hubtelDetails?.AmountAfterFees === 'number'
                            ? hubtelDetails.AmountAfterFees.toFixed(2)
                            : hubtelDetails?.AmountAfterFees || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground">
                          Payment Method
                        </span>
                        <span className="font-medium">
                          {hubtelDetails?.PaymentMethod || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground">Mobile</span>
                        <span className="font-medium">
                          {hubtelDetails?.MobileNumber || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground">
                          Network Txn ID
                        </span>
                        <span className="font-medium">
                          {hubtelDetails?.NetworkTransactionId || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground">
                          Transaction ID
                        </span>
                        <span className="font-medium">
                          {hubtelDetails?.TransactionId || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground">
                          Provider Result
                        </span>
                        <span className="font-medium">
                          {hubtelDetails?.ProviderDescription ||
                            hubtelDetails?.ProviderResponseCode ||
                            'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-md border">
                    <div className="flex items-center justify-between border-b px-4 py-3">
                      <div className="text-sm font-medium">Raw JSON</div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCopyRaw}
                      >
                        {isCopied ? 'Copied' : 'Copy'}
                      </Button>
                    </div>
                    <pre className="max-h-96 overflow-auto bg-muted/50 p-4 text-xs">
                      {JSON.stringify(hubtelStatus, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle>Manual Purchase Entry</CardTitle>
              <CardDescription>
                Create purchase records, provision apps, and send confirmation
                emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {manualError ? (
                <div className="text-sm text-destructive">{manualError}</div>
              ) : null}
              {manualStatus ? (
                <div className="text-sm text-emerald-600">{manualStatus}</div>
              ) : null}
              <Tabs defaultValue="purchase" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="purchase">Create Purchase</TabsTrigger>
                  <TabsTrigger value="provision">Provision Apps</TabsTrigger>
                  <TabsTrigger value="email">Send Email</TabsTrigger>
                </TabsList>
                <TabsContent value="purchase" className="space-y-6">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Apps</CardTitle>
                        <CardDescription>
                          Select the apps and quantities for this purchase
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-3 md:grid-cols-2">
                          {manualApps.map((app) => {
                            const isSelected = selectedAppIds.includes(app.id);
                            return (
                              <div
                                key={app.id}
                                className="flex items-center justify-between rounded-md border px-3 py-2"
                              >
                                <div className="flex items-center gap-3">
                                  <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={(checked) =>
                                      handleManualAppToggle(
                                        app.id,
                                        Boolean(checked)
                                      )
                                    }
                                  />
                                  <div>
                                    <div className="text-sm font-medium">
                                      {app.title}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      GHS {app.price.toFixed(2)}
                                    </div>
                                  </div>
                                </div>
                                <Input
                                  className="h-8 w-20"
                                  type="number"
                                  min={1}
                                  value={manualQuantities[app.id] || 1}
                                  onChange={(event) =>
                                    handleManualQuantityChange(
                                      app.id,
                                      event.target.value
                                    )
                                  }
                                  disabled={!isSelected}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Organization & Billing</CardTitle>
                        <CardDescription>
                          Provide organization and billing details
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="manual-org-name">
                              Organization Name
                            </Label>
                            <Input
                              id="manual-org-name"
                              value={manualBillingDetails.organizationName}
                              onChange={(event) =>
                                handleManualBillingFieldChange(
                                  'organizationName',
                                  event.target.value
                                )
                              }
                              placeholder="Organization name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="manual-org-email">
                              Organization Email
                            </Label>
                            <Input
                              id="manual-org-email"
                              type="email"
                              value={manualBillingDetails.organizationEmail}
                              onChange={(event) =>
                                handleManualBillingFieldChange(
                                  'organizationEmail',
                                  event.target.value
                                )
                              }
                              placeholder="email@company.com"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="manual-phone">Phone Number</Label>
                            <Input
                              id="manual-phone"
                              value={manualBillingDetails.phoneNumber}
                              onChange={(event) =>
                                handleManualBillingFieldChange(
                                  'phoneNumber',
                                  event.target.value
                                )
                              }
                              placeholder="+233..."
                            />
                          </div>
                          <div className="flex items-center gap-2 pt-6">
                            <Checkbox
                              id="manual-existing-org"
                              checked={manualIsExistingOrg}
                              onCheckedChange={(checked) =>
                                setManualIsExistingOrg(Boolean(checked))
                              }
                            />
                            <Label htmlFor="manual-existing-org">
                              Existing organization
                            </Label>
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="manual-street">
                              Street Address
                            </Label>
                            <Input
                              id="manual-street"
                              value={manualBillingDetails.address.street}
                              onChange={(event) =>
                                handleManualAddressChange(
                                  'street',
                                  event.target.value
                                )
                              }
                              placeholder="Street address"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="manual-city">City</Label>
                            <Input
                              id="manual-city"
                              value={manualBillingDetails.address.city}
                              onChange={(event) =>
                                handleManualAddressChange(
                                  'city',
                                  event.target.value
                                )
                              }
                              placeholder="City"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="manual-state">State</Label>
                            <Input
                              id="manual-state"
                              value={manualBillingDetails.address.state}
                              onChange={(event) =>
                                handleManualAddressChange(
                                  'state',
                                  event.target.value
                                )
                              }
                              placeholder="State"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="manual-country">Country</Label>
                            <Input
                              id="manual-country"
                              value={manualBillingDetails.address.country}
                              onChange={(event) =>
                                handleManualAddressChange(
                                  'country',
                                  event.target.value
                                )
                              }
                              placeholder="Country"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="manual-postal">Postal Code</Label>
                            <Input
                              id="manual-postal"
                              value={manualBillingDetails.address.postalCode}
                              onChange={(event) =>
                                handleManualAddressChange(
                                  'postalCode',
                                  event.target.value
                                )
                              }
                              placeholder="Postal code"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Amount & Reference</CardTitle>
                        <CardDescription>
                          Review total and add a payment reference
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="manual-total">
                              Total Amount (GHS)
                            </Label>
                            <Input
                              id="manual-total"
                              type="number"
                              min={0}
                              value={manualTotal}
                              onChange={(event) =>
                                setManualTotal(event.target.value)
                              }
                              placeholder={computedTotal.toFixed(2)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="manual-client-reference">
                              Payment Reference (Optional)
                            </Label>
                            <Input
                              id="manual-client-reference"
                              value={manualClientReferenceInput}
                              onChange={(event) =>
                                setManualClientReferenceInput(
                                  event.target.value
                                )
                              }
                              placeholder="FMT_12345"
                            />
                          </div>
                        </div>
                        <div className="rounded-md border px-4 py-3 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Computed
                            </span>
                            <span className="font-medium">
                              GHS {computedTotal.toFixed(2)}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-muted-foreground">Final</span>
                            <span className="font-medium">
                              GHS {safeResolvedManualTotal.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <Button
                    onClick={handleCreateManualPurchase}
                    disabled={isCreatingPurchase}
                  >
                    {isCreatingPurchase ? 'Creating...' : 'Create Purchase'}
                  </Button>
                </TabsContent>
                <TabsContent value="provision" className="space-y-4">
                  {manualPurchase ? (
                    <div className="rounded-md border p-4 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Payment Reference
                        </span>
                        <span className="font-medium">
                          {manualClientReference ||
                            manualPurchase?.payment_reference}
                        </span>
                      </div>
                    </div>
                  ) : null}
                  <div className="space-y-3">
                    {Object.entries(manualProvisioningDetails).length === 0 ? (
                      <div className="text-sm text-muted-foreground">
                        Create a purchase record to load provisioning details.
                      </div>
                    ) : (
                      Object.entries(manualProvisioningDetails).map(
                        ([appId, details]) => (
                          <div
                            key={appId}
                            className="rounded-md border p-4 space-y-3"
                          >
                            <div className="font-medium">
                              {details.name || appId}
                            </div>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={details.useSameEmailAsAdmin}
                                onCheckedChange={(checked) =>
                                  handleProvisioningUseSameChange(
                                    appId,
                                    Boolean(checked)
                                  )
                                }
                              />
                              <span className="text-sm text-muted-foreground">
                                Use organization email
                              </span>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`manual-provision-${appId}`}>
                                User Email
                              </Label>
                              <Input
                                id={`manual-provision-${appId}`}
                                value={
                                  details.useSameEmailAsAdmin
                                    ? manualBillingDetails.organizationEmail
                                    : details.userEmail || ''
                                }
                                onChange={(event) =>
                                  handleProvisioningEmailChange(
                                    appId,
                                    event.target.value
                                  )
                                }
                                disabled={details.useSameEmailAsAdmin}
                              />
                            </div>
                          </div>
                        )
                      )
                    )}
                  </div>
                  <Button
                    onClick={handleProvisionApps}
                    disabled={isProvisioning}
                  >
                    {isProvisioning ? 'Provisioning...' : 'Provision Apps'}
                  </Button>
                </TabsContent>
                <TabsContent value="email" className="space-y-4">
                  <div className="rounded-md border p-4 text-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Recipient</span>
                      <span className="font-medium">
                        {manualBillingDetails.organizationEmail || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total</span>
                      <span className="font-medium">
                        GHS {safeResolvedManualTotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2 pt-2">
                      {manualItems.map((item) => (
                        <div
                          key={item.productId}
                          className="flex items-center justify-between"
                        >
                          <span>{item.title || item.productId}</span>
                          <span className="font-medium">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={handleSendManualEmail}
                    disabled={isSendingEmail}
                  >
                    {isSendingEmail ? 'Sending...' : 'Send Email'}
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
