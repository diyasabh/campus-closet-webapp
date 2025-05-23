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

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin, User, Clock, Shield } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

export default function ItemDetailPage({ params }: { params: { id: string } }) {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <main className="max-w-6xl mx-auto py-12 px-4">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-[3/4] rounded-lg overflow-hidden border">
            <img
              src={ITEM.images[selectedImage] || "/placeholder.svg"}
              alt={ITEM.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {ITEM.images.map((img, index) => (
              <button
                onClick={() => setSelectedImage(0)}
                className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                  selectedImage === index ? "border-[#8c1515]" : "border-transparent"
                }`}
              >
                <img
                  src={img || "/placeholder.svg"}
                  alt={`${ITEM.name} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Item Details */}
        <div className="space-y-6">
          <div>
            <h1 className="font-serif text-3xl font-bold">{ITEM.name}</h1>
            <p className="text-gray-500">
              {ITEM.brand} · Size {ITEM.size}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-serif text-2xl font-bold">
                ${ITEM.price}
                <span className="text-sm font-normal text-gray-500">/day</span>
              </p>
              <p className="text-sm text-gray-500">${ITEM.deposit} security deposit</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200"></div>
              <span>{ITEM.owner.name}</span>
            </div>
          </div>

          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="rental">Rental Info</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 pt-4">
              <p>{ITEM.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                    <User className="h-5 w-5 text-[#8c1515]" />
                  </div>
                  <div>
                    <p className="font-medium">Size</p>
                    <p className="text-sm text-gray-500">{ITEM.size}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-[#8c1515]" />
                  </div>
                  <div>
                    <p className="font-medium">Brand</p>
                    <p className="text-sm text-gray-500">{ITEM.brand}</p>
                  </div>
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

            <TabsContent value="owner" className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-200"></div>
                <div>
                  <p className="font-serif font-medium text-lg">{ITEM.owner.name}</p>
                  <p className="text-sm text-gray-500">Stanford '25 · Computer Science</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(ITEM.owner.rating) ? "text-yellow-400" : "text-gray-300"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">{ITEM.owner.rating} rating</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-[#8c1515]" />
                </div>
                <div>
                  <p className="font-medium">Response Time</p>
                  <p className="text-sm text-gray-500">{ITEM.owner.responseTime}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="pt-6">
            <Button className="w-full bg-[#8c1515] hover:bg-[#6f1111] text-white">Rent This Item</Button>
          </div>
        </div>
      </div>
    </main>
  );
}
