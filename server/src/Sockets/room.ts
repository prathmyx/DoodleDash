import type { Server, Socket } from "socket.io";
import {
    createRoom,
    joinRoom,
    leaveRoom,
} from "../Services/room.ts";

export function registerRoomHandlers(
    io: Server,
    socket: Socket
) {
    socket.on("create-room", (name, callback) => {
        try {
            const room = createRoom(socket.id, name);

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
            const room = joinRoom(payload.roomId, socket.id, payload.name);

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

    socket.on("leave-room", (roomId, callback) => {
        try {
            const status = leaveRoom(roomId, socket.id);

            socket.leave(status.room.id);

            if (status.valid) {
                io.to(status.room.id).emit("room:updated", status.room);
            } else {
                io.to(status.room.id).emit("host-left");
            }

            callback({
                ok:true
            });

        } catch (error) {
            callback({
                ok:false,
                error: error.message || "Failed to leave room"
            });
        }
    });
}
