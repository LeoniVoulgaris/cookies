import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Package, CreditCard, Banknote, User, MapPin, FileText } from 'lucide-react';
import NavBar from './NavBar';
import { useCart } from '../context/CartContext';

const PAYMENT_METHODS = [
  { id: 'cash_on_delivery', label: 'Cash on Delivery', Icon: Banknote, available: true },
  { id: 'card', label: 'Credit / Debit Card', Icon: CreditCard, available: true },
];

const inputClass =
  'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 text-sm';
const labelClass = 'block text-sm text-gray-700 mb-1';

const Checkout = () => {
  const { cart, checkout, createStripeSession } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    address: '',
    city: '',
    postal_code: '',
    country: '',
    instructions: '',
    payment_method: 'cash_on_delivery',
  });

  // Handle return from Stripe: /checkout?stripe_success=true&order_id=123
  useEffect(() => {
    const stripeSuccess = searchParams.get('stripe_success');
    const orderId = searchParams.get('order_id');
    if (stripeSuccess === 'true' && orderId) {
      setOrder({ id: orderId, _stripe: true });
    }
  }, [searchParams]);

  const items = cart?.items ?? [];
  const totalPrice = cart?.total_price ?? '0.00';
  const SHIPPING_FEE = 4.45;
  const subtotal = Number(totalPrice);
  const shipping = items.length > 0 ? SHIPPING_FEE : 0;
  const grandTotal = subtotal + shipping;

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handlePlaceOrder = async e => {
    e.preventDefault();
    setPlacing(true);
    setError(null);
    try {
      if (form.payment_method === 'card') {
        const result = await createStripeSession(form);
        if (result?.url) {
          window.location.href = result.url;
        } else {
          setError('Could not start payment. Please try again.');
          setPlacing(false);
        }
      } else {
        const result = await checkout(form);
        if (result) {
          setOrder(result);
        } else {
          setError('Failed to place order. Please try again.');
          setPlacing(false);
        }
      }
    } catch {
      setError('An unexpected error occurred.');
      setPlacing(false);
    }
  };

  if (order) {
    // Returned from Stripe — show a clean payment-confirmed screen
    if (order._stripe) {
      return (
        <div className="min-h-screen bg-white">
          <NavBar />
          <div className="max-w-2xl mx-auto px-4 py-20 text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl text-gray-900 mb-2">Payment Confirmed!</h1>
            <p className="text-gray-600 mb-1">Order #{order.id}</p>
            <p className="text-gray-500 text-sm mb-8">
              Your payment was successful. We'll be in touch with shipping details soon.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      );
    }
    // COD order confirmed
    return (
      <div className="min-h-screen bg-white">
        <NavBar />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-1">Order #{order.id}</p>
          <p className="text-gray-600 mb-1">Hi {order.full_name}, thank you for your order!</p>
          <p className="text-gray-500 text-sm mb-8">We'll be in touch soon at {order.email}.</p>
          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
            <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-red-600" />
              Order Summary
            </h2>
            {(() => {
              const itemSubtotal = order.items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
              const shippingAmount = Math.max(0, Number(order.total_price) - itemSubtotal);
              return (
                <>
            <ul className="divide-y divide-gray-200">
              {order.items.map(item => (
                <li key={item.id} className="py-3 flex justify-between">
                  <span className="text-gray-700">{item.product_name} × {item.quantity}</span>
                  <span className="text-gray-900">£{(Number(item.price) * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between pt-4 text-gray-600">
              <span>Subtotal</span>
              <span>£{itemSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 text-gray-600">
              <span>Shipping</span>
              <span>£{shippingAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-4 border-t border-gray-200 mt-2">
              <span className="text-gray-900 font-medium">Total</span>
              <span className="text-red-600 text-xl">£{Number(order.total_price).toFixed(2)}</span>
            </div>
                </>
              );
            })()}
            <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600 text-left">
              <p>
                <span className="font-medium">Delivery to: </span>
                {order.address}, {order.city} {order.postal_code}, {order.country}
              </p>
              {order.instructions && (
                <p className="mt-1">
                  <span className="font-medium">Instructions: </span>{order.instructions}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to shop
        </button>

        <h1 className="text-3xl text-gray-900 mb-8">Checkout</h1>

        {items.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg mb-4">Your cart is empty.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Shop Now
            </button>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid md:grid-cols-3 gap-8">
            {/* Left column: forms */}
            <div className="md:col-span-2 space-y-6">

              {/* Contact */}
              <section className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-red-600" /> Contact
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <input
                      name="full_name"
                      value={form.full_name}
                      onChange={handleChange}
                      required
                      placeholder="Jane Smith"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </div>
                </div>
              </section>

              {/* Delivery address */}
              <section className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-600" /> Delivery Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Street Address</label>
                    <input
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      placeholder="123 Baker Street"
                      className={inputClass}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>City</label>
                      <input
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        required
                        placeholder="London"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Postal Code</label>
                      <input
                        name="postal_code"
                        value={form.postal_code}
                        onChange={handleChange}
                        required
                        placeholder="SW1A 1AA"
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Country</label>
                    <input
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      required
                      placeholder="United Kingdom"
                      className={inputClass}
                    />
                  </div>
                </div>
              </section>

              {/* Special instructions */}
              <section className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-red-600" /> Special Instructions
                </h2>
                <textarea
                  name="instructions"
                  value={form.instructions}
                  onChange={handleChange}
                  placeholder="Leave at the door, ring bell, allergy notes, etc. (optional)"
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </section>

              {/* Payment method */}
              <section className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-red-600" /> Payment Method
                </h2>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map(({ id, label, Icon, available }) => (
                    <label
                      key={id}
                      className={`flex items-center gap-3 p-4 border rounded-lg transition-colors ${
                        !available
                          ? 'opacity-40 cursor-not-allowed'
                          : form.payment_method === id
                          ? 'border-red-500 bg-red-50 cursor-pointer'
                          : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        value={id}
                        checked={form.payment_method === id}
                        onChange={handleChange}
                        disabled={!available}
                        className="accent-red-600"
                      />
                      <Icon className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-800 text-sm">{label}</span>
                      {!available && (
                        <span className="ml-auto text-xs text-gray-400">Coming Soon</span>
                      )}
                    </label>
                  ))}
                </div>
              </section>
            </div>

            {/* Right column: order summary + submit */}
            <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4 h-fit sticky top-24">
              <h2 className="text-lg text-gray-900">Order Summary</h2>
              <ul className="divide-y divide-gray-100 text-sm">
                {items.map(item => (
                  <li key={item.id} className="py-3 flex gap-3 items-center">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.product_name}
                        className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <span className="flex-1 text-gray-700 truncate">
                      {item.product_name} × {item.quantity}
                    </span>
                    <span className="text-gray-900">
                      £{(Number(item.price_at_addition) * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>£{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-900 font-medium text-base pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-red-600">£{grandTotal.toFixed(2)}</span>
                </div>
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={placing}
                className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {placing ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Checkout;
