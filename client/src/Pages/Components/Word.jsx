import "./Word.css";

export default function Word() {
    return (
        <div className="word-card">
            <span className="mini-label">GUESS THE WORD</span>
            <div className="word-blanks" aria-label="Five hidden letters">
                {["_", "_", "_", "_", "_"].map((letter, index) => (
                    <span className="letter-slot" key={index}>{letter}</span>
                ))}
            </div>
            <span className="word-hint">Category: Everyday things</span>
        </div>);
}