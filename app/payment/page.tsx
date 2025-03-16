import { workshops } from '../../workshops';
import PaymentClient from './components/PaymentClient';

export default async function PaymentPage({
  params,
  searchParams,
}: {
  params: Promise<{ workshopId: string }> & { workshopId: string };
  searchParams: Promise<{ data: string }> & { data: string };
}) {
  // Resolve the promises
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  // Access the values
  const workshopId = resolvedParams.workshopId;
  const data = resolvedSearchParams.data;

  const workshop = workshops.find((w) => w.id === workshopId);

  if (!workshop || !data) {
    return null;
  }

  const registrationData = JSON.parse(decodeURIComponent(data));

  return (
    <PaymentClient workshop={workshop} registrationData={registrationData} />
  );
}
