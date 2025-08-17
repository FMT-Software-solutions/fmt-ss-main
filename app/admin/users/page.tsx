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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Users,
  UserPlus,
  Shield,
  Settings,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

// Mock users data
const usersData = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'Super Admin',
    status: 'Active',
    lastLogin: '2024-01-20T10:30:00Z',
    createdAt: '2023-06-15T09:00:00Z',
    phone: '+1 (555) 123-4567',
    department: 'IT',
    permissions: ['all'],
    avatar: null,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2024-01-19T15:45:00Z',
    createdAt: '2023-08-20T14:20:00Z',
    phone: '+1 (555) 234-5678',
    department: 'Operations',
    permissions: ['apps', 'sales', 'users'],
    avatar: null,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    role: 'Manager',
    status: 'Active',
    lastLogin: '2024-01-18T11:20:00Z',
    createdAt: '2023-09-10T11:15:00Z',
    phone: '+1 (555) 345-6789',
    department: 'Sales',
    permissions: ['apps', 'sales'],
    avatar: null,
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@company.com',
    role: 'Analyst',
    status: 'Inactive',
    lastLogin: '2024-01-10T08:30:00Z',
    createdAt: '2023-11-05T16:45:00Z',
    phone: '+1 (555) 456-7890',
    department: 'Analytics',
    permissions: ['metrics', 'reports'],
    avatar: null,
  },
  {
    id: '5',
    name: 'Robert Brown',
    email: 'robert.brown@company.com',
    role: 'Developer',
    status: 'Pending',
    lastLogin: null,
    createdAt: '2024-01-15T13:20:00Z',
    phone: '+1 (555) 567-8901',
    department: 'Development',
    permissions: ['apps', 'releases'],
    avatar: null,
  },
];

// Mock roles data
const rolesData = [
  {
    id: '1',
    name: 'Super Admin',
    description: 'Full system access with all permissions',
    userCount: 1,
    permissions: ['all'],
    color: 'red',
  },
  {
    id: '2',
    name: 'Admin',
    description: 'Administrative access to most features',
    userCount: 1,
    permissions: ['apps', 'sales', 'users', 'metrics'],
    color: 'blue',
  },
  {
    id: '3',
    name: 'Manager',
    description: 'Management access to specific modules',
    userCount: 1,
    permissions: ['apps', 'sales', 'metrics'],
    color: 'green',
  },
  {
    id: '4',
    name: 'Analyst',
    description: 'Read-only access to analytics and reports',
    userCount: 1,
    permissions: ['metrics', 'reports'],
    color: 'purple',
  },
  {
    id: '5',
    name: 'Developer',
    description: 'Access to development and release management',
    userCount: 1,
    permissions: ['apps', 'releases', 'metrics'],
    color: 'yellow',
  },
];

// Available permissions
const availablePermissions = [
  { id: 'apps', label: 'Apps Management', description: 'Manage applications and app details' },
  { id: 'sales', label: 'Sales & Transactions', description: 'View and manage sales data' },
  { id: 'users', label: 'User Management', description: 'Manage users and roles' },
  { id: 'metrics', label: 'Metrics & Monitoring', description: 'View system metrics and analytics' },
  { id: 'releases', label: 'Release Management', description: 'Manage app releases and deployments' },
  { id: 'reports', label: 'Reports', description: 'Generate and view reports' },
  { id: 'settings', label: 'System Settings', description: 'Configure system settings' },
];

