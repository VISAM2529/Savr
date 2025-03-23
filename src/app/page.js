"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Bell, Sparkles, ShoppingBag, TrendingUp, CheckCircle, X } from "lucide-react";
import PriceInputForm from "@/components/tracking/PriceInputForm";
import { useSession } from "next-auth/react";

export default function Home() {
  const [productUrl, setProductUrl] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  

  
  const closeModal = () => {
    setShowModal(false);
    // Reset form after successful submission
    setProductUrl('');
    setTargetPrice('');
  };
  const { data: session } = useSession();
  console.log(session)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!session?.user?.email) {
      setMessage("You must be logged in to track products.");
      setShowModal(true);
      return;
    }
    
    const trackingData = {
      userId: session.user.id,
      productUrl,
      targetPrice,
    };
    
    console.log("Sending data:", trackingData);
    
    try {
      const response = await fetch("/api/tracking/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trackingData),
      });
      
      const data = await response.json();
      console.log("Response:", data);
      
      if (response.ok) {
        setMessage("Product added for tracking!");
        setProductUrl("");
        setTargetPrice("");
        setShowModal(true);
      } else {
        setMessage(`Error: ${data.error}`);
        setShowModal(true);
      }
    } catch (error) {
      console.error("API call failed:", error);
      setMessage("Failed to add product for tracking.");
      setShowModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 w-full">
      {/* Hero Section */}
      <div className="w-full mx-auto px-4 sm:px-6   sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6   ">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-6">
            <Sparkles className="h-6 w-6 text-blue-600" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
            Track Prices & <span className="text-blue-600">Save Money</span>
          </h1>
          
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            Get instant notifications when your favorite products drop in price. Never miss a deal again.
          </p>
          
          {/* Enhanced Form */}
          <div className="mt-10 max-w-xl mx-auto">
            <form 
              onSubmit={handleSubmit} 
              className="bg-white p-8 shadow-lg rounded-2xl border border-gray-100"
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-left">
                    Product URL
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="url"
                        value={productUrl}
                        onChange={(e) => setProductUrl(e.target.value)}
                        className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="https://www.example.com/product"
                        required
                      />
                    </div>
                  </label>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-left">
                    Target Price
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">Rs.</span>
                      </div>
                      <input
                        type="number"
                        value={targetPrice}
                        onChange={(e) => setTargetPrice(e.target.value)}
                        className="mt-1 p-3 pl-8 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="10000"
                        required
                      />
                    </div>
                  </label>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 transform hover:scale-105 transition duration-200 flex items-center justify-center"
                >
                  <Bell className="h-5 w-5 mr-2" />
                  Start Tracking
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all animate-fade-in">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Success!</h3>
              </div>
              <button 
                onClick={closeModal}
                className="bg-gray-100 rounded-full p-1 hover:bg-gray-200 transition duration-200"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-4">
              <p className="text-blue-700">{message}</p>
            </div>
            
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={closeModal}
                className="py-2 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
              >
                Close
              </button>
              <button
                onClick={closeModal}
                className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Track More Products
              </button>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Features Section */}
      <div className="bg-white py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">Simple steps to start saving money today</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <ShoppingBag className="h-8 w-8 text-blue-600" />,
                title: "Add Products",
                description: "Paste the URL of any product you want to track from your favorite online stores."
              },
              {
                icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
                title: "Track Prices",
                description: "We'll monitor price changes and keep a history of fluctuations for your items."
              },
              {
                icon: <Bell className="h-8 w-8 text-blue-600" />,
                title: "Get Notified",
                description: "Receive instant alerts when prices drop so you can buy at the perfect time."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm text-center">
                <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to start saving?</h2>
          <p className="mt-4 text-xl text-blue-100">Join thousands of smart shoppers who never overpay.</p>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/dashboard"
              className="bg-white text-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 transition font-medium flex items-center justify-center gap-2"
            >
              Go to Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="bg-blue-800 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition font-medium"
            >
              View Plans
            </Link>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="bg-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 mb-6">Trusted by thousands of smart shoppers</p>
          <div className="flex justify-center space-x-8 opacity-70">
            {["Amazon", "Walmart", "Target", "Best Buy", "eBay"].map((store) => (
              <div key={store} className="text-gray-400 font-semibold text-lg">
                {store}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}