
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../redux/slices/orderSlice";
import useCart from "../hooks/useCart";
import { saveUserAddress } from "../services/userService";

function Checkout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector((state) => state.auth.user);

    const { loading } = useSelector(
        (state) => state.orders
    );

    const {
        cartItems,
        isLoading,
        clearCart,
        changeQuantity,
        isSaving
    } = useCart();

    const [address, setAddress] = useState({
        fullName: user?.name || "",
        phone: "",
        email: user?.email || "",
        house: "",
        street: "",
        landmark: "",
        city: "",
        state: "",
        pincode: ""
    });

    const [paymentMethod, setPaymentMethod] = useState("COD");

    const [sameAddress, setSameAddress] = useState(true);

    const [billingAddress, setBillingAddress] = useState({
        fullName: "",
        phone: "",
        house: "",
        street: "",
        city: "",
        state: "",
        pincode: ""
    });

    const [coupon, setCoupon] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(false);
    const [notes, setNotes] = useState("");
    const [error, setError] = useState("");
    const [orderSuccess, setOrderSuccess] = useState(false);

    // PRICE CALCULATIONS

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const deliveryCharge = subtotal >= 1000 ? 0 : 50;
    const discount = appliedCoupon ? subtotal * 0.10 : 0;
    const total = subtotal + deliveryCharge - discount;

    const formatPrice = (price) =>
        price.toLocaleString("en-IN");

    // SHIPPING ADDRESS

    const handleAddressChange = (e) => {
        const { name, value } = e.target;

        setAddress((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // BILLING ADDRESS

    const handleBillingChange = (e) => {
        const { name, value } = e.target;

        setBillingAddress((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // COUPON

    const handleApplyCoupon = () => {
        if (coupon.trim().toUpperCase() === "WELCOME10") {
            setAppliedCoupon(true);
            setError("");
        } else {
            setAppliedCoupon(false);
            setError("Invalid coupon code");
        }
    };

    // PLACE ORDER

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        setError("");

        if (!user?.id || cartItems.length === 0) {
            setError("Please login and add products to your cart.");
            return;
        }

        const requiredFields = [
            "fullName",
            "phone",
            "email",
            "house",
            "street",
            "city",
            "state",
            "pincode"
        ];

        for (const field of requiredFields) {
            if (!address[field].trim()) {
                setError("Please fill all required address fields.");
                return;
            }
        }

        if (!/^[6-9]\d{9}$/.test(address.phone)) {
            setError("Enter a valid 10-digit mobile number.");
            return;
        }

        if (!/^\d{6}$/.test(address.pincode)) {
            setError("Enter a valid 6-digit PIN code.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) {
            setError("Enter a valid email address.");
            return;
        }

        if (
            !sameAddress &&
            (
                !billingAddress.fullName.trim() ||
                !billingAddress.phone.trim() ||
                !billingAddress.house.trim() ||
                !billingAddress.street.trim() ||
                !billingAddress.city.trim() ||
                !billingAddress.state.trim() ||
                !/^\d{6}$/.test(billingAddress.pincode)
            )
        ) {
            setError("Please complete your billing address.");
            return;
        }

        if (paymentMethod !== "COD") {
            setError("Online payment is not available yet. Please select Cash on Delivery.");
            return;
        }

        const orderData = {
            userId: user.id,
            items: cartItems,

            shippingAddress: address,

            billingAddress: sameAddress
                ? address
                : billingAddress,

            paymentMethod,
            paymentStatus: "Pending",

            subtotal,
            deliveryCharge,
            discount,
            total,

            couponCode: appliedCoupon
                ? "WELCOME10"
                : "",

            notes,

            date: new Date().toISOString(),
            status: "Placed"
        };

        try {
            // STEP 1: Save address
            console.log("Saving address...");
            console.log("User ID:", user.id);
            console.log("Address:", address);

            const savedUser = await saveUserAddress(user.id, address);

            console.log("Address saved successfully:", savedUser);

            // STEP 2: Place order
            console.log("Placing order...");

            const result = await dispatch(
                placeOrder(orderData)
            );

            if (placeOrder.fulfilled.match(result)) {
                console.log("Order placed successfully");

                // Show success animation
                setOrderSuccess(true);

                // Clear cart
                try {
                    await clearCart();
                } catch (cartError) {
                    console.error("Cart clearing error:", cartError);
                }

                // Navigate after animation
                setTimeout(() => {
                    navigate("/orders");
                }, 2500);
            } else {
                console.error("Order failed:", result.payload);

                setError(
                    result.payload ||
                    "Failed to place order."
                );
            }

        } catch (error) {
            console.error("CHECKOUT ERROR:", error);
            console.error("Error response:", error.response?.data);
            console.error("Error status:", error.response?.status);

            setError(
                error.response?.data?.message ||
                error.message ||
                "Something went wrong during checkout."
            );
        }
    };
    // ORDER SUCCESS ANIMATION

    if (orderSuccess) {
        return (
            <div className="order-success-overlay">
                <div className="order-success-card">

                    <div className="success-checkmark">
                        <svg viewBox="0 0 100 100">
                            <circle
                                className="success-circle"
                                cx="50"
                                cy="50"
                                r="45"
                            />

                            <path
                                className="success-tick"
                                d="M28 51 L43 66 L73 35"
                            />
                        </svg>
                    </div>

                    <h1>Order Placed Successfully!</h1>

                    <p>
                        Thank you for shopping with MY STORE.
                    </p>

                    <span className="success-redirect">
                        Redirecting to your orders...
                    </span>

                </div>
            </div>
        );
    }
    // LOADING

    if (isLoading) {
        return (
            <div className="checkout-empty">
                <h2>Loading checkout...</h2>
            </div>
        );
    }

    // EMPTY CART

    if (cartItems.length === 0) {
        return (
            <div className="checkout-empty">
                <h2>Your cart is empty</h2>

                <p>
                    Add some products before checking out.
                </p>

                <button onClick={() => navigate("/")}>
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="checkout-page">

            <div className="checkout-container">

                {/* HEADER */}

                <div className="checkout-header">

                    <div className="checkout-breadcrumb">
                        Home / Cart / Checkout
                    </div>

                    <h1>Checkout</h1>

                    <p>
                        Complete your details and place your order.
                    </p>

                    {/* PROGRESS */}

                    <div className="checkout-progress">

                        <div className="progress-step active">
                            <span>✓</span>
                            Cart
                        </div>

                        <div className="progress-line"></div>

                        <div className="progress-step active">
                            <span>2</span>
                            Checkout
                        </div>

                        <div className="progress-line"></div>

                        <div className="progress-step">
                            <span>3</span>
                            Complete
                        </div>

                    </div>

                </div>

                <form onSubmit={handlePlaceOrder}>

                    <div className="checkout-layout">

                        {/* LEFT SECTION */}

                        <div className="checkout-left">

                            {/* SHIPPING ADDRESS */}

                            <div className="checkout-card">

                                <div className="checkout-section-header">

                                    <div className="checkout-section-icon">
                                        📍
                                    </div>

                                    <div>
                                        <h2>Shipping Address</h2>
                                        <p>
                                            Where should we deliver your order?
                                        </p>
                                    </div>

                                </div>

                                <div className="checkout-form-grid">

                                    {[
                                        ["fullName", "Full Name", "Enter your full name"],
                                        ["phone", "Phone Number", "10-digit mobile number"],
                                        ["email", "Email Address", "Enter your email"],
                                        ["house", "House / Building", "House number"],
                                        ["street", "Street Address", "Street / Area"],
                                        ["landmark", "Landmark (Optional)", "Nearby landmark"],
                                        ["city", "City", "Enter your city"],
                                        ["state", "State", "Enter your state"],
                                        ["pincode", "PIN Code", "6-digit PIN code"]
                                    ].map(([name, label, placeholder]) => (

                                        <div
                                            key={name}
                                            className={`checkout-form-group ${name === "street" ||
                                                name === "landmark"
                                                ? "full-width"
                                                : ""
                                                }`}
                                        >

                                            <label>
                                                {label}

                                                {name !== "landmark" && (
                                                    <span> *</span>
                                                )}
                                            </label>

                                            <input
                                                type={
                                                    name === "email"
                                                        ? "email"
                                                        : name === "phone" ||
                                                            name === "pincode"
                                                            ? "tel"
                                                            : "text"
                                                }
                                                name={name}
                                                value={address[name]}
                                                onChange={handleAddressChange}
                                                placeholder={placeholder}
                                                maxLength={
                                                    name === "phone"
                                                        ? 10
                                                        : name === "pincode"
                                                            ? 6
                                                            : undefined
                                                }
                                                required={name !== "landmark"}
                                            />

                                        </div>

                                    ))}

                                </div>

                            </div>

                            {/* BILLING ADDRESS */}

                            <div className="checkout-card">

                                <div className="checkout-section-header">

                                    <div className="checkout-section-icon">
                                        🏠
                                    </div>

                                    <div>
                                        <h2>Billing Address</h2>
                                        <p>
                                            Enter your billing information.
                                        </p>
                                    </div>

                                </div>

                                <label className="checkout-checkbox">

                                    <input
                                        type="checkbox"
                                        checked={sameAddress}
                                        onChange={(e) =>
                                            setSameAddress(e.target.checked)
                                        }
                                    />

                                    <span>
                                        Billing address is same as shipping address
                                    </span>

                                </label>

                                {!sameAddress && (

                                    <div className="checkout-form-grid" style={{ marginTop: "25px" }}>

                                        {[
                                            ["fullName", "Full Name"],
                                            ["phone", "Phone Number"],
                                            ["house", "House / Building"],
                                            ["street", "Street Address"],
                                            ["city", "City"],
                                            ["state", "State"],
                                            ["pincode", "PIN Code"]
                                        ].map(([name, label]) => (

                                            <div
                                                key={name}
                                                className={`checkout-form-group ${name === "street"
                                                    ? "full-width"
                                                    : ""
                                                    }`}
                                            >

                                                <label>{label} <span>*</span></label>

                                                <input
                                                    type="text"
                                                    name={name}
                                                    value={billingAddress[name]}
                                                    onChange={handleBillingChange}
                                                    required
                                                />

                                            </div>

                                        ))}

                                    </div>

                                )}

                            </div>

                            {/* PAYMENT METHOD */}

                            <div className="checkout-card">

                                <div className="checkout-section-header">

                                    <div className="checkout-section-icon">
                                        💳
                                    </div>

                                    <div>
                                        <h2>Payment Method</h2>
                                        <p>
                                            Select how you would like to pay.
                                        </p>
                                    </div>

                                </div>

                                <div className="payment-options">

                                    {[
                                        {
                                            id: "COD",
                                            title: "Cash on Delivery",
                                            description: "Pay when your order arrives",
                                            icon: "💵"
                                        },
                                        {
                                            id: "UPI",
                                            title: "UPI Payment",
                                            description: "Google Pay, PhonePe, Paytm",
                                            icon: "📱"
                                        },
                                        {
                                            id: "Card",
                                            title: "Credit / Debit Card",
                                            description: "Visa, Mastercard and RuPay",
                                            icon: "💳"
                                        }
                                    ].map((method) => (

                                        <label
                                            key={method.id}
                                            className={`payment-option ${paymentMethod === method.id
                                                ? "selected"
                                                : ""
                                                }`}
                                        >

                                            <input
                                                type="radio"
                                                name="payment"
                                                value={method.id}
                                                checked={paymentMethod === method.id}
                                                onChange={(e) =>
                                                    setPaymentMethod(e.target.value)
                                                }
                                            />

                                            <div className="payment-icon">
                                                {method.icon}
                                            </div>

                                            <div className="payment-details">

                                                <h3>{method.title}</h3>
                                                <p>{method.description}</p>

                                            </div>

                                            {method.id !== "COD" && (
                                                <span className="payment-coming-soon">
                                                    Coming Soon
                                                </span>
                                            )}

                                        </label>

                                    ))}

                                </div>

                                {paymentMethod !== "COD" && (
                                    <div className="checkout-error">
                                        Online payment gateway integration is required for this option.
                                    </div>
                                )}

                            </div>

                            {/* DELIVERY INSTRUCTIONS */}

                            <div className="checkout-card">

                                <div className="checkout-section-header">

                                    <div className="checkout-section-icon">
                                        📝
                                    </div>

                                    <div>
                                        <h2>Delivery Instructions</h2>
                                        <p>
                                            Any special requests for your delivery?
                                        </p>
                                    </div>

                                </div>

                                <div className="checkout-form-group checkout-notes">

                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Write your delivery instructions here... (Optional)"
                                        rows="4"
                                    />

                                </div>

                            </div>

                        </div>

                        {/* RIGHT SECTION */}

                        <div className="checkout-right">

                            <div className="checkout-summary">

                                <h2 className="checkout-summary-title">
                                    Order Summary
                                </h2>

                                {/* PRODUCTS */}

                                <div className="checkout-products">

                                    {cartItems.map((item) => (


                                        <div
                                            key={`${item.id}-${item.selectedColor || ""}`}
                                            className="checkout-product"
                                        >

                                            <div className="checkout-product-image">

                                                <img
                                                    src={
                                                        item.selectedImage ||
                                                        item.image ||
                                                        item.colors?.[0]?.images?.[0]
                                                    }
                                                    alt={item.title}
                                                />

                                            </div>

                                            <div className="checkout-product-info">

                                                <h3>{item.title}</h3>

                                                {/* QUANTITY CONTROL */}
                                                <div className="checkout-quantity">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            changeQuantity(
                                                                item.id,
                                                                item.selectedColor || "",
                                                                item.quantity - 1
                                                            )
                                                        }
                                                        disabled={item.quantity <= 1 || isSaving}
                                                    >
                                                        −
                                                    </button>

                                                    <span>{item.quantity}</span>

                                                    <button
                                                        type="button"
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

                                                <strong>
                                                    ₹{formatPrice(
                                                        item.price * item.quantity
                                                    )}
                                                </strong>

                                            </div>
                                        </div>

                                    ))}

                                </div>

                                <hr className="checkout-divider" />

                                {/* COUPON */}

                                <h3 className="checkout-coupon-title">
                                    Have a coupon code?
                                </h3>

                                <div className="checkout-coupon">

                                    <input
                                        type="text"
                                        value={coupon}
                                        onChange={(e) => {
                                            setCoupon(e.target.value);
                                            setAppliedCoupon(false);
                                        }}
                                        placeholder="Enter coupon code"
                                    />

                                    <button
                                        type="button"
                                        onClick={handleApplyCoupon}
                                    >
                                        Apply
                                    </button>

                                </div>

                                {appliedCoupon && (
                                    <p className="checkout-coupon-success">
                                        ✓ WELCOME10 applied successfully!
                                    </p>
                                )}

                                <hr className="checkout-divider" />

                                {/* PRICE DETAILS */}

                                <div className="checkout-price-details">

                                    <div className="checkout-price-row">
                                        <span>Subtotal</span>
                                        <span>₹{formatPrice(subtotal)}</span>
                                    </div>

                                    <div className="checkout-price-row">
                                        <span>Delivery Charges</span>

                                        <span>
                                            {deliveryCharge === 0
                                                ? "FREE"
                                                : `₹${formatPrice(deliveryCharge)}`
                                            }
                                        </span>
                                    </div>

                                    <div className="checkout-price-row">
                                        <span>Discount</span>

                                        <span className="discount">
                                            - ₹{formatPrice(discount)}
                                        </span>
                                    </div>

                                </div>

                                <hr className="checkout-divider" />

                                {/* TOTAL */}

                                <div className="checkout-total">

                                    <span>Total Amount</span>

                                    <span>
                                        ₹{formatPrice(total)}
                                    </span>

                                </div>

                                {/* ERROR */}

                                {error && (
                                    <div className="checkout-error">
                                        {error}
                                    </div>
                                )}

                                {/* PLACE ORDER */}

                                <button
                                    type="submit"
                                    disabled={loading || isSaving}
                                    className="checkout-place-order"
                                >
                                    {loading || isSaving
                                        ? "Processing Order..."
                                        : `Place Order • ₹${formatPrice(total)}`
                                    }
                                </button>

                                <div className="checkout-security">
                                    🔒 Safe and secure checkout
                                </div>

                                <p className="checkout-delivery-info">
                                    Free delivery on orders above ₹1,000
                                </p>

                            </div>

                        </div>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default Checkout;
