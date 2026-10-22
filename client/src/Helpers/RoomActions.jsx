import { socket } from "../socket";

export const createRoom = (username, setRoom, setPlayers) => {
    socket.connect();

    return new Promise((resolve, reject) => {
        socket.timeout(3000).emit("create-room", username, (err, result) => {
            if (err) {
                reject(new Error("Create room timed out. Please try again."));
                return;
            }

            if (!result?.ok) {
                reject(new Error(result?.error || "Failed to create room"));
                return;
            }

            setRoom({ roomId: result.roomId });
            setPlayers(result.players);

            resolve(result);
        });
    });
};

export const joinRoom = (roomId, username, setRoom, setPlayers) => {
    socket.connect();

    return new Promise((resolve, reject) => {
        socket.timeout(3000).emit("join-room", {roomId, username}, (err, result) => {
            if (err) {
                reject(new Error("Join room timed out. Please try again."));
                return;
            }

            if (!result?.ok) {
                reject(new Error(result?.error || "Failed to join room"));
                return;
            }

            setRoom({ roomId: result.roomId });
            setPlayers(result.players);

            resolve(result);
        });
    });
};