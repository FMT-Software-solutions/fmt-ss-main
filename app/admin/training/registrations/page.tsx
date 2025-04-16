import { createClient } from '@/lib/supabase/server';
import AdminRegistrationsList from './components/AdminRegistrationsList';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Training Registrations | Admin Dashboard',
  description: 'View and manage training registrations',
};

export default async function TrainingRegistrationsPage() {
  const supabase = await createClient();

  // Get all training registrations
  const { data: registrations, error } = await supabase
    .from('training_registrations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching registrations:', error);
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-8">Training Registrations</h1>
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          Error loading registrations. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Training Registrations</h1>
      <AdminRegistrationsList registrations={registrations || []} />
    </div>
  );
}
