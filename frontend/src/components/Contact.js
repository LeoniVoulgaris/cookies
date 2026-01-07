import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';


const Contact = () => {
  return (
<section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-gray-600 text-lg">We'd love to hear from you! Reach out with any questions.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <Phone className="w-8 h-8 text-red-600" />
              </div>
              <h4 className="text-gray-900 mb-2">Phone</h4>
              <p className="text-gray-600">(555) 123-4567</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <Mail className="w-8 h-8 text-red-600" />
              </div>
              <h4 className="text-gray-900 mb-2">Email</h4>
              <p className="text-gray-600">hello@postedcookies.com</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <MapPin className="w-8 h-8 text-red-600" />
              </div>
              <h4 className="text-gray-900 mb-2">Location</h4>
              <p className="text-gray-600">123 Cookie Lane, Bakery City</p>
            </div>
          </div>
        </div>
      </section>
  );
};

export default Contact;