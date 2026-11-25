
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import useCart from "../hooks/useCart";
import { removeFromWishlist } from "../redux/slices/wishlistSlice";
import { useState, useCallback } from "react";
import SuccessPopup from "../components/SuccessPopup";

function Wishlist() {
    const dispatch = useDispatch();

    const { addProduct, isSaving } = useCart();

    const wishlistItems = useSelector(
        (state) => state.wishlist.items
    );
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");

    const closePopup = useCallback(() => {
        setShowPopup(false);
    }, []);

    const handleMoveToCart = async (item) => {
        try {
            const result = await addProduct(item);

            if (result !== false) {
                setPopupMessage("Product Added to Cart!");
                setShowPopup(true);
            }
        } catch (error) {
            alert("Unable to add product to cart.");
        }
    };

    return (
        <div className="wishlist-page">

            {/* HEADER */}
            <div className="wishlist-header">
                <p className="wishlist-label">
                    YOUR PERSONAL COLLECTION
                </p>

                <h1>
                    My <span>Wishlist.</span>
                </h1>

                <p className="wishlist-subtitle">
                    All your favourite products, saved in one place.
                </p>

                <div className="wishlist-count">
                    {wishlistItems.length} Saved Products
                </div>
            </div>

            {/* EMPTY WISHLIST */}
            {wishlistItems.length === 0 ? (

                <div className="wishlist-empty">
                    <div className="empty-heart">♡</div>

                    <h2>Your wishlist is empty</h2>

                    <p>
                        You haven't saved any products yet.
                        Explore our collection and find something you love.
                    </p>

                    <a href="/" className="wishlist-shop-btn">
                        Explore Products ↗
                    </a>
                </div>

            ) : (

                /* WISHLIST PRODUCTS */
                <div className="wishlist-grid">

                    {wishlistItems.map((item) => (

                        <div className="wishlist-card" key={item.id}>

                            {/* PRODUCT IMAGE */}
                            <div className="wishlist-image-box">

                                <span className="wishlist-heart">
                                    ♡
                                </span>

                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="wishlist-image"
                                />

                            </div>

                            {/* PRODUCT DETAILS */}
                            <div className="wishlist-details">

                                <p className="wishlist-category">
                                    {item.category}
                                </p>

                                <h2>{item.title}</h2>

                                <p className="wishlist-price">
                                    ₹{Number(item.price).toLocaleString("en-IN")}
                                </p>

                                <p className={
                                    item.stock > 0
                                        ? "wishlist-stock"
                                        : "wishlist-out-stock"
                                }>
                                    {item.stock > 0
                                        ? `✓ In Stock (${item.stock})`
                                        : "Out of Stock"}
                                </p>

                                {/* MOVE TO CART */}
                                <button
                                    onClick={() => handleMoveToCart(item)}
                                    disabled={item.stock <= 0 || isSaving}
                                    className="wishlist-cart-btn"
                                >
                                    {isSaving
                                        ? "Adding..."
                                        : item.stock > 0
                                            ? "Move to Cart →"
                                            : "Out of Stock"}
                                </button>

                                {/* REMOVE */}
                                <button
                                    onClick={() =>
                                        dispatch(removeFromWishlist(item.id))
                                    }
                                    className="wishlist-remove-btn"
                                >
                                    Remove
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default Wishlist;
