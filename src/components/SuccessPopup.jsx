import React, { useEffect } from "react";

function SuccessPopup({ show, message, onClose }) {
    const isWishlist = message.includes("Wishlist");

    useEffect(() => {
        if (!show) return;

        const timer = setTimeout(() => {
            onClose();
        }, 2000);

        return () => clearTimeout(timer);
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div className="success-popup-overlay">
            <div className="success-popup">

                {isWishlist ? (
                    <div className="success-heart">
                        <svg viewBox="0 0 52 52">
                            <path
                                className="heart-outline"
                                d="M26 45 C22 41 5 29 5 17 C5 3 22 1 26 15 C30 1 47 3 47 17 C47 29 30 41 26 45 Z"
                                fill="none"
                            />
                        </svg>
                    </div>
                ) : (
                    <div className="success-check">
                        <svg viewBox="0 0 52 52">
                            <circle className="success-circle" cx="26" cy="26" r="24" fill="none" />
                            <path className="success-tick" fill="none" d="M14 27 L22 35 L38 17" />
                        </svg>
                    </div>
                )}

                <h2>Success!</h2>
                <p>{message}</p>

            </div>
        </div>
    );
}

export default SuccessPopup;