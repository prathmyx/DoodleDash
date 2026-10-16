import "./Leaderboard.css";

export default function Leaderboard( {players}) {

    return (
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
    );
}