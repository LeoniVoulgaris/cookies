import React from "react";
import { ShoppingCart, Cookie, Heart, Star } from "lucide-react";


const About = () => {
  return (
<section id="about" className="py-20 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl text-gray-900">Baked with Love Since 2020</h2>
              <p className="text-gray-600 text-lg">
                At Posted Cookies, we believe every cookie should bring a smile to your face. Our journey began in a small home kitchen with a passion for creating the perfect cookie.
              </p>
              <p className="text-gray-600 text-lg">
                Today, we use only the finest ingredients - real butter, premium chocolate, and our grandmother's secret vanilla blend - to craft cookies that taste just like homemade.
              </p>
              <div className="grid grid-cols-3 gap-6 pt-6">
                <div className="text-center">
                  <div className="text-4xl text-red-600 mb-2">1000+</div>
                  <div className="text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl text-red-600 mb-2">15+</div>
                  <div className="text-gray-600">Cookie Varieties</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl text-red-600 mb-2">100%</div>
                  <div className="text-gray-600">Fresh Daily</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <Cookie className="w-12 h-12 text-red-600 mb-4" />
                  <h4 className="text-gray-900 mb-2">Premium Quality</h4>
                  <p className="text-gray-600">Only the finest ingredients in every batch</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <Heart className="w-12 h-12 text-red-600 mb-4" />
                  <h4 className="text-gray-900 mb-2">Made with Love</h4>
                  <p className="text-gray-600">Family recipes passed down generations</p>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <Star className="w-12 h-12 text-red-600 mb-4" />
                  <h4 className="text-gray-900 mb-2">5-Star Rated</h4>
                  <p className="text-gray-600">Loved by cookie enthusiasts everywhere</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <ShoppingCart className="w-12 h-12 text-red-600 mb-4" />
                  <h4 className="text-gray-900 mb-2">Fast Delivery</h4>
                  <p className="text-gray-600">Fresh cookies to your door in 24hrs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}
export default About;