export default function UsersPage() {
  const [filteredData, setFilteredData] = useState(usersData);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('users');
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [addRoleDialogOpen, setAddRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof usersData[0] | null>(null);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    role: '',
  });
  const [roleFormData, setRoleFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
  });

  // Calculate stats
  const totalUsers = usersData.length;
  const activeUsers = usersData.filter(user => user.status === 'Active').length;
  const pendingUsers = usersData.filter(user => user.status === 'Pending').length;
  const totalRoles = rolesData.length;

  const statsData = [
    {
      title: 'Total Users',
      value: totalUsers.toString(),
      description: 'All admin users',
      icon: Users,
      trend: { value: 8.5, label: 'from last month', isPositive: true },
      color: 'blue' as const,
    },
    {
      title: 'Active Users',
      value: activeUsers.toString(),
      description: 'Currently active',
      icon: CheckCircle,
      trend: { value: 12.3, label: 'from last month', isPositive: true },
      color: 'green' as const,
    },
    {
      title: 'Pending Users',
      value: pendingUsers.toString(),
      description: 'Awaiting activation',
      icon: Clock,
      trend: { value: 5.7, label: 'from last month', isPositive: false },
      color: 'yellow' as const,
    },
    {
      title: 'Total Roles',
      value: totalRoles.toString(),
      description: 'Defined roles',
      icon: Shield,
      trend: { value: 0, label: 'no change', isPositive: true },
      color: 'purple' as const,
    },
  ];

  const filterOptions = [
    {
      key: 'role',
      label: 'Role',
      type: 'select' as const,
      options: Array.from(new Set(usersData.map(user => user.role))).map(role => ({ label: role, value: role })),
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: Array.from(new Set(usersData.map(user => user.status))).map(status => ({ label: status, value: status })),
    },
    {
      key: 'department',
      label: 'Department',
      type: 'select' as const,
      options: Array.from(new Set(usersData.map(user => user.department))).map(dept => ({ label: dept, value: dept })),
    },
  ];

  const handleFilter = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
    
    let filtered = usersData;
    
    // Apply filters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(user => 
          user[key as keyof typeof user]?.toString().toLowerCase().includes(value.toLowerCase())
        );
      }
    });
    
    setFilteredData(filtered);
  };

  const handleAddUser = () => {
    console.log('Adding user:', userFormData);
    setAddUserDialogOpen(false);
    setUserFormData({ name: '', email: '', phone: '', department: '', role: '' });
  };

  const handleAddRole = () => {
    console.log('Adding role:', roleFormData);
    setAddRoleDialogOpen(false);
    setRoleFormData({ name: '', description: '', permissions: [] });
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setRoleFormData(prev => ({
      ...prev,
      permissions: checked 
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter(p => p !== permissionId)
    }));
  };

  const usersColumns: Column<typeof usersData[0]>[] = [
    {
      key: 'name',
      label: 'User',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{value.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-muted-foreground">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (value) => <Badge variant="outline">{value}</Badge>,
    },
    {
      key: 'department',
      label: 'Department',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'lastLogin',
      label: 'Last Login',
      sortable: true,
      render: (value) => (
        <div className="text-sm">
          {value ? (
            <>
              <div>{new Date(value).toLocaleDateString()}</div>
              <div className="text-muted-foreground">{new Date(value).toLocaleTimeString()}</div>
            </>
          ) : (
            <span className="text-muted-foreground">Never</span>
          )}
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const rolesColumns: Column<typeof rolesData[0]>[] = [
    {
      key: 'name',
      label: 'Role',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className={`h-3 w-3 rounded-full bg-${row.color}-500`} />
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-muted-foreground">{row.description}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'userCount',
      label: 'Users',
      render: (value) => (
        <div className="text-center">
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">assigned</div>
        </div>
      ),
    },
    {
      key: 'permissions',
      label: 'Permissions',
      render: (value) => (
        <div className="flex flex-wrap gap-1">
          {value.includes('all') ? (
            <Badge variant="destructive">All Permissions</Badge>
          ) : (
            <>
              {value.slice(0, 3).map((permission: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {permission}
                </Badge>
              ))}
              {value.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{value.length - 3}
                </Badge>
              )}
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminHeader
        title="User & Role Management"
        description="Manage admin users, roles, and permissions"
        action={{
          label: 'Add User',
          onClick: () => setAddUserDialogOpen(true),
          icon: UserPlus,
        }}
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Admin Users</CardTitle>
              <CardDescription>Manage administrative users and their access</CardDescription>
            </CardHeader>
            <CardContent>
              <FilterBar
                onFilter={handleFilter}
                filters={filterOptions}
                searchPlaceholder="Search users..."
              />
              
              <div className="mt-6">
                <DataTable
                  data={filteredData}
                  columns={usersColumns}
                  searchable={false}
                  exportable={true}
                  actions={(user) => (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Roles & Permissions</CardTitle>
                    <CardDescription>Manage user roles and their permissions</CardDescription>
                  </div>
                  <Button onClick={() => setAddRoleDialogOpen(true)}>
                    <Shield className="mr-2 h-4 w-4" />
                    Add Role
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={rolesData}
                  columns={rolesColumns}
                  searchable={true}
                  exportable={false}
                  actions={(role) => (
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                />
              </CardContent>
            </Card>

            {/* Permissions Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Available Permissions</CardTitle>
                <CardDescription>System permissions that can be assigned to roles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {availablePermissions.map((permission) => (
                    <div key={permission.id} className="p-4 border rounded-lg">
                      <div className="font-medium">{permission.label}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {permission.description}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add User Dialog */}
      <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new admin user account with appropriate permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={userFormData.name}
                onChange={(e) => setUserFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="John Doe"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userFormData.email}
                onChange={(e) => setUserFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john.doe@company.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={userFormData.phone}
                onChange={(e) => setUserFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={userFormData.department}
                onChange={(e) => setUserFormData(prev => ({ ...prev, department: e.target.value }))}
                placeholder="IT"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select value={userFormData.role} onValueChange={(value) => setUserFormData(prev => ({ ...prev, role: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {rolesData.map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Role Dialog */}
      <Dialog open={addRoleDialogOpen} onOpenChange={setAddRoleDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Role</DialogTitle>
            <DialogDescription>
              Create a new role with specific permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="roleName">Role Name</Label>
              <Input
                id="roleName"
                value={roleFormData.name}
                onChange={(e) => setRoleFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Manager"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="roleDescription">Description</Label>
              <Textarea
                id="roleDescription"
                value={roleFormData.description}
                onChange={(e) => setRoleFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the role and its responsibilities..."
              />
            </div>
            <div className="grid gap-2">
              <Label>Permissions</Label>
              <div className="grid gap-3 max-h-48 overflow-y-auto">
                {availablePermissions.map((permission) => (
                  <div key={permission.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={permission.id}
                      checked={roleFormData.permissions.includes(permission.id)}
                      onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor={permission.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {permission.label}
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {permission.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRole}>
              <Shield className="mr-2 h-4 w-4" />
              Add Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}