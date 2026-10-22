import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../socket";

const SocketContext = createContext();

export function SocketProvider( {children} ) {
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        }
    }, []);

    const connectSocket = () => {
        if (!socket.connected) socket.connect()
    }

    const disconnectSocket = () => {
        if (socket.connected) socket.disconnect();
    }

    return (
        <SocketContext.Provider value = {{socket, isConnected, connectSocket, disconnectSocket}} >
            { children }
        </SocketContext.Provider>
    );
}

export function useSocket() {
    const context = useContext(SocketContext);

    if (!context) {
        throw new Error(
            "useSocket must be used inside SocketProvider"
        );
    }

    return context;
}