import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    useNavigate,
} from "react-router-dom";

import { useState } from "react";

import {
    AuthProvider,
    useAuth,
} from "./context/AuthContext";

import {
    CartProvider,
} from "./context/CartContext";

// =====================================================
// PAGES
// =====================================================

import Home from "./Pages/Home";
import Products from "./Pages/Products";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import Orders from "./Pages/Orders";
import OrderDetails from "./Pages/OrderDetails";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import AIAssistant from "./Pages/AIAssistant";

// =====================================================
// CSS
// =====================================================

import "./index.css";
import "./App.css";
import "./css/navbar.css";

// =====================================================
// NAVBAR
// =====================================================

function Navbar() {

    const {
        user,
        isAuthenticated,
        loading,
        logout,
    } = useAuth();

    const navigate = useNavigate();

    // =================================================
    // PROFILE DROPDOWN STATE
    // =================================================

    const [profileOpen, setProfileOpen] =
        useState(false);


    // =================================================
    // LOGOUT
    // =================================================

    const handleLogout = async () => {

        try {

            setProfileOpen(false);

            await logout();

            navigate("/login");

        } catch (error) {

            console.error(
                "Logout failed:",
                error
            );

        }
    };


    // =================================================
    // USER NAME
    // =================================================

    const userName =
        user?.name ||
        user?.fullName ||
        user?.email ||
        "User";


    // =================================================
    // USER INITIAL
    // =================================================

    const userInitial =
        userName
            .charAt(0)
            .toUpperCase();


    // =================================================
    // AUTH LOADING
    // =================================================

    if (loading) {

        return (

            <nav className="navbar">

                {/* BRAND */}

                <div className="navbar-brand">

                    <Link to="/">
                        MyShop
                    </Link>

                </div>


                {/* LINKS */}

                <div className="nav-links">

                    <Link to="/">
                        Home
                    </Link>

                    <Link to="/products">
                        Products
                    </Link>

                    <Link to="/ai-assistant">
                        🤖 AI Assistant
                    </Link>

                </div>

            </nav>
        );
    }


    // =================================================
    // NAVBAR
    // =================================================

    return (

        <nav className="navbar">

            {/* =================================================
                BRAND
            ================================================= */}

            <div className="navbar-brand">

                <Link to="/">
                    MyShop
                </Link>

            </div>


            {/* =================================================
                NAVIGATION LINKS
            ================================================= */}

            <div className="nav-links">

                {/* HOME */}

                <Link to="/">
                    Home
                </Link>


                {/* PRODUCTS */}

                <Link to="/products">
                    Products
                </Link>


                {/* AI ASSISTANT */}

                <Link to="/ai-assistant">
                    🤖 AI Assistant
                </Link>


                {/* =================================================
                    AUTHENTICATED USER
                ================================================= */}

                {isAuthenticated && (

                    <>

                        {/* CART */}

                        <Link to="/cart">
                            🛒 Cart
                        </Link>


                        {/* ORDERS */}

                        <Link to="/orders">
                            📦 My Orders
                        </Link>


                        {/* =================================================
                            PROFILE
                        ================================================= */}

                        <div className="profile-menu">

                            {/* PROFILE BUTTON */}

                            <button
                                type="button"
                                className={`profile-button ${
                                    profileOpen
                                        ? "profile-active"
                                        : ""
                                }`}
                                onClick={() =>
                                    setProfileOpen(
                                        !profileOpen
                                    )
                                }
                            >

                                {/* AVATAR */}

                                <span className="profile-avatar">
                                    {userInitial}
                                </span>


                                {/* NAME */}

                                <span className="profile-name">
                                    {userName}
                                </span>


                                {/* ARROW */}

                                <span className="profile-arrow">
                                    {profileOpen
                                        ? "⌃"
                                        : "⌄"}
                                </span>

                            </button>


                            {/* =================================================
                                PROFILE DROPDOWN
                            ================================================= */}

                            {profileOpen && (

                                <div className="profile-dropdown">

                                    {/* USER INFORMATION */}

                                    <div className="profile-info">

                                        <div className="dropdown-avatar">
                                            {userInitial}
                                        </div>


                                        <div className="profile-details">

                                            <strong>
                                                {userName}
                                            </strong>

                                            <span>
                                                {user?.email}
                                            </span>

                                        </div>

                                    </div>


                                    {/* DIVIDER */}

                                    <div className="profile-divider"></div>


                                    {/* LOGOUT */}

                                    <button
                                        type="button"
                                        className="dropdown-logout"
                                        onClick={handleLogout}
                                    >

                                        <span className="logout-icon">
                                            ↪
                                        </span>

                                        <span>
                                            Logout
                                        </span>

                                    </button>

                                </div>

                            )}

                        </div>

                    </>
                )}


                {/* =================================================
                    GUEST USER
                ================================================= */}

                {!isAuthenticated && (

                    <>

                        <Link to="/login">
                            Login
                        </Link>


                        <Link to="/register">
                            Register
                        </Link>

                    </>
                )}

            </div>

        </nav>
    );
}


// =====================================================
// APP CONTENT
// =====================================================

function AppContent() {

    return (

        <>

            {/* NAVBAR */}

            <Navbar />


            {/* =================================================
                ROUTES
            ================================================= */}

            <Routes>

                {/* HOME */}

                <Route
                    path="/"
                    element={<Home />}
                />


                {/* PRODUCTS */}

                <Route
                    path="/products"
                    element={<Products />}
                />


                {/* AI ASSISTANT */}

                <Route
                    path="/ai-assistant"
                    element={<AIAssistant />}
                />


                {/* CART */}

                <Route
                    path="/cart"
                    element={<Cart />}
                />


                {/* CHECKOUT */}

                <Route
                    path="/checkout"
                    element={<Checkout />}
                />


                {/* ORDERS */}

                <Route
                    path="/orders"
                    element={<Orders />}
                />


                {/* ORDER DETAILS */}

                <Route
                    path="/orders/:id"
                    element={<OrderDetails />}
                />


                {/* LOGIN */}

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* REGISTER */}

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* FORGOT PASSWORD */}

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />


                {/* RESET PASSWORD */}

                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />

            </Routes>

        </>
    );
}


// =====================================================
// APP
// =====================================================

function App() {

    return (

        <AuthProvider>

            <CartProvider>

                <BrowserRouter>

                    <AppContent />

                </BrowserRouter>

            </CartProvider>

        </AuthProvider>
    );
}


export default App;