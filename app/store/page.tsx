import { Metadata } from 'next';
import StoreHero from './components/StoreHero';
import StoreContent from './components/StoreContent';

export const metadata: Metadata = {
  title: 'Software Store | FMT Software Solutions',
  description:
    'Browse our collection of premium software solutions for businesses and professionals',
};

// This is a Server Component in React 19
export default function Store() {
  return (
    <div className="min-h-screen py-10">
      <div className="container">
        <StoreHero />
        <StoreContent />
      </div>
    </div>
  );
}
