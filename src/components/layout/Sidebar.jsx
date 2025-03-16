"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  Menu, 
  X, 
  Home, 
  LayoutDashboard, 
  ShoppingBag, 
  Bell, 
  Settings,
  TrendingDown,
  BarChart4,
  Heart,
  CreditCard
} from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  
  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Track Products", href: "/tracks", icon: ShoppingBag },
    { name: "My Deals", href: "/deals", icon: TrendingDown },
    { name: "Analytics", href: "/analytics", icon: BarChart4 },
    { name: "Favorites", href: "/favorites", icon: Heart },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Billing", href: "/billing", icon: CreditCard },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="relative">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/10 shadow-lg"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-black/80 backdrop-blur-md text-white border-r border-white/10 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 z-40 overflow-y-auto`}
      >
        {/* Logo section */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
              <TrendingDown size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                savr
              </span>
            </h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all group"
                >
                  <span className="flex-shrink-0">
                    <Icon size={18} className="group-hover:text-purple-400 transition-colors" />
                  </span>
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center space-x-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-xs font-medium">US</span>
            </div>
            <div>
              <div className="text-sm font-medium">User Account</div>
              <div className="text-xs text-white/60">Premium Plan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </aside>
  );
}