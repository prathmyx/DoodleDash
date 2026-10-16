import { useEffect, useRef, useState } from "react";
import "./Game.css";

const initialPlayers = [
    { id: 1, name: "PixelPanda", score: 420, color: "coral", drawing: true },
    { id: 2, name: "You", score: 280, color: "mint", drawing: false },
    { id: 3, name: "Sketchy", score: 150, color: "yellow", drawing: false },
    { id: 4, name: "DoodleBug", score: 80, color: "purple", drawing: false },
];

export default function Game() {
    const canvasRef = useRef(null);
    const drawingRef = useRef(false);
    const [tool, setTool] = useState("pen");
    const [brushSize, setBrushSize] = useState(5);
    const [guess, setGuess] = useState("");
    const [players] = useState(initialPlayers);
    const [messages, setMessages] = useState([
        { type: "system", text: "Round 2 has started!" },
        { type: "chat", name: "You", text: "Is it an animal?" },
        { type: "system", text: "Keep guessing!" },
    ]);
    const [seconds, setSeconds] = useState(60);

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds((value) => Math.max(0, value - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    function getCanvasPoint(event) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        return {
            x: (event.clientX - rect.left) * (canvas.width / rect.width),
            y: (event.clientY - rect.top) * (canvas.height / rect.height),
        };
    }

    function startDrawing(event) {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.setPointerCapture(event.pointerId);
        drawingRef.current = true;

        const ctx = canvas.getContext("2d");
        const { x, y } = getCanvasPoint(event);

        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    function draw(event) {
        if (!drawingRef.current) return;

        const ctx = canvasRef.current.getContext("2d");
        const { x, y } = getCanvasPoint(event);

        ctx.lineWidth = brushSize;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = tool === "eraser" ? "#ffffff" : "#25251f";
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    function stopDrawing() {
        drawingRef.current = false;
    }

    function clearCanvas() {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

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

    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");

    return (
        <div className="page">
            {/* 1 310px */}
            <main className="game-layout">
                <section className="game-center">

                    <div className="word-card">
                        <span className="mini-label">GUESS THE WORD</span>
                        <div className="word-blanks" aria-label="Five hidden letters">
                            {["_", "_", "_", "_", "_"].map((letter, index) => (
                                <span className="letter-slot" key={index}>{letter}</span>
                            ))}
                        </div>
                        <span className="word-hint">Category: Everyday things</span>
                    </div>

                    <div className="drawing-card">
                        <div className="canvas-header">
                            <div className="round-label">
                                <span className="round-icon">✳</span>
                                <div>
                                    <span className="mini-label">ROUND</span>
                                    <strong>02 <span>/ 05</span></strong>
                                </div>
                            </div>

                            <div className="turn-info">
                                <span className="turn-avatar">P</span>
                                <div>
                                    <span className="mini-label">NOW DRAWING</span>
                                    <strong>PixelPanda</strong>
                                </div>
                            </div>

                            <div className={`game-timer ${seconds <= 10 ? "urgent" : ""}`}>
                                <span>◷</span> {minutes}:{secs}
                            </div>
                        </div>                

                        <div className="canvas-wrap">
                            <canvas
                                ref={canvasRef}
                                width={900}
                                height={520}
                                onPointerDown={startDrawing}
                                onPointerMove={draw}
                                onPointerUp={stopDrawing}
                                onPointerCancel={stopDrawing}
                                onPointerLeave={stopDrawing}
                            />
                            <span className="canvas-watermark">doodle dash ✳</span>
                        </div>

                        <div className="drawing-toolbar">
                            <div className="tool-group">
                                <button
                                    className={`tool-button ${tool === "pen" ? "selected" : ""}`}
                                    onClick={() => setTool("pen")}
                                    aria-label="Pen"
                                    title="Pen"
                                >
                                    ✎
                                </button>
                                <button
                                    className={`tool-button ${tool === "eraser" ? "selected" : ""}`}
                                    onClick={() => setTool("eraser")}
                                    aria-label="Eraser"
                                    title="Eraser"
                                >
                                    ▱
                                </button>
                                <button
                                    className="tool-button"
                                    onClick={clearCanvas}
                                    aria-label="Clear canvas"
                                    title="Clear canvas"
                                >
                                    ↺
                                </button>
                            </div>

                            <label className="brush-control">
                                <span>BRUSH</span>
                                <input
                                    type="range"
                                    min="2"
                                    max="24"
                                    value={brushSize}
                                    onChange={(event) => setBrushSize(Number(event.target.value))}
                                />
                            </label>

                            <span className="drawer-only">DRAWER TOOLS</span>
                        </div>
                    </div>

                    <form className="guess-form" onSubmit={submitGuess}>
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

                    <p className="game-footnote">
                        No pressure. It's only your artistic reputation.
                    </p>
                </section>

                <aside className="game-sidebar">
                    <section className="side-card leaderboard-card">
                        <div className="side-heading">
                            <div>
                                <span className="mini-label">THE COMPETITION</span>
                                <h2>Leaderboard <span>↗</span></h2>
                            </div>
                            <span className="trophy">♛</span>
                        </div>

                        <div className="leaderboard-list">
                            {[...players]
                                .sort((a, b) => b.score - a.score)
                                .map((player, index) => (
                                    <div className="leader-row" key={player.id}>
                                        <span className="rank-number">
                                            {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "4"}
                                        </span>
                                        <span className={`leader-avatar ${player.color}`}>
                                            {player.name.charAt(0)}
                                        </span>
                                        <div className="leader-name">
                                            <strong>{player.name}</strong>
                                            {player.drawing && <span>DRAWING</span>}
                                        </div>
                                        <strong className="leader-score">{player.score}</strong>
                                    </div>
                                ))}
                        </div>

                        <div className="your-score">
                            <span>Your points</span>
                            <strong>{players.find((p) => p.name === "You")?.score ?? 0} pts</strong>
                        </div>
                    </section>

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
