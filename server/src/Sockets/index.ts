import type { Server } from "socket.io";
import { registerRoomHandlers } from "./room.ts";
// import { registerGameHandlers } from "./game";

export function registerSocketHandlers(io: Server) {
    io.on("connection", (socket) => {
        console.log(`Connected: ${socket.id}`);

        registerRoomHandlers(io, socket);
        // registerGameHandlers(io, socket);

        socket.on("disconnect", () => {
            console.log(`Disconnected: ${socket.id}`);
        });
    });
}
