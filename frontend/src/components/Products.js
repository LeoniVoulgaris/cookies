// Products.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Cookie, ShoppingCart, Truck, Minus, Plus, ArrowLeft, ArrowRight } from 'lucide-react';
import api from '../api';
import NavBar from './NavBar';
import { useCart } from '../context/CartContext';



export default function Products() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    setError(null);

    api.get(`products_detail/${slug}/`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Product not found or API error.");
        setLoading(false);
      });
  }, [slug]);

  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));

  const handleBack = () => navigate('/');
  const handleProductClick = newSlug => navigate(`/product/${newSlug}/`);
  const handleAddToCart = () => addToCart(product.id, quantity);
  const handleBuyNow = () => console.log(`Buy now: ${quantity} of ${product?.name}`);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Cookie className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl mb-4">{error || "Product not found"}</p>
          <button onClick={handleBack} className="flex items-center gap-2">
            <ArrowLeft /> Back to Home
          </button>
        </div>
      </div>
    );
  }

 return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        < NavBar/>
      </header>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="grid md:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={product.image ? `http://127.0.0.1:8000${product.image}` : "https://via.placeholder.com/600x600?text=No+Image"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-4">
                {product.category && (
                  <span className="inline-block bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm mb-2">
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                  </span>
                )}
                <h2 className="text-3xl lg:text-4xl text-gray-900 mb-2">{product.name}</h2>
              </div>

              <p className="text-gray-600 text-lg mb-6 flex-grow">{product.description}</p>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl text-red-600">${Number(product.price).toFixed(2)}</span>
                  <div className="flex items-center gap-2 text-green-600">
                    <Truck className="w-5 h-5" />
                    <span>In Stock</span>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center rounded-lg border-2 border-gray-300 w-fit">
                  <button
                    onClick={decrementQuantity}
                    className="px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    readOnly
                    className="w-16 text-center border-0 focus:outline-none text-lg"
                  />
                  <button
                    onClick={incrementQuantity}
                    className="px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-white border-2 border-red-600 text-red-600 px-8 py-3 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Buy Now
                </button>
              </div>

              {/* Shipping Info */}
              <div className="flex items-center gap-2 text-gray-600 pt-4 border-t border-gray-200">
                <Truck className="w-5 h-5 text-red-600" />
                <span>Free shipping on all orders</span>
              </div>
            </div>
          </div>

          {/* Similar Products */}
          {product.similar_products && product.similar_products.length > 0 && (
            <div className="border-t border-gray-200 p-6 lg:p-8 bg-red-50">
              <h3 className="text-2xl text-gray-900 mb-6">Similar Products</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {product.similar_products.slice(0, 3).map((similarProduct) => (
                  <button
                    key={similarProduct.id}
                    onClick={() => handleProductClick?.(similarProduct.slug)}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:border-red-600 hover:shadow-md transition-all text-left"
                  >
                    <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={similarProduct.image ? `http://127.0.0.1:8000${similarProduct.image}` : "https://via.placeholder.com/150x150?text=No+Image"}
                        alt={similarProduct.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 truncate">{similarProduct.name}</p>
                      <p className="text-red-600">${Number(similarProduct.price).toFixed(2)}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
