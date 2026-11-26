
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
    loginUser,
    registerUser
} from "../redux/slices/authSlice";

import "./css/AuthPage.css";

function AuthPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const isRegister = location.pathname === "/register";

    const { loading, error } = useSelector(
        (state) => state.auth
    );

    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);

    const [loginForm, setLoginForm] = useState({
        email: "",
        password: ""
    });

    const [registerForm, setRegisterForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [validationError, setValidationError] = useState("");

    const handleLoginChange = (e) => {
        setLoginForm({
            ...loginForm,
            [e.target.name]: e.target.value
        });
    };

    const handleRegisterChange = (e) => {
        setRegisterForm({
            ...registerForm,
            [e.target.name]: e.target.value
        });

        setValidationError("");
    };

    // LOGIN
    const handleLogin = async (e) => {
        e.preventDefault();

        const result = await dispatch(loginUser(loginForm));

        if (loginUser.fulfilled.match(result)) {
            const redirectTo = location.state?.from || "/";
            navigate(redirectTo, { replace: true });
        }
    };

    // REGISTER
    const handleRegister = async (e) => {
        e.preventDefault();

        if (
            !registerForm.name.trim() ||
            !registerForm.email.trim() ||
            !registerForm.password.trim()
        ) {
            setValidationError("Please fill in all fields.");
            return;
        }

        if (registerForm.password.length < 6) {
            setValidationError(
                "Password must contain at least 6 characters."
            );
            return;
        }

        const result = await dispatch(registerUser(registerForm));

        if (registerUser.fulfilled.match(result)) {
            setLoginForm({
                email: registerForm.email,
                password: ""
            });

            setValidationError("");

            navigate("/login", {
                state: {
                    message: "Registration successful! Please sign in."
                }
            });
        }
    };

    return (
        <div className={`auth-page ${isRegister ? "register-active" : ""}`}>

            <div className="auth-card">

                {/* LOGIN FORM - LEFT */}

                <section className="auth-form-panel auth-login-panel">

                    <div className="auth-form-content">

                        <Link to="/" className="auth-mobile-logo">
                            MY<span>STORE.</span>
                        </Link>

                        <p className="auth-eyebrow">WELCOME BACK</p>

                        <h2>Sign In</h2>

                        <p className="auth-subtitle">
                            Welcome back! Please enter your details.
                        </p>

                        {location.state?.message && !isRegister && (
                            <div className="auth-success">
                                {location.state.message}
                            </div>
                        )}

                        <form onSubmit={handleLogin}>

                            <div className="auth-input-group">
                                <label>Email Address</label>

                                <input
                                    type="email"
                                    name="email"
                                    value={loginForm.email}
                                    onChange={handleLoginChange}
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    required
                                />
                            </div>

                            <div className="auth-input-group">
                                <label>Password</label>

                                <div className="auth-password-field">
                                    <input
                                        type={
                                            showLoginPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        value={loginForm.password}
                                        onChange={handleLoginChange}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowLoginPassword(!showLoginPassword)
                                        }
                                    >
                                        {showLoginPassword ? "HIDE" : "SHOW"}
                                    </button>
                                </div>
                            </div>

                            {error && !isRegister && (
                                <div className="auth-error">{error}</div>
                            )}

                            <button
                                type="submit"
                                className="auth-submit"
                                disabled={loading}
                            >
                                {loading ? "SIGNING IN..." : "SIGN IN"}
                            </button>

                        </form>

                        <p className="auth-mobile-switch">
                            Don't have an account?{" "}
                            <Link to="/register">Sign Up</Link>
                        </p>

                    </div>

                </section>


                {/* REGISTER FORM - RIGHT */}

                <section className="auth-form-panel auth-register-panel">

                    <div className="auth-form-content">

                        <Link to="/" className="auth-mobile-logo">
                            MY<span>STORE.</span>
                        </Link>

                        <p className="auth-eyebrow">JOIN MY STORE</p>

                        <h2>Create Account</h2>

                        <p className="auth-subtitle">
                            Enter your details to get started.
                        </p>

                        <form onSubmit={handleRegister}>

                            <div className="auth-input-group">
                                <label>Full Name</label>

                                <input
                                    type="text"
                                    name="name"
                                    value={registerForm.name}
                                    onChange={handleRegisterChange}
                                    placeholder="Enter your full name"
                                    autoComplete="name"
                                    required
                                />
                            </div>

                            <div className="auth-input-group">
                                <label>Email Address</label>

                                <input
                                    type="email"
                                    name="email"
                                    value={registerForm.email}
                                    onChange={handleRegisterChange}
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    required
                                />
                            </div>

                            <div className="auth-input-group">
                                <label>Password</label>

                                <div className="auth-password-field">
                                    <input
                                        type={
                                            showRegisterPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        value={registerForm.password}
                                        onChange={handleRegisterChange}
                                        placeholder="Create a password"
                                        autoComplete="new-password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowRegisterPassword(!showRegisterPassword)
                                        }
                                    >
                                        {showRegisterPassword ? "HIDE" : "SHOW"}
                                    </button>
                                </div>
                            </div>

                            {(validationError || (error && isRegister)) && (
                                <div className="auth-error">
                                    {validationError || error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="auth-submit"
                                disabled={loading}
                            >
                                {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                            </button>

                        </form>

                        <p className="auth-mobile-switch">
                            Already have an account?{" "}
                            <Link to="/login">Sign In</Link>
                        </p>

                    </div>

                </section>


                {/* SLIDING GREEN OVERLAY */}

                <div className="auth-overlay">

                    <div className="auth-overlay-panel">

                        <Link to="/" className="auth-overlay-logo">
                            MY<span>STORE.</span>
                        </Link>

                        {!isRegister ? (
                            <div className="auth-overlay-content">
                                <p>NEW TO MY STORE?</p>

                                <h1>
                                    CREATE YOUR
                                    <br />
                                    ACCOUNT.
                                </h1>

                                <span>
                                    Join us and discover a better
                                    shopping experience.
                                </span>

                                <button
                                    type="button"
                                    onClick={() => navigate("/register")}
                                >
                                    SIGN UP
                                </button>
                            </div>
                        ) : (
                            <div className="auth-overlay-content">
                                <p>ALREADY A MEMBER?</p>

                                <h1>
                                    WELCOME
                                    <br />
                                    BACK.
                                </h1>

                                <span>
                                    Sign in to continue your shopping
                                    journey with us.
                                </span>

                                <button
                                    type="button"
                                    onClick={() => navigate("/login")}
                                >
                                    SIGN IN
                                </button>
                            </div>
                        )}

                        <div className="auth-overlay-footer">
                            YOUR STYLE. YOUR STORE.
                        </div>

                        <div className="auth-decoration auth-decoration-one"></div>
                        <div className="auth-decoration auth-decoration-two"></div>
                        <div className="auth-decoration auth-decoration-three"></div>

                    </div>

                </div>

            </div>

            <Link to="/" className="auth-home-link">
                ← Back to Home
            </Link>

        </div>
    );
}

export default AuthPage;
