
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../redux/slices/orderSlice";
import useCart from "../hooks/useCart";

function Checkout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector((state) => state.auth.user);

    const { loading } = useSelector(
        (state) => state.orders
    );

    // Get cart from TanStack Query
    const {
        cartItems,
        isLoading,
        clearCart,
        isSaving
    } = useCart();

    const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handlePlaceOrder = async () => {
        if (!user?.id || cartItems.length === 0) return;

        const orderData = {
            userId: user.id,
            items: cartItems,
            total: total,
            date: new Date().toISOString(),
            status: "Placed"
        };

        try {
            const result = await dispatch(
                placeOrder(orderData)
            );

            if (placeOrder.fulfilled.match(result)) {

                // Clear database cart
                await clearCart();

                alert("Order placed successfully!");

                navigate("/orders");

            } else {
                alert("Failed to place order. Please try again.");
            }

        } catch (error) {
            alert("Order was placed, but cart cleanup failed. Please refresh your cart.");
        }
    };

    if (isLoading) {
        return (
            <h2 className="text-center mt-10">
                Loading checkout...
            </h2>
        );
    }

    if (cartItems.length === 0) {
        return (
            <h2 className="text-center mt-10">
                Your cart is empty
            </h2>
        );
    }

    return (
        <div className="min-h-screen bg-[#F2F2F2] p-8">

            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl">

                <h1 className="text-3xl font-bold text-[#174D38] mb-6">
                    Checkout
                </h1>

                <h2 className="font-bold mb-3">
                    Order Summary
                </h2>

                {cartItems.map((item) => (

                    <div
                        key={item.id}
                        className="flex justify-between mb-3"
                    >
                        <p>
                            {item.title} × {item.quantity}
                        </p>

                        <p>
                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>

                    </div>

                ))}

                <hr className="my-4" />

                <h2 className="text-xl font-bold mb-6">
                    Total: ₹{total.toLocaleString("en-IN")}
                </h2>

                <button
                    onClick={handlePlaceOrder}
                    disabled={loading || isSaving}
                    className="w-full bg-[#174D38] text-white py-3 rounded-lg disabled:opacity-50"
                >
                    {loading || isSaving
                        ? "Processing..."
                        : "Place Order"}
                </button>

            </div>

        </div>
    );
}

export default Checkout;
