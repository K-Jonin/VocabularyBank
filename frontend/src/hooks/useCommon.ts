import React from 'react';

export const useCommon = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  
  return {
    isSidebarOpen,
    setIsSidebarOpen,
  };
};
