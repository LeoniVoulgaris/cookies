// Products.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Cookie, ShoppingCart, Truck, Minus, Plus, ArrowLeft, ArrowRight, Sparkles, X } from 'lucide-react';
import api from '../api';
import NavBar from './NavBar';
import { useCart } from '../context/CartContext';
import { ImageWithFallback } from '../layouts/ImageWithFallback';

// ----- Box config --------------------------------------------------------
const getBoxConfig = (name) => {
  if (!name) return null;
  if (name.includes('Classic')) {
    return [{ category: 'classic', slots: 6, label: 'Choose your 6 flavours' }];
  }
  if (name.includes('Limited')) {
    return [{ category: 'limited', slots: 6, label: 'Choose your 6 flavours' }];
  }
  if (name.includes('Mixed')) {
    return [
      { category: 'classic', slots: 3, label: '3 classic flavours' },
      { category: 'limited', slots: 3, label: '3 limited flavours' },
    ];
  }
  return null;
};

const buildDefaultSelections = (boxConfig, cookieProducts) => {
  const defaults = {};
  boxConfig.forEach(group => {
    const available = cookieProducts.filter(p => p.category === group.category);
    if (available.length === 0) return;

    const base = Math.floor(group.slots / available.length);
    const remainder = group.slots % available.length;

    available.forEach((cookie, index) => {
      const amount = base + (index < remainder ? 1 : 0);
      defaults[cookie.name] = (defaults[cookie.name] || 0) + amount;
    });
  });
  return defaults;
};

const inferCategory = (product) => {
  if (product.category === 'classic' || product.category === 'limited') return product.category;
  const name = (product.name || '').toLowerCase();
  const limitedHints = ['limited', 'mini eggs', 'cream egg', 'easter', 'lotus'];
  if (limitedHints.some(hint => name.includes(hint))) return 'limited';
  return 'classic';
};

