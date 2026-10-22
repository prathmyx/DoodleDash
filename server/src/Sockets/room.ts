import type { Server, Socket } from "socket.io";
import {
    createRoom,
    joinRoom,
} from "../Services/room.ts";

export function registerRoomHandlers(
    io: Server,
    socket: Socket
) {
    socket.on("create-room", (username, callback) => {
        try {
            const room = createRoom(socket.id, username);

            socket.join(room.id);

            callback({
                ok: true,
                roomId: room.id,
                players: room.players
            });
        } catch (error) {
            callback({
                ok: false,
                error: "Failed to create room",
            });
        }
    });

    socket.on("join-room", (payload, callback) => {
        try {
            const room = joinRoom(payload.roomId, socket.id, payload.username);

            socket.join(room.id);

            io.to(room.id).emit("room:updated", room);

            callback({
                ok: true,
                roomId: room.id,
                players: room.players
            });
        } catch (error) {
            callback({
                ok: false,
                error: error.message || "Failed to join room"
            });
        }
    });
}
