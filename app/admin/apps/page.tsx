'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminHeader } from '../components/AdminHeader';
import { DataTable, Column, StatusBadge } from '../components/DataTable';
import { FilterBar, FilterOption } from '../components/FilterBar';
import { StatsCard } from '../components/StatsCard';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Package,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Settings,
} from 'lucide-react';

// Mock data
const appsData = [
  {
    id: 'app-1',
    name: 'TaskManager Pro',
    type: 'Desktop',
    status: 'Active',
    version: '2.1.0',
    sales: 1250,
    downloads: 15420,
    revenue: '$18,750',
    lastUpdated: '2024-01-15',
    rating: 4.8,
    category: 'Productivity',
  },
  {
    id: 'app-2',
    name: 'Analytics Dashboard',
    type: 'Web',
    status: 'Active',
    version: '1.5.2',
    sales: 890,
    downloads: 12340,
    revenue: '$13,350',
    lastUpdated: '2024-01-12',
    rating: 4.6,
    category: 'Analytics',
  },
  {
    id: 'app-3',
    name: 'Mobile Sync',
    type: 'Mobile',
    status: 'Active',
    version: '3.0.1',
    sales: 2100,
    downloads: 28900,
    revenue: '$31,500',
    lastUpdated: '2024-01-10',
    rating: 4.4,
    category: 'Utilities',
  },
  {
    id: 'app-4',
    name: 'DataSync Tool',
    type: 'Desktop',
    status: 'Draft',
    version: '1.0.0-beta',
    sales: 0,
    downloads: 0,
    revenue: '$0',
    lastUpdated: '2024-01-08',
    rating: 0,
    category: 'Development',
  },
  {
    id: 'app-5',
    name: 'Report Generator',
    type: 'Web',
    status: 'Inactive',
    version: '2.3.1',
    sales: 450,
    downloads: 5670,
    revenue: '$6,750',
    lastUpdated: '2023-12-20',
    rating: 4.2,
    category: 'Business',
  },
  {
    id: 'app-6',
    name: 'File Organizer',
    type: 'Desktop',
    status: 'Active',
    version: '1.8.0',
    sales: 780,
    downloads: 9850,
    revenue: '$11,700',
    lastUpdated: '2024-01-05',
    rating: 4.7,
    category: 'Utilities',
  },
  {
    id: 'app-7',
    name: 'Team Chat',
    type: 'Mobile',
    status: 'Active',
    version: '2.2.0',
    sales: 1680,
    downloads: 22100,
    revenue: '$25,200',
    lastUpdated: '2024-01-14',
    rating: 4.5,
    category: 'Communication',
  },
  {
    id: 'app-8',
    name: 'Budget Tracker',
    type: 'Web',
    status: 'Active',
    version: '1.4.3',
    sales: 920,
    downloads: 11200,
    revenue: '$13,800',
    lastUpdated: '2024-01-11',
    rating: 4.3,
    category: 'Finance',
  },
];

const statsData = [
  {
    title: 'Total Apps',
    value: appsData.length.toString(),
    description: 'All applications',
    icon: Package,
    color: 'blue' as const,
  },
  {
    title: 'Active Apps',
    value: appsData.filter(app => app.status === 'Active').length.toString(),
    description: 'Currently active',
    icon: Package,
    color: 'green' as const,
  },
  {
    title: 'Total Downloads',
    value: appsData.reduce((sum, app) => sum + app.downloads, 0).toLocaleString(),
    description: 'All time downloads',
    icon: Download,
    color: 'purple' as const,
  },
  {
    title: 'Total Revenue',
    value: `$${appsData.reduce((sum, app) => sum + parseInt(app.revenue.replace(/[$,]/g, '')), 0).toLocaleString()}`,
    description: 'All time revenue',
    icon: Package,
    color: 'yellow' as const,
  },
];

const filterOptions: FilterOption[] = [
  {
    key: 'type',
    label: 'Type',
    type: 'select',
    options: [
      { value: 'Desktop', label: 'Desktop' },
      { value: 'Web', label: 'Web' },
      { value: 'Mobile', label: 'Mobile' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'Active', label: 'Active' },
      { value: 'Inactive', label: 'Inactive' },
      { value: 'Draft', label: 'Draft' },
    ],
  },
  {
    key: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { value: 'Productivity', label: 'Productivity' },
      { value: 'Analytics', label: 'Analytics' },
      { value: 'Utilities', label: 'Utilities' },
      { value: 'Development', label: 'Development' },
      { value: 'Business', label: 'Business' },
      { value: 'Communication', label: 'Communication' },
      { value: 'Finance', label: 'Finance' },
    ],
  },
];

export default function AppsManagement() {
  const router = useRouter();
  const [filteredData, setFilteredData] = useState(appsData);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<typeof appsData[0] | null>(null);

  const handleSearch = (term: string) => {
    const filtered = appsData.filter(app =>
      app.name.toLowerCase().includes(term.toLowerCase()) ||
      app.type.toLowerCase().includes(term.toLowerCase()) ||
      app.category.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleFilter = (filters: Record<string, any>) => {
    let filtered = [...appsData];
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(app => app[key as keyof typeof app] === value);
      }
    });
    
    setFilteredData(filtered);
  };

  const handleClearFilters = () => {
    setFilteredData(appsData);
  };

  const handleRowClick = (app: typeof appsData[0]) => {
    router.push(`/admin/apps/${app.id}`);
  };

  const handleEdit = (app: typeof appsData[0]) => {
    console.log('Edit app:', app.name);
  };

  const handleDelete = (app: typeof appsData[0]) => {
    setSelectedApp(app);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedApp) {
      console.log('Delete app:', selectedApp.name);
      setDeleteDialogOpen(false);
      setSelectedApp(null);
    }
  };

  const handlePublish = (app: typeof appsData[0]) => {
    console.log('Publish app:', app.name);
  };

  const columns: Column<typeof appsData[0]>[] = [
    {
      key: 'name',
      label: 'App Name',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Package className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-xs text-muted-foreground">v{row.version}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
    },
    {
      key: 'sales',
      label: 'Sales',
      sortable: true,
      render: (value) => value.toLocaleString(),
    },
    {
      key: 'downloads',
      label: 'Downloads',
      sortable: true,
      render: (value) => value.toLocaleString(),
    },
    {
      key: 'revenue',
      label: 'Revenue',
      sortable: true,
      render: (value) => <span className="font-medium text-green-600">{value}</span>,
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-1">
          <span>{value > 0 ? value.toFixed(1) : 'N/A'}</span>
          {value > 0 && <span className="text-yellow-500">★</span>}
        </div>
      ),
    },
    {
      key: 'lastUpdated',
      label: 'Last Updated',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const renderActions = (app: typeof appsData[0]) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleRowClick(app)}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleEdit(app)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        {app.status === 'Draft' && (
          <DropdownMenuItem onClick={() => handlePublish(app)}>
            <Upload className="mr-2 h-4 w-4" />
            Publish
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleDelete(app)}
          className="text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Apps Management"
        description="Manage all your applications, monitor performance, and track metrics."
        action={{
          label: 'Add New App',
          onClick: () => console.log('Add new app'),
          icon: Plus,
        }}
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Filters */}
      <FilterBar
        searchPlaceholder="Search apps..."
        filters={filterOptions}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onClear={handleClearFilters}
      />

      {/* Apps Table */}
      <DataTable
        data={filteredData}
        columns={columns}
        searchable={false}
        exportable={true}
        onRowClick={handleRowClick}
        actions={renderActions}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedApp?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}