"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

export default function PriceInputForm({ onSubmit }) {
  const [productUrl, setProductUrl] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const { data: session } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productUrl || !targetPrice) {
      toast.error("Enter a valid product URL and target price!");
      return;
    }

    try {
      const res = await fetch("/api/tracking/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productUrl,
          targetPrice: parseFloat(targetPrice), // Ensure it's a number
          userEmail: session?.user?.email,
        }),
      });

      const data = await res.json();
      console.log(data)
      if (res.ok) {
        toast.success("Product tracking started!");
        setProductUrl(""); // Reset input
        setTargetPrice("");
      } else {
        toast.error(data.error || "Failed to track product");
      }
    } catch (error) {
      console.error("Error tracking product:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-5">
      <input
        type="url"
        placeholder="Enter product URL"
        value={productUrl}
        onChange={(e) => setProductUrl(e.target.value)}
        className="border p-2 rounded w-full"
        required
      />
      <input
        type="number"
        placeholder="Target Price"
        value={targetPrice}
        onChange={(e) => setTargetPrice(e.target.value)}
        className="border p-2 rounded w-1/3"
        required
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Track
      </button>
    </form>
  );
}
