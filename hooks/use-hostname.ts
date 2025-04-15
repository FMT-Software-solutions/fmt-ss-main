import { useEffect, useState } from 'react';

export function useHostname() {
  const [hostname, setHostname] = useState<string>('');
  const [isMainDomain, setIsMainDomain] = useState(false);

  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      const currentHostname = window.location.hostname;
      setHostname(currentHostname);
      setIsMainDomain(currentHostname === 'fmtsoftware.com');
    }
  }, []);

  return {
    hostname,
    isMainDomain,
  };
}
