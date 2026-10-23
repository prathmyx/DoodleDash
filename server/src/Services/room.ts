import { randomUUID } from "crypto";
import getColor from "../Utils/getColor.ts"

export interface Players {
    id: string;
    name: string;
    color: string;
    isHost?: boolean;
}

export interface Room {
    id: string;
    hostId: string;
    players: Players[];
    maxPlayers: number;
    status: "waiting" | "playing";
}

export const rooms = new Map<string, Room>();

export function createRoom(hostId: string, name: string): Room {
    const id = randomUUID().slice(0, 6).toUpperCase();

    const room: Room = {
        id,
        hostId,
        players: [{
            id:hostId, 
            name, 
            color:getColor(),
            isHost: true,
        } ],
        maxPlayers: 8,
        status: "waiting",
    };

    rooms.set(id, room);

    return room;
}

export function joinRoom(
    roomId: string,
    playerId: string,
    name: string
): Room {
    const room = rooms.get(roomId.toUpperCase());

    if (!room) {
        throw new Error("Room not found");
    }

    if (room.status !== "waiting") {
        throw new Error("Game has already started");
    }

    if (room.players.some((existPlayer) => existPlayer.id === playerId)) {
        return room;
    }

    if (room.players.length >= room.maxPlayers) {
        throw new Error("Room is full");
    }

    room.players.push({id:playerId, name, color:getColor()});

    return room;
}

type status = {
    room: Room,
    valid: boolean
}

export function leaveRoom(roomId: string, playerId: string): status {
    const room = rooms.get(roomId.toUpperCase());

    if (!room) {
        throw new Error("Room not found");
    }

    if (room.hostId !== playerId) {
        room.players = room.players.filter((player) => player.id !== playerId);
        return {
            valid: true, 
            room: room
        };

    } else {
        rooms.delete(roomId);
        return {
            valid: false,
            room: room
        };
    }
} 