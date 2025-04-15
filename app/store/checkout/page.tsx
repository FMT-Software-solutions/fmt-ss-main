import { Metadata } from 'next';
import CheckoutContent from './components/CheckoutContent';

export const metadata: Metadata = {
  title: 'Checkout | FMT Software Solutions',
  description: 'Complete your purchase of premium software solutions',
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-5xl">
        <CheckoutContent />
      </div>
    </div>
  );
}
