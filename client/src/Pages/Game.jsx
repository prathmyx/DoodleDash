import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSocket } from "../Context/SocketContext";
import { useRoom } from "../Context/RoomContext";
import { usePlayers } from "../Context/PlayersContext";
import Canvas from "./Components/Canvas";
import Word from "./Components/Word";
import GuessForm from "./Components/GuessForm";
import Leaderboard from "./Components/Leaderboard";
import Chat from "./Components/Chat";
import "./Game.css";

export default function Game() {
    const navigate = useNavigate();
    const { room } = useRoom();
    const { players, setPlayers } = usePlayers();
    const { roomId } = useParams();
    const { socket } = useSocket();
    const [game, setGame] = useState(null);
    const [word, setWord] = useState("");
    const [messages, setMessages] = useState([]);
    const [seconds, setSeconds] = useState(60);

    useEffect(() => {
        if (!room || room.roomId?.toUpperCase() !== roomId?.toUpperCase()) {
            navigate("/");
            return;
        }
        const onState = (next) => {
            setGame(next);
            if (next.players) setPlayers(next.players);
            setSeconds(Math.max(0, Math.ceil((next.endsAt - Date.now()) / 1000)));
            setWord("");
        };
        const onWord = ({ word: nextWord }) => setWord(nextWord);
        const onMessage = (message) => setMessages((old) => [...old.slice(-49), message]);
        const onPlayers = (nextPlayers) => setPlayers(nextPlayers);
        const onTurnEnded = ({ word: answer }) => {
            setMessages((old) => [...old, { type: "system", text: `Time's up! The word was “${answer}”.` }]);
            setWord("");
        };
        const onFinished = ({ players: finalPlayers }) => {
            setPlayers(finalPlayers);
            setMessages((old) => [...old, { type: "system", text: "Game over! Final scores are shown on the leaderboard." }]);
        };
        const onDraw = (action) => window.dispatchEvent(new CustomEvent("doodledash:draw", { detail: action }));
        const onClear = () => window.dispatchEvent(new Event("doodledash:clear"));
        socket.on("game:state", onState);
        socket.on("game:your-word", onWord);
        socket.on("game:message", onMessage);
        socket.on("game:players", onPlayers);
        socket.on("game:turn-ended", onTurnEnded);
        socket.on("game:finished", onFinished);
        socket.on("game:draw", onDraw);
        socket.on("game:clear", onClear);
        socket.emit("game:sync", roomId);
        return () => {
            socket.off("game:state", onState);
            socket.off("game:your-word", onWord);
            socket.off("game:message", onMessage);
            socket.off("game:players", onPlayers);
            socket.off("game:turn-ended", onTurnEnded);
            socket.off("game:finished", onFinished);
            socket.off("game:draw", onDraw);
            socket.off("game:clear", onClear);
        };
    }, [socket, room, roomId, navigate, setPlayers]);

    useEffect(() => {
        if (!game?.endsAt || game.status !== "playing") return;
        const tick = () => setSeconds(Math.max(0, Math.ceil((game.endsAt - Date.now()) / 1000)));
        tick();
        const interval = setInterval(tick, 250);
        return () => clearInterval(interval);
    }, [game?.endsAt, game?.status]);

    const isDrawer = game?.drawerId === socket.id;
    const drawer = players.find((player) => player.id === game?.drawerId);

    return (
        <div className="page">
            <main className="game-layout">
                <section className="game-center">
                    <Word game={game} word={word} isDrawer={isDrawer} />
                    <Canvas game={game} isDrawer={isDrawer} drawerName={drawer?.name ?? "Waiting..."} seconds={seconds} roomId={roomId} />
                    <GuessForm roomId={roomId} isDrawer={isDrawer} />
                    <p className="game-footnote">No pressure. It's only your artistic reputation.</p>
                </section>
                <aside className="game-sidebar">
                    <Leaderboard />
                    <Chat messages={messages} />
                </aside>
            </main>
            {game?.status === "finished" && <div className="game-finished-banner" role="status">Game over! Check the leaderboard for final scores.</div>}
        </div>
    );
}