// ----- Flavour picker sub-component -------------------------------------
const FlavourGroup = ({ group, cookieProducts, selections, setSelections, onOpenFlavour }) => {
  const available = cookieProducts.filter(p => p.category === group.category);
  const groupTotal = available.reduce((sum, p) => sum + (selections[p.name] || 0), 0);
  const filled = groupTotal === group.slots;

  const adjust = (name, delta) => {
    const current = selections[name] || 0;
    const next = Math.max(0, current + delta);
    if (delta > 0 && groupTotal >= group.slots) return;
    setSelections(prev => ({ ...prev, [name]: next }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-gray-800">
          {group.label}
          {group.category === 'limited' && (
            <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Limited</span>
          )}
        </h4>
        <span className={`text-sm font-medium ${filled ? 'text-green-600' : 'text-gray-400'}`}>
          {groupTotal}/{group.slots} {filled ? '✓' : ''}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {available.map(cookie => {
          const count = selections[cookie.name] || 0;
          return (
            <div
              key={cookie.id}
              role="button"
              tabIndex={0}
              onClick={() => onOpenFlavour(cookie)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpenFlavour(cookie);
                }
              }}
              className={`cursor-pointer flex items-center gap-3 p-3 rounded-xl border transition-colors ${count > 0 ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'}`}
            >
              <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                {cookie.image
                  ? <img src={cookie.image} alt={cookie.name} className="w-full h-full object-contain p-1 bg-white" />
                  : <Cookie className="w-8 h-8 text-red-300 m-2" />}
              </div>
              <span className="flex-1 text-sm text-gray-800 leading-tight">{cookie.name}</span>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    adjust(cookie.name, -1);
                  }}
                  className="p-1 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-30"
                  disabled={count === 0}
                >
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
                <span className="w-6 text-center text-sm font-medium text-gray-900">{count}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    adjust(cookie.name, 1);
                  }}
                  className="p-1 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-30"
                  disabled={groupTotal >= group.slots}
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ----- Main component ---------------------------------------------------
export default function Products() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selections, setSelections] = useState({});
  const [cookieProducts, setCookieProducts] = useState([]);
  const [selectedFlavour, setSelectedFlavour] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    setSelections({});
    setSelectedFlavour(null);
    api.get(`products_detail/${slug}/`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Product not found or API error.');
        setLoading(false);
      });
  }, [slug]);

  // Fetch all cookies when this is a box product
  useEffect(() => {
    if (product?.category === 'box') {
      api.get('products/').then(res => {
        const cookiesOnly = res.data
          .filter(p => {
            const explicitBox = p.category === 'box';
            const nameLooksLikeBox = (p.name || '').toLowerCase().includes('box');
            return !explicitBox && !nameLooksLikeBox;
          })
          .map(p => ({ ...p, category: inferCategory(p) }));
        setCookieProducts(cookiesOnly);
      });
    }
  }, [product]);

  const boxConfig = product ? getBoxConfig(product.name) : null;

  useEffect(() => {
    if (product?.category !== 'box' || !boxConfig || cookieProducts.length === 0) return;
    const hasUserSelection = Object.values(selections).some(qty => qty > 0);
    if (hasUserSelection) return;
    setSelections(buildDefaultSelections(boxConfig, cookieProducts));
  }, [product, boxConfig, cookieProducts, selections]);

  const allGroupsFilled = !boxConfig || boxConfig.every(group => {
    const available = cookieProducts.filter(p => p.category === group.category);
    if (available.length === 0) return true;
    return available.reduce((sum, p) => sum + (selections[p.name] || 0), 0) === group.slots;
  });

  const buildCustomisation = () => ({
    flavours: Object.fromEntries(Object.entries(selections).filter(([, qty]) => qty > 0)),
  });

  const getBoxCustomisation = () => {
    const existing = buildCustomisation();
    if (Object.keys(existing.flavours).length > 0) return existing;
    const defaults = boxConfig ? buildDefaultSelections(boxConfig, cookieProducts) : {};
    return { flavours: defaults };
  };

  const handleAddToCart = () => {
    addToCart(product.id, quantity, product.category === 'box' ? getBoxCustomisation() : null);
  };
  const handleBuyNow = () => {
    addToCart(product.id, quantity, product.category === 'box' ? getBoxCustomisation() : null);
    openCart();
  };

  const handleProductClick = newSlug => navigate(`/product/${newSlug}/`);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Cookie className="w-12 h-12 text-red-600 animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl mb-4">{error || 'Product not found'}</p>
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <ArrowLeft /> Back to Home
          </button>
        </div>
      </div>
    );
  }

  const isBox = product.category === 'box';
  const isCookie = product.category === 'classic' || product.category === 'limited';
  const productImageClass = isBox ? 'w-full h-full object-cover' : 'w-full h-full object-contain p-4 bg-white';

  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
          <div className="grid md:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Image */}
            <div className="relative">
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className={productImageClass}
                />
              </div>
              {product.category === 'limited' && (
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Limited Edition
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <h2 className="text-3xl lg:text-4xl text-gray-900 mb-3">{product.name}</h2>

              {isBox && (
                <p className="text-4xl text-red-600 mb-4">£{Number(product.price).toFixed(2)}</p>
              )}

              <div className="text-gray-600 text-sm leading-relaxed mb-6 whitespace-pre-line flex-grow">
                {product.description}
              </div>

              {isBox && (
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                  <Truck className="w-4 h-4 text-red-600" />
                  Collection available from SE23 and SW2
                </div>
              )}

              {isCookie && (
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <p className="text-gray-500 text-sm mb-3">Available in our cookie boxes:</p>
                  <div className="flex gap-2 flex-wrap">
                    {(product.category === 'classic' || product.category === 'limited') && (
                      <>
                        {product.category === 'classic' && (
                          <>
                            <Link to="/product/classic-cookie-box" className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full hover:bg-red-100 transition-colors">Classic Cookie Box</Link>
                            <Link to="/product/mixed-cookie-box" className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full hover:bg-red-100 transition-colors">Mixed Cookie Box</Link>
                          </>
                        )}
                        {product.category === 'limited' && (
                          <>
                            <Link to="/product/limited-cookie-box" className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full hover:bg-red-100 transition-colors">Limited Cookie Box</Link>
                            <Link to="/product/mixed-cookie-box" className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full hover:bg-red-100 transition-colors">Mixed Cookie Box</Link>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Box-only: quantity + add to cart */}
              {isBox && (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm mb-2">Quantity</label>
                    <div className="flex items-center rounded-lg border-2 border-gray-200 w-fit">
                      <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 text-gray-600 hover:text-red-600 transition-colors">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center">{quantity}</span>
                      <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-2 text-gray-600 hover:text-red-600 transition-colors">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={!allGroupsFilled}
                      className="flex-1 bg-white border-2 border-red-600 text-red-600 px-6 py-3 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-5 h-5" /> Add to Cart
                    </button>
                    <button
                      onClick={handleBuyNow}
                      disabled={!allGroupsFilled}
                      className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Buy Now
                    </button>
                  </div>
                  {!allGroupsFilled && (
                    <p className="text-gray-400 text-xs mt-2 text-center">Select all your flavours below to add to cart</p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Flavour Picker — boxes only */}
          {isBox && boxConfig && cookieProducts.length > 0 && (
            <div className="border-t border-gray-200 p-6 lg:p-8">
              <h3 className="text-xl text-gray-900 mb-6">Customise Your Box</h3>
              <div className="space-y-8">
                {boxConfig.map(group => (
                  <FlavourGroup
                    key={group.category}
                    group={group}
                    cookieProducts={cookieProducts}
                    selections={selections}
                    setSelections={setSelections}
                    onOpenFlavour={setSelectedFlavour}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Similar products */}
          {product.similar_products && product.similar_products.length > 0 && (
            <div className="border-t border-gray-200 p-6 lg:p-8 bg-red-50">
              <h3 className="text-xl text-gray-900 mb-4">
                {isBox ? 'Our Other Boxes' : 'Other Flavours'}
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {product.similar_products.slice(0, 3).map(similar => (
                  <button
                    key={similar.id}
                    onClick={() => handleProductClick(similar.slug)}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:border-red-600 hover:shadow-md transition-all text-left"
                  >
                    <div className="w-14 h-14 flex-shrink-0 overflow-hidden rounded-md border border-gray-100">
                      <ImageWithFallback
                        src={similar.image}
                        alt={similar.name}
                        className={`w-full h-full ${similar.category === 'box' ? 'object-cover' : 'object-contain p-1 bg-white'}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 text-sm truncate">{similar.name}</p>
                      {similar.price > 0 && <p className="text-red-600 text-sm">£{Number(similar.price).toFixed(2)}</p>}
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedFlavour && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-[1px] flex items-end sm:items-center justify-center px-0 sm:px-4"
          onClick={() => setSelectedFlavour(null)}
        >
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl max-w-5xl w-full max-h-[90dvh] shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-gray-900 text-lg sm:text-2xl pr-3">{selectedFlavour.name}</h3>
              <button
                type="button"
                onClick={() => setSelectedFlavour(null)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close flavour details"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="grid md:grid-cols-[1.2fr_1fr] gap-4 sm:gap-6 p-4 sm:p-6 overflow-y-auto">
              <div className="aspect-[5/4] sm:aspect-[4/3] md:aspect-[5/4] rounded-xl overflow-hidden bg-gray-100">
                <ImageWithFallback
                  src={selectedFlavour.image}
                  alt={selectedFlavour.name}
                  className="w-full h-full object-contain p-3 bg-white"
                />
              </div>
              <div className="flex flex-col">
                <p className="text-gray-600 text-sm sm:text-base whitespace-pre-line leading-relaxed flex-grow">
                  {selectedFlavour.description || 'No flavour notes available yet.'}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedFlavour(null)}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors w-full sm:w-fit"
                >
                  Continue Customising
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
