import React from "react";
import { Link } from "react-scroll";
import { Cookie } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Cookie className="w-6 h-6 text-red-600" />
                <span>Posted Cookies</span>
              </div>
              <p className="text-gray-400">Delivering happiness, one cookie at a time.</p>
            </div>
            <div>
              <h4 className="mb-4">Shop</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-red-600 transition-colors">All Products</a></li>
                <li><a href="#" className="hover:text-red-600 transition-colors">Best Sellers</a></li>
                <li><a href="#" className="hover:text-red-600 transition-colors">Gift Boxes</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-red-600 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-red-600 transition-colors">Our Story</a></li>
                <li><a href="#" className="hover:text-red-600 transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-red-600 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-red-600 transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-red-600 transition-colors">Shipping</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Posted Cookies. All rights reserved.</p>
          </div>
        </div>
      </footer>
  );
};

export default Footer;