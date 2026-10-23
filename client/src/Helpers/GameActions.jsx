import { socket } from "../socket";

export const startGame = (roomId) => {

    return new Promise((resolve, reject) => {
        socket.timeout(3000).emit("game:start", roomId, (err, result) => {
            if (err) {
                reject(new Error("Start game timed out. Please try again."));
                return;
            }

            if (!result?.ok) {
                reject(new Error(result?.error || "Failed to start game"));
                return;
            }

            resolve(result);
        });
    });
};