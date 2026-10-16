import { useEffect, useRef, useState } from "react";
import "./Game.css";
import Canvas from "./Components/Canvas";
import Word from "./Components/Word";
import GuessForm from "./Components/GuessForm";
import Leaderboard from "./Components/Leaderboard";

const initialPlayers = [
    { id: 1, name: "PixelPanda", score: 420, color: "coral", drawing: true },
    { id: 2, name: "You", score: 280, color: "mint", drawing: false },
    { id: 3, name: "Sketchy", score: 150, color: "yellow", drawing: false },
    { id: 4, name: "DoodleBug", score: 80, color: "purple", drawing: false },
];

export default function Game() {
    const [players] = useState(initialPlayers);

    const [messages, setMessages] = useState([
        { type: "system", text: "Round 2 has started!" },
        { type: "chat", name: "You", text: "Is it an animal?" },
        { type: "system", text: "Keep guessing!" },
    ]);

    return (
        <div className="page">
            {/* 1 310px */}
            <main className="game-layout">
                <section className="game-center">

                    <Word />

                    <Canvas />

                    <GuessForm setMessages={setMessages}/>

                    <p className="game-footnote">
                        No pressure. It's only your artistic reputation.
                    </p>
                </section>

                <aside className="game-sidebar">
                    <Leaderboard players={players}/>

                    <section className="side-card chat-card">
                        <div className="side-heading chat-heading">
                            <div>
                                <span className="mini-label">LIVE ACTIVITY</span>
                                <h2>Guesses & chat</h2>
                            </div>
                            <span className="chat-count">{messages.length}</span>
                        </div>

                        <div className="chat-messages" aria-live="polite">
                            {messages.map((message, index) => (
                                <div
                                    className={`chat-message ${message.type}`}
                                    key={index}
                                >
                                    {message.type === "system" ? (
                                        <span>✳ {message.text}</span>
                                    ) : (
                                        <p>
                                            <strong>{message.name}</strong>
                                            <span>{message.text}</span>
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="chat-note">
                            Chat and guesses will appear here.
                        </div>
                    </section>

                    <div className="players-online">
                        <span className="online-dot" />
                        <strong>{players.length} players</strong> in this room
                    </div>
                </aside>
            </main>
        </div>
    );
}
