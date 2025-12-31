import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
import HomePage from "./HomePage";

import Signup from "./Signup";
import Signin from "./Signin";
import Products from "./Products";
import { AuthContextProvider } from "../context/AuthContext";

export default function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="product/:slug" element={<Products />} />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}
