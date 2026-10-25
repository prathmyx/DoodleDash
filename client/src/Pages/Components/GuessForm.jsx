import { useState } from "react";
import { useSocket } from "../../Context/SocketContext";
import "./GuessForm.css";

export default function GuessForm({ roomId, isDrawer }) {
    const [guess, setGuess] = useState("");
    const [feedback, setFeedback] = useState("");
    const { socket } = useSocket();

    function submitGuess(event) {
        event.preventDefault();
        const value = guess.trim();
        if (!value || isDrawer) return;
        socket.timeout(3000).emit("game:guess", { roomId, guess: value }, (error, result) => {
            if (error) {
                setFeedback("Connection timed out. Try again.");
                return;
            }
            setFeedback(result?.message || result?.error || "");
        });
        setGuess("");
    }

    return (
        <form className="guess-form box" onSubmit={submitGuess}>
            <span className="guess-icon">✎</span>
            <input value={guess} onChange={(event) => setGuess(event.target.value)}
                placeholder={isDrawer ? "You're drawing this turn…" : "Type your guess here…"}
                maxLength={80} aria-label="Your guess" disabled={isDrawer} />
            <button type="submit" disabled={isDrawer || !guess.trim()}>Guess <span>→</span></button>
            {feedback && <span className="guess-feedback" role="status">{feedback}</span>}
        </form>
    );
}
