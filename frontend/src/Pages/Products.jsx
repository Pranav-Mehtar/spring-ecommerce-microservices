import { useEffect, useState } from "react";

import api from "../api/axios";
import { useCart } from "../context/CartContext";

import "../css/Products.css";

function Products() {
    const { addToCart } = useCart();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cartMessage, setCartMessage] = useState("");
    const [addingProduct, setAddingProduct] = useState(null);

    // ==========================================
    // LOAD PRODUCTS
    // ==========================================

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(
                    "/api/products/all"
                );

                console.log(
                    "API response:",
                    response.data
                );

                setProducts(
                    response.data.data || []
                );

            } catch (error) {
                console.error(
                    "API error:",
                    error
                );

                setError(
                    "Failed to load products."
                );

            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    // ==========================================
    // ADD TO CART
    // ==========================================

    const handleAddToCart = async (productId) => {
        setCartMessage("");
        setError("");
        setAddingProduct(productId);

        try {
            await addToCart(productId, 1);

            setCartMessage(
                "Product added to cart successfully!"
            );

            setTimeout(() => {
                setCartMessage("");
            }, 3000);

        } catch (error) {
            console.error(
                "Add to cart error:",
                error
            );

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {
                setError(
                    "Please login before adding products to cart."
                );
            } else {
                setError(
                    error.response?.data?.message ||
                    "Failed to add product to cart."
                );
            }

        } finally {
            setAddingProduct(null);
        }
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <main className="products-page">

                <div className="products-loading">

                    <div className="loading-spinner"></div>

                    <h2>
                        Loading products...
                    </h2>

                    <p>
                        Getting the best products for you.
                    </p>

                </div>

            </main>
        );
    }

    // ==========================================
    // ERROR
    // ==========================================

    if (
        error &&
        products.length === 0
    ) {
        return (
            <main className="products-page">

                <div className="products-error">

                    <div className="error-icon">
                        ⚠️
                    </div>

                    <h2>
                        Something went wrong
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={() =>
                            window.location.reload()
                        }
                    >
                        Try Again
                    </button>

                </div>

            </main>
        );
    }

    // ==========================================
    // PRODUCTS
    // ==========================================

    return (
        <main className="products-page">

            {/* ================= HEADER ================= */}

            <section className="products-header">

                <div>

                    <span className="products-badge">
                        🛍️ MyShop Collection
                    </span>

                    <h1>
                        Discover your
                        <span> next favorite.</span>
                    </h1>

                    <p>
                        Explore our collection of quality
                        products at amazing prices.
                    </p>

                </div>



            </section>


            {/* ================= MESSAGES ================= */}

            {cartMessage && (
                <div className="success-message">
                    <span>✓</span>
                    {cartMessage}
                </div>
            )}

            {error && (
                <div className="error-message">
                    <span>⚠️</span>
                    {error}
                </div>
            )}


            {/* ================= PRODUCT LIST ================= */}

            <section className="products-container">

                {products.length === 0 ? (

                    <div className="empty-products">

                        <div>
                            🛍️
                        </div>

                        <h2>
                            No products found
                        </h2>

                        <p>
                            There are currently no products
                            available.
                        </p>

                    </div>

                ) : (

                    products.map((product) => (

                        <article
                            className="product-card"
                            key={product.id}
                        >

                            {/* PRODUCT IMAGE */}

                            <div className="product-image-container">

                                {product.imageUrl ? (

                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="product-image"
                                    />

                                ) : (

                                    <div className="product-placeholder">
                                        🛍️
                                    </div>

                                )}

                                <span className="product-category">
                                    {product.category}
                                </span>

                            </div>


                            {/* PRODUCT INFORMATION */}

                            <div className="product-info">

                                <h2>
                                    {product.name}
                                </h2>

                                <p className="product-description">

                                    {product.description ||
                                        "Quality product from MyShop."}

                                </p>


                                {/* PRICE + STOCK */}

                                <div className="product-meta">

                                    <div className="product-price">
                                        ₹{Number(
                                            product.price
                                        ).toFixed(2)}
                                    </div>

                                    <div
                                        className={
                                            product.stock > 0
                                                ? "stock available"
                                                : "stock unavailable"
                                        }
                                    >
                                        {product.stock > 0
                                            ? `${product.stock} in stock`
                                            : "Out of stock"}
                                    </div>

                                </div>


                                {/* ADD BUTTON */}

                                <button
                                    className="add-cart-button"
                                    disabled={
                                        product.stock <= 0 ||
                                        addingProduct === product.id
                                    }
                                    onClick={() =>
                                        handleAddToCart(
                                            product.id
                                        )
                                    }
                                >

                                    {addingProduct === product.id
                                        ? "Adding..."
                                        : product.stock <= 0
                                            ? "Out of Stock"
                                            : "🛒 Add to Cart"}

                                </button>

                            </div>

                        </article>

                    ))

                )}

            </section>

        </main>
    );
}

export default Products;