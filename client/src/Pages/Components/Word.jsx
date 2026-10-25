import "./Word.css";

export default function Word({ game, word, isDrawer }) {
    const answer = word || "";
    const slots = answer ? answer.split("") : Array.from({ length: game?.wordLength || 5 }, () => "_");
    return (
        <div className="word-card">
            <span className="mini-label">{isDrawer ? "YOUR WORD — DRAW THIS" : "GUESS THE WORD"}</span>
            <div className="word-blanks" aria-label={isDrawer ? answer : `${slots.length} letter word`}>
                {isDrawer
                    ? answer.split("").map((letter, index) => <span className="letter-slot" key={index}>{letter === " " ? "·" : letter}</span>)
                    : slots.map((letter, index) => <span className="letter-slot" key={index}>{letter === " " ? " " : "_"}</span>)}
            </div>
            <span className="word-hint">{game?.wordHint ? `Category: ${game.wordHint}` : "Waiting for the next turn…"}</span>
        </div>
    );
}
