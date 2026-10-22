import { useNavigate } from "react-router-dom";
import { createRoom, joinRoom } from "../Helpers/RoomActions";
import { useRoom } from "../Context/RoomContext";
import { usePlayers } from "../Context/PlayersContext";
import "./Home.css";

export default function Home() {
    const navigate = useNavigate();
    const { setRoom} = useRoom();
    const { setPlayers} = usePlayers();

    function handleCreateRoom() {
        let username = document.getElementById('username').value;

        createRoom(username, setRoom, setPlayers)
            .then((result) => {
                navigate(`/lobby/${result.roomId.toUpperCase()}`, {
                    state: { isHost: true, roomId: result.roomId,}, 
                });
            })
            .catch((error) => {
                console.log("Error:", error.message);
            });
    }

    function handleJoinRoom() {
        let username = document.getElementById('username').value;

        const roomId = prompt("Enter the room code:").trim();

        if (roomId.length < 6) {
            alert("Invalid Room Code");
            return;
        }

        joinRoom(roomId?.trim(), username, setRoom, setPlayers)
            .then((result) => {
                navigate(`/lobby/${roomId.trim().toUpperCase()}`, {
                    state: { isHost: false, roomId: result.roomId,},  
                });
            })
            .catch((error) => {
                console.log("Error:", error.message);
            })
    }


    return (
        <div className="page">
            <main className="home-main">
                <section className="hero">
                    <div className="hero-sticker">✎ NO ART SKILLS NEEDED</div>

                    <h1>
                        Draw it.
                        <br />
                        <span>Don't say it.</span>
                    </h1>

                    <p className="hero-description">
                        One secret word. One questionable drawing.
                        <br />
                        Can your friends guess what you're sketching?
                    </p>

                    <div className="game-panel box">
                        <label className="field-label" htmlFor="username">
                            FIRST THINGS FIRST — WHO ARE YOU?
                        </label>

                        <input
                            id="username"
                            type="text"
                            name="username"
                            placeholder="Your legendary nickname..."
                            maxLength={20}
                            autoComplete="nickname name"
                            required
                        />

                        <div className="action-grid">
                            <button
                                className="action-card create-card"
                                type="button"
                                onClick={handleCreateRoom}
                            >
                                <span className="card-icon">✳</span>
                                <span className="card-copy">
                                    <strong>Create a room</strong>
                                    <small>Be the host. Set the chaos in motion.</small>
                                </span>
                                <span className="card-arrow">↗</span>
                            </button>

                            <button
                                className="action-card join-card"
                                type="button"
                                onClick={handleJoinRoom}
                            >
                                <span className="card-icon">↗</span>
                                <span className="card-copy">
                                    <strong>Join a room</strong>
                                    <small>Got a code? Jump right in.</small>
                                </span>
                                <span className="card-arrow">→</span>
                            </button>
                        </div>

                        <div className="panel-footer">
                            <span className="live-dot" />
                            GRAB YOUR FRIENDS. MAKE A MESS.
                        </div>
                    </div>
                </section>

                <div className="doodle doodle-star">✳</div>
                <div className="doodle doodle-squiggle">〰</div>
                <div className="doodle doodle-smile">☺</div>
                <div className="doodle doodle-spark">✦</div>

            </main>

            <footer className="bottom-bar">
                <span>MADE FOR BAD ART & GOOD FRIENDS</span>
                <span className="footer-right">NO ERASERS ALLOWED ↗</span>
            </footer>
        </div>
    );
}
