"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, User, Clock, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import emailjs from '@emailjs/browser';

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
  fee: number;
  deposit: number;
  description: string;
  photo: string[];
  owner: string;
  userName: string;
  userEmail: string;
}

interface RentalInfo {
  id: number;
  userId: string;
  itemId: number;
  rentedAt: string;
  renterEmail: string;
  renterName: string;
  ownerEmail: string;
  ownerName: string;
  duration_days: number;
  return_date: string;
  status: string;
}

export async function trackButtonClick(
  userId: string,
  page: string,
  element: string,
  metadata: any = {}
) {
  await supabase.from('events').insert({
    user_id: userId,
    event_type: 'button_click',
    page,
    element,
    timestamp: new Date().toISOString(),
    metadata: metadata
  });
}

export default function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string>("1");
  const [rentalInfo, setRentalInfo] = useState<RentalInfo | null>(null);
  const { user, signOut, isAuthenticated } = useAuth();

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };

    resolveParams();
  }, [params]);

  const { id } = resolvedParams || {}; 

  useEffect(() => {
    if (!id) return;  

    const fetchItem = async () => {
      try {
        setLoading(true);  

        // Fetch item data
        const { data, error } = await supabase
          .from("listing")  
          .select("*")
          .eq("id", id) 
          .single(); 

        if (error) {
          throw new Error(error.message); 
        }

        setItem(data);

        // Check if item is currently rented
        const { data: rentalData, error: rentalError } = await supabase
          .from("rentals")
          .select("*")
          .eq("itemId", id)
          .eq("status", "active")
          .single();

        if (rentalData && !rentalError) {
          setRentalInfo(rentalData);
        }

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

      if (user) {
        await trackButtonClick(user.id, window.location.pathname, 'rent_this_item_button');
      }

      const durationDays = parseInt(selectedDuration);
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + durationDays);
  
      // Insert rental record with duration and return date
      const { error: rentalError } = await supabase.from("rentals").insert([
        {
          userId: user.id,
          itemId: item?.id,
          rentedAt: startDate.toISOString(),
          renterEmail: user.email,
          renterName: user.name,
          ownerEmail: item?.userEmail,
          ownerName: item?.userName,
          duration_days: durationDays,
          return_date: endDate.toISOString(),
          status: "active"
        },
      ]);
  
      if (rentalError) {
        throw new Error(`Failed to log rental: ${rentalError.message}`);
      }

      // Send email notification to both renter and owner
      const toEmails = `${item?.userEmail}, ${user.email}`;
      const totalCost = (item?.fee || 0) * durationDays;

      try {
        await emailjs.send('service_nla0ot8', 'template_x867sks', {
          owner_name: item?.userName,
          renter_name: user.name,
          item_name: item?.name,
          owner_email: item?.userEmail,
          renter_email: user.email,
          rental_fee: totalCost,
          security_deposit: item?.deposit,
          rental_duration: durationDays,
          rental_start_date: startDate.toLocaleDateString(),
          rental_end_date: endDate.toLocaleDateString(),
          email: toEmails,  
        }, 'qa1eAXMv6yKYqBlBf');
        
        console.log('Email sent successfully!');
      } catch (emailError) {
        console.error('Email failed to send:', emailError);
        // Don't fail the rental if email fails
      }
  
      alert(`Item rented for ${durationDays} day(s)! You'll receive an email with the owner's contact information shortly.`);
      window.location.reload();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsReturned = async () => {
    if (!rentalInfo || !user) return;

    try {
      setLoading(true);

      // Update rental status to returned
      const { error } = await supabase
        .from("rentals")
        .update({ status: "returned" })
        .eq("id", rentalInfo.id);

      if (error) {
        throw new Error(`Failed to mark as returned: ${error.message}`);
      }

      // Send return confirmation email
      try {
        const toEmails = `${rentalInfo.ownerEmail}, ${rentalInfo.renterEmail}`;
        
        await emailjs.send('service_nla0ot8', 'template_return_notification', {
          owner_name: rentalInfo.ownerName,
          renter_name: rentalInfo.renterName,
          item_name: item?.name,
          owner_email: rentalInfo.ownerEmail,
          renter_email: rentalInfo.renterEmail,
          return_date: new Date().toLocaleDateString(),
          rental_duration: rentalInfo.duration_days,
          email: toEmails,
        }, 'qa1eAXMv6yKYqBlBf');
        
        console.log('Return notification email sent!');
      } catch (emailError) {
        console.error('Return email failed to send:', emailError);
        // Don't fail the return process if email fails
      }

      alert("Item marked as returned! It's now available for rent again.");
      window.location.reload();
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

  const isRented = rentalInfo !== null;
  const selectedDurationPrice = item.fee * parseInt(selectedDuration);
  const isMyRental = rentalInfo && user && rentalInfo.userId === user.id;
  const isOwner = user && item.userEmail === user.email;

  const durationOptions = [
    { value: "1", label: "1 day", price: item.fee * 1 },
    { value: "3", label: "3 days", price: item.fee * 3 },
    { value: "7", label: "1 week", price: item.fee * 7 },
    { value: "14", label: "2 weeks", price: item.fee * 14 },
    { value: "30", label: "1 month", price: item.fee * 30 },
  ];

  return (
    <main className="max-w-6xl mx-auto py-12 px-4">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="aspect-[3/4] rounded-lg overflow-hidden border relative">
            {isRented && (
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                Currently Rented
              </div>
            )}
            <img
              src={item.photo?.[selectedImage] || "/placeholder.svg"}
              alt={item.name}
              className={`w-full h-full object-cover ${isRented ? 'opacity-75' : ''}`}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {item.photo?.map((photoUrl, index) => (
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

        <div className="space-y-6">
          <div>
            <h1 className="font-serif text-3xl font-bold">{item.name}</h1>
            <p className="text-gray-500">
              {item.brand} · Size {item.size}
            </p>
            {isRented && rentalInfo && (
              <div className="mt-2 space-y-1">
                <p className="text-red-600 font-medium">
                  Rented for {rentalInfo.duration_days} day(s)
                </p>
                <p className="text-red-600 text-sm">
                  Available again on {new Date(rentalInfo.return_date).toLocaleDateString()}
                </p>
                <p className="text-gray-600 text-sm">
                  Rented by: {rentalInfo.renterName}
                </p>
              </div>
            )}
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
              <span>{item.userName || item.owner}</span>
            </div>
          </div>

          {/* Rental Status Card */}
          {isRented && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <h3 className="font-medium text-red-800 mb-2">Rental Information</h3>
                <div className="text-sm text-red-700 space-y-1">
                  <p>• Rental Duration: {rentalInfo?.duration_days} day(s)</p>
                  <p>• Rented on: {rentalInfo ? new Date(rentalInfo.rentedAt).toLocaleDateString() : ''}</p>
                  <p>• Available on: {rentalInfo ? new Date(rentalInfo.return_date).toLocaleDateString() : ''}</p>
                  <p>• Current Renter: {rentalInfo?.renterName}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {!isRented && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-3">Select Rental Duration</h3>
                <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label} - ${option.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-600 mt-2">
                  Total cost: ${selectedDurationPrice} + ${item.deposit} deposit
                </p>
              </CardContent>
            </Card>
          )}

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
                    <p className="text-sm text-gray-500">1-30 days</p>
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
                  <p className="font-serif font-medium text-lg">{item.userName || item.owner}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="pt-6 space-y-2">
            {isRented ? (
              <>
                <Button className="w-full bg-gray-400 text-white" disabled>
                  Currently Rented - Available {rentalInfo ? new Date(rentalInfo.return_date).toLocaleDateString() : ''}
                </Button>
                {(isMyRental || isOwner) && (
                  <Button 
                    variant="outline"
                    className="w-full border-green-600 text-green-600 hover:bg-green-50" 
                    onClick={handleMarkAsReturned}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Mark as Returned'}
                  </Button>
                )}
              </>
            ) : (
              <Button 
                className="w-full bg-[#8c1515] hover:bg-[#6f1111] text-white" 
                onClick={handleRentItem}
                disabled={loading}
              >
                {loading ? 'Processing...' : `Rent for ${selectedDuration} day(s) - $${selectedDurationPrice}`}
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}