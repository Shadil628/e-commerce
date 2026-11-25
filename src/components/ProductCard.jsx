
import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import useCart from "../hooks/useCart";
import { addToWishlist } from "../redux/slices/wishlistSlice";
import SuccessPopup from "./SuccessPopup";

function ProductCard({ product }) {
    const [heartKey, setHeartKey] = useState(0);
    const { addProduct, isLoading, isSaving } = useCart();
    const dispatch = useDispatch();

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");

    const closePopup = useCallback(() => {
        setShowPopup(false);
    }, []);

    const showSuccess = (message) => {
        setPopupMessage(message);
        setShowPopup(true);
    };

    const handleAddToCart = async () => {
        try {
            const result = await addProduct(product);

            if (result !== false) {
                showSuccess("Added to Cart!");
            }
        } catch (error) {
            alert("Unable to add product to cart.");
        }
    };

    const handleWishlist = () => {
        dispatch(addToWishlist(product));

        setHeartKey((prev) => prev + 1);

        showSuccess("Added to Wishlist!");
    };

    return (
        <>
            <div className="product-card group">

                <div className="product-image-box">
                    <span className="product-badge">NEW</span>

                    <img
                        src={product.image}
                        alt={product.title}
                        className="product-image"
                    />

                    <Link
                        to={`/products/${product.id}`}
                        className="quick-view"
                    >
                        Quick View ↗
                    </Link>
                </div>

                <div className="product-info">

                    <p className="product-category">
                        {product.category}
                    </p>

                    <h2>{product.title}</h2>

                    <div className="product-price-row">
                        <p className="product-price">
                            ₹{product.price.toLocaleString("en-IN")}
                        </p>

                        <p className="product-stock">
                            {product.stock > 0
                                ? "In Stock"
                                : "Out of Stock"}
                        </p>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0 || isLoading || isSaving}
                        className="product-add-button"
                    >
                        {isSaving ? "Saving..." : "Add to Cart 🛒"}
                    </button>

                    <button
                        onClick={handleWishlist}
                        className="product-wishlist-button"
                    >
                        <span key={heartKey} className="wishlist-heart-animation">
                            🛒
                        </span>
                        Add to Wishlist
                    </button>

                </div>
            </div>

            <SuccessPopup
                show={showPopup}
                message={popupMessage}
                onClose={closePopup}
            />
        </>
    );
}

export default ProductCard;
