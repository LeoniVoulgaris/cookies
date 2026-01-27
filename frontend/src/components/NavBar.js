// File: frontend/components/NavBar.jsx
import React from "react";
import {Link} from "react-router-dom";
import {Cookies, Cookie, ShoppingCart, Menu} from "lucide-react";

const NavBar = () => {
  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Cookie className="w-8 h-8 text-red-600" />
              <h1 className="text-red-600">Posted Cookies</h1>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-gray-700 hover:text-red-600 transition-colors">Home</a>
              <a href="#products" className="text-gray-700 hover:text-red-600 transition-colors">Products</a>
              <a href="#about" className="text-gray-700 hover:text-red-600 transition-colors">About</a>
              <a href="#contact" className="text-gray-700 hover:text-red-600 transition-colors">Contact</a>
            </nav>

            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                </button>
                <Link
                to="/signin"
                onClick={() => setShowSignIn(true)}
                className="hidden md:block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setShowSignUp(true)}
                className="hidden md:block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Sign Up
              </Link>
              <button className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default NavBar;
