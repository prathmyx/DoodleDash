import { useContext, useState, createContext } from "react";

const PlayersContext = createContext(null);

export function PlayersProvider({children}) {
    const [players, setPlayers] = useState([]);
    const value = {players, setPlayers};

    return (
        <PlayersContext.Provider value={value}>
            {children}
        </PlayersContext.Provider>
    );
}

export function usePlayers() {
    const context = useContext(PlayersContext);

    if (!context) {
        throw new Error(
            "usePlayers must be used inside PlayersProvider"
        );
    }

    return context;
}