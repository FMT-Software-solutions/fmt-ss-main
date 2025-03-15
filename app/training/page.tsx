import { Metadata } from 'next';
import TrainingHero from './components/TrainingHero';
import UpcomingTraining from './components/UpcomingTraining';
import FreeWorkshops from './components/FreeWorkshops';
import InstructorHighlight from './components/InstructorHighlight';
import TrainingFaq from './components/TrainingFaq';

export const metadata: Metadata = {
  title: 'Training & Workshops | FMT Software Solutions',
  description:
    'Enhance your skills with our expert-led training sessions and workshops. From beginner to advanced levels, we offer both free and premium training options.',
};

export default function TrainingPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <TrainingHero />

      <div className="my-16">
        <UpcomingTraining />
      </div>

      <div className="my-16 bg-muted/50 py-16 -mx-4 px-4">
        <div className="container mx-auto">
          <FreeWorkshops />
        </div>
      </div>

      <InstructorHighlight />

      <div className="my-16 bg-muted/50 py-16 -mx-4 px-4">
        <div className="container mx-auto">
          <TrainingFaq />
        </div>
      </div>
    </main>
  );
}
