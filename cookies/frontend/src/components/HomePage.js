import React, { Component } from "react";
import ProductPage from "./Products";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

export default class HomePage extends Component {
  render() {
    return (
      <Router>
        {/* Navbar */}
        <header style={styles.header}>
          <h1 style={styles.logo}>Cookie Heaven 🍪</h1>
          <nav>
            <Link to="/" style={styles.navLink}>Home</Link>
            <Link to="/products" style={styles.navLink}>Shop</Link>
          </nav>
        </header>

        {/* Routes */}
        <Routes>
          {/* Home Page */}
          <Route path="/" element={
            <div style={styles.homeContainer}>
              {/* Hero Section */}
              <section style={styles.hero}>
                <h2>Delicious Cookies Delivered to Your Door</h2>
                <p>Freshly baked, handcrafted cookies for every occasion!</p>
                <Link to="/products" style={styles.shopButton}>Shop Now</Link>
              </section>

              {/* Featured Products */}
              <section style={styles.featured}>
                <h3>Featured Cookies</h3>
                <div style={styles.productsGrid}>
                  <div style={styles.productCard}>
                    <img src="https://via.placeholder.com/150" alt="Chocolate Chip" style={styles.productImage}/>
                    <h4>Chocolate Chip</h4>
                    <p>$5.99</p>
                  </div>
                  <div style={styles.productCard}>
                    <img src="https://via.placeholder.com/150" alt="Oatmeal Raisin" style={styles.productImage}/>
                    <h4>Oatmeal Raisin</h4>
                    <p>$6.49</p>
                  </div>
                  <div style={styles.productCard}>
                    <img src="https://via.placeholder.com/150" alt="Sugar Cookie" style={styles.productImage}/>
                    <h4>Sugar Cookie</h4>
                    <p>$5.49</p>
                  </div>
                </div>
              </section>
            </div>
          }/>

          {/* Product Page */}
          <Route path="/products" element={<ProductPage />} />
        </Routes>

        {/* Footer */}
        <footer style={styles.footer}>
          <p>© 2025 Cookie Heaven. All rights reserved.</p>
        </footer>
      </Router>
    );
  }
}

// Simple inline styles (replace with CSS or Tailwind if desired)
const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#f5d6c6"
  },
  logo: { margin: 0 },
  navLink: { marginLeft: "1rem", textDecoration: "none", color: "#333", fontWeight: "bold" },
  homeContainer: { padding: "2rem" },
  hero: { textAlign: "center", marginBottom: "3rem" },
  shopButton: { display: "inline-block", marginTop: "1rem", padding: "0.5rem 1rem", backgroundColor: "#ffb347", color: "#fff", textDecoration: "none", borderRadius: "5px" },
  featured: { textAlign: "center" },
  productsGrid: { display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap", marginTop: "1rem" },
  productCard: { border: "1px solid #ddd", borderRadius: "5px", padding: "1rem", width: "150px" },
  productImage: { width: "100%", borderRadius: "5px" },
  footer: { textAlign: "center", padding: "1rem", backgroundColor: "#f5d6c6", marginTop: "2rem" }
};
