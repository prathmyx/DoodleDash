import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { useSocket } from "../Context/SocketContext";
import { useRoom } from "../Context/RoomContext";

import Canvas from "./Components/Canvas";
import Word from "./Components/Word";
import GuessForm from "./Components/GuessForm";
import Leaderboard from "./Components/Leaderboard";
import Chat from "./Components/Chat";

import "./Game.css";

export default function Game() {
    const navigate = useNavigate();

    const { room } = useRoom();

    const { roomId } = useParams();
    const { socket } = useSocket();

    useEffect(() => {
        if (room?.roomId !== roomId) navigate('/');

        return () => {

        }
    }, [socket]);

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
