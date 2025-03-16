"use client";
import "./globals.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen">
        <SessionProvider>
          <AuthWrapper>
            <div className="flex w-full">
              {/* Sidebar with fixed width */}
              <div className="w-64">
                <Sidebar />
              </div>
              
              {/* Main content area */}
              <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 container mx-auto p-4 max-w-5xl">{children}</main>
                <Footer />
              </div>
            </div>
          </AuthWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}

function AuthWrapper({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  console.log("Session Data:", session);
  console.log("Auth Status:", status);
  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [status, router]);
  
  if (status === "loading") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
        <div className="text-center">
          <div className="relative w-32 h-32 mb-6">
            {/* Coin stack animation */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <div className="animate-bounce-delayed-1 w-16 h-16 bg-yellow-400 rounded-full border-4 border-yellow-500 shadow-lg flex items-center justify-center z-30">
                <span className="font-bold text-yellow-800">$</span>
              </div>
            </div>
            
            <div className="absolute left-1/2 transform -translate-x-1/2 top-6">
              <div className="animate-bounce-delayed-2 w-16 h-16 bg-yellow-400 rounded-full border-4 border-yellow-500 shadow-lg flex items-center justify-center z-20">
                <span className="font-bold text-yellow-800">$</span>
              </div>
            </div>
            
            <div className="absolute left-1/2 transform -translate-x-1/2 top-12">
              <div className="animate-bounce-delayed-3 w-16 h-16 bg-yellow-400 rounded-full border-4 border-yellow-500 shadow-lg flex items-center justify-center z-10">
                <span className="font-bold text-yellow-800">$</span>
              </div>
            </div>
            
            {/* Piggy bank shadow */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-gray-300 rounded-full opacity-50"></div>
          </div>
          
          <h3 className="text-xl font-semibold text-blue-600 mb-2">Loading your savings</h3>
          <p className="text-gray-600">Tracking the best deals for you...</p>
        </div>
      </div>
    );
  }
  
  return children;
}

// Add this to your globals.css or create a style tag
const styles = `
@keyframes bounce-delayed-1 {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0) translateX(-50%);
  }
  40% {
    transform: translateY(-20px) translateX(-50%);
  }
  60% {
    transform: translateY(-10px) translateX(-50%);
  }
}

@keyframes bounce-delayed-2 {
  0%, 30%, 60%, 90% {
    transform: translateY(0) translateX(-50%);
  }
  50% {
    transform: translateY(-15px) translateX(-50%);
  }
  70% {
    transform: translateY(-7px) translateX(-50%);
  }
}

@keyframes bounce-delayed-3 {
  0%, 40%, 70%, 100% {
    transform: translateY(0) translateX(-50%);
  }
  60% {
    transform: translateY(-10px) translateX(-50%);
  }
  80% {
    transform: translateY(-5px) translateX(-50%);
  }
}

.animate-bounce-delayed-1 {
  animation: bounce-delayed-1 2s infinite;
}

.animate-bounce-delayed-2 {
  animation: bounce-delayed-2 2s infinite;
}

.animate-bounce-delayed-3 {
  animation: bounce-delayed-3 2s infinite;
}
`;