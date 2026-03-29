import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const stripeSuccess = searchParams.get('stripe_success');
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    // Guard against direct visits to the success URL without a successful payment redirect.
    if (stripeSuccess !== 'true') {
      navigate('/checkout', { replace: true });
    }
  }, [navigate, stripeSuccess]);

  if (stripeSuccess !== 'true') {
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl text-gray-900 mb-2">Payment Confirmed!</h1>
        {orderId ? (
          <p className="text-gray-600 mb-1">Order #{orderId}</p>
        ) : (
          <p className="text-gray-600 mb-1">Your order has been received.</p>
        )}
        <p className="text-gray-500 text-sm mb-8">
          Your payment was successful. We will email your receipt and delivery details shortly.
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
};

export default PaymentSuccess;
