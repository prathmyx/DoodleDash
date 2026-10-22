import { RoomProvider } from "./RoomContext";
import { PlayersProvider } from "./PlayersContext";
import { NameProvider } from "./NameContext";

export function GameProvider({children}) {
    return (
        <>
            <NameProvider>
                <RoomProvider >
                    <PlayersProvider>
                        {children}
                    </PlayersProvider>
                </RoomProvider>
            </NameProvider>
        </>
    );
}