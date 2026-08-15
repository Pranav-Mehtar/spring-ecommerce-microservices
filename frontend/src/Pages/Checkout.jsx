import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import api from "../api/axios";

import "../css/checkout.css";

function Checkout() {

    const navigate = useNavigate();

    const {
        cart,
        cartTotal,
        loadCart
    } = useCart();

    const [shippingAddress, setShippingAddress] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // =====================================================
    // PLACE ORDER
    // =====================================================

    const handleCheckout = async (e) => {

        e.preventDefault();

        setError("");


        if (!shippingAddress.trim()) {

            setError(
                "Please enter your shipping address."
            );

            return;
        }


        try {

            setLoading(true);


            const response =
                await api.post(
                    "/api/orders/checkout",
                    {
                        shippingAddress
                    }
                );


            console.log(
                "Checkout response:",
                response.data
            );


            // Refresh cart
            await loadCart();


            // Get order ID
            const orderId =
                response.data.data.id;


            // Navigate to order details
            navigate(
                `/orders/${orderId}`
            );


        } catch (error) {

            console.error(
                "Checkout error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to place order."
            );


        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // EMPTY CART
    // =====================================================

    if (cart.length === 0) {

        return (

            <div className="checkout-page">

                <div className="empty-checkout">

                    <div className="empty-icon">
                        🛒
                    </div>


                    <h1>
                        Your cart is empty
                    </h1>


                    <p>
                        Add some products before
                        proceeding to checkout.
                    </p>


                    <button
                        onClick={() =>
                            navigate("/products")
                        }
                    >
                        🛍️ Continue Shopping
                    </button>

                </div>

            </div>
        );
    }


    // =====================================================
    // CHECKOUT PAGE
    // =====================================================

    return (

        <div className="checkout-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="checkout-header">

                <span>
                    🛍️ MyShop Checkout
                </span>


                <h1>
                    Complete Your Order
                </h1>


                <p>
                    Review your items and enter
                    your delivery details.
                </p>

            </div>


            {/* =================================================
                MAIN CHECKOUT
            ================================================= */}

            <div className="checkout-container">


                {/* =================================================
                    ORDER SUMMARY
                ================================================= */}

                <div className="order-summary">


                    <div className="section-title">

                        <span>
                            🛒
                        </span>

                        <h2>
                            Order Summary
                        </h2>

                    </div>


                    <div className="checkout-items">


                        {cart.map((item) => (

                            <div
                                className="checkout-item"
                                key={item.id}
                            >


                                {/* PRODUCT INFO */}

                                <div className="item-info">

                                    <h3>
                                        {item.productName}
                                    </h3>


                                    <p>
                                        ₹{item.price}
                                        {" "}×{" "}
                                        {item.quantity}
                                    </p>

                                </div>


                                {/* QUANTITY + SUBTOTAL */}

                                <div className="item-quantity">

                                    <span>
                                        Qty: {item.quantity}
                                    </span>


                                    <strong>
                                        ₹
                                        {(
                                            item.price *
                                            item.quantity
                                        ).toFixed(2)}
                                    </strong>

                                </div>

                            </div>

                        ))}

                    </div>


                    {/* TOTAL */}

                    <div className="checkout-total">

                        <span>
                            Total
                        </span>


                        <strong>
                            ₹{Number(cartTotal).toFixed(2)}
                        </strong>

                    </div>

                </div>


                {/* =================================================
                    SHIPPING
                ================================================= */}

                <div className="shipping-section">


                    <div className="section-title">

                        <span>
                            📦
                        </span>

                        <h2>
                            Delivery Details
                        </h2>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="checkout-error">

                            ⚠️ {error}

                        </div>

                    )}


                    {/* FORM */}

                    <form
                        className="checkout-form"
                        onSubmit={handleCheckout}
                    >


                        <label htmlFor="shippingAddress">

                            Shipping Address

                        </label>


                        <textarea
                            id="shippingAddress"

                            value={shippingAddress}

                            onChange={(e) =>
                                setShippingAddress(
                                    e.target.value
                                )
                            }

                            placeholder="Enter your complete delivery address..."

                            rows="5"

                            required
                        />


                        {/* SECURITY */}

                        <div className="secure-message">

                            🔒

                            <span>
                                Your order information is
                                securely processed.
                            </span>

                        </div>


                        {/* PLACE ORDER */}

                        <button
                            className="place-order-btn"

                            type="submit"

                            disabled={loading}
                        >

                            {loading
                                ? "⏳ Placing Order..."
                                : "🚀 Place Order"}

                        </button>


                        {/* CONTINUE SHOPPING */}

                        <button
                            className="back-shopping-btn"

                            type="button"

                            onClick={() =>
                                navigate("/products")
                            }
                        >

                            ← Continue Shopping

                        </button>


                    </form>

                </div>

            </div>

        </div>
    );
}

export default Checkout;