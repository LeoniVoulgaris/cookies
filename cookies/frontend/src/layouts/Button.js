import React from "react";

const Button = ({ title, onClick, fullWidth = false, className = "" }) => {
  return (
    <div className={fullWidth ? "w-full" : "text-center"}>
      <button
        onClick={onClick}
        className={`text-black bg-yellow-400 font-semibold px-5 py-2 rounded-md hover:bg-yellow-300 transition duration-200 ease-linear ${fullWidth ? 'w-full' : ''} ${className}`}
      >
        {title}
      </button>
    </div>
  );
};

export default Button;