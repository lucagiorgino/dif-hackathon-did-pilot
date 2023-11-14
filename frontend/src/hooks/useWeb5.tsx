import { useState, useEffect, useContext, PropsWithChildren, createContext } from 'react';
import { Web5 } from '@web5/api';

interface Web5Context {
    web5: Web5 | null
    userDid: string | null
}

const Web5Context = createContext<Web5Context>({} as Web5Context);
  
export function Web5ContextProvider({ children }: PropsWithChildren) {

    const [web5, setWeb5] = useState<Web5 | null>(null);
    const [userDid, setMyDid] = useState<string | null>(null);

    useEffect(() => {
        const initWeb5 = async () => {
            try {
                const { web5, did } = await Web5.connect();
                console.log("Web5 initialized successfully", web5, did);
                setWeb5(web5);
                setMyDid(did);
            } catch (error) {
                console.error("Error initializing Web5:", error);
            }
        }
        initWeb5();  
    }, []);
  
    const value = { web5, userDid };
    return (
        <Web5Context.Provider value={value}>{children}</Web5Context.Provider>
    );
}

export function useWeb5() {
    const context = useContext(Web5Context);
    if (!context) {
        throw new Error("useWeb5 must be used within Web5ContextProvider");
    }
    return context
}