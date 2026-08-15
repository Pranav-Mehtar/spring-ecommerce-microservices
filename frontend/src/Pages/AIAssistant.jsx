
import { useState } from "react";
import api from "../api/axios";
import "../css/ai-assistant.css";

function AIAssistant() {
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!message.trim() || loading) {
            return;
        }

        setLoading(true);
        setError("");
        setResponse("");

        try {
            const result = await api.get(
                "/api/ai/chat",
                {
                    params: {
                        message: message.trim(),
                    },
                }
            );

            // Handles both plain-string and wrapped API responses
            const aiResponse =
                result.data?.data ??
                result.data?.message ??
                result.data;

            setResponse(
                typeof aiResponse === "string"
                    ? aiResponse
                    : JSON.stringify(aiResponse)
            );

        } catch (err) {
            console.error("AI error:", err);

            setError(
                err.response?.data?.message ||
                "Failed to get AI response. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();

            if (message.trim() && !loading) {
                e.currentTarget.form.requestSubmit();
            }
        }
    };

    const clearChat = () => {
        setMessage("");
        setResponse("");
        setError("");
    };

    return (
        <main className="ai-page">

            {/* ================= HERO ================= */}

            <section className="ai-hero">

                <div className="ai-icon">
                    🤖
                </div>

                <div>
                    <p className="ai-eyebrow">
                        MYSHOP AI
                    </p>

                    <h1>
                        Your personal
                        <span> shopping assistant.</span>
                    </h1>

                    <p className="ai-subtitle">
                        Ask about products, recommendations,
                        prices, categories, or anything else
                        you need help with.
                    </p>
                </div>

            </section>


            {/* ================= AI CARD ================= */}

            <section className="ai-card">

                <div className="ai-card-header">

                    <div className="assistant-info">

                        <div className="assistant-avatar">
                            🤖
                        </div>

                        <div>
                            <h2>
                                MyShop Assistant
                            </h2>

                            <div className="online-status">
                                <span></span>
                                Ready to help
                            </div>
                        </div>

                    </div>


                    {(message || response || error) && (
                        <button
                            type="button"
                            className="clear-btn"
                            onClick={clearChat}
                        >
                            Clear
                        </button>
                    )}

                </div>


                {/* ================= CHAT AREA ================= */}

                <div className="ai-chat-area">

                    {!message &&
                        !response &&
                        !loading &&
                        !error && (

                            <div className="ai-empty">

                                <div className="empty-icon">
                                    ✨
                                </div>

                                <h3>
                                    What can I help you find?
                                </h3>

                                <p>
                                    Start a conversation with your
                                    MyShop shopping assistant.
                                </p>


                                <div className="suggestions">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setMessage(
                                                "What are the best products available?"
                                            )
                                        }
                                    >
                                        ⭐ Best products
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setMessage(
                                                "Can you recommend a product for me?"
                                            )
                                        }
                                    >
                                        🛍️ Recommend something
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setMessage(
                                                "What products are available?"
                                            )
                                        }
                                    >
                                        🔎 Browse products
                                    </button>

                                </div>

                            </div>
                        )}


                    {/* ================= USER MESSAGE ================= */}

                    {message && (

                        <div className="message-row user-row">

                            <div className="message-bubble user-bubble">
                                {message}
                            </div>

                            <div className="message-avatar user-avatar">
                                👤
                            </div>

                        </div>
                    )}


                    {/* ================= LOADING ================= */}

                    {loading && (

                        <div className="message-row ai-row">

                            <div className="message-avatar assistant-small">
                                🤖
                            </div>

                            <div className="message-bubble ai-bubble loading-bubble">

                                <span className="typing-dot"></span>
                                <span className="typing-dot"></span>
                                <span className="typing-dot"></span>

                                <span className="thinking-text">
                                    Thinking...
                                </span>

                            </div>

                        </div>
                    )}


                    {/* ================= AI RESPONSE ================= */}

                    {response && !loading && (

                        <div className="message-row ai-row">

                            <div className="message-avatar assistant-small">
                                🤖
                            </div>

                            <div className="message-bubble ai-bubble">

                                <div className="response-label">
                                    MyShop AI
                                </div>

                                <p>
                                    {response}
                                </p>

                            </div>

                        </div>
                    )}


                    {/* ================= ERROR ================= */}

                    {error && (

                        <div className="ai-error">
                            <span>⚠️</span>
                            <p>{error}</p>
                        </div>
                    )}

                </div>


                {/* ================= INPUT ================= */}

                <form
                    className="ai-input-area"
                    onSubmit={handleSubmit}
                >

                    <div className="input-wrapper">

                        <textarea
                            value={message}
                            onChange={(e) =>
                                setMessage(e.target.value)
                            }
                            onKeyDown={handleKeyDown}
                            placeholder="Ask me anything about MyShop..."
                            rows="1"
                            disabled={loading}
                        />

                        <span className="input-hint">
                            Enter to send · Shift + Enter for new line
                        </span>

                    </div>


                    <button
                        type="submit"
                        className="ask-ai-btn"
                        disabled={
                            loading ||
                            !message.trim()
                        }
                    >

                        {loading ? (
                            <>
                                <span className="button-spinner"></span>
                                Thinking
                            </>
                        ) : (
                            <>
                                Ask AI
                                <span className="send-icon">
                                    ➜
                                </span>
                            </>
                        )}

                    </button>

                </form>

            </section>


            {/* ================= FOOTER NOTE ================= */}

            <p className="ai-footer">
                🤝 MyShop AI is here to make shopping easier.
            </p>

        </main>
    );
}

export default AIAssistant;
