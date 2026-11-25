
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../redux/slices/authSlice";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector(
    (state) => state.auth
  );

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    const result = await dispatch(registerUser(form));

    if (registerUser.fulfilled.match(result)) {
      alert("Registration successful!");
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
          Create Account
        </h1>

        <label className="block mb-2">Full Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter your name"
          className="w-full border border-[#CBCBCB] p-3 rounded-lg mb-4"
        />

        <label className="block mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className="w-full border border-[#CBCBCB] p-3 rounded-lg mb-4"
        />

        <label className="block mb-2">Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
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
          {loading ? "Creating Account..." : "Register"}
        </button>

        <p className="text-center mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-[#174D38] font-bold">
            Login
          </Link>
        </p>

      </form>
    </div>
  );
}

export default Register;
