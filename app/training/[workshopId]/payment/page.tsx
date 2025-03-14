import PaymentClient from './payment-client';
import { workshops } from '../../workshops';

export default function PaymentPage({ 
  params,
  searchParams 
}: { 
  params: { workshopId: string },
  searchParams: { data: string }
}) {
  const workshop = workshops.find(w => w.id === params.workshopId);
  
  if (!workshop || !searchParams.data) {
    return null;
  }

  const registrationData = JSON.parse(decodeURIComponent(searchParams.data));

  return <PaymentClient workshop={workshop} registrationData={registrationData} />;
}