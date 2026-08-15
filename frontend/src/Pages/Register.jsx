import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import "../css/register.css";

function Register() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        address: "",
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
    // REGISTER
    // =================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {

            const response = await axios.post(
                "http://localhost:8080/api/auth/register",
                form
            );

            setMessage(
                response.data.message ||
                "Registration successful!"
            );

            setForm({
                fullName: "",
                email: "",
                password: "",
                phone: "",
                address: "",
            });

            // Go to login after successful registration
            setTimeout(() => {

                navigate("/login");

            }, 1200);

        } catch (error) {

            console.error(
                "Registration error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };


    // =================================================
    // UI
    // =================================================

    return (

        <main className="register-page">

            <div className="register-container">

                {/* =========================================
                    LEFT BRAND SECTION
                ========================================== */}

                <div className="register-brand">

                    <div className="register-brand-icon">
                        ✨
                    </div>

                    <h1>
                        Join MyShop
                    </h1>

                    <p>
                        Create your account and start
                        discovering amazing products today.
                    </p>


                    <div className="register-feature">

                        <span>✓</span>

                        <span>
                            Shop from a wide range of products
                        </span>

                    </div>


                    <div className="register-feature">

                        <span>✓</span>

                        <span>
                            Manage your shopping cart
                        </span>

                    </div>


                    <div className="register-feature">

                        <span>✓</span>

                        <span>
                            Track all your orders
                        </span>

                    </div>


                    <div className="register-feature">

                        <span>✓</span>

                        <span>
                            Get help from our AI assistant
                        </span>

                    </div>

                </div>


                {/* =========================================
                    REGISTER CARD
                ========================================== */}

                <div className="register-card">

                    <div className="register-header">

                        <h2>
                            Create Account
                        </h2>

                        <p>
                            Fill in your details to get started
                        </p>

                    </div>


                    {/* SUCCESS */}

                    {message && (

                        <div className="register-success">

                            ✓ {message}

                        </div>

                    )}


                    {/* ERROR */}

                    {error && (

                        <div className="register-error">

                            {error}

                        </div>

                    )}


                    {/* FORM */}

                    <form
                        className="register-form"
                        onSubmit={handleSubmit}
                    >

                        {/* FULL NAME */}

                        <div className="register-form-group">

                            <label htmlFor="fullName">
                                Full Name
                            </label>

                            <input
                                id="fullName"
                                type="text"
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                autoComplete="name"
                                required
                            />

                        </div>


                        {/* EMAIL */}

                        <div className="register-form-group">

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

                        <div className="register-form-group">

                            <label htmlFor="password">
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Create a strong password"
                                autoComplete="new-password"
                                required
                            />

                            <small className="password-hint">
                                Minimum 8 characters with letters,
                                numbers and a special character.
                            </small>

                        </div>


                        {/* PHONE */}

                        <div className="register-form-group">

                            <label htmlFor="phone">
                                Phone Number
                            </label>

                            <input
                                id="phone"
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                autoComplete="tel"
                            />

                        </div>


                        {/* ADDRESS */}

                        <div className="register-form-group">

                            <label htmlFor="address">
                                Address
                            </label>

                            <textarea
                                id="address"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="Enter your address"
                                rows="3"
                                autoComplete="street-address"
                            />

                        </div>


                        {/* REGISTER BUTTON */}

                        <button
                            type="submit"
                            className="register-button"
                            disabled={loading}
                        >

                            {loading ? (

                                <>
                                    <span className="register-spinner"></span>
                                    Creating Account...
                                </>

                            ) : (

                                "Create Account"

                            )}

                        </button>

                    </form>


                    {/* LOGIN LINK */}

                    <div className="login-link">

                        <span>
                            Already have an account?
                        </span>

                        <Link to="/login">
                            Login
                        </Link>

                    </div>

                </div>

            </div>

        </main>

    );

}

export default Register;