
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
           <Route path="/checkout" element={<Checkout />} />
           <Route path="/orders" element={<Orders />} />
        </Route>
      </Routes>
      <Footer/>
    </>
  );
}

export default App;
