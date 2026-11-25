
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../redux/slices/authSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector(
    (state) => state.auth
  );

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
      alert("Login successful!");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] flex items-center justify-center p-5">

      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg"
      >

        <h1 className="text-3xl font-bold text-[#174D38] text-center mb-6">
          Welcome Back
        </h1>

        <label className="block mb-2">Email</label>

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
          className="w-full border border-[#CBCBCB] p-3 rounded-lg mb-4"
        />

        <label className="block mb-2">Password</label>

        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
          className="w-full border border-[#CBCBCB] p-3 rounded-lg mb-5"
        />

        {error && (
          <p className="text-red-600 mb-4">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#174D38] text-white py-3 rounded-lg hover:bg-[#103b2b] disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center mt-5">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#174D38] font-bold">
            Register
          </Link>
        </p>

      </form>
    </div>
  );
}

export default Login;
