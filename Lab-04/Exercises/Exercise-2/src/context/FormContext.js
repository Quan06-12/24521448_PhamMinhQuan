import { createContext, useContext } from 'react';

// 1. Context initialization (null = used outside a provider)
export const FormContext = createContext(null);

// 2. Custom hook abstraction with a clear error for misuse
export function useFormContext() {
  const context = useContext(FormContext);
  if (context === null) {
    throw new Error('useFormContext must be used inside <FormContext value={...}>');
  }
  return context;
}
