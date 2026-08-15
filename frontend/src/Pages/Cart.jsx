import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

import "../css/cart.css";

function Cart() {
    const {
        cart,
        cartTotal,
        removeFromCart,
        updateQuantity,
    } = useCart();

    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // ==========================================
    // REMOVE ITEM
    // ==========================================

    const handleRemove = async (cartItemId) => {
        setMessage("");
        setError("");

        try {
            await removeFromCart(cartItemId);

            setMessage("Item removed successfully.");
        } catch (error) {
            console.error("Remove item error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to remove item."
            );
        }
    };

    // ==========================================
    // UPDATE QUANTITY
    // ==========================================

    const handleQuantityChange = async (
        cartItemId,
        quantity
    ) => {
        if (quantity < 1) {
            return;
        }

        try {
            await updateQuantity(
                cartItemId,
                quantity
            );
        } catch (error) {
            console.error(
                "Update quantity error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to update quantity."
            );
        }
    };

    // ==========================================
    // EMPTY CART
    // ==========================================

    if (cart.length === 0) {
        return (
            <main className="cart-page">

                <section className="empty-cart">

                    <div className="empty-cart-icon">
                        🛒
                    </div>

                    <h1>
                        Your cart is empty
                    </h1>

                    <p>
                        Looks like you haven't added
                        anything to your cart yet.
                    </p>

                    <button
                        className="continue-shopping-btn"
                        onClick={() =>
                            navigate("/products")
                        }
                    >
                        🛍️ Continue Shopping
                    </button>

                </section>

            </main>
        );
    }

    // ==========================================
    // CART
    // ==========================================

    return (
        <main className="cart-page">

            {/* HEADER */}

            <section className="cart-header">

                <div>
                    <span className="cart-eyebrow">
                        🛒 MyShop
                    </span>

                    <h1>
                        Your Shopping Cart
                    </h1>

                    <p>
                        Review your items before checkout.
                    </p>
                </div>

                <button
                    className="back-shopping-btn"
                    onClick={() =>
                        navigate("/products")
                    }
                >
                    ← Continue Shopping
                </button>

            </section>


            {/* MESSAGES */}

            {message && (
                <div className="cart-message success">
                    ✓ {message}
                </div>
            )}

            {error && (
                <div className="cart-message error">
                    ⚠ {error}
                </div>
            )}


            {/* CART LAYOUT */}

            <section className="cart-layout">

                {/* CART ITEMS */}

                <div className="cart-items">

                    {cart.map((item) => {

                        const subtotal =
                            item.price *
                            item.quantity;

                        return (
                            <article
                                className="cart-item"
                                key={item.id}
                            >

                                {/* PRODUCT ICON */}

                                <div className="cart-product-icon">
                                    🛍️
                                </div>


                                {/* PRODUCT DETAILS */}

                                <div className="cart-item-details">

                                    <h2>
                                        {item.name}
                                    </h2>

                                    <p className="cart-item-price">
                                        ₹{item.price}
                                    </p>

                                    <div className="cart-item-actions">

                                        {/* QUANTITY */}

                                        <div className="quantity-control">

                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item.id,
                                                        item.quantity - 1
                                                    )
                                                }
                                                disabled={
                                                    item.quantity <= 1
                                                }
                                            >
                                                −
                                            </button>

                                            <span>
                                                {item.quantity}
                                            </span>

                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item.id,
                                                        item.quantity + 1
                                                    )
                                                }
                                            >
                                                +
                                            </button>

                                        </div>


                                        {/* REMOVE */}

                                        <button
                                            className="remove-btn"
                                            onClick={() =>
                                                handleRemove(
                                                    item.id
                                                )
                                            }
                                        >
                                            Remove
                                        </button>

                                    </div>

                                </div>


                                {/* SUBTOTAL */}

                                <div className="cart-item-subtotal">

                                    <span>
                                        Subtotal
                                    </span>

                                    <strong>
                                        ₹{subtotal.toFixed(2)}
                                    </strong>

                                </div>

                            </article>
                        );
                    })}

                </div>


                {/* ORDER SUMMARY */}

                <aside className="cart-summary">

                    <h2>
                        Order Summary
                    </h2>

                    <div className="summary-row">
                        <span>
                            Items
                        </span>

                        <span>
                            {cart.length}
                        </span>
                    </div>

                    <div className="summary-row">
                        <span>
                            Delivery
                        </span>

                        <span className="free">
                            FREE
                        </span>
                    </div>

                    <div className="summary-divider" />

                    <div className="summary-total">

                        <span>
                            Total
                        </span>

                        <strong>
                            ₹{Number(cartTotal).toFixed(2)}
                        </strong>

                    </div>


                    <button
                        className="checkout-btn"
                        onClick={() =>
                            navigate("/checkout")
                        }
                    >
                        Proceed to Checkout
                        <span>→</span>
                    </button>


                    <button
                        className="summary-shopping-btn"
                        onClick={() =>
                            navigate("/products")
                        }
                    >
                        Continue Shopping
                    </button>

                </aside>

            </section>

        </main>
    );
}

export default Cart;