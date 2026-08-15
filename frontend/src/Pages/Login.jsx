import { useState } from "react";
import {
    Link,
    useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "../css/login.css";

function Login() {

    const navigate = useNavigate();

    const {
        login,
    } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    // =================================================
    // INPUT
    // =================================================

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

    };


    // =================================================
    // LOGIN
    // =================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {

            await login(
                form.email,
                form.password
            );

            setMessage(
                "Login successful!"
            );

            setTimeout(() => {

                navigate("/products");

            }, 500);

        } catch (err) {

            console.error(
                "Login error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Login failed. Please check your email and password."
            );

        } finally {

            setLoading(false);

        }

    };


    // =================================================
    // UI
    // =================================================

    return (

        <main className="login-page">

            <div className="login-container">

                {/* ================================
                    LEFT SIDE
                ================================= */}

                <div className="login-brand">

                    <div className="brand-icon">
                        🛍️
                    </div>

                    <h1>
                        Welcome Back
                    </h1>

                    <p>
                        Sign in to continue shopping
                        with MyShop.
                    </p>

                    <div className="brand-feature">
                        <span>✓</span>
                        <span>
                            Discover amazing products
                        </span>
                    </div>

                    <div className="brand-feature">
                        <span>✓</span>
                        <span>
                            Manage your cart easily
                        </span>
                    </div>

                    <div className="brand-feature">
                        <span>✓</span>
                        <span>
                            Track your orders
                        </span>
                    </div>

                </div>


                {/* ================================
                    RIGHT SIDE
                ================================= */}

                <div className="login-card">

                    <div className="login-header">

                        <h2>
                            Login
                        </h2>

                        <p>
                            Enter your account details
                        </p>

                    </div>


                    {/* SUCCESS MESSAGE */}

                    {message && (

                        <div className="login-success">
                            {message}
                        </div>

                    )}


                    {/* ERROR MESSAGE */}

                    {error && (

                        <div className="login-error">
                            {error}
                        </div>

                    )}


                    {/* LOGIN FORM */}

                    <form
                        onSubmit={handleSubmit}
                        className="login-form"
                    >

                        {/* EMAIL */}

                        <div className="form-group">

                            <label htmlFor="email">
                                Email Address
                            </label>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                autoComplete="email"
                                required
                            />

                        </div>


                        {/* PASSWORD */}

                        <div className="form-group">

                            <div className="password-label">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <Link to="/forgot-password">
                                    Forgot Password?
                                </Link>

                            </div>

                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                            />

                        </div>


                        {/* LOGIN BUTTON */}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >

                            {loading ? (

                                <>
                                    <span className="login-spinner"></span>
                                    Logging in...
                                </>

                            ) : (

                                "Login"

                            )}

                        </button>

                    </form>


                    {/* REGISTER */}

                    <div className="register-link">

                        <span>
                            Don't have an account?
                        </span>

                        <Link to="/register">
                            Create Account
                        </Link>

                    </div>

                </div>

            </div>

        </main>

    );

}

export default Login;