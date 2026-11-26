
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../redux/slices/authSlice";

import "./css/Login.css";
import "./css/Register.css";

function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error } = useSelector(
        (state) => state.auth
    );

    const [showPassword, setShowPassword] = useState(false);
    const [validationError, setValidationError] = useState("");

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

        setValidationError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !form.name.trim() ||
            !form.email.trim() ||
            !form.password.trim()
        ) {
            setValidationError("Please fill in all fields.");
            return;
        }

        if (form.password.length < 6) {
            setValidationError(
                "Password must contain at least 6 characters."
            );
            return;
        }

        const result = await dispatch(registerUser(form));

        if (registerUser.fulfilled.match(result)) {
            navigate("/login", {
                state: {
                    message: "Registration successful! Please sign in."
                }
            });
        }
    };

    return (
        <div className="login-page register-page">

            <div className="login-card register-card">

                {/* LEFT WELCOME SECTION */}

                <section className="login-welcome">

                    <div className="login-brand">
                        <Link to="/">
                            MY<span>STORE.</span>
                        </Link>
                    </div>

                    <div className="welcome-content">

                        <p className="welcome-label">
                            JOIN US
                        </p>

                        <h1>
                            CREATE YOUR
                            <br />
                            OWN ACCOUNT.
                        </h1>

                        <p className="welcome-description">
                            Become a part of MY STORE and discover
                            a better shopping experience. Create
                            your account and start exploring today.
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


                {/* RIGHT REGISTER SECTION */}

                <section className="login-form-section register-form-section">

                    <div className="login-form-container">

                        <div className="login-heading">

                            <h2>Create Account</h2>

                            <p>
                                Enter your details to get started.
                            </p>

                        </div>


                        <form onSubmit={handleSubmit}>

                            {/* FULL NAME */}

                            <div className="login-input-group">

                                <label htmlFor="register-name">
                                    Full Name
                                </label>

                                <div className="login-input-wrapper">

                                    <span className="input-icon">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                        >
                                            <circle cx="12" cy="8" r="4" />
                                            <path d="M4 21a8 8 0 0 1 16 0" />
                                        </svg>
                                    </span>

                                    <input
                                        id="register-name"
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        autoComplete="name"
                                        required
                                    />

                                </div>

                            </div>


                            {/* EMAIL */}

                            <div className="login-input-group">

                                <label htmlFor="register-email">
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
                                        id="register-email"
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

                                <label htmlFor="register-password">
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
                                        id="register-password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="Create a password"
                                        autoComplete="new-password"
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

                            {(validationError || error) && (
                                <div className="login-error">
                                    {validationError || error}
                                </div>
                            )}


                            {/* REGISTER BUTTON */}

                            <button
                                type="submit"
                                className="login-submit-button register-submit-button"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="login-spinner"></span>
                                        Creating Account...
                                    </>
                                ) : (
                                    "CREATE ACCOUNT"
                                )}
                            </button>

                        </form>


                        {/* LOGIN LINK */}

                        <div className="login-register">

                            <p>
                                Already have an account?

                                <Link to="/login">
                                    Sign In
                                </Link>
                            </p>

                        </div>


                        {/* HOME LINK */}

                        <Link
                            to="/"
                            className="login-back-home"
                        >
                            ← Back to Home
                        </Link>

                    </div>

                </section>

            </div>

        </div>
    );
}

export default Register;
