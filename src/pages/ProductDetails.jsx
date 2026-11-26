import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import useCart from "../hooks/useCart";
import { getProductById } from "../services/productService";
import SuccessPopup from "../components/SuccessPopup";

function ProductDetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector((state) => state.auth.user);
    const { id } = useParams();

    const { addProduct, isSaving } = useCart();

    const [selectedColor, setSelectedColor] = useState("");
    const [activeImage, setActiveImage] = useState(0);

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");

    const closePopup = useCallback(() => {
        setShowPopup(false);
    }, []);

    const showSuccess = (message) => {
        setPopupMessage(message);
        setShowPopup(true);
    };

    // Fetch product details
    const {
        data: product,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ["product", id],
        queryFn: () => getProductById(id)
    });

    // Automatically select the first colour
    useEffect(() => {
        if (product?.colors?.length > 0) {
            setSelectedColor(product.colors[0].name);
        } else {
            setSelectedColor("");
        }

        setActiveImage(0);
    }, [product?.id]);

    // Get selected colour details
    const selectedColorOption =
        product?.colors?.find(
            (color) => color.name === selectedColor
        ) || product?.colors?.[0];

    // Get images for selected colour
    const images = selectedColorOption?.images?.length
        ? selectedColorOption.images
        : selectedColorOption?.image
            ? [selectedColorOption.image]
            : product?.images?.length
                ? product.images
                : product?.image
                    ? [product.image]
                    : [];

    // Reset image when colour changes
    useEffect(() => {
        setActiveImage(0);
    }, [selectedColor, id]);

    // Automatically slide images every 3 seconds
    useEffect(() => {
        if (images.length <= 1) return;

        const timer = setInterval(() => {
            setActiveImage((previous) =>
                (previous + 1) % images.length
            );
        }, 3000);

        return () => clearInterval(timer);
    }, [images.length, id, selectedColor]);

    // Next image
    const nextImage = () => {
        setActiveImage((previous) =>
            (previous + 1) % images.length
        );
    };

    // Previous image
    const previousImage = () => {
        setActiveImage((previous) =>
            (previous - 1 + images.length) % images.length
        );
    };

    // Add product to cart
    const handleAddToCart = async () => {
        try {
            const success = await addProduct({
                ...product,
                selectedColor: selectedColorOption?.name || "",
                image: images[activeImage] || product.image
            });

            if (success) {
                showSuccess("Added to Cart!");
            }
        } catch (error) {
            console.error("Unable to add product:", error);
        }
    };
    // Buy now
    const handleBuyNow = async () => {
        if (!user?.id) {
            navigate("/login", {
                state: {
                    from: location.pathname,
                    message: "Please login before buying."
                }
            });
            return;
        }

        try {
            const result = await addProduct(product);

            if (result !== false) {
                navigate("/checkout");
            }
        } catch (error) {
            console.error("Buy Now error:", error);
        }
    };

    // Loading
    if (isLoading) {
        return (
            <h2 className="text-center mt-10">
                Loading product...
            </h2>
        );
    }

    // Error
    if (isError) {
        return (
            <h2 className="text-center mt-10 text-red-600">
                {error.message}
            </h2>
        );
    }

    // Product not found
    if (!product) {
        return (
            <div className="product-not-found">
                <h2>Product Not Found</h2>
                <Link to="/">Back to Home ↗</Link>
            </div>
        );
    }

    return (
        <div className="details-page">

            <Link to="/" className="back-link">
                ← Back to Collection
            </Link>

            <div className="details-container">

                {/* PRODUCT IMAGE GALLERY */}
                <div className="details-image-box">

                    <span className="details-badge">
                        ✦ FEATURED PRODUCT
                    </span>

                    {images.length > 0 ? (
                        <>
                            {/* MAIN PRODUCT IMAGE */}
                            <img
                                key={images[activeImage]}
                                src={images[activeImage]}
                                alt={`${product.title} ${activeImage + 1}`}
                            />

                            {/* PREVIOUS AND NEXT ARROWS */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        className="gallery-arrow gallery-prev"
                                        onClick={previousImage}
                                        aria-label="Previous image"
                                    >
                                        ❮
                                    </button>

                                    <button
                                        type="button"
                                        className="gallery-arrow gallery-next"
                                        onClick={nextImage}
                                        aria-label="Next image"
                                    >
                                        ❯
                                    </button>

                                    <span className="gallery-counter">
                                        {activeImage + 1} / {images.length}
                                    </span>
                                </>
                            )}
                        </>
                    ) : (
                        <p>No product image available</p>
                    )}

                </div>

                {/* IMAGE THUMBNAILS */}
                {images.length > 1 && (
                    <div className="details-thumbnails">

                        {images.map((image, index) => (
                            <button
                                key={index}
                                className={`thumbnail-button ${activeImage === index ? "active" : ""
                                    }`}
                                onClick={() => setActiveImage(index)}
                            >
                                <img
                                    src={image}
                                    alt={`${product.title} thumbnail ${index + 1}`}
                                />
                            </button>
                        ))}

                    </div>
                )}

                {/* PRODUCT INFORMATION */}
                <div className="details-info">

                    <p className="details-category">
                        {product.category}
                    </p>

                    <h1>{product.title}</h1>

                    <p className="details-description">
                        {product.description}
                    </p>

                    {/* OFFER PRICE */}
                    <div className="details-price-box">

                        <div className="details-price-row">

                            <span className="details-offer-price">
                                ₹{(product.price * 0.9).toLocaleString(
                                    "en-IN",
                                    { maximumFractionDigits: 0 }
                                )}
                            </span>

                            <span className="details-original-price">
                                ₹{product.price.toLocaleString("en-IN")}
                            </span>

                            <span className="details-discount">
                                10% OFF
                            </span>

                        </div>

                        <p className="details-savings">
                            You save ₹{(product.price * 0.1).toLocaleString(
                                "en-IN",
                                { maximumFractionDigits: 0 }
                            )}
                        </p>

                    </div>

                    {/* STOCK */}
                    <div className="details-stock">

                        <span
                            className={
                                product.stock > 0
                                    ? "stock-dot available"
                                    : "stock-dot unavailable"
                            }
                        ></span>

                        {product.stock > 0
                            ? `${product.stock} units available`
                            : "Currently unavailable"}

                    </div>

                    {/* COLOUR SELECTION */}
                    {product.colors?.length > 0 && (
                        <div className="details-colors">

                            <h3>Choose Colour</h3>

                            <div className="details-color-list">

                                {product.colors.map((color) => (
                                    <button
                                        key={color.name}
                                        type="button"
                                        title={color.name}
                                        aria-label={color.name}
                                        className={`details-color-swatch ${selectedColorOption?.name === color.name
                                            ? "selected"
                                            : ""
                                            }`}
                                        style={{
                                            backgroundColor: color.hex
                                        }}
                                        onClick={() => {
                                            setSelectedColor(color.name);
                                            setActiveImage(0);
                                        }}
                                    >
                                        {selectedColorOption?.name === color.name && "✓"}
                                    </button>
                                ))}

                            </div>

                            <p className="details-selected-color">
                                Selected Colour:{" "}
                                <strong>
                                    {selectedColorOption?.name}
                                </strong>
                            </p>

                        </div>
                    )}

                    {/* PRODUCT SPECIFICATIONS */}
                    {product.specifications && (
                        <div className="details-specifications">

                            <h3>Product Specifications</h3>

                            {Object.entries(product.specifications).map(
                                ([key, value]) => (
                                    <div
                                        className="details-spec-row"
                                        key={key}
                                    >
                                        <span>{key}</span>
                                        <strong>{value}</strong>
                                    </div>
                                )
                            )}

                        </div>
                    )}

                    <div className="details-divider"></div>

                    {/* BUTTONS */}
                    {product.stock > 0 ? (

                        <div className="details-buttons">

                            <button
                                onClick={handleAddToCart}
                                className="details-cart-button"
                                disabled={isSaving}
                            >
                                {isSaving ? "Adding..." : "Add to Cart ↗"}
                            </button>

                            <button
                                onClick={handleBuyNow}
                                className="details-buy-button"
                                disabled={isSaving}
                            >
                                {isSaving ? "Processing..." : "Buy Now ↗"}
                            </button>

                        </div>

                    ) : (

                        <button
                            disabled
                            className="details-cart-button disabled"
                        >
                            Out of Stock
                        </button>

                    )}

                    <p className="details-note">
                        Quality products. Better everyday experiences.
                    </p>

                </div>

            </div>
            {/* SUCCESS POPUP */}
            <SuccessPopup
                show={showPopup}
                message={popupMessage}
                onClose={closePopup}
            />

        </div>
    );
}

export default ProductDetails;
