'use client';

import dynamic from 'next/dynamic';

// Create a loading component
const Loading = () => <div>Loading...</div>;

// Use dynamic import with ssr: false in a client component
const CheckoutContent = dynamic(() => import('./CheckoutContent'), {
  ssr: false,
  loading: () => <Loading />,
});

export default function ClientCheckoutPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-5xl">
        <CheckoutContent />
      </div>
    </div>
  );
}
