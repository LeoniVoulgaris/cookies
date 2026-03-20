import React, { useState } from 'react';
import { Mail, MapPin, ChevronDown, ChevronUp, Instagram } from 'lucide-react';
import TiktokFillIcon from './TiktokIcon';

const FAQS = [
  {
    q: 'How do I place an order?',
    a: 'All cookie boxes are found under the Shop section on our website. Choose your box (Classic Cookie Box, Mixed Cookie Box, or Limited Cookie Box). Each cookie box comes with a carefully curated selection of flavours. Prefer to choose your own? You can customise your box by selecting your preferred flavours before adding to basket and completing checkout. Your cookies are baked fresh to order and delivered straight to your door. Order by Wednesday 3pm to receive on Friday.',
  },
  {
    q: 'When will I receive my order?',
    a: 'Order by Wednesday 3pm to receive on Friday. All orders are delivered via Royal Mail Tracked 24 on Fridays. Tracking details will be sent once your box has been posted.',
  },
  {
    q: 'How are orders shipped?',
    a: 'All orders are delivered via Royal Mail Tracked 24 on Fridays. Tracking details will be sent once your box has been posted. To avoid delays, we recommend selecting a safe place or ensuring someone is available to accept your cookie box.',
  },
  {
    q: 'Can I place a custom or bulk order?',
    a: 'For all custom or bulk enquiries, please email us at postedcustomcookies@gmail.com with your order details and preferred delivery date.',
  },
  {
    q: 'Do your products contain allergens?',
    a: 'All products are made in a bakery that stores and bakes with NUTS, SOYA, GLUTEN, EGGS and DAIRY, so may contain traces due to cross contamination.',
  },
  {
    q: 'Do you offer collection?',
    a: 'We offer free collection from SE23 and SW2. The exact collection point will be sent to you once your order has been processed',
  },
];

const FAQ = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex justify-between items-center py-4 text-left text-gray-900 hover:text-red-600 transition-colors"
      >
        <span>{q}</span>
        {open ? <ChevronUp className="w-5 h-5 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 flex-shrink-0" />}
      </button>
      {open && <p className="text-gray-600 pb-4 text-sm leading-relaxed">{a}</p>}
    </div>
  );
};

const Contact = () => {
  return (
    <>
      {/* FAQ Section */}
      <section id="faqs" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">FAQs</h2>
          </div>
          <div className="bg-gray-50 rounded-xl p-6">
            {FAQS.map((faq, i) => <FAQ key={i} {...faq} />)}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">Stay Posted</h2>
            <p className="text-gray-600 text-lg">We'd love to hear from you!</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <Mail className="w-8 h-8 text-red-600" />
              </div>
              <h4 className="text-gray-900 mb-2">Email</h4>
              <a href="mailto:postedcutomcookies@gmail.com" className="text-gray-600 hover:text-red-600 transition-colors">postedcustomcookies@gmail.com</a>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <MapPin className="w-8 h-8 text-red-600" />
              </div>
              <h4 className="text-gray-900 mb-2">Location</h4>
              <p className="text-gray-600">South London</p>
            </div>
            <div className="text-center">
              <a
                href="https://www.instagram.com/postedcookies"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-col items-center text-gray-600 hover:text-red-600 transition-colors"
              >
                <span className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <Instagram className="w-8 h-8 text-red-600" />
                </span>
                <h4 className="text-gray-900 mb-2">Instagram</h4>
                <span>@postedcookies</span>
              </a>
            </div>
            <div className="text-center">
              <a
                href="https://www.tiktok.com/@postedcookies"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-col items-center text-gray-600 hover:text-red-600 transition-colors"
              >
                <span className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <TiktokFillIcon size={32} className="text-red-600 w-8 h-8" />
                </span>
                <h4 className="text-gray-900 mb-2">TikTok</h4>
                <span>@postedcookies</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;