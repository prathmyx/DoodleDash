import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./Lobby.css";

const demoPlayers = [
    { id: 1, name: "You", color: "coral", isHost: true },
    { id: 2, name: "PixelPanda", color: "mint", isHost: false },
    { id: 3, name: "Sketchy", color: "yellow", isHost: false },
];

export default function Lobby() {
    const { roomId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const isHost = location.state?.isHost ?? false;

    const players = demoPlayers;

    function handleStartGame() {
        navigate(`/game/${roomId}`);
    }

    function handleCopyCode() {
        navigator.clipboard.writeText(roomId);
    }

    return (
        <div className="lobby-page">
            <header className="lobby-header">
                <button
                    className="lobby-brand"
                    onClick={() => navigate("/")}
                >
                    <span className="brand-mark">✳</span>
                    doodle dash<span className="brand-period">.</span>
                </button>

                <span className="lobby-status">
                    <span className="status-dot" />
                    ROOM LOBBY
                </span>
            </header>

            <main className="lobby-main">
                <div className="lobby-intro">
                    <span className="eyebrow">THE FUN STARTS HERE</span>
                    <h1>
                        Assemble your <span>squad.</span>
                    </h1>
                    <p>
                        Grab your friends, warm up those drawing fingers,
                        and get ready to guess!
                    </p>
                </div>

                <section className="room-card">
                    <div className="room-info">
                        <div>
                            <span className="section-label">YOUR ROOM CODE</span>
                            <div className="room-code">{roomId}</div>
                        </div>

                        <button
                            className="copy-button"
                            onClick={handleCopyCode}
                            title="Copy room code"
                        >
                            ↗ Copy code
                        </button>
                    </div>

                    <div className="room-divider" />

                    <div className="players-heading">
                        <div>
                            <h2>The players</h2>
                            <p>Everyone who's in the room.</p>
                        </div>

                        <span className="player-count">
                            {players.length} / 8
                        </span>
                    </div>

                    <div className="players-list">
                        {players.map((player) => (
                            <div className="player-row" key={player.id}>
                                <div className={`player-avatar ${player.color}`}>
                                    {player.name.charAt(0).toUpperCase()}
                                </div>

                                <div className="player-details">
                                    <span className="player-name">
                                        {player.name}
                                    </span>
                                    {player.isHost && (
                                        <span className="host-label">HOST</span>
                                    )}
                                </div>

                                <span className="player-ready">
                                    <span className="status-dot" />
                                    Ready
                                </span>
                            </div>
                        ))}

                        <div className="waiting-row">
                            <span className="waiting-plus">+</span>
                            <span>Waiting for more doodlers...</span>
                        </div>
                    </div>

                    <div className="lobby-footer">
                        {isHost ? (
                            <>
                                <p className="host-hint">
                                    Everyone here? Let the chaos begin.
                                </p>
                                <button
                                    className="start-button"
                                    onClick={handleStartGame}
                                >
                                    Start the game <span>→</span>
                                </button>
                            </>
                        ) : (
                            <div className="waiting-message">
                                <span className="waiting-sparkle">✳</span>
                                Waiting for the host to start the game...
                            </div>
                        )}
                    </div>
                </section>

                <div className="lobby-tip">
                    <span>✎</span>
                    Tip: The worse the drawing, the better the laughs.
                </div>
            </main>
        </div>
    );
}
