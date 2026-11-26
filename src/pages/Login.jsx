
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Link,
    useNavigate,
    useLocation
} from "react-router-dom";

import { loginUser } from "../redux/slices/authSlice";
import "./css/Login.css";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { loading, error } = useSelector(
        (state) => state.auth
    );

    const [showPassword, setShowPassword] = useState(false);

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await dispatch(loginUser(form));

        if (loginUser.fulfilled.match(result)) {
            const redirectTo = location.state?.from || "/";
            navigate(redirectTo, { replace: true });
        }
    };

    return (
        <div className="login-page">

            <div className="login-card">

                {/* LEFT WELCOME SECTION */}

                <section className="login-welcome">

                    <div className="login-brand">
                        <Link to="/">
                            MY<span>STORE.</span>
                        </Link>
                    </div>

                    <div className="welcome-content">

                        <p className="welcome-label">
                            WELCOME
                        </p>

                        <h1>
                            YOUR SHOPPING
                            <br />
                            STARTS HERE.
                        </h1>

                        <p className="welcome-description">
                            Discover products you love and enjoy
                            a simple, smooth and comfortable
                            shopping experience with MY STORE.
                        </p>

                    </div>

                    <div className="welcome-footer">
                        YOUR STYLE. YOUR STORE.
                    </div>

                    {/* DECORATIVE CIRCLES */}

                    <div className="circle circle-one"></div>
                    <div className="circle circle-two"></div>
                    <div className="circle circle-three"></div>

                </section>


                {/* RIGHT LOGIN SECTION */}

                <section className="login-form-section">

                    <div className="login-form-container">

                        <div className="login-heading">

                            <h2>Sign In</h2>

                            <p>
                                Welcome back! Please enter your details.
                            </p>

                        </div>


                        {/* REDIRECT MESSAGE */}

                        {location.state?.message && (
                            <div className="login-notice">
                                {location.state.message}
                            </div>
                        )}


                        <form onSubmit={handleSubmit}>

                            {/* EMAIL */}

                            <div className="login-input-group">

                                <label htmlFor="email">
                                    Email Address
                                </label>

                                <div className="login-input-wrapper">

                                    <span className="input-icon">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                        >
                                            <rect
                                                x="3"
                                                y="5"
                                                width="18"
                                                height="14"
                                                rx="2"
                                            />
                                            <path d="m3 7 9 6 9-6" />
                                        </svg>
                                    </span>

                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        autoComplete="email"
                                        required
                                    />

                                </div>

                            </div>


                            {/* PASSWORD */}

                            <div className="login-input-group">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <div className="login-input-wrapper">

                                    <span className="input-icon">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                        >
                                            <rect
                                                x="4"
                                                y="10"
                                                width="16"
                                                height="11"
                                                rx="2"
                                            />
                                            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                                            <path d="M12 14v3" />
                                        </svg>
                                    </span>

                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? "HIDE" : "SHOW"}
                                    </button>

                                </div>

                            </div>


                            {/* ERROR MESSAGE */}

                            {error && (
                                <div className="login-error">
                                    {error}
                                </div>
                            )}


                            {/* LOGIN BUTTON */}

                            <button
                                type="submit"
                                className="login-submit-button"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="login-spinner"></span>
                                        Signing in...
                                    </>
                                ) : (
                                    "SIGN IN"
                                )}
                            </button>

                        </form>


                        {/* REGISTER */}

                        <div className="login-register">

                            <p>
                                Don't have an account?

                                <Link to="/register">
                                    Create Account
                                </Link>
                            </p>

                        </div>


                        <Link to="/" className="login-back-home">
                            ← Back to Home
                        </Link>

                    </div>

                </section>

            </div>

        </div>
    );
}

export default Login;
