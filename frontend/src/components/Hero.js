import React from "react";
import img from "../assets/img/heroNew.png";

import { ShoppingCart, Star } from "lucide-react";
import {ImageWithFallback} from "../layouts/ImageWithFallback";

const Hero = () => {
  return (
     <section id="home" className="relative bg-gradient-to-br from-red-50 to-white py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block bg-red-100 text-red-600 px-4 py-2 rounded-full">
                Freshly Baked Daily
              </div>
              <h1 className="text-5xl sm:text-6xl text-gray-900">
                Homemade Cookies, <span className="text-red-600">Posted</span> to Your Door
              </h1>
              <p className="text-gray-600 text-lg">
                Experience the joy of warm, delicious cookies delivered straight to your doorstep. Made with love, premium ingredients, and our secret family recipe.
              </p>
              <div className="flex gap-4">
                <button className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Order Now
                </button>
                <button className="border-2 border-red-600 text-red-600 px-8 py-3 rounded-lg hover:bg-red-50 transition-colors">
                  View Menu
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1610698501974-0f18588d6c2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBjb29raWVzJTIwdGFibGV8ZW58MXx8fHwxNzY3MTIyMjI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Fresh baked cookies"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl border-4 border-red-600">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 fill-red-600 text-red-600" />
                  <Star className="w-5 h-5 fill-red-600 text-red-600" />
                  <Star className="w-5 h-5 fill-red-600 text-red-600" />
                  <Star className="w-5 h-5 fill-red-600 text-red-600" />
                  <Star className="w-5 h-5 fill-red-600 text-red-600" />
                </div>
                <p className="text-sm">Rated 5/5 by 1000+ customers</p>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
};

export default Hero;