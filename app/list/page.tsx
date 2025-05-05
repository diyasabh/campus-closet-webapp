"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, User, Info } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function ListItemPage() {
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  // Mock user data - in a real app, this would come from authentication
  const userData = {
    name: "Emma Stanford",
    email: "estanford@stanford.edu",
    profilePicture: "/placeholder.svg?height=100&width=100&text=Profile",
    instagram: "@stanford_emma",
    phone: "(650) 123-4567",
  }

  // Mock image upload
  const handleImageUpload = () => {
    setLoading(true)
    // Simulate upload delay
    setTimeout(() => {
      setImages([...images, `/placeholder.svg?height=400&width=300&text=Image ${images.length + 1}`])
      setLoading(false)
    }, 1000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit the form data to the server
    alert("Your item has been listed successfully!")
  }

  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="font-serif text-3xl font-bold mb-8">List Your Item</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Item Details</CardTitle>
              <CardDescription>Provide details about the clothing item you want to rent out</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Item Name</Label>
                    <Input id="name" placeholder="e.g., Black Formal Dress" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input id="brand" placeholder="e.g., Zara, H&M, etc." required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size">Size</Label>
                    <Select required>
                      <SelectTrigger id="size">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="XS">XS</SelectItem>
                        <SelectItem value="S">S</SelectItem>
                        <SelectItem value="M">M</SelectItem>
                        <SelectItem value="L">L</SelectItem>
                        <SelectItem value="XL">XL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select required>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="formal">Formal Wear</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="outerwear">Outerwear</SelectItem>
                        <SelectItem value="athletic">Athletic</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rental-fee">Rental Fee ($ per day)</Label>
                    <Input id="rental-fee" type="number" min="1" step="1" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deposit">Security Deposit ($)</Label>
                    <Input id="deposit" type="number" min="10" step="5" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your item, including condition, fit, and any other relevant details."
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Photos</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((img, index) => (
                      <div key={index} className="aspect-square rounded-md overflow-hidden border">
                        <img
                          src={img || "/placeholder.svg"}
                          alt={`Item photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={handleImageUpload}
                      disabled={loading}
                      className="aspect-square rounded-md border-2 border-dashed flex flex-col items-center justify-center p-4 hover:bg-gray-50 transition-colors"
                    >
                      {loading ? (
                        <div className="animate-pulse">Uploading...</div>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">Add Photo</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">Upload up to 6 photos. First photo will be the cover image.</p>
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full bg-[#8c1515] hover:bg-[#6f1111] text-white">
                    List Item
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Profile Information Section */}
        <div>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle className="font-serif">Your Profile</CardTitle>
                <Info className="h-4 w-4 text-gray-400" />
              </div>
              <CardDescription>This information will be visible to users viewing your listing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-200 mb-3">
                  <img
                    src={userData.profilePicture || "/placeholder.svg"}
                    alt="Your profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-medium text-lg">{userData.name}</h3>
                <p className="text-sm text-gray-500">Stanford '25</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wider">Contact Information</h4>

                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{userData.name}</span>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Instagram (Optional)</p>
                  <p className="text-sm">{userData.instagram}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  Privacy Note
                </h4>
                <p className="text-xs text-gray-500">
                  Your email and phone number are never shared publicly. Other users can contact you through the Campus
                  Closet messaging system.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
