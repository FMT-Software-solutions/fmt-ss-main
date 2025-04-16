import { useEffect, useState } from 'react';

export function useHostname() {
  const [hostname, setHostname] = useState<string>('');
  const [isMainDomain, setIsMainDomain] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Only access window after component is mounted on client
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const currentHostname = window.location.hostname;
      setHostname(currentHostname);
      setIsMainDomain(currentHostname === 'fmtsoftware.com');
    }
  }, []);

  return {
    hostname,
    isMainDomain,
    isClient,
  };
}
