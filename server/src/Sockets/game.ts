import type { Server, Socket } from "socket.io";
import {
    startGame
} from "../Services/game.ts";

export function registerGameHandlers(
    io: Server,
    socket: Socket
) {

    socket.on("game:start", (roomId, callback) => {
        try {
            const room = startGame(roomId, socket.id);

            socket.to(room.id).emit("game:start");

            callback({
                ok: true,
                roomId: room.id,
            });
        } catch (error) {
            callback({
                ok: false,
                error: error.message || "Failed to start game"
            });
        }
    });
}
