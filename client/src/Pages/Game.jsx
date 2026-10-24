import Canvas from "./Components/Canvas";
import Word from "./Components/Word";
import GuessForm from "./Components/GuessForm";
import Leaderboard from "./Components/Leaderboard";
import Chat from "./Components/Chat";

import "./Game.css";

export default function Game() {

    return (
        <div className="page">

            <main className="game-layout">
                <section className="game-center">

                    <Word />

                    <Canvas />

                    <GuessForm />

                    <p className="game-footnote">
                        No pressure. It's only your artistic reputation.
                    </p>

                </section>

                <aside className="game-sidebar">
                    <Leaderboard />

                    <Chat />
                </aside>
            </main>

        </div>
    );
}
