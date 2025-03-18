'use client';

import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { toast } from 'sonner';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const rawToken = searchParams.get('token');

  // Clean the token to ensure it's a valid UUID
  const token = rawToken?.trim();

  // Check if token is a valid UUID format
  const isValidUUID =
    token &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      token
    );

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Handle unsubscribe action
  const handleUnsubscribe = async () => {
    if (!token || !isValidUUID) {
      setStatus('error');
      setMessage(
        'Invalid unsubscribe link. Please check your email and try again.'
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus('error');
        setMessage(data.error || 'Failed to unsubscribe. Please try again.');
        toast.error(data.error || 'Failed to unsubscribe');
      } else {
        setStatus('success');
        setMessage(
          data.message || 'Successfully unsubscribed from the newsletter.'
        );
        toast.success(data.message || 'Successfully unsubscribed');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An unexpected error occurred. Please try again.');
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-unsubscribe if token is present and valid
  useEffect(() => {
    if (token && isValidUUID && status === 'idle') {
      handleUnsubscribe();
    } else if (token && !isValidUUID && status === 'idle') {
      setStatus('error');
      setMessage(
        'Invalid unsubscribe token format. Please check your email link.'
      );
    }
  }, [token, isValidUUID, status]);

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-6">Newsletter Unsubscribe</h1>

      {status === 'idle' && token && isValidUUID && (
        <div className="mb-8">
          <p className="mb-4">Processing your unsubscribe request...</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      )}

      {status === 'idle' && (!token || !isValidUUID) && (
        <div className="mb-8">
          <p className="text-destructive mb-4">
            {!token
              ? 'No unsubscribe token found. Please use the link provided in the newsletter email.'
              : 'Invalid unsubscribe token format. Please check your email link.'}
          </p>
        </div>
      )}

      {status === 'success' && (
        <div className="mb-8">
          <p className="text-green-600 mb-4">{message}</p>
          <p>
            You have been removed from our newsletter list and will no longer
            receive emails from us.
          </p>
        </div>
      )}

      {status === 'error' && (
        <div className="mb-8">
          <p className="text-destructive mb-4">{message}</p>
          {token && isValidUUID && (
            <Button
              onClick={handleUnsubscribe}
              disabled={isLoading}
              className="mt-4"
            >
              {isLoading ? 'Processing...' : 'Try Again'}
            </Button>
          )}
        </div>
      )}

      <div className="mt-8">
        <a href="/" className="text-primary hover:underline">
          Return to Homepage
        </a>
      </div>
    </div>
  );
}

// Main page component with Suspense
export default function UnsubscribePage() {
  return (
    <div className="container max-w-2xl mx-auto py-20">
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <UnsubscribeContent />
      </Suspense>
    </div>
  );
}
