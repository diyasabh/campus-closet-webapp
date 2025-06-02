"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

// Define the ClothingItem interface to match your database
interface ClothingItem {
  id: string;
  name: string;
  brand: string;
  size: string;
  category: string;
  fee: number;
  deposit: number;
  description: string;
  photo: any; // Can be string or array
  userId: string;
  userEmail: string;
  userName: string;
  createdAt: string;
}

interface RentalInfo {
  id: number;
  userId: string;
  itemId: number;
  rentedAt: string;
  renterEmail: string;
  renterName: string;
  duration_days: number;
  return_date: string;
  status: string;
}

export default function MyListingsPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [myListings, setMyListings] = useState<ClothingItem[]>([]);
  const [rentalInfos, setRentalInfos] = useState<{[key: string]: RentalInfo}>({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/");
    }
  }, [loading, isAuthenticated, router]);
  
  // Load user's listings and rental information
  useEffect(() => {
    const fetchUserListings = async () => {
      if (!user) return;
  
      try {
        console.log("Fetching listings for user:", user.id);
        
        // Fetch user's listings
        const { data: listingsData, error: listingsError } = await supabase
          .from("listing")
          .select("*")
          .eq("userId", user.id);
  
        if (listingsError) {
          console.error("Error fetching listings:", listingsError.message);
          return;
        }

        console.log("Fetched listings:", listingsData);
        setMyListings(listingsData || []);

        // Fetch rental information for each listing
        if (listingsData && listingsData.length > 0) {
          const itemIds = listingsData.map(item => item.id);
          
          const { data: rentalsData, error: rentalsError } = await supabase
            .from("rentals")
            .select("*")
            .in("itemId", itemIds)
            .eq("status", "active");

          if (rentalsError) {
            console.error("Error fetching rentals:", rentalsError.message);
          } else {
            console.log("Fetched rentals:", rentalsData);
            // Create a map of itemId to rental info
            const rentalMap: {[key: string]: RentalInfo} = {};
            rentalsData?.forEach(rental => {
              rentalMap[rental.itemId] = rental;
            });
            setRentalInfos(rentalMap);
          }
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchUserListings();
  }, [user]);
  
  // Handler to delete an item from Supabase
  const handleDeleteItem = async (itemId: string) => {
    try {
      console.log("Attempting to delete item:", itemId);
      
      // Check if item is currently rented
      if (rentalInfos[itemId]) {
        alert("Cannot delete item that is currently rented. Please wait for it to be returned.");
        return;
      }

      const { error } = await supabase
        .from("listing")
        .delete()
        .eq("id", itemId)
        .eq("userId", user?.id);

      if (error) {
        console.error("Error deleting item:", error);
        alert(`Failed to delete item: ${error.message}`);
        return;
      }
      
      console.log("Item deleted successfully");
      
      // Update state to remove deleted item
      setMyListings(prevListings => prevListings.filter(item => item.id !== itemId));
      
      // Remove rental info if it exists
      setRentalInfos(prevRentalInfos => {
        const updated = { ...prevRentalInfos };
        delete updated[itemId];
        return updated;
      });

      alert("Item deleted successfully!");
    } catch (error) {
      console.error('Error deleting item:', error);
      alert("An error occurred while deleting the item.");
    }
  };

  // Handler to mark item as returned
  const handleMarkAsReturned = async (itemId: string) => {
    const rentalInfo = rentalInfos[itemId];
    if (!rentalInfo) return;

    try {
      const { error } = await supabase
        .from("rentals")
        .update({ status: "returned" })
        .eq("id", rentalInfo.id);

      if (error) {
        console.error("Error marking as returned:", error.message);
        alert("Failed to mark as returned. Please try again.");
        return;
      }

      // Remove from rental infos
      setRentalInfos(prevRentalInfos => {
        const updated = { ...prevRentalInfos };
        delete updated[itemId];
        return updated;
      });

      alert("Item marked as returned successfully!");
    } catch (error) {
      console.error('Error marking as returned:', error);
      alert("An error occurred while marking the item as returned.");
    }
  };

  // Function to get the first photo URL
  const getPhotoUrl = (photo: any) => {
    if (!photo) return null;
    
    console.log("Processing photo:", photo, "Type:", typeof photo);
    
    if (Array.isArray(photo) && photo.length > 0) {
      return photo[0];
    } else if (typeof photo === 'string') {
      try {
        const parsedPhotos = JSON.parse(photo);
        if (Array.isArray(parsedPhotos) && parsedPhotos.length > 0) {
          return parsedPhotos[0];
        }
      } catch {
        // If it's just a string URL
        return photo;
      }
    }
    return null;
  };
  
  if (loading || isLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center">Loading your listings...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Listings</h1>
        <Link href="/list">
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
          {myListings.map(item => {
            const isRented = rentalInfos[item.id];
            const rentalInfo = rentalInfos[item.id];
            const photoUrl = getPhotoUrl(item.photo);
            
            console.log("Rendering item:", item.name, "Photo URL:", photoUrl);
            
            return (
              <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="h-48 bg-gray-200 relative">
                  {photoUrl ? (
                    <img 
                      src={photoUrl} 
                      alt={item.name} 
                      className={`w-full h-full object-cover ${isRented ? 'opacity-75' : ''}`}
                      onError={(e) => {
                        console.error('Image failed to load:', photoUrl);
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  
                  <div className={`w-full h-full flex items-center justify-center text-gray-400 ${photoUrl ? 'hidden' : ''}`}>
                    No image
                  </div>
                  
                  {/* Rental Status Badge */}
                  {isRented && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-red-600 text-white">
                        RENTED
                      </Badge>
                    </div>
                  )}
                  
                  {/* Price Badge */}
                  <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-sm font-medium">
                    ${item.fee}/day
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <span className="text-sm bg-gray-100 px-2 py-0.5 rounded">
                      Size {item.size}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{item.brand}</p>
                  
                  {/* Rental Information */}
                  {isRented && rentalInfo && (
                    <Card className="mb-3 border-red-200 bg-red-50">
                      <CardContent className="p-3">
                        <div className="text-sm text-red-700 space-y-1">
                          <p className="font-medium">Currently Rented</p>
                          <p>Renter: {rentalInfo.renterName}</p>
                          <p>Duration: {rentalInfo.duration_days} day(s)</p>
                          <p>Available: {new Date(rentalInfo.return_date).toLocaleDateString()}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  <p className="text-sm mb-4 line-clamp-2">{item.description}</p>
                  
                  <div className="space-y-2">
                    {/* Main action buttons */}
                    <div className="flex justify-between gap-2">
                      <Link href={`/item/${item.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          View Details
                        </Button>
                      </Link>
                      
                      {!isRented && (
                        <>
                          <Link href={`/edit-item/${item.id}`}>
                            <Button variant="outline" size="sm" className="border-blue-500 text-blue-500 hover:bg-blue-50">
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
                        </>
                      )}
                    </div>
                    
                    {/* Return button for rented items */}
                    {isRented && (
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                        onClick={() => {
                          if (confirm('Mark this item as returned? This will make it available for rent again.')) {
                            handleMarkAsReturned(item.id);
                          }
                        }}
                      >
                        Mark as Returned
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}