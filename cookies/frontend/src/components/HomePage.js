import React, { Component } from "react";
import ProductPage from "./Products";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

export default class HomePage extends Component {
  render() {
    return (
      <Router>
        <div>
          <h1>Welcome to the Home Page</h1>
          <nav>
            <Link to="/products">Go to Products Page</Link>
          </nav>
          <Routes>
            <Route path="/products" element={<ProductPage />} />
          </Routes>
        </div>
      </Router>
    );
  }
}
