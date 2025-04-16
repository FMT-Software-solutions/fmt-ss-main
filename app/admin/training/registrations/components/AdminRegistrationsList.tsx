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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Calendar, MoreHorizontal, Search, Download } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { createClient } from '@/lib/supabase/browser';
import { Input } from '@/components/ui/input';
import { client as sanityClient } from '@/sanity/lib/client';

interface Registration {
  id: string;
  training_id: string;
  training_slug: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'attended';
  created_at: string;
  updated_at: string;
}

interface AdminRegistrationsListProps {
  registrations: Registration[];
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

      // Update registration status in Supabase
      const { error } = await supabase
        .from('training_registrations')
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
        (reg.company && reg.company.toLowerCase().includes(value))
    );

    setFilteredRegistrations(filtered);
  };

  const exportToCSV = () => {
    const headers = [
      'ID',
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
      reg.training_slug,
      reg.first_name,
      reg.last_name,
      reg.email,
      reg.phone || '',
      reg.company || '',
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
                    {registration.company && (
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
                            registration.status === 'confirmed' || isProcessing
                          }
                        >
                          Mark as Confirmed
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(registration, 'cancelled')
                          }
                          disabled={
                            registration.status === 'cancelled' || isProcessing
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
