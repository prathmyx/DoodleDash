import "./Chat.css";

export default function Chat({ messages = [] }) {
    return (
        <section className="side-card chat-card">
            <div className="side-heading chat-heading">
                <div><span className="mini-label">LIVE ACTIVITY</span><h2>Guesses &amp; chat</h2></div>
                <span className="chat-count">{messages.length}</span>
            </div>
            <div className="chat-messages" aria-live="polite">
                {messages.map((message, index) => (
                    <div className={`chat-message ${message.type}`} key={index}>
                        {message.type === "system" ? <span>✳ {message.text}</span> : <p><strong>{message.name}</strong><span>{message.text}</span></p>}
                    </div>
                ))}
                {!messages.length && <div className="chat-note">Guesses and game updates will appear here.</div>}
            </div>
            <div className="chat-note">Correct guesses earn points. Drawer gets a bonus too.</div>
        </section>
    );
}
