'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import {
  Calendar,
  MoreHorizontal,
  Search,
  Download,
  Eye,
  User,
  Code,
  Target,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { createClient } from '@/lib/supabase/browser';
import { Input } from '@/components/ui/input';
import { client as sanityClient } from '@/sanity/lib/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BaseRegistration {
  id: string;
  training_id: string;
  training_slug: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'attended';
  created_at: string;
  updated_at: string;
}

interface RegularRegistration extends BaseRegistration {
  type: 'regular';
  company: string | null;
  message: string | null;
}

interface CustomRegistration extends BaseRegistration {
  type: 'custom';
  company: null;
  message: null;
  details: {
    about?: string;
    experience: string[];
    expectations?: string;
    [key: string]: any;
  };
}

type Registration = RegularRegistration | CustomRegistration;

interface AdminRegistrationsListProps {
  registrations: Registration[];
}

const experienceLabels: Record<string, string> = {
  'no-programming': 'No knowledge about programming',
  'little-programming': 'Little knowledge about programming',
  'no-webdev': 'No knowledge about web development',
  'little-webdev': 'Little knowledge about web development',
  'html-basics': 'Familiar with HTML basics',
  'css-basics': 'Familiar with CSS basics',
  'javascript-basics': 'Familiar with JavaScript basics',
  'website-builders': 'Used website builders (WordPress, Wix, etc.)',
  'self-taught': 'Self-taught through online tutorials',
  'online-courses': 'Completed online coding courses',
  'academic-background': 'Academic background in computer science',
  'professional-experience': 'Professional experience in related fields',
};

function CustomRegistrationDetails({
  registration,
}: {
  registration: CustomRegistration;
}) {
  const { details } = registration;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            About the Participant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {details.about || 'No information provided'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Code className="h-5 w-5 text-purple-600" />
            Experience Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2">
            {details.experience && details.experience.length > 0 ? (
              details.experience.map((exp, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{experienceLabels[exp] || exp}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No experience information provided
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Expectations & Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {details.expectations || 'No expectations provided'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminRegistrationsList({
  registrations,
}: AdminRegistrationsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRegistrations, setFilteredRegistrations] =
    useState<Registration[]>(registrations);
  const [isProcessing, setIsProcessing] = useState(false);
  const supabase = createClient();

  const handleStatusChange = async (
    registration: Registration,
    newStatus: string
  ) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const oldStatus = registration.status;
      const tableName =
        registration.type === 'custom'
          ? 'custom_training_registrations'
          : 'training_registrations';

      // Update registration status in Supabase
      const { error } = await supabase
        .from(tableName)
        .update({ status: newStatus })
        .eq('id', registration.id);

      if (error) {
        throw new Error(
          `Failed to update registration status: ${error.message}`
        );
      }

      // Only decrement participant count when cancelling
      if (newStatus === 'cancelled' && oldStatus !== 'cancelled') {
        try {
          await sanityClient
            .patch(registration.training_id)
            .dec({ registeredParticipants: 1 })
            .commit();
        } catch (sanityError) {
          console.error('Error updating Sanity document:', sanityError);
          toast({
            title: 'Warning',
            description:
              'Registration status updated, but participant count could not be updated in CMS.',
            variant: 'destructive',
          });
        }
      }

      // Update the local state with the new status
      setFilteredRegistrations((prev) =>
        prev.map((reg) =>
          reg.id === registration.id
            ? { ...reg, status: newStatus as any }
            : reg
        )
      );

      toast({
        title: 'Status Updated',
        description: `Registration status has been updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to update registration status',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (!value.trim()) {
      setFilteredRegistrations(registrations);
      return;
    }

    const filtered = registrations.filter(
      (reg) =>
        reg.first_name.toLowerCase().includes(value) ||
        reg.last_name.toLowerCase().includes(value) ||
        reg.email.toLowerCase().includes(value) ||
        reg.training_slug.toLowerCase().includes(value) ||
        (reg.type === 'regular' &&
          reg.company &&
          reg.company.toLowerCase().includes(value))
    );

    setFilteredRegistrations(filtered);
  };

  const exportToCSV = () => {
    const headers = [
      'ID',
      'Type',
      'Training Slug',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Company',
      'Status',
      'Registration Date',
    ];

    const csvData = filteredRegistrations.map((reg) => [
      reg.id,
      reg.type,
      reg.training_slug,
      reg.first_name,
      reg.last_name,
      reg.email,
      reg.phone || '',
      reg.type === 'regular' ? reg.company || '' : 'N/A (Custom)',
      reg.status,
      format(new Date(reg.created_at), 'yyyy-MM-dd HH:mm:ss'),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...csvData.map((row) => row.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `training-registrations-${format(new Date(), 'yyyy-MM-dd')}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'attended':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'custom'
      ? 'bg-purple-100 text-purple-800 border-purple-200'
      : 'bg-blue-100 text-blue-800 border-blue-200';
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, email or training..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={exportToCSV}
          disabled={isProcessing}
        >
          <Download className="h-4 w-4" />
          Export to CSV
        </Button>
      </div>

      {filteredRegistrations.length === 0 ? (
        <div className="text-center py-8 bg-muted rounded-md">
          <p className="text-muted-foreground">
            {searchTerm
              ? 'No registrations match your search'
              : 'No registrations found'}
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Training</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRegistrations.map((registration) => (
                <TableRow key={registration.id}>
                  <TableCell className="font-medium">
                    {registration.first_name} {registration.last_name}
                    {registration.type === 'regular' &&
                      registration.company && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {registration.company}
                        </div>
                      )}
                  </TableCell>
                  <TableCell>
                    <div>{registration.email}</div>
                    {registration.phone && (
                      <div className="text-xs text-muted-foreground">
                        {registration.phone}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate">
                      {registration.training_slug.replace(/-/g, ' ')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getTypeColor(registration.type)}
                    >
                      {registration.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusColor(registration.status)}
                    >
                      {registration.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-xs">
                        {formatDistanceToNow(
                          new Date(registration.created_at),
                          {
                            addSuffix: true,
                          }
                        )}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {format(new Date(registration.created_at), 'MMM d, yyyy')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {registration.type === 'custom' && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              aria-label="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Registration Details</DialogTitle>
                              <DialogDescription>
                                Custom registration details for{' '}
                                {registration.first_name}{' '}
                                {registration.last_name}
                              </DialogDescription>
                            </DialogHeader>
                            <CustomRegistrationDetails
                              registration={registration}
                            />
                          </DialogContent>
                        </Dialog>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            aria-label="Open menu"
                            disabled={isProcessing}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(registration, 'pending')
                            }
                            disabled={
                              registration.status === 'pending' || isProcessing
                            }
                          >
                            Mark as Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(registration, 'confirmed')
                            }
                            disabled={
                              registration.status === 'confirmed' ||
                              isProcessing
                            }
                          >
                            Mark as Confirmed
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(registration, 'cancelled')
                            }
                            disabled={
                              registration.status === 'cancelled' ||
                              isProcessing
                            }
                          >
                            Mark as Cancelled
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(registration, 'attended')
                            }
                            disabled={
                              registration.status === 'attended' || isProcessing
                            }
                          >
                            Mark as Attended
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
