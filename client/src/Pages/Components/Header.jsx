import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css"

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
            <header className="main-header">
                <button
                    className="main-brand"
                    onClick={() => navigate("/")}
                >
                    <span className="brand-mark">✳</span>
                    Doodle Dash<span className="brand-period">.</span>
                </button>

                {location.pathname.startsWith('/lobby') && <span className="lobby-status">
                    <span className="status-dot" />
                    ROOM LOBBY
                </span>}

                {( location.pathname.startsWith('/game') || location.pathname.startsWith('/lobby') )&& <>
                <div className="game-room">
                    ROOM <strong>{location.state.roomId}</strong>
                </div>

                <button
                    className="leave-button"
                    onClick={() => navigate("/")}
                    >
                    Leave game <span>↗</span>
                </button></>}
            </header>
        </>
    );
}