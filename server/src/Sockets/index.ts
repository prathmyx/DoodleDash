import type { Server } from "socket.io";
import { registerRoomHandlers } from "./room.ts";
import { leaveRoom } from "../Services/room.ts";
// import { registerGameHandlers } from "./game";

export function registerSocketHandlers(io: Server) {
    io.on("connection", (socket) => {
        console.log(`Connected: ${socket.id}`);

        registerRoomHandlers(io, socket);
        // registerGameHandlers(io, socket);

        socket.on('disconnecting', (reason) => {
            socket.rooms.forEach((room) => {
                if (room !== socket.id) {
                    const status = leaveRoom(room, socket.id);

                    socket.leave(status.room.id);

                    if (status.valid) {
                        io.to(status.room.id).emit("room:updated", status.room.players);
                    } else {
                        io.to(status.room.id).emit("host-left");
                    }
                }
            })
        })
        socket.on("disconnect", () => {
            console.log(`Disconnected: ${socket.id}`);
        });
    });
}
