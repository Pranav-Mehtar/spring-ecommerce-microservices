import { Link } from "react-router-dom";
import "../css/Home.css";

function Home() {
    return (
        <main className="home-page">

            {/* ================= HERO ================= */}

            <section className="hero-section">

                {/* LEFT SIDE */}

                <div className="hero-content">

                    <span className="hero-badge">
                        ✨ Welcome to MyShop
                    </span>

                    <h1>
                        Shop smarter.
                        <br />
                        <span>Shop better.</span>
                    </h1>

                    <p>
                        Discover amazing products at great prices.
                        Browse our collection, manage your cart,
                        track your orders, and get help from AI.
                    </p>

                    <div className="hero-buttons">

                        <Link
                            to="/products"
                            className="hero-primary-btn"
                        >
                            🛍️ Explore Products
                        </Link>

                        <Link
                            to="/ai-assistant"
                            className="hero-secondary-btn"
                        >
                            🤖 Ask AI
                        </Link>

                    </div>

                </div>


                {/* RIGHT SIDE */}

                <div className="hero-visual">

                    <div className="hero-card">

                        <div className="card-top">

                            <span>
                                ⭐ Best Products
                            </span>

                            <span className="card-icon">
                                🛍️
                            </span>

                        </div>


                        <div className="shopping-circle">

                            <div className="shopping-bag">
                                🛍️
                            </div>

                        </div>


                        <h2>
                            Everything you need
                        </h2>

                        <p>
                            One shop.
                            <br />
                            Endless possibilities.
                        </p>


                        <div className="fast-badge">
                            🚀 Fast & Easy
                        </div>

                    </div>

                    {/* Decorative elements */}

                    <div className="floating-shape shape-one">
                        ✨
                    </div>

                    <div className="floating-shape shape-two">
                        🛒
                    </div>

                    <div className="floating-shape shape-three">
                        ⭐
                    </div>

                </div>

            </section>


            {/* ================= FEATURES ================= */}

            <section className="features-section">

                <div className="feature-card">

                    <div className="feature-icon">
                        🛍️
                    </div>

                    <div>
                        <h3>
                            Huge Collection
                        </h3>

                        <p>
                            Explore products across multiple categories.
                        </p>
                    </div>

                </div>


                <div className="feature-card">

                    <div className="feature-icon">
                        🛒
                    </div>

                    <div>
                        <h3>
                            Easy Shopping
                        </h3>

                        <p>
                            Add products to your cart with ease.
                        </p>
                    </div>

                </div>


                <div className="feature-card">

                    <div className="feature-icon">
                        🤖
                    </div>

                    <div>
                        <h3>
                            AI Assistant
                        </h3>

                        <p>
                            Get intelligent help while shopping.
                        </p>
                    </div>

                </div>

            </section>

        </main>
    );
}

export default Home;