"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin, User, Clock, Shield } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase"

// This would come from a database in a real app
const ITEM = {
  id: 1,
  name: "Formal Dress",
  brand: "Reformation",
  size: "S",
  price: 15,
  deposit: 50,
  description:
    "Beautiful black formal dress, perfect for events and parties. Worn only twice and in excellent condition. The fabric is high quality and has a slight stretch for comfort.",
  images: [
    "/placeholder.svg?height=600&width=400",
    "/placeholder.svg?height=600&width=400",
    "/placeholder.svg?height=600&width=400",
    "/placeholder.svg?height=600&width=400",
  ],
  owner: {
    name: "Emma S.",
    rating: 4.8,
    responseTime: "Within 2 hours",
  },
}

export default function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [item, setItem] = useState(null);  // Store the item data
  const [loading, setLoading] = useState(true);  // To handle loading state
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);  // Manage image selection
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

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
  
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
  
      if (userError || !user) {
        throw new Error("User must be logged in to rent an item.");
      }
  
      // 1. Log rental in 'rentals' table
      const { error: rentalError } = await supabase.from("rentals").insert([
        {
          user_id: user.id,
          item_id: item.id,
          rented_at: new Date().toISOString(),
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
              src={item.photo || "/placeholder.svg"}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedImage(0)}
                className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                  selectedImage === 0 ? "border-[#8c1515]" : "border-transparent"
                }`}
              >
          <img
            src={item.photo || "/placeholder.svg"}
            alt={`${item.name} view`}
            className="w-full h-full object-cover"
          />
        </button>
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
                  <p className="font-serif font-medium text-lg">{item.owner}</p>
                  <p className="text-sm text-gray-500">Stanford '25 · Computer Science</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(item.owner) ? "text-yellow-400" : "text-gray-300"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">{item.owner} rating</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-[#8c1515]" />
                </div>
                <div>
                  <p className="font-medium">Response Time</p>
                  <p className="text-sm text-gray-500">{item.owner}</p>
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
