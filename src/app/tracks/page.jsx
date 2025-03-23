"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Bell, Trash2, ArrowUp, ArrowDown, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function MyTracksPage() {
  const { data: session } = useSession();
  const [trackedProducts, setTrackedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);

  // Function to fetch product details by productId
  const fetchProductDetails = async (productId) => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        console.error("Failed to fetch product details:", data.error);
        return null;
      }
    } catch (err) {
      console.error("Error fetching product details:", err);
      return null;
    }
  };

  // Fetch tracked products and their details
  useEffect(() => {
    const fetchTrackedProducts = async () => {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/tracking/user/${session.user.id}`);
        const data = await response.json();

        if (response.ok) {
          // Fetch product details for each tracked product
          const productsWithDetails = await Promise.all(
            data.products.map(async (product) => {
              const productDetails = await fetchProductDetails(product.productId);
              return { ...product, ...productDetails }; // Merge tracked product data with product details
            })
          );
          setTrackedProducts(productsWithDetails);
        } else {
          setError(data.error || "Failed to fetch tracked products");
        }
      } catch (err) {
        console.error("Error fetching tracked products:", err);
        setError("An error occurred while fetching your tracked products");
      } finally {
        setLoading(false);
      }
    };

    fetchTrackedProducts();
  }, [session]);

  const handleRemoveProduct = async (productId) => {
    setDeletingProductId(productId);
  
    try {
      const response = await fetch(`/api/tracking/remove/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: session.user.id }), // Passing user ID
      });
  
      if (response.ok) {
        setTrackedProducts((prev) => prev.filter((product) => product.productId !== productId));
      } else {
        const data = await response.json();
        setError(data.error || "Failed to remove product");
      }
    } catch (err) {
      console.error("Error removing product:", err);
      setError("An error occurred while removing the product");
    } finally {
      setDeletingProductId(null);
    }
  };
  

  const getPriceChangeIndicator = (currentPrice, targetPrice) => {
    if (currentPrice === targetPrice) return null;

    const priceDifference = (((currentPrice - targetPrice) / targetPrice) * 100).toFixed(1);
    const isHigher = currentPrice > targetPrice;

    return (
      <div className={`flex items-center ${isHigher ? "text-red-500" : "text-green-500"}`}>
        {isHigher ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
        <span>{Math.abs(priceDifference)}%</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading your tracked products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
        <p className="text-red-600 mb-2">{error}</p>
        <button onClick={() => window.location.reload()} className="text-blue-600 hover:underline">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Tracked Products</h1>
            <p className="mt-2 text-gray-600">
              Monitoring {trackedProducts.length} product{trackedProducts.length !== 1 ? "s" : ""} for price drops
            </p>
          </div>
          <Bell className="h-6 w-6 text-blue-600" />
        </div>

        {trackedProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products tracked yet</h3>
            <p className="text-gray-600 mb-4">Start tracking your favorite products to get notified when prices drop.</p>
            <a
              href="/"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Track a Product
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trackedProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <Image
                    width={1920}
                    height={1080}
                    
                    src={product.imageUrl || "/api/placeholder/400/200"}
                    alt={product.title}
                    className="w-full h-48 object-contain"
                  />
                  {product.currentPrice < product.targetPrice && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold uppercase px-3 py-1 rounded-full">
                      Price Drop!
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900 line-clamp-2 mb-2" title={product.title}>
                      {product.title}
                    </h3>
                    <button
                      onClick={() => handleRemoveProduct(product.productId)}
                      className="text-gray-400 hover:text-red-500 cursor-pointer"
                      title="Remove product"
                      disabled={deletingProductId === product.productId}
                    >
                      {deletingProductId === product.productId ? (
                        <Loader2 className="h-5 w-5 animate-spin text-red-500" />
                      ) : (
                        <Trash2 className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  <a href={product.productUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline line-clamp-1 mb-3">
                    {new URL(product.productUrl).hostname}
                  </a>

                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Current Price</div>
                      <div className="text-lg font-semibold text-gray-900">Rs.{product.currentPrice?.toFixed(0)}</div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 mb-1">Target Price</div>
                      <div className="text-lg font-semibold text-gray-900">Rs.{product.targetPrice.toFixed(0)}</div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 mb-1">Difference</div>
                      {getPriceChangeIndicator(product.currentPrice, product.targetPrice)}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-500">Tracking since {new Date(product.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}