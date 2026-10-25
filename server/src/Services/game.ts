import { rooms, type Players } from "./room.ts";

export const WORDS = [
    "apple", "bicycle", "castle", "guitar", "rainbow", "turtle",
    "pizza", "rocket", "umbrella", "camera", "elephant", "volcano",
    "airplane", "cactus", "dolphin", "ice cream", "lighthouse",
    "mountain", "penguin", "sandwich", "toothbrush", "watermelon",
    "backpack", "butterfly", "firefighter", "spaceship", "sunflower",
];

export interface GameState {
    roomId: string;
    status: "playing" | "finished";
    players: Players[];
    turnOrder: string[];
    turnIndex: number;
    round: number;
    totalRounds: number;
    drawerId: string;
    word: string;
    guessedBy: string[];
    endsAt: number;
}

export const games = new Map<string, GameState>();
export const TURN_SECONDS = 60;
export const TOTAL_ROUNDS = 3;

export function startGame(roomId: string, hostId: string): GameState {
    const room = rooms.get(roomId.toUpperCase());
    if (!room) throw new Error("Room not found");
    if (room.status !== "waiting") throw new Error("Game has already started");
    if (room.hostId !== hostId) throw new Error("Only the host can start the game");
    if (room.players.length < 2) throw new Error("Minimum 2 players required");

    room.status = "playing";
    const turnOrder = room.players.map((player) => player.id);
    const first = room.players[0];
    const state: GameState = {
        roomId: room.id, status: "playing", players: room.players,
        turnOrder, turnIndex: 0, round: 1, totalRounds: TOTAL_ROUNDS,
        drawerId: first.id, word: pickWord(), guessedBy: [],
        endsAt: Date.now() + TURN_SECONDS * 1000,
    };
    games.set(room.id, state);
    return state;
}

export function pickWord(previous?: string): string {
    const options = WORDS.filter((word) => word !== previous);
    return options[Math.floor(Math.random() * options.length)];
}

export function publicGameState(state: GameState) {
    return {
        roomId: state.roomId, status: state.status, players: state.players,
        turnOrder: state.turnOrder, turnIndex: state.turnIndex,
        round: state.round, totalRounds: state.totalRounds,
        drawerId: state.drawerId, guessedBy: state.guessedBy,
        endsAt: state.endsAt, wordLength: state.word.length,
        wordHint: "Everyday things",
    };
}

export function advanceTurn(state: GameState): boolean {
    state.turnIndex += 1;
    if (state.turnIndex >= state.turnOrder.length) {
        state.turnIndex = 0;
        state.round += 1;
    }
    if (state.round > state.totalRounds) {
        state.status = "finished";
        return false;
    }
    state.drawerId = state.turnOrder[state.turnIndex];
    state.word = pickWord(state.word);
    state.guessedBy = [];
    state.endsAt = Date.now() + TURN_SECONDS * 1000;
    return true;
}
