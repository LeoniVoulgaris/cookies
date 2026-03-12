import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, Sparkles } from 'lucide-react';
import { ImageWithFallback } from '../layouts/ImageWithFallback';
import api from '../api';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, openCart } = useCart();

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

  if (loading) return <div className="py-20 text-center text-gray-500">Loading...</div>;
  if (error) return <div className="py-20 text-center text-red-600">{error}</div>;

  const boxes = products.filter(p => p.category === 'box');
  const classics = products.filter(p => p.category === 'classic');
  const limited = products.filter(p => p.category === 'limited');

  return (
    <>
      {/* Cookie Boxes Section */}
      <section id="products" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">Our Cookie Boxes</h2>
            <p className="text-gray-600 text-lg">Handcrafted, gift packaged and posted straight to your door</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {boxes.map((box) => (
              <Link
                key={box.id}
                to={`/product/${box.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-100 block"
              >
                <div className="aspect-square overflow-hidden bg-red-50 relative">
                  <ImageWithFallback
                    src={box.image}
                    alt={box.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    £{Number(box.price).toFixed(2)}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-gray-900 text-xl mb-2">{box.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                    {box.description?.split('\n')[0]}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-red-600 text-sm">Customise your flavours →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Classic Flavours Section */}
      {classics.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h3 className="text-2xl text-gray-900 mb-1">Classic Flavours</h3>
              <p className="text-gray-500 text-sm">Available in our Classic Box and Mixed Box</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {classics.map((cookie) => (
                <Link
                  key={cookie.id}
                  to={`/product/${cookie.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex gap-4 p-4 items-center border border-gray-100"
                >
                  <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg bg-red-50">
                    <ImageWithFallback
                      src={cookie.image}
                      alt={cookie.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h4 className="text-gray-900 mb-1">{cookie.name}</h4>
                    <p className="text-gray-500 text-xs line-clamp-2">{cookie.description?.split('\n')[0]}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Limited Flavours Section */}
      {limited.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-2xl text-gray-900">Limited Flavours</h3>
                  <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Limited Edition
                  </span>
                </div>
                <p className="text-gray-500 text-sm">Available in our Limited Box and Mixed Box</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {limited.map((cookie) => (
                <Link
                  key={cookie.id}
                  to={`/product/${cookie.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex gap-4 p-4 items-center border border-red-100"
                >
                  <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg bg-red-50">
                    <ImageWithFallback
                      src={cookie.image}
                      alt={cookie.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h4 className="text-gray-900 mb-1">{cookie.name}</h4>
                    <p className="text-gray-500 text-xs line-clamp-2">{cookie.description?.split('\n')[0]}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Menu;

