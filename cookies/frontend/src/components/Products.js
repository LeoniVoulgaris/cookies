import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import NavBar from "./NavBar";
import Button from "../layouts/Button";

const ProductsDetailPage = () => {
  // Get the slug from the URL params
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.get(`products_detail/${slug}`)
      .then(res => {
        console.log("API Response:", res.data);
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("API Error:", err);
        setError("Product not found or API error.");
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;
  if (!product) return null;

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div id="webcrumbs">
          <div className="relative max-w-4xl mx-auto overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all duration-300 hover:shadow-xl md:flex md:max-w-6xl lg:max-w-7xl">


            {/* Image container - simple product image */}
            <div className="relative md:w-2/5 lg:w-1/3">
              <div className="relative h-64 overflow-hidden bg-gray-100 md:h-full">
                <img
                  src={product.image ? `http://127.0.0.1:8000${product.image}` : "https://via.placeholder.com/300x300?text=No+Image"}
                  alt={product.name}
                  className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-110"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col md:w-3/5 lg:w-2/3">
              <div className="p-4 md:p-6 lg:p-8">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-primary-600">{product.category && product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>

                </div>

                <h3 className="mb-2 text-xl font-semibold tracking-tight text-gray-900 hover:text-primary-600 md:text-2xl lg:text-3xl">
                  {product.name}
                </h3>

                <div className="mb-4">
                  <p className="text-sm text-gray-500 md:text-base lg:w-5/6">
                    {product.description}
                  </p>

                  {product.category && (
                    <div className="mt-2">


                    </div>
                  )}
                </div>

                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900 md:text-3xl">${product.price}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 md:text-base">
                    <span className="material-symbols-outlined mr-1 text-sm text-green-500 md:text-base">inventory</span>
                    In Stock
                  </div>
                </div>

                {/* Add to cart section */}
                <div className="mb-5 md:flex md:items-center md:gap-8">

                  <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:space-x-3 md:w-auto md:flex-1">
                    <div className="flex items-center rounded-lg border border-gray-300">
                      <button
                        className="px-2 py-1 text-gray-600 hover:text-primary-600 md:px-3 md:py-2"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <span className="material-symbols-outlined text-xl">remove</span>
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        className="w-10 border-0 text-center focus:outline-none focus:ring-0 md:w-16"
                        readOnly
                      />
                      <button
                        className="px-2 py-1 text-gray-600 hover:text-primary-600 md:px-3 md:py-2"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <span className="material-symbols-outlined text-xl">add</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Buttons container - centered and spaced */}
                <div className="flex justify-center space-x-24 mt-8 mb-4">
                  <Button
                    title="Add to Cart"
                    onClick={() => {
                      // Here you would implement the actual cart functionality
                    }}
                  />
                  <Button
                    title="Buy Now"
                    onClick={() => {
                    }}
                  />
                </div>

                {/* Extra info */}
                <div className="mt-4 flex flex-wrap items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500 md:text-sm lg:w-3/4">
                  <div className="flex items-center">
                    <span className="material-symbols-outlined mr-1 text-xs md:text-sm">local_shipping</span>
                    Free shipping
                  </div>
                </div>
              </div>
            </div>
          </div>



          {/* Recently Viewed */}
          <div className="border-t border-gray-200 p-4 md:p-6">
            <h4 className="mb-3 text-sm font-semibold text-gray-800 md:text-base">Similar products</h4>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {product.similar_products && product.similar_products.slice(0, 3).map((similarProduct) => (
                <div key={`recent-${similarProduct.id}`} className="flex items-center space-x-3 rounded-lg border border-gray-100 p-2 transition-all hover:border-gray-200 hover:shadow-sm">
                  <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 md:h-16 md:w-16">
                    <img
                      src={similarProduct.image ? `http://127.0.0.1:8000${similarProduct.image}` : "https://via.placeholder.com/150x150?text=No+Image"}
                      alt={similarProduct.name}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium line-clamp-1 md:text-sm">{similarProduct.name}</p>
                    <p className="text-xs font-semibold text-primary-600 md:text-sm">${similarProduct.price}</p>

                  </div>
                  <Link to={`/product/${similarProduct.slug}`} className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-primary-600">
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsDetailPage;
