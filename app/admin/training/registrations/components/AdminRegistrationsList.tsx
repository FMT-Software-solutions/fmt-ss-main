'use client';

import React, { useState, useEffect } from 'react';
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
  Clock,
  CreditCard,
  Mail,
  Check,
  Filter,
  CalendarDays,
} from 'lucide-react';
import {
  formatDistanceToNow,
  format,
  startOfDay,
  endOfDay,
  subDays,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfYear,
  endOfYear,
  subYears,
  isWithinInterval,
} from 'date-fns';
import { createClient } from '@/lib/supabase/browser';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  payment_method?: 'paystack' | 'momo' | null;
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
    session?: string;
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

type DateFilterType =
  | 'today'
  | 'yesterday'
  | 'last3days'
  | 'last7days'
  | 'last15days'
  | 'last30days'
  | 'thismonth'
  | 'lastmonth'
  | 'thisyear'
  | 'lastyear'
  | 'alltime'
  | 'custom';

interface DateRange {
  start: Date | null;
  end: Date | null;
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

  const getPaymentMethodLabel = (method?: string | null) => {
    switch (method) {
      case 'paystack':
        return 'Paystack (Card Payment)';
      case 'momo':
        return 'Mobile Money (Manual)';
      default:
        return 'Not specified';
    }
  };

