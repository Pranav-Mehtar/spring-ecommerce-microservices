import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import "../css/orders.css";

function Orders() {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =====================================================
    // LOAD ORDERS
    // =====================================================

    useEffect(() => {

        const loadOrders = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await api.get("/api/orders");

                console.log(
                    "Orders response:",
                    response.data
                );

                setOrders(
                    response.data.data || []
                );

            } catch (error) {

                console.error(
                    "Failed to load orders:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load orders."
                );

            } finally {

                setLoading(false);
            }
        };


        loadOrders();

    }, []);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="orders-page">

                <div className="orders-loading">

                    <div className="loading-icon">
                        📦
                    </div>

                    <h2>
                        Loading your orders...
                    </h2>

                    <p>
                        Please wait while we fetch your
                        order history.
                    </p>

                </div>

            </div>
        );
    }


    // =====================================================
    // ORDERS PAGE
    // =====================================================

    return (

        <div className="orders-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="orders-header">

                <span className="orders-badge">
                    📦 MyShop Orders
                </span>

                <h1>
                    Your Orders
                </h1>

                <p>
                    Track your purchases and view
                    your order details.
                </p>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="orders-error">
                    ⚠️ {error}
                </div>

            )}


            {/* =================================================
                EMPTY ORDERS
            ================================================= */}

            {orders.length === 0 ? (

                <div className="empty-orders">

                    <div className="empty-orders-icon">
                        🛍️
                    </div>

                    <h2>
                        No orders yet
                    </h2>

                    <p>
                        You haven't placed an order yet.
                        Find something you love and start shopping!
                    </p>

                    <button
                        onClick={() =>
                            navigate("/products")
                        }
                    >
                        🛒 Start Shopping
                    </button>

                </div>

            ) : (

                /* =================================================
                   ORDER LIST
                ================================================= */

                <div className="orders-container">

                    {orders.map((order) => (

                        <div
                            className="order-card"
                            key={order.id}
                        >

                            {/* =================================================
                                ORDER TOP
                            ================================================= */}

                            <div className="order-card-header">

                                <div>

                                    <span className="order-label">
                                        ORDER
                                    </span>

                                    <h2>
                                        #{order.id}
                                    </h2>

                                </div>


                                <span
                                    className={`order-status ${
                                        order.status
                                            ?.toLowerCase()
                                            .replace(/\s+/g, "-")
                                    }`}
                                >
                                    {order.status}
                                </span>

                            </div>


                            {/* =================================================
                                ORDER INFO
                            ================================================= */}

                            <div className="order-info-grid">

                                <div className="order-info">

                                    <span>
                                        💰 Total
                                    </span>

                                    <strong>
                                        ₹
                                        {Number(
                                            order.totalAmount || 0
                                        ).toFixed(2)}
                                    </strong>

                                </div>


                                <div className="order-info">

                                    <span>
                                        📅 Order Date
                                    </span>

                                    <strong>

                                        {order.createdAt
                                            ? new Date(
                                                order.createdAt
                                            ).toLocaleDateString(
                                                "en-IN",
                                                {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric"
                                                }
                                            )
                                            : "N/A"}

                                    </strong>

                                </div>


                                <div className="order-info">

                                    <span>
                                        🧾 Order ID
                                    </span>

                                    <strong>
                                        #{order.id}
                                    </strong>

                                </div>

                            </div>


                            {/* =================================================
                                DIVIDER
                            ================================================= */}

                            <div className="order-divider" />


                            {/* =================================================
                                VIEW DETAILS
                            ================================================= */}

                            <div className="order-card-footer">

                                <span>
                                    View complete order information
                                </span>


                                <button
                                    onClick={() =>
                                        navigate(
                                            `/orders/${order.id}`
                                        )
                                    }
                                >
                                    View Details
                                    <span>
                                        →
                                    </span>
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default Orders;