
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "../redux/slices/orderSlice";

function Orders() {
    const dispatch = useDispatch();

    const user = useSelector((state) => state.auth.user);

    const { items, loading, error } = useSelector(
        (state) => state.orders
    );

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchUserOrders(user.id));
        }
    }, [dispatch, user?.id]);

    if (loading) {
        return (
            <h2 className="text-center mt-10">
                Loading orders...
            </h2>
        );
    }

    if (error) {
        return (
            <h2 className="text-center mt-10 text-red-700">
                {error}
            </h2>
        );
    }

    return (
        <div className="orders-page">

            {/* HEADER */}
            <div className="orders-header">
                <p className="orders-label">
                    ✦ YOUR SHOPPING JOURNEY
                </p>

                <h1>
                    My <span>Orders.</span>
                </h1>

                <p className="orders-subtitle">
                    Track and manage all your purchases in one place.
                </p>

                <div className="orders-count">
                    {items.length} Total Orders
                </div>
            </div>

            {/* EMPTY ORDERS */}
            {items.length === 0 ? (

                <div className="orders-empty">
                    <div className="orders-empty-icon">📦</div>

                    <h2>No Orders Yet</h2>

                    <p>
                        You haven't placed any orders.
                        Start exploring our collection!
                    </p>

                    <a href="/" className="orders-shop-btn">
                        Start Shopping ↗
                    </a>
                </div>

            ) : (

                /* ORDER LIST */
                <div className="orders-list">

                    {items.map((order) => (

                        <div className="order-card" key={order.id}>

                            {/* ORDER HEADER */}
                            <div className="order-top">

                                <div>
                                    <p className="order-small-label">
                                        ORDER ID
                                    </p>

                                    <h2>#{order.id}</h2>
                                </div>

                                <span className={`order-status ${String(order.status).toLowerCase().replace(/\s+/g, "-")}`}>
                                    {order.status}
                                </span>

                            </div>

                            {/* ORDER DATE */}
                            <div className="order-date">
                                <span>Order Date</span>

                                <strong>
                                    {new Date(order.date).toLocaleString("en-IN")}
                                </strong>
                            </div>

                            {/* ORDER PRODUCTS */}
                            <div className="order-products">

                                {order.items.map((item, index) => (

                                    <div
                                        className="order-product"
                                        key={`${item.id}-${index}`}
                                    >

                                        <div className="order-product-image">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                            />
                                        </div>

                                        <div className="order-product-info">
                                            <h3>{item.title}</h3>

                                            <p>
                                                Quantity: {item.quantity}
                                            </p>

                                            <p>
                                                ₹{Number(item.price).toLocaleString("en-IN")} each
                                            </p>
                                        </div>

                                        <strong className="order-item-total">
                                            ₹{(Number(item.price) * Number(item.quantity)).toLocaleString("en-IN")}
                                        </strong>

                                    </div>

                                ))}

                            </div>

                            {/* ORDER FOOTER */}
                            <div className="order-footer">

                                <div>
                                    <p>Total Amount</p>

                                    <h2>
                                        ₹{Number(order.total).toLocaleString("en-IN")}
                                    </h2>
                                </div>

                                <span className="order-payment-label">
                                    ✓ Order Placed
                                </span>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default Orders;
