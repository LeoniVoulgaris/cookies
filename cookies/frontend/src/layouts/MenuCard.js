import React from "react";
import Button from "../layouts/Button";

const MenuCard = ({ products = [] }) => {
  const fallbackImg = "https://via.placeholder.com/300x200?text=No+Image";
  const getImageUrl = (product) => {
    if (product.img) return product.img;
    if (product.image) {
      // If image path starts with /media/, prepend host
      if (product.image.startsWith('/media/')) {
        return `http://127.0.0.1:8000${product.image}`;
      }
      return product.image;
    }
    return fallbackImg;
  };
  return (

    <div className="shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-lg bg-slate-50">
      <div className="container px-4 px-lg-5 mt-5">
        <div className="flex flex-row flex-wrap gap-4 justify-center">
          {products.length > 0 ? (
            products.map((product) => (
              <div className="card mb-4 hover:scale-95 transition duration-300 ease-in-out cursor-pointer" style={{ minWidth: '300px', maxWidth: '320px' }} key={product.id}>
                <img
                  className="card-img-top"
                  src={getImageUrl(product)}
                  alt={product.title || product.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.title || product.name}</h5>
                  <p className="card-text">${product.price}</p>
                  <Button title="Order Now" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center w-100">No products available.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuCard;