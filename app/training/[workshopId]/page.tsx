import { workshops } from '../workshops';
import WorkshopRegistrationClient from './workshop-registration-client';

export function generateStaticParams() {
  return workshops.map((workshop) => ({
    workshopId: workshop.id,
  }));
}

export default function WorkshopPage({ params }: { params: { workshopId: string } }) {
  const workshop = workshops.find(w => w.id === params.workshopId);
  
  if (!workshop) {
    return null;
  }

  return <WorkshopRegistrationClient workshop={workshop} />;
}