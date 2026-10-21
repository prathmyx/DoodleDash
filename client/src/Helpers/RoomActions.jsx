import { socket } from "../socket";

export const createRoom = (setRoom, setPlayers) => {
    socket.connect();

    return new Promise((resolve, reject) => {
        socket.timeout(3000).emit("create-room", (err, result) => {
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

export const joinRoom = (roomId, setRoom, setPlayers) => {
    socket.connect();

    return new Promise((resolve, reject) => {
        socket.timeout(3000).emit("join-room", roomId, (err, result) => {
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