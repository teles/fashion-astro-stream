
import { createContext, useContext, ReactNode } from 'react';
import { ApiService } from './api-interface';
import { wpApiService } from './wp-api-service';

// Create context with the API service
const ApiContext = createContext<ApiService>(wpApiService);

// Provider component
export const ApiProvider = ({ 
  children, 
  service = wpApiService 
}: { 
  children: ReactNode, 
  service?: ApiService 
}) => {
  return (
    <ApiContext.Provider value={service}>
      {children}
    </ApiContext.Provider>
  );
};

// Hook to use the API service
export const useApiService = () => {
  return useContext(ApiContext);
};
