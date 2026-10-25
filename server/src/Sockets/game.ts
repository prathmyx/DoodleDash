import type { Server, Socket } from "socket.io";
import { advanceTurn, games, publicGameState, startGame, TURN_SECONDS } from "../Services/game.ts";
import { rooms } from "../Services/room.ts";

const timers = new Map<string, ReturnType<typeof setTimeout>>();

function clearTurnTimer(roomId: string) {
    const timer = timers.get(roomId);
    if (timer) clearTimeout(timer);
    timers.delete(roomId);
}

function broadcastState(io: Server, roomId: string) {
    const state = games.get(roomId);
    if (!state) return;
    io.to(roomId).emit("game:state", publicGameState(state));
    io.to(state.drawerId).emit("game:your-word", { word: state.word });
}

function scheduleTurn(io: Server, roomId: string) {
    clearTurnTimer(roomId);
    timers.set(roomId, setTimeout(() => finishTurn(io, roomId), TURN_SECONDS * 1000));
}

function finishTurn(io: Server, roomId: string) {
    clearTurnTimer(roomId);
    const state = games.get(roomId);
    if (!state || state.status !== "playing") return;
    io.to(roomId).emit("game:turn-ended", { word: state.word });
    if (!advanceTurn(state)) {
        io.to(roomId).emit("game:state", publicGameState(state));
        io.to(roomId).emit("game:finished", { players: [...state.players].sort((a, b) => b.score - a.score) });
        const room = rooms.get(roomId);
        if (room) room.status = "waiting";
        games.delete(roomId);
        return;
    }
    broadcastState(io, roomId);
    scheduleTurn(io, roomId);
}

export function registerGameHandlers(io: Server, socket: Socket) {
    socket.on("game:start", (roomId: string, callback: (result: any) => void) => {
        try {
            const state = startGame(roomId, socket.id);
            broadcastState(io, state.roomId);
            scheduleTurn(io, state.roomId);
            callback({ ok: true, roomId: state.roomId });
        } catch (error) {
            callback({ ok: false, error: error instanceof Error ? error.message : "Failed to start game" });
        }
    });

    socket.on("game:guess", (payload: { roomId: string; guess: string }, callback?: (result: any) => void) => {
        const roomId = payload?.roomId?.toUpperCase();
        const state = games.get(roomId);
        const room = rooms.get(roomId);
        if (!state || state.status !== "playing" || !room) {
            callback?.({ ok: false, error: "This game is not active." });
            return;
        }
        const player = room.players.find((item) => item.id === socket.id);
        if (!player || socket.id === state.drawerId || state.guessedBy.includes(socket.id)) {
            callback?.({ ok: false, error: "You cannot guess right now." });
            return;
        }
        const guess = String(payload.guess ?? "").trim();
        if (!guess) {
            callback?.({ ok: false, error: "Enter a guess first." });
            return;
        }
        const correct = guess.toLowerCase() === state.word.toLowerCase();
        if (correct) {
            state.guessedBy.push(socket.id);
            const remainingSeconds = Math.max(0, Math.ceil((state.endsAt - Date.now()) / 1000));
            player.score += 100 + remainingSeconds;
            const drawer = room.players.find((item) => item.id === state.drawerId);
            if (drawer) drawer.score += 25;
            io.to(roomId).emit("game:message", { type: "system", text: `${player.name} guessed the word! 🎉` });
            io.to(roomId).emit("game:players", room.players);
            callback?.({ ok: true, correct: true, message: "Correct! Nice guess 🎉" });
            if (state.guessedBy.length >= room.players.length - 1) finishTurn(io, roomId);
        } else {
            io.to(roomId).emit("game:message", { type: "guess", name: player.name, text: guess });
            callback?.({ ok: true, correct: false, message: "Not quite — keep trying!" });
        }
    });

    socket.on("game:draw", (payload: { roomId: string; action: unknown }) => {
        const roomId = payload?.roomId?.toUpperCase();
        const state = games.get(roomId);
        if (!state || state.status !== "playing" || state.drawerId !== socket.id) return;
        socket.to(roomId).emit("game:draw", payload.action);
    });

    socket.on("game:clear", (roomId: string) => {
        const state = games.get(String(roomId).toUpperCase());
        if (state?.status === "playing" && state.drawerId === socket.id) socket.to(state.roomId).emit("game:clear");
    });
}
