import React from "react";

import Biscoff_visual from "../assets/img/Biscoff_visual.png";
import { ShoppingCart, Star } from "lucide-react";
import {ImageWithFallback} from "../layouts/ImageWithFallback";

const Hero = () => {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
     <section id="home" className="relative bg-gradient-to-br from-red-50 to-white py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-block bg-red-100 text-red-600 px-4 py-2 rounded-full">
                Baked Fresh to Order
              </div>
              <h1 className="text-5xl sm:text-6xl text-gray-900">
                Thick, Gooey Cookies Done Right
              </h1>
              <p className="text-gray-600 text-lg">
                Each cookie box is freshly baked in small batches, hand packaged and posted straight to your door for the ultimate cookie experience.
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
              <div className="aspect-[4/5] sm:aspect-square rounded-2xl overflow-hidden shadow-2xl max-w-md sm:max-w-xl md:max-w-none mx-auto md:scale-110 origin-center">
                <ImageWithFallback
                  src={Biscoff_visual}
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