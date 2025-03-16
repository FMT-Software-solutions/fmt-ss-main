import React from 'react';
import { PortableTextInput } from 'sanity';

// This is a wrapper component to handle state updates properly
export const CustomPortableText = (props: any) => {
  // Use React.memo to prevent unnecessary re-renders
  return React.useMemo(() => {
    return <PortableTextInput {...props} />;
  }, [props]);
};
