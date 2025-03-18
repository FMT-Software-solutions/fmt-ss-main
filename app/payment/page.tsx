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

  if (!data) {
    return null;
  }

  const registrationData = JSON.parse(decodeURIComponent(data));

  return (
    <PaymentClient productId={workshopId} registrationData={registrationData} />
  );
}
