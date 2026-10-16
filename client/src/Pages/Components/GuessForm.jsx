import { useState } from "react";
import "./GuessForm.css";

export default function GuessForm({ setMessages }) {
    const [guess, setGuess] = useState("");

    function submitGuess(event) {
        event.preventDefault();

        const value = guess.trim();
        if (!value) return;

        setMessages((previous) => [
            ...previous,
            { type: "chat", name: "You", text: value },
        ]);
        setGuess("");
    }

    return (
        <form className="guess-form box" onSubmit={submitGuess}>
            <span className="guess-icon">✎</span>
            <input
                value={guess}
                onChange={(event) => setGuess(event.target.value)}
                placeholder="Type your guess here..."
                maxLength={80}
                aria-label="Your guess"
            />
            <button type="submit">Guess <span>→</span></button>
        </form>
    );
}