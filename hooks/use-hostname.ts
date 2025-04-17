import { useEffect, useState } from 'react';

export function useHostname() {
  const [hostname, setHostname] = useState<string>('');
  const [isMainDomain, setIsMainDomain] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Only access window after component is mounted on client
    setIsClient(true);

    // Safe check for window object
    if (typeof window !== 'undefined') {
      try {
        const currentHostname = window.location.hostname;
        setHostname(currentHostname);
        setIsMainDomain(currentHostname === 'fmtsoftware.com');
      } catch (error) {
        console.error('Error accessing window.location:', error);
        // Set defaults if window access fails
        setHostname('');
        setIsMainDomain(false);
      }
    }
  }, []);

  return {
    hostname,
    isMainDomain,
    isClient,
  };
}
