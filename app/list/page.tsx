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
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/useAuth"
import { trackButtonClick } from "../item/[id]/page"

export default function ListItemPage() {
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    size: "",
    category: "",
    fee: "",
    deposit: "",
    description: "",
    photo: ""
  })
  

  // Mock user data - in a real app, this would come from authentication
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  // Mock image upload
  const handleImageUpload = () => {
    setLoading(true)
    // Simulate upload delay
    setTimeout(() => {
      setImages([...images, `/placeholder.svg?height=400&width=300&text=Image ${images.length + 1}`])
      setLoading(false)
    }, 1000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
  
    if (userError || !user) {
      setLoading(false)
      alert("You must be signed in to list an item.")
      return
    }

    if (user) {
      await trackButtonClick(user.id, window.location.pathname, 'list_item_button');
    }
  
    const userId = user.id
    const userEmail = user.email
    const userName = user.user_metadata?.full_name
  
    const { error } = await supabase.from("listing").insert([
      {
        name: formData.name,
        brand: formData.brand,
        size: formData.size,
        category: formData.category,
        fee: Number(formData.fee),
        deposit: Number(formData.deposit),
        description: formData.description,
        photo: images,
        userId: userId,
        userEmail: userEmail,
        userName: userName
      },
    ])
  
    setLoading(false)
  
    if (error) {
      console.error("Insert error:", error)
      alert("There was an error listing your item.")
    } else {
      alert("Your item was listed successfully!")
      setFormData({
        name: "",
        brand: "",
        size: "",
        category: "",
        fee: "",
        deposit: "",
        description: "",
        photo: ""
      })
      setImages([])
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
  
    setLoading(true)
    const uploadedImageUrls: string[] = []
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `public/${fileName}`
  
      // Upload to Supabase Storage
      const { error } = await supabase.storage
        .from("images")
        .upload(filePath, file)
  
      if (error) {
        console.error("Upload error:", error)
        alert("Error uploading image")
        continue
      }
  
      // Get public URL
      const { data: publicUrlData } = supabase
        .storage
        .from("images")
        .getPublicUrl(filePath)
  
      uploadedImageUrls.push(publicUrlData.publicUrl)
    }
  
    setImages((prev) => [...uploadedImageUrls, ...prev])
    setLoading(false)
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
                    <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Black Formal Dress" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input id="brand" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} placeholder="e.g., Zara, H&M, etc." required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size">Size</Label>
                    <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })} required>
                      <SelectTrigger id="size">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Free">Free</SelectItem>
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
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })} required>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="formal">Formal Wear</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="outerwear">Outerwear</SelectItem>
                        <SelectItem value="athletic">Athletic</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rental-fee">Rental Fee ($ per day)</Label>
                    <Input id="rental-fee" value={formData.fee} onChange={(e) => setFormData({ ...formData, fee: e.target.value })} type="number" min="0" step="1" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deposit">Security Deposit ($)</Label>
                    <Input id="deposit" value={formData.deposit} onChange={(e) => setFormData({ ...formData, deposit: e.target.value })} type="number" min="0" step="1" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your item, including condition, fit, and any other relevant details."
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Photos</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="photos"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      onClick={() => document.getElementById('photos')?.click()}
                      className="bg-[#8c1515] hover:bg-[#6f1111] text-white"
                    >
                      Choose Files
                    </Button>
                  </div>
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
                <h3 className="font-medium text-lg">{user?.name || "Your Name"}</h3>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wider">Contact Information</h4>

                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{user?.name || "Your Name"}</span>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Instagram (Optional)</p>
                  <p className="text-sm">{user?.instagram || "Not provided"}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  Privacy Note
                </h4>
                <p className="text-xs text-gray-500">
                  Your email and phone number are never shared publicly.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
