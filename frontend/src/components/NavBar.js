// File: frontend/components/NavBar.jsx
import React, { useState } from "react";
import { ShoppingCart, Menu as MenuIcon, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.png";

const NavBar = () => {
  const { cart, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const totalItems = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

  const scrollToSection = (id) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollTo: id } });
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-1 min-h-[80px]">
            <div className="flex items-center">
              <img src={logo} alt="Posted Cookies" className="h-18 w-auto" />
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-red-600 transition-colors">Home</button>
              <button onClick={() => scrollToSection('products')} className="text-gray-700 hover:text-red-600 transition-colors">Shop</button>
              <button onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-red-600 transition-colors">About</button>
              <button onClick={() => scrollToSection('faqs')} className="text-gray-700 hover:text-red-600 transition-colors">FAQs</button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-red-600 transition-colors">Contact</button>
            </nav>

            <div className="flex items-center gap-4">
              <button
                onClick={openCart}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Open cart"
              >
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileOpen(o => !o)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Toggle mobile menu"
              >
                {mobileOpen
                  ? <X className="w-6 h-6 text-gray-700" />
                  : <MenuIcon className="w-6 h-6 text-gray-700" />
                }
              </button>
            </div>
          </div>

          {mobileOpen && (
            <div className="md:hidden border-t border-gray-200 py-4 flex flex-col gap-4 px-2">
              <button onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-red-600 transition-colors text-left">Home</button>
              <button onClick={() => scrollToSection('products')} className="text-gray-700 hover:text-red-600 transition-colors text-left">Shop</button>
              <button onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-red-600 transition-colors text-left">About</button>
              <button onClick={() => scrollToSection('faqs')} className="text-gray-700 hover:text-red-600 transition-colors text-left">FAQs</button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-red-600 transition-colors text-left">Contact</button>
            </div>
          )}
        </div>
      </header>

      <CartDrawer />
    </>
  );
};

export default NavBar;
