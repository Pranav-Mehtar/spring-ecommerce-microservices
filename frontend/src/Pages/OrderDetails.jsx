import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../api/axios.js";
import "../css/order-details.css";

function OrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [error, setError] = useState("");

    // =====================================================
    // LOAD ORDER DETAILS
    // =====================================================

    useEffect(() => {
        loadOrder();
    }, [id]);

    const loadOrder = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `/api/orders/${id}`
            );

            console.log(
                "Order details:",
                response.data
            );

            setOrder(response.data.data);

        } catch (err) {
            console.error(
                "Failed to load order:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load order details."
            );

        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // CANCEL ORDER
    // =====================================================

    const handleCancelOrder = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this order?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setCancelLoading(true);
            setError("");

            const response = await api.put(
                `/api/orders/cancel/${id}`
            );

            console.log(
                "Cancel response:",
                response.data
            );

            setOrder(response.data.data);

            alert(
                "Order cancelled successfully."
            );

        } catch (err) {
            console.error(
                "Cancel order error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to cancel order."
            );

        } finally {
            setCancelLoading(false);
        }
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="order-details-page">

                <div className="order-loading-card">

                    <div className="loading-spinner"></div>

                    <h2>
                        Loading your order...
                    </h2>

                    <p>
                        Please wait while we fetch
                        your order details.
                    </p>

                </div>

            </div>
        );
    }

    // =====================================================
    // ORDER NOT FOUND
    // =====================================================

    if (!order) {
        return (
            <div className="order-details-page">

                <div className="order-error-card">

                    <div className="error-icon">
                        ⚠️
                    </div>

                    <h1>
                        Order Not Found
                    </h1>

                    <p>
                        {error ||
                            "We couldn't find the requested order."}
                    </p>

                    <button
                        className="primary-order-button"
                        onClick={() =>
                            navigate("/orders")
                        }
                    >
                        ← Back to My Orders
                    </button>

                </div>

            </div>
        );
    }

    // =====================================================
    // ORDER STATUS
    // =====================================================

    const status =
        order.status?.toUpperCase() || "UNKNOWN";

    const canCancel =
        status !== "SHIPPED" &&
        status !== "DELIVERED" &&
        status !== "CANCELLED";

    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getStatusClass = () => {
        switch (status) {
            case "PENDING":
                return "status-pending";

            case "CONFIRMED":
                return "status-confirmed";

            case "PROCESSING":
                return "status-processing";

            case "SHIPPED":
                return "status-shipped";

            case "DELIVERED":
                return "status-delivered";

            case "CANCELLED":
                return "status-cancelled";

            default:
                return "status-default";
        }
    };

    // =====================================================
    // PAGE
    // =====================================================

    return (
        <div className="order-details-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <section className="order-details-header">

                <div>

                    <span className="order-header-label">
                        📦 MyShop Order
                    </span>

                    <h1>
                        Order #{order.id}
                    </h1>

                    <p>
                        Thank you for shopping with MyShop.
                        Here are the details of your order.
                    </p>

                </div>

                <div className="order-header-icon">
                    🛍️
                </div>

            </section>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
                <div className="order-alert-error">
                    ⚠️ {error}
                </div>
            )}


            {/* =================================================
                ORDER STATUS
            ================================================= */}

            <section className="order-status-card">

                <div className="status-info">

                    <span className="status-label">
                        ORDER STATUS
                    </span>

                    <span
                        className={`order-status ${getStatusClass()}`}
                    >
                        <span className="status-dot"></span>

                        {status}
                    </span>

                </div>

                <div className="order-date">

                    <span>
                        ORDER DATE
                    </span>

                    <strong>
                        {order.createdAt
                            ? new Date(
                                order.createdAt
                            ).toLocaleString()
                            : "N/A"}
                    </strong>

                </div>

            </section>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <div className="order-content">

                {/* =================================================
                    LEFT SIDE
                ================================================= */}

                <div className="order-main-column">

                    {/* ================================
                        ORDER ITEMS
                    ================================= */}

                    <section className="order-section">

                        <div className="section-heading">

                            <div>
                                <span className="section-icon">
                                    🛒
                                </span>

                                <div>
                                    <h2>
                                        Order Items
                                    </h2>

                                    <p>
                                        Products included in this order
                                    </p>
                                </div>
                            </div>

                        </div>


                        <div className="order-items">

                            {order.items &&
                            order.items.length > 0 ? (

                                order.items.map((item) => {

                                    const productName =
                                        item.product?.name ||
                                        item.productName ||
                                        "Product";

                                    const price =
                                        Number(
                                            item.priceAtPurchase || 0
                                        );

                                    const quantity =
                                        Number(
                                            item.quantity || 0
                                        );

                                    const subtotal =
                                        price * quantity;

                                    return (
                                        <div
                                            className="order-item"
                                            key={item.id}
                                        >

                                            {/* PRODUCT ICON */}

                                            <div className="product-placeholder">
                                                🛍️
                                            </div>


                                            {/* PRODUCT INFO */}

                                            <div className="order-item-info">

                                                <h3>
                                                    {productName}
                                                </h3>

                                                <p>
                                                    Price: ₹
                                                    {price.toFixed(2)}
                                                </p>

                                            </div>


                                            {/* QUANTITY */}

                                            <div className="item-quantity">

                                                <span>
                                                    Qty
                                                </span>

                                                <strong>
                                                    {quantity}
                                                </strong>

                                            </div>


                                            {/* SUBTOTAL */}

                                            <div className="item-subtotal">

                                                <span>
                                                    Subtotal
                                                </span>

                                                <strong>
                                                    ₹
                                                    {subtotal.toFixed(2)}
                                                </strong>

                                            </div>

                                        </div>
                                    );
                                })

                            ) : (

                                <div className="empty-order-items">
                                    No items found for this order.
                                </div>

                            )}

                        </div>

                    </section>


                    {/* =================================================
                        SHIPPING ADDRESS
                    ================================================= */}

                    <section className="order-section">

                        <div className="section-heading">

                            <div>

                                <span className="section-icon">
                                    📍
                                </span>

                                <div>

                                    <h2>
                                        Shipping Address
                                    </h2>

                                    <p>
                                        Delivery information
                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="shipping-address">

                            <div className="address-icon">
                                🏠
                            </div>

                            <div>

                                <strong>
                                    Delivery Address
                                </strong>

                                <p>
                                    {order.shippingAddress ||
                                        "No shipping address available."}
                                </p>

                            </div>

                        </div>

                    </section>

                </div>


                {/* =================================================
                    RIGHT SIDE
                ================================================= */}

                <aside className="order-sidebar">

                    {/* ================================
                        PAYMENT / TOTAL
                    ================================= */}

                    <section className="total-card">

                        <div className="total-card-header">

                            <span>
                                💳
                            </span>

                            <h2>
                                Order Summary
                            </h2>

                        </div>


                        <div className="summary-row">

                            <span>
                                Items
                            </span>

                            <strong>
                                {order.items?.length || 0}
                            </strong>

                        </div>


                        <div className="summary-row">

                            <span>
                                Shipping
                            </span>

                            <strong className="free-shipping">
                                FREE
                            </strong>

                        </div>


                        <div className="summary-divider"></div>


                        <div className="grand-total">

                            <span>
                                Total
                            </span>

                            <strong>
                                ₹
                                {Number(
                                    order.totalAmount || 0
                                ).toFixed(2)}
                            </strong>

                        </div>

                    </section>


                    {/* ================================
                        ORDER PROGRESS
                    ================================= */}

                    <section className="progress-card">

                        <h3>
                            📦 Order Progress
                        </h3>

                        <div className="progress-line">

                            <div className="progress-step active">

                                <div className="progress-circle">
                                    ✓
                                </div>

                                <span>
                                    Order Placed
                                </span>

                            </div>


                            <div
                                className={`progress-step ${
                                    status !== "PENDING" &&
                                    status !== "CANCELLED"
                                        ? "active"
                                        : ""
                                }`}
                            >

                                <div className="progress-circle">
                                    ✓
                                </div>

                                <span>
                                    Processing
                                </span>

                            </div>


                            <div
                                className={`progress-step ${
                                    status === "SHIPPED" ||
                                    status === "DELIVERED"
                                        ? "active"
                                        : ""
                                }`}
                            >

                                <div className="progress-circle">
                                    ✓
                                </div>

                                <span>
                                    Shipped
                                </span>

                            </div>


                            <div
                                className={`progress-step ${
                                    status === "DELIVERED"
                                        ? "active"
                                        : ""
                                }`}
                            >

                                <div className="progress-circle">
                                    ✓
                                </div>

                                <span>
                                    Delivered
                                </span>

                            </div>

                        </div>

                    </section>


                    {/* ================================
                        ACTIONS
                    ================================= */}

                    <section className="order-actions">

                        {canCancel && (

                            <button
                                className="cancel-order-button"
                                onClick={handleCancelOrder}
                                disabled={cancelLoading}
                            >

                                {cancelLoading
                                    ? "Cancelling Order..."
                                    : "✕ Cancel Order"}

                            </button>

                        )}


                        <button
                            className="back-orders-button"
                            onClick={() =>
                                navigate("/orders")
                            }
                            disabled={cancelLoading}
                        >
                            ← Back to My Orders
                        </button>

                    </section>


                    {/* ================================
                        SECURE MESSAGE
                    ================================= */}

                    <div className="secure-order-message">

                        🔒

                        <div>

                            <strong>
                                Your order is secure
                            </strong>

                            <p>
                                Your order information is
                                safely protected.
                            </p>

                        </div>

                    </div>

                </aside>

            </div>

        </div>
    );
}

export default OrderDetails;