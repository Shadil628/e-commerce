
import React from "react";
import { Link } from "react-router-dom";
import useCart from "../hooks/useCart";

function Cart() {
    const {
        cartItems,
        isLoading,
        removeProduct,
        changeQuantity,
        isSaving
    } = useCart();

    // Calculate total price
    const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    // Calculate total quantity
    const totalItems = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    if (isLoading) {
        return (
            <h2 className="text-center mt-10">
                Loading cart...
            </h2>
        );
    }

    return (
        <div className="cart-page">

            {/* CART HEADER */}
            <div className="cart-header">
                <p>✦ YOUR SHOPPING SPACE</p>
                <h1>
                    My Shopping <span>Cart.</span>
                </h1>
                <span>{totalItems} items in your cart</span>
            </div>

            {cartItems.length === 0 ? (

                /* EMPTY CART */
                <div className="empty-cart">
                    <div className="empty-cart-icon">🛒</div>

                    <h2>Your Cart is Empty</h2>

                    <p>
                        Looks like you haven't added anything yet.
                    </p>

                    <Link to="/" className="continue-shopping">
                        Explore Collection ↗
                    </Link>
                </div>

            ) : (

                <div className="cart-layout">

                    {/* CART ITEMS */}
                    <div className="cart-items">

                        {cartItems.map((item) => (

                            <div
                                key={`${item.id}-${item.selectedColor || "default"}`}
                                className="cart-item"
                            >

                                {/* PRODUCT IMAGE */}
                                <div className="cart-image">
                                    <img
                                        src={item.image}
                                        alt={`${item.title} ${item.selectedColor || ""}`}
                                    />
                                </div>

                                {/* PRODUCT INFORMATION */}
                                <div className="cart-item-info">

                                    <p className="cart-category">
                                        {item.category}
                                    </p>

                                    <h2>{item.title}</h2>

                                    {/* SELECTED COLOUR */}
                                    {item.selectedColor && (
                                        <p className="cart-item-color">
                                            Colour: <strong>{item.selectedColor}</strong>
                                        </p>
                                    )}

                                    <p className="cart-item-price">
                                        ₹{item.price.toLocaleString("en-IN")}
                                    </p>

                                    {/* QUANTITY CONTROL */}
                                    <div className="quantity-control">

                                        <button
                                            onClick={() =>
                                                changeQuantity(
                                                    item.id,
                                                    item.selectedColor || "",
                                                    item.quantity - 1
                                                )
                                            }
                                            disabled={
                                                item.quantity === 1 || isSaving
                                            }
                                        >
                                            −
                                        </button>

                                        <span>{item.quantity}</span>

                                        <button
                                            onClick={() =>
                                                changeQuantity(
                                                    item.id,
                                                    item.selectedColor || "",
                                                    item.quantity + 1
                                                )
                                            }
                                            disabled={
                                                item.quantity >= item.stock ||
                                                isSaving
                                            }
                                        >
                                            +
                                        </button>

                                    </div>
                                </div>

                                {/* PRICE AND REMOVE */}
                                <div className="cart-item-actions">

                                    <p>
                                        ₹{(
                                            item.price * item.quantity
                                        ).toLocaleString("en-IN")}
                                    </p>

                                    <button
                                        onClick={() =>
                                            removeProduct(
                                                item.id,
                                                item.selectedColor || ""
                                            )
                                        }
                                        disabled={isSaving}
                                    >
                                        Remove ×
                                    </button>

                                </div>

                            </div>
                        ))}

                        <Link to="/" className="back-shopping">
                            ← Continue Shopping
                        </Link>

                    </div>

                    {/* ORDER SUMMARY */}
                    <div className="cart-summary">

                        <p className="summary-label">
                            ✦ ORDER SUMMARY
                        </p>

                        <h2>Your Order</h2>

                        <div className="summary-row">
                            <span>Total Items</span>
                            <span>{totalItems}</span>
                        </div>

                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>
                                ₹{total.toLocaleString("en-IN")}
                            </span>
                        </div>

                        <div className="summary-row">
                            <span>Delivery</span>
                            <span>Calculated at checkout</span>
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-total">
                            <span>Total</span>
                            <h3>
                                ₹{total.toLocaleString("en-IN")}
                            </h3>
                        </div>

                        <Link
                            to="/checkout"
                            className="checkout-button"
                        >
                            Buy Now ↗
                        </Link>

                        <p className="summary-note">
                            Thank you for shopping with MyStore.
                        </p>

                    </div>

                </div>
            )}

        </div>
    );
}

export default Cart;
