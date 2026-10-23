import { useState } from "react";

import Canvas from "./Components/Canvas";
import Word from "./Components/Word";
import GuessForm from "./Components/GuessForm";
import Leaderboard from "./Components/Leaderboard";
import Chat from "./Components/Chat";

import "./Game.css";

export default function Game() {

    const [messages, setMessages] = useState([
        { type: "system", text: "Round 1 has started!" },
        { type: "chat", name: "You", text: "Kya hein yeh?" },
        { type: "system", text: "Keep guessing!" },
    ]);

    return (
        <div className="page">

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
                    <Leaderboard />

                    <Chat messages={messages}/>
                </aside>
            </main>

        </div>
    );
}
