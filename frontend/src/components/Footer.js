import React from "react";
import logo from "../assets/img/logo.png";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Posted Cookies" className="h-12 w-auto" />
            <p className="text-gray-300 text-sm">Delivering happiness, one cookie at a time.</p>
          </div>
          <p className="text-gray-400 text-sm">&copy; 2024 Posted Cookies. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;