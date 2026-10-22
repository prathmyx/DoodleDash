import { useContext, useState, createContext } from "react";

const NameContext = createContext(null);

export function NameProvider({children}) {
    const [name, setName] = useState('');
    const value = {name, setName};

    return (
        <NameContext.Provider value={value}>
            {children}
        </NameContext.Provider>
    );
}

export function useName() {
    const context = useContext(NameContext);

    if (!context) {
        throw new Error(
            "usename must be used inside nameProvider"
        );
    }

    return context;
}