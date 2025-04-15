import { Metadata } from 'next';
import CartContent from './components/CartContent';

export const metadata: Metadata = {
  title: 'Shopping Cart | FMT Software Solutions',
  description: 'Review and checkout your selected premium software solutions',
};

export default function CartPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-4xl">
        <CartContent />
      </div>
    </div>
  );
}
