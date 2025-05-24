"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Define the ClothingItem interface
interface ClothingItem {
  id: string;
  title: string;
  brand: string;
  size: string;
  category: string;
  price: number;
  deposit: number;
  description: string;
  photos: string[];
  userId: string;
  createdAt: string;
}

export default function MyListingsPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [myListings, setMyListings] = useState<ClothingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/");
    }
  }, [loading, isAuthenticated, router]);
  
  // Load user's listings
  useEffect(() => {
    if (user) {
      try {
        // Get all items from localStorage
        const itemsJson = localStorage.getItem('clothingItems');
        const allItems = itemsJson ? JSON.parse(itemsJson) : [];
        
        // Filter items that belong to the current user
        const userItems = allItems.filter((item: ClothingItem) => item.userId === user.id);
        
        setMyListings(userItems);
      } catch (error) {
        console.error('Error loading listings:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [user]);
  
  // Handler to delete an item
  const handleDeleteItem = (itemId: string) => {
    try {
      // Get all items
      const itemsJson = localStorage.getItem('clothingItems');
      const allItems = itemsJson ? JSON.parse(itemsJson) : [];
      
      // Filter out the item to delete
      const updatedItems = allItems.filter((item: ClothingItem) => item.id !== itemId);
      
      // Save updated items
      localStorage.setItem('clothingItems', JSON.stringify(updatedItems));
      
      // Update state
      setMyListings(myListings.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };
  
  if (loading || isLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center">Loading your listings...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Redirecting, handled in useEffect
  }
  
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Listings</h1>
        <Link href="/list-item">
          <Button className="bg-[#8c1515] hover:bg-[#6f1111] text-white">
            Add New Item
          </Button>
        </Link>
      </div>
      
      {myListings.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-medium mb-4">You don't have any items listed yet</h2>
          <p className="text-gray-500 mb-6">
            List your rarely-worn clothes to make money and help other Stanford students find stylish outfits sustainably.
          </p>
          <Link href="/list">
            <Button className="bg-[#8c1515] hover:bg-[#6f1111] text-white">
              List Your First Item
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {myListings.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                {item.photos && item.photos.length > 0 ? (
                  <img 
                    src={item.photos[0]} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-sm font-medium">
                  ${item.price}/day
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  <span className="text-sm bg-gray-100 px-2 py-0.5 rounded">
                    Size {item.size}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-3">{item.brand}</p>
                <p className="text-sm mb-4 line-clamp-2">{item.description}</p>
                <div className="flex justify-between">
                  <Link href={`/edit-item/${item.id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-red-500 text-red-500 hover:bg-red-50"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this listing?')) {
                        handleDeleteItem(item.id);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}