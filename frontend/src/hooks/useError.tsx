import { useState, useContext, PropsWithChildren, createContext } from 'react';

interface ErrContext {
    error: boolean
    errorMessage: string
    setError: (error: Error | null | string ) => void
    clearError: () => void
}

const ErrContext = createContext<ErrContext>({} as ErrContext);
  
export function ErrContextProvider({ children }: PropsWithChildren) {
    const [errorMessage, setErrorMessage] = useState('');
    const clearError = () => setErrorMessage('');
    const setError = (error: Error | null | string) => {
    
        if (!error) return clearError()
        if (typeof error === 'string') error = new Error(error)
        if (error instanceof Error) error = error.message
        setErrorMessage(error)
      }
    
    const value = { error: !!errorMessage, errorMessage, setError, clearError };
    
    return (
        <ErrContext.Provider value={value}>{children}</ErrContext.Provider>
    );
}

export function useError() {
    const context = useContext(ErrContext);
    if (!context) {
        throw new Error("useErr must be used within ErrProvider");
    }
    return context
}