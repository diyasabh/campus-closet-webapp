"use client";

import { useState, use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, User, Clock, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

interface Items {
  [key: number]: Item;
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
};

export default function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const resolvedParams = use(params);
  const item = ITEMS[parseInt(resolvedParams.id)];

  if (!item) {
    return (
      <main className="max-w-6xl mx-auto py-12 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Item Not Found</h1>
          <p className="text-gray-600">The item you're looking for doesn't exist.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto py-12 px-4">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-[3/4] rounded-lg overflow-hidden border">
            <img
              src={item.images[selectedImage]}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {item.images.map((img: string, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                  selectedImage === index
                    ? "border-[#8c1515]"
                    : "border-transparent"
                }`}
              >
                <img
                  src={img}
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
            <h1 className="font-serif text-3xl font-bold text-black mb-2">
              {item.name}
            </h1>
            <p className="text-lg text-gray-600">{item.brand}</p>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span>Listed by {item.owner.name}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>Response time: {item.owner.responseTime}</span>
            </div>
          </div>

          <div className="border-t border-b py-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-2xl font-bold text-black">${item.price}/day</p>
                <p className="text-sm text-gray-600">${item.deposit} deposit</p>
              </div>
              <Button className="bg-[#8c1515] hover:bg-[#6f1111] text-white">
                Rent Now
              </Button>
            </div>
          </div>

          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="rental">Rental Info</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Size</p>
                  <p className="font-medium">{item.size}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-medium">{item.category}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Description</p>
                <p className="text-gray-800">{item.description}</p>
              </div>
            </TabsContent>
            <TabsContent value="rental" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <Shield className="h-5 w-5 text-[#8c1515] mt-1" />
                      <div>
                        <h3 className="font-medium mb-1">Security Deposit</h3>
                        <p className="text-sm text-gray-600">
                          A ${item.deposit} security deposit is required and will be
                          refunded after the item is returned in good condition.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Calendar className="h-5 w-5 text-[#8c1515] mt-1" />
                      <div>
                        <h3 className="font-medium mb-1">Rental Period</h3>
                        <p className="text-sm text-gray-600">
                          Minimum rental period is 1 day. Extend your rental by
                          contacting the owner.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <MapPin className="h-5 w-5 text-[#8c1515] mt-1" />
                      <div>
                        <h3 className="font-medium mb-1">Pickup Location</h3>
                        <p className="text-sm text-gray-600">
                          Arrange pickup on campus with the owner after booking.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
