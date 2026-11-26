
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";

import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

function App() {

  const location = useLocation();

  // Hide Navbar and Footer on Login and Register pages
  const hideLayout = ["/login", "/register"].includes(
    location.pathname
  );

  return (
    <>
      <ScrollToTop />

      {/* Navbar */}
      {!hideLayout && <Navbar />}

      <Routes>

        <Route path="/" element={<Home />} />

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/wishlist"
            element={<Wishlist />}
          />

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          <Route
            path="/orders"
            element={<Orders />}
          />
        </Route>

      </Routes>

      {/* Footer */}
      {!hideLayout && <Footer />}

    </>
  );
}

export default App;