  const getPaymentMethodColor = (method?: string | null) => {
    switch (method) {
      case 'paystack':
        return 'text-green-600';
      case 'momo':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      {/* Session and Payment Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Session Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">
              {details.session || 'Not specified'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-600" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-sm font-medium ${getPaymentMethodColor(
                registration.payment_method
              )}`}
            >
              {getPaymentMethodLabel(registration.payment_method)}
            </p>
          </CardContent>
        </Card>
      </div>

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
  const [dateFilter, setDateFilter] = useState<DateFilterType>('thismonth');
  const [customDateRange, setCustomDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });
  const [filteredRegistrations, setFilteredRegistrations] = useState<
    Registration[]
  >(registrations);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmationDialog, setConfirmationDialog] = useState<{
    isOpen: boolean;
    registration: Registration | null;
    email: string;
  }>({ isOpen: false, registration: null, email: '' });
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { toast } = useToast();
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

  const getDateRange = (filterType: DateFilterType): DateRange => {
    const now = new Date();

    switch (filterType) {
      case 'today':
        return {
          start: startOfDay(now),
          end: endOfDay(now),
        };
      case 'yesterday':
        const yesterday = subDays(now, 1);
        return {
          start: startOfDay(yesterday),
          end: endOfDay(yesterday),
        };
      case 'last3days':
        return {
          start: startOfDay(subDays(now, 2)),
          end: endOfDay(now),
        };
      case 'last7days':
        return {
          start: startOfDay(subDays(now, 6)),
          end: endOfDay(now),
        };
      case 'last15days':
        return {
          start: startOfDay(subDays(now, 14)),
          end: endOfDay(now),
        };
      case 'last30days':
        return {
          start: startOfDay(subDays(now, 29)),
          end: endOfDay(now),
        };
      case 'thismonth':
        return {
          start: startOfMonth(now),
          end: endOfMonth(now),
        };
      case 'lastmonth':
        const lastMonth = subMonths(now, 1);
        return {
          start: startOfMonth(lastMonth),
          end: endOfMonth(lastMonth),
        };
      case 'thisyear':
        return {
          start: startOfYear(now),
          end: endOfYear(now),
        };
      case 'lastyear':
        const lastYear = subYears(now, 1);
        return {
          start: startOfYear(lastYear),
          end: endOfYear(lastYear),
        };
      case 'custom':
        return customDateRange;
      case 'alltime':
      default:
        return { start: null, end: null };
    }
  };

  const applyFilters = () => {
    let filtered = registrations;

    // Apply search filter
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(
        (registration) =>
          registration.first_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          registration.last_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          registration.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          registration.training_slug
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (registration.type === 'regular' &&
            registration.company &&
            registration.company
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }

    // Apply date filter
    const dateRange = getDateRange(dateFilter);
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter((registration) => {
        const registrationDate = new Date(registration.created_at);
        return isWithinInterval(registrationDate, {
          start: dateRange.start!,
          end: dateRange.end!,
        });
      });
    }

    setFilteredRegistrations(filtered);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleDateFilterChange = (filter: DateFilterType) => {
    setDateFilter(filter);
  };

  // Apply filters whenever search term, date filter, or registrations change
  useEffect(() => {
    applyFilters();
  }, [searchTerm, dateFilter, customDateRange, registrations]);

  const handleConfirmAndSendEmail = (registration: Registration) => {
    setConfirmationDialog({
      isOpen: true,
      registration,
      email: registration.email,
    });
  };

  const sendConfirmationEmail = async () => {
    if (!confirmationDialog.registration) return;

    setIsSendingEmail(true);
    try {
      const response = await fetch('/api/training/send-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registrationId: confirmationDialog.registration.id,
          email: confirmationDialog.email,
          registrationType: confirmationDialog.registration.type,
        }),
      });

      if (response.ok) {
        // Update registration status to confirmed
        await handleStatusChange(confirmationDialog.registration, 'confirmed');
        setConfirmationDialog({ isOpen: false, registration: null, email: '' });
        toast({
          title: 'Success',
          description: 'Confirmation email sent successfully!',
        });
      } else {
        throw new Error('Failed to send confirmation email');
      }
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      toast({
        title: 'Error',
        description: 'Failed to send confirmation email. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSendingEmail(false);
    }
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

  const getFilterLabel = (filter: DateFilterType): string => {
    switch (filter) {
      case 'today':
        return 'Today';
      case 'yesterday':
        return 'Yesterday';
      case 'last3days':
        return 'Last 3 Days';
      case 'last7days':
        return 'Last 7 Days';
      case 'last15days':
        return 'Last 15 Days';
      case 'last30days':
        return 'Last 30 Days';
      case 'thismonth':
        return 'This Month';
      case 'lastmonth':
        return 'Last Month';
      case 'thisyear':
        return 'This Year';
      case 'lastyear':
        return 'Last Year';
      case 'alltime':
        return 'All Time';
      case 'custom':
        return 'Custom';
      default:
        return 'All Time';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 items-start sm:items-center">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
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
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={dateFilter} onValueChange={handleDateFilterChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="last3days">Last 3 Days</SelectItem>
                  <SelectItem value="last7days">Last 7 Days</SelectItem>
                  <SelectItem value="last15days">Last 15 Days</SelectItem>
                  <SelectItem value="last30days">Last 30 Days</SelectItem>
                  <SelectItem value="thismonth">This Month</SelectItem>
                  <SelectItem value="lastmonth">Last Month</SelectItem>
                  <SelectItem value="thisyear">This Year</SelectItem>
                  <SelectItem value="lastyear">Last Year</SelectItem>
                  <SelectItem value="alltime">All Time</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {filteredRegistrations.length} of {registrations.length}{' '}
            registrations
          </div>
        </div>
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
                          <DropdownMenuItem
                            onClick={() =>
                              handleConfirmAndSendEmail(registration)
                            }
                            className="text-green-600"
                            disabled={
                              registration.status === 'confirmed' ||
                              isProcessing
                            }
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            Confirm & Send Email
                          </DropdownMenuItem>
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

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmationDialog.isOpen}
        onOpenChange={(open) =>
          !open &&
          setConfirmationDialog({
            isOpen: false,
            registration: null,
            email: '',
          })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Registration & Send Email</DialogTitle>
            <DialogDescription>
              This will mark the registration as confirmed and send a
              confirmation email to the participant.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={confirmationDialog.email}
                onChange={(e) =>
                  setConfirmationDialog((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                placeholder="Enter email address"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  setConfirmationDialog({
                    isOpen: false,
                    registration: null,
                    email: '',
                  })
                }
                disabled={isSendingEmail}
              >
                Cancel
              </Button>
              <Button
                onClick={sendConfirmationEmail}
                disabled={isSendingEmail || !confirmationDialog.email.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSendingEmail ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Confirm & Send
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
