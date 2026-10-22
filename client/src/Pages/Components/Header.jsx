import { useNavigate, useLocation } from "react-router-dom";

import { useRoom } from "../../Context/RoomContext";
import { usePlayers } from "../../Context/PlayersContext";

import { leaveRoom } from "../../Helpers/RoomActions";

import "./Header.css"

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    const { room, setRoom } = useRoom();
    const { setPlayers } = usePlayers();

    function handleLeave(e) {
        if (location.pathname.endsWith('/')) return;
        if (confirm("You sure want to Leave the Game??")) {

            leaveRoom(room.roomId)
            .then((result) => {
                console.log("result", result);
                setRoom(null);
                setPlayers([]);
                navigate('/');
            })
            .catch((error) => {
                console.log("Error:", error.message);
            });
        }
    }

    return (
        <>
            <header className="main-header">
                <button
                    className="main-brand"
                    onClick={handleLeave}
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
                    ROOM <strong>{room?.roomId} </strong>
                </div>

                <button
                    className="leave-button"
                    onClick={handleLeave}
                    >
                    Leave game <span>↗</span>
                </button></>}
            </header>
        </>
    );
}