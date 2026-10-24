import { useState } from "react";

import "./Chat.css";

export default function Chat() {

    const [messages, setMessages] = useState([
        { type: "system", text: "Round 1 has started!" },
        { type: "chat", name: "You", text: "Kya hein yeh?" },
        { type: "system", text: "Keep guessing!" },
    ]);

    return (
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
    );
}