import React from "react";

import tower from "../assets/img/tower.png";
import { ShoppingCart, Star } from "lucide-react";
import {ImageWithFallback} from "../layouts/ImageWithFallback";

const Hero = () => {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
     <section id="home" className="relative bg-gradient-to-br from-red-50 to-white py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block bg-red-100 text-red-600 px-4 py-2 rounded-full">
                Baked Fresh to Order
              </div>
              <h1 className="text-5xl sm:text-6xl text-gray-900">
                Homemade Cookies, <span className="text-red-600">Posted</span> to Your Door
              </h1>
              <p className="text-gray-600 text-lg">
                Thick, gooey, handcrafted cookie boxes — beautifully packaged and posted straight to you from our South London micro-bakery.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => scrollTo('products')}
                  className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Order Now
                </button>
                <button
                  onClick={() => scrollTo('about')}
                  className="border-2 border-red-600 text-red-600 px-8 py-3 rounded-lg hover:bg-red-50 transition-colors"
                >
                  About Us
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src={tower}
                  alt="Fresh baked cookies"
                  className="w-full h-full object-cover"
                />
              </div>

            </div>
          </div>
        </div>
      </section>
  );
};

export default Hero;