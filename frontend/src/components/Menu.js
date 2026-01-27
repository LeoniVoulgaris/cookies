import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { ImageWithFallback } from '../layouts/ImageWithFallback';
import api from '../api';
import { Link } from 'react-router-dom';

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('products/')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load products.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section id="products" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl text-gray-900 mb-4">Our Signature Collection</h2>
          <p className="text-gray-600 text-lg">Handcrafted with premium ingredients and baked to perfection</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.slug}`}
              className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow block"
            >
              <div className="aspect-square overflow-hidden">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div className="p-6">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(product.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-red-600 text-red-600" />
                  ))}
                </div>

                <h3 className="text-gray-900 mb-2">{product.name}</h3>

                <div className="flex justify-between items-center">
                  <span className="text-red-600">{product.price}</span>

                  <button
                    onClick={(e) => e.preventDefault()}
                    className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Menu;
