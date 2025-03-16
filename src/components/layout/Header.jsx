import Link from "next/link";
import AuthButton from "@/components/auth/AuthButton";
import { TrendingDown, Bell, Search, Menu } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-black/70 text-white border-b border-white/10">
      <div className="w-full mx-auto">
        <div className="flex justify-between items-center px-4 py-3">
          {/* Logo Section */}
          <div className="flex items-center space-x-1">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
              <TrendingDown size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              <Link href="/" className="hover:opacity-80 transition-all">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  savr
                </span>
              </Link>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/tracks" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
              My Tracks
            </Link>
            <Link href="/deals" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
              Hot Deals
            </Link>
            <div className="relative group">
              <Link href="/pricing" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
                Pricing
              </Link>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 group-hover:w-full transition-all duration-300"></div>
            </div>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <Search size={18} className="text-white/80" />
            </button>
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <Bell size={18} className="text-white/80" />
            </button>
            <AuthButton />
            <button className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors">
              <Menu size={20} className="text-white/80" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-3 px-4 border-t border-white/10 animate-fadeIn">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-white/50" />
              <input 
                type="text" 
                placeholder="Search for products..." 
                className="w-full bg-white/10 border border-white/20 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}