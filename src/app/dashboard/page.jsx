"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  TrendingDown, 
  TrendingUp, 
  Bell, 
  ShoppingBag, 
  Plus, 
  ExternalLink, 
  Heart, 
  ArrowRight, 
  ChevronDown,
  BarChart4,
  DollarSign,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-xl font-medium text-gray-700">Loading your deals...</div>
      </div>
    );
  }
  
  if (status === "unauthenticated") return null; // Prevents rendering before redirect

  // Sample data for the dashboard
  const trackedProducts = [
    {
      id: 1,
      name: "Sony WH-1000XM5 Wireless Headphones",
      image: "/api/placeholder/100/100",
      currentPrice: 299.99,
      initialPrice: 399.99,
      priceChange: -25,
      store: "Amazon",
      targetPrice: 275,
      lastUpdated: "10 minutes ago",
      priceHistory: [350, 349.99, 349.99, 329.99, 299.99]
    },
    {
      id: 2,
      name: "Samsung 55\" OLED 4K Smart TV",
      image: "/api/placeholder/100/100",
      currentPrice: 1299.99,
      initialPrice: 1499.99,
      priceChange: -13.3,
      store: "Flipkart",
      targetPrice: 1200,
      lastUpdated: "2 hours ago",
      priceHistory: [1499.99, 1449.99, 1399.99, 1349.99, 1299.99]
    },
    {
      id: 3,
      name: "Apple MacBook Air M2",
      image: "/api/placeholder/100/100",
      currentPrice: 1099,
      initialPrice: 1199,
      priceChange: -8.3,
      store: "Best Buy",
      targetPrice: 999,
      lastUpdated: "4 hours ago",
      priceHistory: [1199, 1199, 1149, 1149, 1099]
    },
    {
      id: 4,
      name: "Nike Air Jordan 1 Retro High",
      image: "/api/placeholder/100/100",
      currentPrice: 179.99,
      initialPrice: 170,
      priceChange: 5.9,
      store: "Nike",
      targetPrice: 150,
      lastUpdated: "1 day ago",
      priceHistory: [170, 170, 175, 175, 179.99]
    }
  ];

  const recentAlerts = [
    {
      id: 1,
      productName: "Sony WH-1000XM5 Wireless Headphones",
      message: "Price dropped by $100 (25%)",
      time: "2 hours ago",
      isNew: true,
      type: "price_drop"
    },
    {
      id: 2,
      productName: "Apple MacBook Air M2",
      message: "Price dropped by $100 (8.3%)",
      time: "1 day ago",
      isNew: false,
      type: "price_drop"
    },
    {
      id: 3,
      productName: "Nike Air Jordan 1 Retro High",
      message: "Price increased by $9.99 (5.9%)",
      time: "3 days ago",
      isNew: false,
      type: "price_increase"
    }
  ];

  const summaryStats = [
    {
      title: "Products Tracked",
      value: 12,
      icon: ShoppingBag,
      color: "bg-blue-500"
    },
    {
      title: "Price Alerts",
      value: 3,
      icon: Bell,
      color: "bg-purple-500"
    },
    {
      title: "Potential Savings",
      value: "$432.97",
      icon: DollarSign,
      color: "bg-green-500"
    },
    {
      title: "Average Price Drop",
      value: "12.4%",
      icon: TrendingDown,
      color: "bg-red-500"
    }
  ];

  const recommendedDeals = [
    {
      id: 1,
      name: "Bose QuietComfort Ultra Headphones",
      discount: "35% OFF",
      originalPrice: 429.99,
      currentPrice: 279.99,
      image: "/api/placeholder/80/80",
      store: "Amazon"
    },
    {
      id: 2,
      name: "Dyson V12 Detect Slim Absolute",
      discount: "20% OFF",
      originalPrice: 649.99,
      currentPrice: 519.99,
      image: "/api/placeholder/80/80",
      store: "Walmart"
    },
    {
      id: 3,
      name: "iPad Pro 11-inch (Latest Model)",
      discount: "15% OFF",
      originalPrice: 799,
      currentPrice: 679.15,
      image: "/api/placeholder/80/80",
      store: "Best Buy"
    }
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Welcome section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Welcome to Your Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Hello, {session?.user?.name || "Savvy Shopper"}! Here's your latest price tracking updates.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-md">
            <Plus size={18} />
            <span>Track New Product</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-2 rounded-lg text-white`}>
                  <IconComponent size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main content area with tracked products */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Your Tracked Products</h2>
          <div className="flex space-x-2 mt-3 md:mt-0">
            <button 
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1 text-sm rounded-md ${activeTab === "all" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              All
            </button>
            <button 
              onClick={() => setActiveTab("price_drop")}
              className={`px-3 py-1 text-sm rounded-md ${activeTab === "price_drop" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Price Drops
            </button>
            <button 
              onClick={() => setActiveTab("price_increase")}
              className={`px-3 py-1 text-sm rounded-md ${activeTab === "price_increase" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Price Increases
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {trackedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md overflow-hidden">
                          <img src={product.image} alt={product.name} className="h-10 w-10 object-cover" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900 hover:text-blue-600">{product.name}</span>
                          <div className="flex mt-1">
                            {[...Array(5)].map((_, i) => (
                              <div key={i} className="w-1 h-8 bg-gray-200 mx-0.5 rounded-sm" style={{
                                height: `${Math.max(10, product.priceHistory[i] / 5)}px`,
                                backgroundColor: product.priceHistory[i] > product.priceHistory[i+1] ? '#e5e7eb' : 
                                                 product.priceHistory[i] < product.priceHistory[i+1] ? '#ef4444' : '#e5e7eb'
                              }} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${product.currentPrice}</div>
                      <div className="text-xs text-gray-500">was ${product.initialPrice}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.priceChange < 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.priceChange < 0 ? <TrendingDown size={12} className="mr-1" /> : <TrendingUp size={12} className="mr-1" />}
                        {Math.abs(product.priceChange)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${product.targetPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.store}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.lastUpdated}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-gray-400 hover:text-red-500">
                          <Heart size={16} />
                        </button>
                        <button className="text-gray-400 hover:text-blue-500">
                          <BarChart4 size={16} />
                        </button>
                        <button className="text-gray-400 hover:text-gray-900">
                          <ExternalLink size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Two-column layout for price alerts and recommended deals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Price Alerts Column */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">Recent Price Alerts</h3>
              <Link href="/notifications" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                View All <ArrowRight size={14} className="ml-1" />
              </Link>
            </div>
            </div>
            <div className="divide-y divide-gray-100">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start">
                    <div className={`p-2 rounded-full mr-3 ${
                      alert.type === 'price_drop' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {alert.type === 'price_drop' ? 
                        <TrendingDown size={16} className="text-green-600" /> : 
                        <TrendingUp size={16} className="text-red-600" />
                      }
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900 mr-2">{alert.productName}</p>
                        {alert.isNew && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">New</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <button className="w-full py-2 px-4 bg-white border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                Configure Alert Settings
              </button>
            </div>
          </div>
        </div>

        {/* Recommended Deals Column */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">Recommended Deals</h3>
              <Link href="/deals" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                See More Deals <ArrowRight size={14} className="ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {recommendedDeals.map((deal) => (
                <div key={deal.id} className="border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img src={deal.image} alt={deal.name} className="w-full h-36 object-cover" />
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                      {deal.discount}
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm font-medium line-clamp-2 h-10">{deal.name}</h4>
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <p className="text-sm font-bold text-gray-900">${deal.currentPrice}</p>
                        <p className="text-xs text-gray-500 line-through">${deal.originalPrice}</p>
                      </div>
                      <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{deal.store}</span>
                    </div>
                    <button className="w-full mt-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm rounded-md hover:opacity-90">
                      View Deal
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
         {/* Pro Tips Section */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-start">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl text-white mr-4">
            <AlertCircle size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">Pro Tips</h3>
            <p className="text-gray-700 mt-1">
              Set price drop alerts for high-value items to maximize your savings. The best time to track electronics is typically before major shopping events like Black Friday or Prime Day.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="bg-white text-gray-700 border border-gray-200 rounded-md px-3 py-1.5 text-sm hover:bg-gray-50">
                Learn More
              </button>
              <button className="bg-blue-600 text-white rounded-md px-3 py-1.5 text-sm hover:bg-blue-700">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recently Viewed */}
      <div className="mt-8 mb-4">
        <h3 className="font-bold text-lg mb-4">Recently Viewed</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {trackedProducts.slice(0, 6).map((product) => (
            <div key={`recent-${product.id}`} className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-24 bg-gray-100 flex items-center justify-center">
                <img src={product.image} alt={product.name} className="h-20 w-20 object-contain" />
              </div>
              <div className="p-3">
                <h4 className="text-xs font-medium line-clamp-2 h-8">{product.name}</h4>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs font-bold">${product.currentPrice}</p>
                  <span className={`text-xs ${product.priceChange < 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.priceChange < 0 ? '↓' : '↑'} {Math.abs(product.priceChange)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>

     
    
  );
}