import { useState } from "react";

import {
    Link,
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import api from "../api/axios";

function ResetPassword() {

    const navigate = useNavigate();

    const [
        searchParams
    ] = useSearchParams();

    const token =
        searchParams.get("token");

    const [password, setPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    // =================================================
    // SUBMIT
    // =================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        // ---------------------------------------------
        // TOKEN CHECK
        // ---------------------------------------------

        if (!token) {

            setError(
                "Invalid or missing reset token."
            );

            return;
        }


        // ---------------------------------------------
        // PASSWORD MATCH
        // ---------------------------------------------

        if (
            password !==
            confirmPassword
        ) {

            setError(
                "Passwords do not match."
            );

            return;
        }


        try {

            setLoading(true);

            const response =
                await api.post(
                    "/api/auth/reset-password",
                    {
                        token,
                        newPassword: password,
                    }
                );

            console.log(
                "Reset password response:",
                response.data
            );

            setMessage(
                response.data.message ||
                "Password reset successfully."
            );


            // -----------------------------------------
            // GO TO LOGIN
            // -----------------------------------------

            setTimeout(() => {

                navigate("/login");

            }, 1500);

        } catch (err) {

            console.error(
                "Reset password error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to reset password."
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <main>

            <h2>
                Reset Password
            </h2>


            {!token && (
                <p
                    style={{
                        color: "red",
                    }}
                >
                    Invalid or missing reset token.
                </p>
            )}


            {token && (
                <form
                    onSubmit={handleSubmit}
                >

                    {/* NEW PASSWORD */}

                    <div>

                        <label>
                            New Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            placeholder="Enter new password"
                            required
                        />

                    </div>


                    {/* CONFIRM PASSWORD */}

                    <div>

                        <label>
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                            placeholder="Confirm new password"
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Resetting..."
                            : "Reset Password"}

                    </button>

                </form>
            )}


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

export default ResetPassword;