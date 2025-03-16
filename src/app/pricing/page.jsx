"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  Check, 
  X, 
  CreditCard, 
  ShieldCheck, 
  AlertTriangle, 
  BellRing, 
  BarChart, 
  Zap,
  Crown,
  TrendingDown,
  AlertCircle
} from "lucide-react";

export default function PricingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState("monthly");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-xl font-medium text-gray-700">Loading pricing plans...</div>
      </div>
    );
  }
  
  if (status === "unauthenticated") return null; // Prevents rendering before redirect

  const plans = [
    {
      name: "Free",
      tagline: "For occasional deal hunters",
      price: billingCycle === "monthly" ? 0 : 0,
      priceUnit: "/month",
      description: "Basic tracking for casual shoppers",
      color: "from-gray-500 to-gray-600",
      features: [
        { name: "Track up to 5 products", included: true },
        { name: "Basic email notifications", included: true },
        { name: "24-hour price check frequency", included: true },
        { name: "7-day price history", included: true },
        { name: "1 supported retailer", included: true },
        { name: "SMS notifications", included: false },
        { name: "Auto-purchase on price drop", included: false },
        { name: "Advanced price analytics", included: false },
        { name: "Priority support", included: false },
      ],
      buttonText: "Get Started Free",
      buttonVariant: "secondary",
      popular: false
    },
    {
      name: "Pro",
      tagline: "For serious savers",
      price: billingCycle === "monthly" ? 9.99 : 7.99,
      priceUnit: "/month",
      description: "Advanced tracking for frequent shoppers",
      color: "from-blue-500 to-purple-600",
      features: [
        { name: "Track up to 25 products", included: true },
        { name: "Real-time email notifications", included: true },
        { name: "4-hour price check frequency", included: true },
        { name: "30-day price history", included: true },
        { name: "10+ supported retailers", included: true },
        { name: "SMS notifications", included: true },
        { name: "Auto-purchase on price drop", included: true },
        { name: "Advanced price analytics", included: false },
        { name: "Priority support", included: false },
      ],
      buttonText: "Subscribe to Pro",
      buttonVariant: "primary",
      popular: true
    },
    {
      name: "Premium",
      tagline: "For maximum savings",
      price: billingCycle === "monthly" ? 19.99 : 15.99,
      priceUnit: "/month",
      description: "Ultimate tracking for power users",
      color: "from-amber-500 to-amber-600",
      features: [
        { name: "Unlimited product tracking", included: true },
        { name: "Real-time email notifications", included: true },
        { name: "1-hour price check frequency", included: true },
        { name: "90-day price history", included: true },
        { name: "All supported retailers", included: true },
        { name: "SMS notifications", included: true },
        { name: "Auto-purchase on price drop", included: true },
        { name: "Advanced price analytics", included: true },
        { name: "Priority support", included: true },
      ],
      buttonText: "Subscribe to Premium",
      buttonVariant: "premium",
      popular: false
    }
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Choose Your Savings Plan
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Track more products, get faster updates, and save more money with our premium plans.
        </p>
        
        {/* Billing toggle */}
        <div className="mt-8 flex justify-center items-center space-x-4">
          <span className={`text-sm ${billingCycle === "monthly" ? "font-medium text-gray-900" : "text-gray-500"}`}>
            Monthly Billing
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
            className="relative bg-gray-200 rounded-full w-14 h-7 transition duration-200 ease-in-out"
          >
            <div
              className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${
                billingCycle === "yearly" ? "translate-x-7" : ""
              }`}
            />
          </button>
          <span className={`text-sm ${billingCycle === "yearly" ? "font-medium text-gray-900" : "text-gray-500"}`}>
            Yearly Billing <span className="inline-block ml-1 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">Save 20%</span>
          </span>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div 
            key={plan.name}
            className={`relative flex flex-col rounded-2xl bg-white border ${plan.popular ? 'border-blue-400 shadow-xl' : 'border-gray-200 shadow-md'} overflow-hidden`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                  Most Popular
                </div>
              </div>
            )}
            
            {/* Header */}
            <div className={`bg-gradient-to-r ${plan.color} text-white p-6 text-center`}>
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <p className="text-white text-opacity-80 mt-1">{plan.tagline}</p>
            </div>
            
            {/* Pricing */}
            <div className="p-6 text-center border-b border-gray-100">
              <div className="flex items-center justify-center">
                <span className="text-4xl font-bold">
                  {plan.price === 0 ? "Free" : `$${plan.price}`}
                </span>
                {plan.price > 0 && (
                  <span className="text-gray-500 ml-2">{plan.priceUnit}</span>
                )}
              </div>
              <p className="text-gray-500 mt-2">{plan.description}</p>
            </div>
            
            {/* Features */}
            <div className="p-6 flex-grow">
              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature.name} className="flex items-start">
                    {feature.included ? (
                      <Check size={18} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X size={18} className="text-gray-300 mr-2 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* CTA */}
            <div className="p-6 border-t border-gray-100">
              <button 
                className={`w-full py-3 px-4 rounded-xl text-center font-medium text-sm ${
                    plan.buttonVariant === 'primary' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90'
                      : plan.buttonVariant === 'premium'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:opacity-90'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                } transition-all shadow-sm`}
              >
                {plan.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mt-24 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-medium text-gray-900">Can I upgrade or downgrade my plan anytime?</h3>
            <p className="mt-2 text-gray-600">Yes, you can change your subscription plan at any time. When upgrading, you'll be charged the prorated difference for the remainder of your billing cycle. When downgrading, the changes will take effect at the end of your current billing cycle.</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-medium text-gray-900">How often are prices checked?</h3>
            <p className="mt-2 text-gray-600">Price check frequency depends on your plan. Free users get 24-hour checks, Pro users get 4-hour checks, and Premium users receive hourly price checks for maximum savings opportunities.</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-medium text-gray-900">Which retailers are supported?</h3>
            <p className="mt-2 text-gray-600">We support major retailers including Amazon, Walmart, Best Buy, Target, eBay, Flipkart, and more. Premium users get access to all our supported retailers, while other plans have limitations.</p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="mt-24 mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                JD
              </div>
              <div className="ml-3">
                <h4 className="font-medium">Jane Doe</h4>
                <p className="text-sm text-gray-500">Pro User</p>
              </div>
            </div>
            <p className="text-gray-700">"Savr helped me save over $500 on my holiday shopping last year. The price alerts are timely and the auto-purchase feature is a game changer!"</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                MS
              </div>
              <div className="ml-3">
                <h4 className="font-medium">Michael Smith</h4>
                <p className="text-sm text-gray-500">Premium User</p>
              </div>
            </div>
            <p className="text-gray-700">"The analytics features on the Premium plan have completely changed how I shop online. I can predict price drops and time my purchases perfectly."</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                AJ
              </div>
              <div className="ml-3">
                <h4 className="font-medium">Alex Johnson</h4>
                <p className="text-sm text-gray-500">Free User</p>
              </div>
            </div>
            <p className="text-gray-700">"Even the free plan has saved me money! I tracked my new TV and got an alert when it dropped $200. Now I'm considering upgrading to track more items."</p>
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center shadow-xl max-w-5xl mx-auto">
        <div className="flex items-center justify-center mb-4">
          <TrendingDown size={32} className="mr-2" />
          <h2 className="text-2xl font-bold">Start saving money today!</h2>
        </div>
        <p className="text-lg max-w-2xl mx-auto mb-6">
          Join thousands of smart shoppers who never overpay again. Try Savr risk-free with our 14-day money-back guarantee.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="bg-white text-blue-600 font-medium py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors shadow-md">
            Try Pro Free for 7 Days</button>
          <button className="bg-blue-800 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
            View All Features
          </button>
        </div>
        <div className="mt-4 flex items-center justify-center">
          <ShieldCheck size={16} className="mr-1" />
          <span className="text-sm text-blue-100">14-day money-back guarantee</span>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-16 text-center">
        <p className="text-sm text-gray-500 mb-4">Trusted Payment Methods</p>
        <div className="flex justify-center space-x-6">
          <div className="flex items-center text-gray-400">
            <CreditCard size={20} className="mr-2" />
            <span>Credit Card</span>
          </div>
          <div className="flex items-center text-gray-400">
            <AlertCircle size={20} className="mr-2" />
            <span>PayPal</span>
          </div>
          <div className="flex items-center text-gray-400">
            <AlertCircle size={20} className="mr-2" />
            <span>Apple Pay</span>
          </div>
          <div className="flex items-center text-gray-400">
            <AlertCircle size={20} className="mr-2" />
            <span>Google Pay</span>
          </div>
        </div>
      </div>

      {/* Features Summary */}
      <div className="mt-16 bg-gray-50 rounded-2xl p-8 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">All Plans Include</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 p-3 rounded-full mb-3">
              <BellRing size={24} className="text-blue-600" />
            </div>
            <h3 className="font-medium">Price Alerts</h3>
            <p className="text-sm text-gray-600 mt-1">Instant notifications when prices drop</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 p-3 rounded-full mb-3">
              <BarChart size={24} className="text-blue-600" />
            </div>
            <h3 className="font-medium">Price History</h3>
            <p className="text-sm text-gray-600 mt-1">Track price changes over time</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 p-3 rounded-full mb-3">
              <Zap size={24} className="text-blue-600" />
            </div>
            <h3 className="font-medium">Fast Setup</h3>
            <p className="text-sm text-gray-600 mt-1">Start tracking in seconds</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 p-3 rounded-full mb-3">
              <Crown size={24} className="text-blue-600" />
            </div>
            <h3 className="font-medium">No Ads</h3>
            <p className="text-sm text-gray-600 mt-1">Clean, distraction-free experience</p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold">Ready to start saving?</h2>
        <p className="text-gray-600 mt-2 mb-6">Choose the plan that's right for you and start saving today.</p>
        <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-3 px-6 rounded-lg hover:opacity-90 transition-colors shadow-md">
          Get Started
        </button>
      </div>
    </div>
  );
}