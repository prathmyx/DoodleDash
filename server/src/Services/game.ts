import { rooms, type Room } from "./room.ts";

export function startGame(roomId: string, hostId: string): Room {
    const room = rooms.get(roomId.toUpperCase());

    if (!room) {
        throw new Error("Room not Found");
    }

    if (room.status !== "waiting") {
        throw new Error("Game has already Started");
    }

    if (room.hostId !== hostId) {
        throw new Error("Only Host Can Start The Game");
    }

    room.status = "playing";

    return room;
}