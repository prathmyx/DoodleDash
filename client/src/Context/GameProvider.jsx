import { RoomProvider } from "./RoomContext";
import { PlayersProvider } from "./PlayersContext";
import { NameProvider } from "./NameContext";
import { SocketProvider } from "./SocketContext";

export function GameProvider({children}) {
    return (
        <>
            <SocketProvider >
                <NameProvider>
                    <RoomProvider >
                        <PlayersProvider>
                            {children}
                        </PlayersProvider>
                    </RoomProvider>
                </NameProvider>
            </SocketProvider>
        </>
    );
}