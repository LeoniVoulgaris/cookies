import React, { useEffect, useState } from "react";
import api from "../api";
import { useParams } from "react-router-dom";

const ProductsDetailPage = () => {
  // Get the slug from the URL params
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.get(`products_detail/${slug}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Product not found or API error.");
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;
  if (!product) return null;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-2 text-center">{product.name}</h2>
      <img
        src={product.image ? `http://127.0.0.1:8000${product.image}` : "https://via.placeholder.com/300x200?text=No+Image"}
        alt={product.name}
        className="mx-auto mb-4 rounded"
        style={{ maxHeight: "250px", maxWidth: "100%" }}
      />
      <p className="text-lg text-center mb-2">Price: ${product.price}</p>
      <p className="text-center mb-4">Slug: {product.slug}</p>
      <h3 className="text-xl font-semibold mb-2 text-center">Similar Products</h3>
      <div className="grid grid-cols-1 gap-4">
        {product.similar_products && product.similar_products.length > 0 ? (
          product.similar_products.map(sp => (
            <div key={sp.id} className="border rounded p-2 flex items-center gap-4">
              <img
                src={sp.image ? `http://127.0.0.1:8000${sp.image}` : "https://via.placeholder.com/80x80?text=No+Image"}
                alt={sp.name}
                className="rounded"
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
              />
              <div>
                <div className="font-bold">{sp.name}</div>
                <div>Price: ${sp.price}</div>
                <div>Category: {sp.category}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No similar products found.</div>
        )}
      </div>
    </div>
  );
};

export default ProductsDetailPage;