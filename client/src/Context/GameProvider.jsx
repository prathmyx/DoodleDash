import { RoomProvider } from "./RoomContext";
import { PlayersProvider } from "./PlayersContext";

export function GameProvider({children}) {
    return (
        <>
            <RoomProvider >
                <PlayersProvider>
                    {children}
                </PlayersProvider>
            </RoomProvider>
        </>
    );
}