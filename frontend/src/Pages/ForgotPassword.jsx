import { useState } from "react";

import {
    Link,
} from "react-router-dom";

import api from "../api/axios";

function ForgotPassword() {

    const [email, setEmail] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    // =================================================
    // SUBMIT
    // =================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {

            const response =
                await api.post(
                    "/api/auth/forgot-password",
                    {
                        email,
                    }
                );

            console.log(
                "Forgot password response:",
                response.data
            );

            setMessage(
                response.data.message ||
                "Password reset instructions sent."
            );

        } catch (err) {

            console.error(
                "Forgot password error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to process forgot password request."
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <main>

            <h2>
                Forgot Password
            </h2>

            <p>
                Enter your registered email address.
            </p>


            <form
                onSubmit={handleSubmit}
            >

                <div>

                    <label>
                        Email
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        placeholder="Enter your email"
                        required
                    />

                </div>


                <button
                    type="submit"
                    disabled={loading}
                >

                    {loading
                        ? "Processing..."
                        : "Send Reset Link"}

                </button>

            </form>


            {message && (
                <p
                    style={{
                        color: "green",
                    }}
                >
                    {message}
                </p>
            )}


            {error && (
                <p
                    style={{
                        color: "red",
                    }}
                >
                    {error}
                </p>
            )}


            <div
                style={{
                    marginTop: "15px",
                }}
            >

                <Link to="/login">
                    Back to Login
                </Link>

            </div>

        </main>
    );
}

export default ForgotPassword;