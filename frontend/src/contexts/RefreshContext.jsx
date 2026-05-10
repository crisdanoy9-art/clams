import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const RefreshContext = createContext();

export function RefreshProvider({ children }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const timeoutRef = useRef(null);

  const triggerRefresh = useCallback(() => {
    // Clear previous timeout to prevent multiple rapid refreshes
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Debounce the refresh to prevent multiple triggers
    timeoutRef.current = setTimeout(() => {
      setRefreshTrigger(prev => prev + 1);
      console.log('🔄 Global refresh triggered at:', new Date().toLocaleTimeString());
    }, 100);
  }, []);

  return (
    <RefreshContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
}

export function useRefresh() {
  const context = useContext(RefreshContext);
  if (!context) {
    throw new Error('useRefresh must be used within RefreshProvider');
  }
  return context;
}