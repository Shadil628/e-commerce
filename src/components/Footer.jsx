
import React from "react";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="site-footer">

            <div className="footer-main">

                <div className="footer-brand">
                    <h2>MY<span>STORE.</span></h2>

                    <p>
                        Discover products that make
                        everyday life extraordinary.
                    </p>
                </div>

                <div className="footer-links">
                    <h3>Explore</h3>
                    <Link to="">Home</Link>
                    <Link to="/products">Products</Link>

                    <Link to="/wishlist">Wishlist</Link>
                </div>

                <div className="footer-links">
                    <h3>Account</h3>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                    <Link to="/orders">My Orders</Link>
                </div>

                <div className="footer-contact">
                    <h3>Stay Connected</h3>
                    <p>Have questions? We'd love to hear from you.</p>
                    <a href="mailto:support@mystore.com">
                        Contact Us ↗
                    </a>
                </div>

            </div>

            <div className="footer-bottom">
                <p>© 2026 MyStore. All rights reserved.</p>
                <p>Designed with creativity ✦</p>
            </div>

        </footer>
    );
}

export default Footer;
