import React from "react";
import { Package, Sparkles, Gift, Truck } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="py-20 bg-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl text-gray-900">About Us</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Posted Cookies began with a simple obsession: thick, gooey cookies done right.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              From our South London micro-bakery, we craft gourmand cookie boxes designed to feel like a little luxury, whether you&apos;re gifting, sharing, or keeping them to yourself.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Each cookie is handmade in small batches, thoughtfully packaged, and posted with care. We offer a selection of classic cookie flavours and a new limited-edition flavour every month. All flavours are inspired by indulgence, nostalgia, and comfort.
            </p>
            <p className="text-red-600 font-medium text-lg">Baked locally. Posted nationally.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <Package className="w-12 h-12 text-red-600 mb-4" />
                <h4 className="text-gray-900 mb-2">Small Batches</h4>
                <p className="text-gray-600">Baked fresh to order</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <Sparkles className="w-12 h-12 text-red-600 mb-4" />
                <h4 className="text-gray-900 mb-2">Premium Ingredients</h4>
                <p className="text-gray-600">Pure, high-quality ingredients in every cookie</p>
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <Gift className="w-12 h-12 text-red-600 mb-4" />
                <h4 className="text-gray-900 mb-2">Gift Packaged</h4>
                <p className="text-gray-600">Beautifully hand packaged and gift wrapped</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <Truck className="w-12 h-12 text-red-600 mb-4" />
                <h4 className="text-gray-900 mb-2">Free Collection</h4>
                <p className="text-gray-600">Free collection available from SE23 and SW2</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
