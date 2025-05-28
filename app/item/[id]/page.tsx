"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, User, Clock, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import emailjs from 'emailjs-com';

interface ItemOwner {
  name: string;
  rating: number;
  responseTime: string;
}

interface Item {
  id: number;
  name: string;
  brand: string;
  size: string;
  category: string;
  price: number;
  deposit: number;
  description: string;
  images: string[];
  owner: ItemOwner;
}

// This would come from a database in a real app
const ITEMS: Items = {
  18: {
    id: 18,
    name: "Long Blue Evening Dress",
    brand: "(Tulum, Mexico)",
    size: "Free",
    category: "formal",
    price: 10,
    deposit: 15,
    description: "Beautiful long blue evening dress from Tulum, Mexico. Perfect for formal events, parties, or special occasions. The dress features a flowing design with elegant details. Worn only once and in excellent condition.",
    images: [
      "/images/long_bluedress.jpg",
      "/images/long_bluedress.jpg", // Using same image for demo
      "/images/long_bluedress.jpg", // Using same image for demo
      "/images/long_bluedress.jpg", // Using same image for demo
    ],
    owner: {
      name: "NaYoung S.",
      rating: 4.9,
      responseTime: "Within 1 hour",
    },
  },
  19: {
    id: 19,
    name: "Blue Midi Dress",
    brand: "H&M",
    size: "S",
    category: "formal",
    price: 5,
    deposit: 10,
    description: "Stylish blue midi dress from H&M. Perfect for both casual and formal occasions. The dress features a flattering silhouette and comfortable fit. In excellent condition with minimal wear.",
    images: [
      "/images/midi_bluedress.jpg",
      "/images/midi_bluedress.jpg", // Using same image for demo
      "/images/midi_bluedress.jpg", // Using same image for demo
      "/images/midi_bluedress.jpg", // Using same image for demo
    ],
    owner: {
      name: "NaYoung S.",
      rating: 4.9,
      responseTime: "Within 1 hour",
    },
  },
  20: {
    id: 20,
    name: "Piglet Onesie",
    brand: "Amazon",
    size: "M",
    category: "casual",
    price: 5,
    deposit: 10,
    description: "Adorable Piglet onesie from Amazon. Perfect for costume parties, casual wear, or just staying cozy at home. Made of soft, comfortable material. In like-new condition.",
    images: [
      "/images/piglet_onsie.jpg",
      "/images/piglet_onsie.jpg", // Using same image for demo
      "/images/piglet_onsie.jpg", // Using same image for demo
      "/images/piglet_onsie.jpg", // Using same image for demo
    ],
    owner: {
      name: "NaYoung S.",
      rating: 4.9,
      responseTime: "Within 1 hour",
    },
  },
}

export default function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [item, setItem] = useState(null);  // Store the item data
  const [loading, setLoading] = useState(true);  // To handle loading state
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);  // Manage image selection
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const { user, signOut, isAuthenticated } = useAuth(); // Get current user

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };

    resolveParams();
  }, [params]);

  const { id } = resolvedParams || {}; 

  // Fetch item data when the component mounts or when `id` changes
  useEffect(() => {
    if (!id) return;  

    const fetchItem = async () => {
      try {
        setLoading(true);  

        // Fetch item data from Supabase by id
        const { data, error } = await supabase
          .from("listing")  
          .select("*")
          .eq("id", id) 
          .single(); 

        if (error) {
          throw new Error(error.message); 
        }

        setItem(data);  
      } catch (err: any) {
        setError(err.message);  
      } finally {
        setLoading(false); 
      }
    };

    fetchItem();
  }, [id]);

  const handleRentItem = async () => {
    try {
      setLoading(true);
  
      if (!user) {
        throw new Error("User must be logged in to rent an item.");
      }
  
      // 1. Log rental in 'rentals' table
      const { error: rentalError } = await supabase.from("rentals").insert([
        {
          userId: user.id,
          itemId: item.id,
          rentedAt: new Date().toISOString(),
          renterEmail: user.email,
          renterName: user.name,
          ownerEmail: item.userEmail,
          ownerName: item.userName
        },
      ]);
  
      if (rentalError) {
        throw new Error(`Failed to log rental: ${rentalError.message}`);
      }
  
      // 2. Delete the item from the listings table
      const { error: deleteError } = await supabase
        .from("listing")
        .delete()
        .eq("id", item.id);
  
      if (deleteError) {
        throw new Error(`Failed to delete item: ${deleteError.message}`);
      }

      const toEmails = `${item.userEmail}, ${user.email}`

      emailjs.send('service_nla0ot8', 'template_x867sks', {
        owner_name: item.userName,
        renter_name: user.name,
        item_name: item.name,
        owner_email: item.userEmail,
        renter_email: user.email,
        rental_fee: item.fee,
        security_deposit: item.deposit,
        email: toEmails,  
      }, 'qa1eAXMv6yKYqBlBf');
  
      alert("Item rented successfully!");
      // Optional: redirect or refresh
      // router.push("/"); or location.reload();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;  
  }

  if (error) {
    return <div>Error: {error}</div>;  
  }

  if (!item) {
    return <div>Item not found</div>; 
  }

  return (
    <main className="max-w-6xl mx-auto py-12 px-4">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-[3/4] rounded-lg overflow-hidden border">
            <img
            src={item.photo[selectedImage] || "/placeholder.svg"}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {item.photo.map((photoUrl, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                  selectedImage === index ? "border-[#8c1515]" : "border-transparent"
                }`}
              >
                <img
                  src={photoUrl || "/placeholder.svg"}
                  alt={`${item.name} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Item Details */}
        <div className="space-y-6">
          <div>
            <h1 className="font-serif text-3xl font-bold">{item.name}</h1>
            <p className="text-gray-500">
              {item.brand} · Size {item.size}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-serif text-2xl font-bold">
                ${item.fee}
                <span className="text-sm font-normal text-gray-500">/day</span>
              </p>
              <p className="text-sm text-gray-500">${item.deposit} security deposit</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200"></div>
              <span>{item.owner}</span>
            </div>
          </div>

          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="rental">Rental Info</TabsTrigger>
              <TabsTrigger value="owner">Owner</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 pt-4">
              <p>{item.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                    <User className="h-5 w-5 text-[#8c1515]" />
                  </div>
                  <div>
                    <p className="font-medium">Size</p>
                    <p className="text-sm text-gray-500">{item.size}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-[#8c1515]" />
                  </div>
                  <div>
                    <p className="font-medium">Brand</p>
                    <p className="text-sm text-gray-500">{item.brand}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rental" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-[#8c1515]" />
                  </div>
                  <div>
                    <p className="font-medium">Rental Period</p>
                    <p className="text-sm text-gray-500">1-14 days</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-[#8c1515]" />
                  </div>
                  <div>
                    <p className="font-medium">Pickup/Return</p>
                    <p className="text-sm text-gray-500">On campus</p>
                  </div>
                </div>
              </div>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-serif font-medium mb-2">Rental Policy</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Return in the same condition</li>
                    <li>• Deposit refunded upon safe return</li>
                    <li>• Cleaning not required (but appreciated)</li>
                    <li>• Damage may result in partial/full deposit loss</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="owner" className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-200"></div>
                <div>
                  <p className="font-serif font-medium text-lg">{item.userName}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="pt-6">
            <Button className="w-full bg-[#8c1515] hover:bg-[#6f1111] text-white" onClick={handleRentItem}>Rent This Item</Button>
          </div>
        </div>
      </div>
    </main>
  );
}
