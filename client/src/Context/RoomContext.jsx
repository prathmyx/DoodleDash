import { useContext, useState, createContext } from "react";

const RoomContext = createContext(null);

export function RoomProvider({children}) {
    const [room, setRoom] = useState(null);
    const value = {room, setRoom};

    return (
        <RoomContext.Provider value={value}>
            {children}
        </RoomContext.Provider>
    );
}

export function useRoom() {
    const context = useContext(RoomContext);

    if (!context) {
        throw new Error(
            "useRoom must be used inside RoomProvider"
        );
    }

    return context;
}