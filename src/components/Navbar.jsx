
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import useCart from "../hooks/useCart";

function Navbar() {
    const dispatch = useDispatch();

    const user = useSelector((state) => state.auth.user);

    // Get cart from TanStack Query
    const { cartItems } = useCart();

    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <nav className={`main-navbar ${isScrolled ? "navbar-scrolled" : ""}`}>

            <Link to="/" className="navbar-logo">
                MY<span>STORE.</span>
            </Link>

            <div className="navbar-links">

                <Link to="" className="nav-link">
                    Discover
                </Link>

                <Link to="/products" className="nav-link">Products</Link>
                {user && (
                    <>
                        <Link to="/cart" className="nav-link">
                            Cart ({cartCount})
                        </Link>

                        <Link to="/wishlist" className="nav-link">
                            Wishlist
                        </Link>

                        <Link to="/orders" className="nav-link">
                            Orders
                        </Link>
                    </>
                )}

            </div>

            <div className="navbar-account">

                {user ? (
                    <>
                        <span className="welcome-user">
                            Hi, {user.fullName || user.name}
                        </span>

                        <button
                            onClick={() => dispatch(logout())}
                            className="navbar-button"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>

                        <Link to="/register" className="navbar-button">
                            Get Started ↗
                        </Link>
                    </>
                )}

            </div>

        </nav>
    );
}

export default Navbar;
