import { createClient } from '@/lib/supabase/server';
import AdminRegistrationsList from './components/AdminRegistrationsList';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Training Registrations | Admin Dashboard',
  description: 'View and manage training registrations',
};

interface CustomRegistrationFromDB {
  id: string;
  training_id: string;
  training_slug: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  details: {
    about?: string;
    experience: string[];
    expectations?: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

interface RegularRegistrationFromDB {
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

// The types that AdminRegistrationsList expects
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

export default async function TrainingRegistrationsPage() {
  const supabase = await createClient();

  // Get regular training registrations
  const { data: regularRegistrations, error: regularError } = await supabase
    .from('training_registrations')
    .select('*')
    .order('created_at', { ascending: false });

  // Get custom training registrations
  const { data: customRegistrations, error: customError } = await supabase
    .from('custom_training_registrations')
    .select('*')
    .order('created_at', { ascending: false });

  if (regularError && customError) {
    console.error('Error fetching registrations:', {
      regularError,
      customError,
    });
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-8">Training Registrations</h1>
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          Error loading registrations. Please try again later.
        </div>
      </div>
    );
  }

  // Helper function to map custom registration status to regular status
  const mapCustomStatus = (
    status: string
  ): 'pending' | 'confirmed' | 'cancelled' | 'attended' => {
    switch (status) {
      case 'completed':
        return 'attended';
      case 'pending':
      case 'confirmed':
      case 'cancelled':
        return status as 'pending' | 'confirmed' | 'cancelled';
      default:
        return 'pending';
    }
  };

  // Normalize custom registrations to match expected format
  const normalizedCustomRegistrations: CustomRegistration[] = (
    customRegistrations || []
  ).map((reg: CustomRegistrationFromDB) => ({
    id: reg.id,
    training_id: reg.training_id,
    training_slug: reg.training_slug,
    first_name: reg.first_name,
    last_name: reg.last_name,
    email: reg.email,
    phone: reg.phone,
    company: null,
    message: null,
    status: mapCustomStatus(reg.status),
    created_at: reg.created_at,
    updated_at: reg.updated_at,
    type: 'custom' as const,
    details: reg.details,
  }));

  // Normalize regular registrations
  const normalizedRegularRegistrations: RegularRegistration[] = (
    regularRegistrations || []
  ).map((reg: RegularRegistrationFromDB) => ({
    ...reg,
    type: 'regular' as const,
  }));

  // Combine and sort all registrations
  const allRegistrations: Registration[] = [
    ...normalizedRegularRegistrations,
    ...normalizedCustomRegistrations,
  ].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Training Registrations</h1>
        <p className="text-muted-foreground">
          Manage all training registrations including both regular and custom
          registration forms.
        </p>
        <div className="flex gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>
              Regular Registrations: {regularRegistrations?.length || 0}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>
              Custom Registrations: {customRegistrations?.length || 0}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span>Total: {allRegistrations.length}</span>
          </div>
        </div>
      </div>
      <AdminRegistrationsList registrations={allRegistrations} />
    </div>
  );
}
