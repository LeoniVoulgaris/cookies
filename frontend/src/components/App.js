import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import { CartProvider } from "../context/CartContext";
import Products from "./Products";
import Checkout from "./Checkout";
import PaymentSuccess from "./PaymentSuccess";
import { AuthContextProvider } from "../context/AuthContext";

export default function App() {
  return (
    <AuthContextProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="product/:slug/" element={<Products />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/" element={<Checkout />} />
            <Route path="/checkout/success" element={<PaymentSuccess />} />
            <Route path="/checkout/success/" element={<PaymentSuccess />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthContextProvider>
  );
}
