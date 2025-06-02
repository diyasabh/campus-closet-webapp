"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/useAuth"

interface EditItemPageProps {
  params: Promise<{ id: string }>;
}

export default function EditItemPage({ params }: EditItemPageProps) {
  const router = useRouter()
  const { user, loading: authLoading, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [itemLoading, setItemLoading] = useState(true)
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    size: "",
    category: "",
    fee: "",
    deposit: "",
    description: "",
  })

  // Resolve params
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  const { id } = resolvedParams || {};

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch item data
  useEffect(() => {
    const fetchItem = async () => {
      if (!id || !user) return;

      try {
        setItemLoading(true);
        
        const { data, error } = await supabase
          .from("listing")
          .select("*")
          .eq("id", id)
          .eq("userId", user.id) // Ensure user can only edit their own items
          .single();

        if (error) {
          console.error("Error fetching item:", error);
          alert("Item not found or you don't have permission to edit it.");
          router.push("/profile/listings");
          return;
        }

        // Populate form with existing data
        setFormData({
          name: data.name || "",
          brand: data.brand || "",
          size: data.size || "",
          category: data.category || "",
          fee: data.fee?.toString() || "",
          deposit: data.deposit?.toString() || "",
          description: data.description || "",
        });

        // Handle photos
        if (data.photo) {
          if (Array.isArray(data.photo)) {
            setImages(data.photo);
          } else if (typeof data.photo === 'string') {
            try {
              const parsedPhotos = JSON.parse(data.photo);
              if (Array.isArray(parsedPhotos)) {
                setImages(parsedPhotos);
              } else {
                setImages([data.photo]);
              }
            } catch {
              setImages([data.photo]);
            }
          }
        }

      } catch (err) {
        console.error("Unexpected error:", err);
        alert("An error occurred while loading the item.");
        router.push("/profile/listings");
      } finally {
        setItemLoading(false);
      }
    };

    fetchItem();
  }, [id, user, router]);

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
  
    setImages((prev) => [...prev, ...uploadedImageUrls])
    setLoading(false)
  }

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!user || !id) {
      alert("Authentication error. Please log in again.")
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase
        .from("listing")
        .update({
          name: formData.name,
          brand: formData.brand,
          size: formData.size,
          category: formData.category,
          fee: Number(formData.fee),
          deposit: Number(formData.deposit),
          description: formData.description,
          photo: images,
        })
        .eq("id", id)
        .eq("userId", user.id); // Ensure user can only update their own items

      if (error) {
        console.error("Update error:", error)
        alert("There was an error updating your item.")
      } else {
        alert("Your item was updated successfully!")
        router.push("/profile/listings")
      }
    } catch (err) {
      console.error("Unexpected error:", err)
      alert("An error occurred while updating the item.")
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || itemLoading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="outline" 
          onClick={() => router.push("/profile/listings")}
        >
          ← Back to Listings
        </Button>
        <h1 className="font-serif text-3xl font-bold">Edit Item</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Edit Item Details</CardTitle>
          <CardDescription>Update the details of your clothing item</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  placeholder="e.g., Black Formal Dress" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input 
                  id="brand" 
                  value={formData.brand} 
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })} 
                  placeholder="e.g., Zara, H&M, etc." 
                  required 
                />
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
                <Input 
                  id="rental-fee" 
                  value={formData.fee} 
                  onChange={(e) => setFormData({ ...formData, fee: e.target.value })} 
                  type="number" 
                  min="0" 
                  step="1" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deposit">Security Deposit ($)</Label>
                <Input 
                  id="deposit" 
                  value={formData.deposit} 
                  onChange={(e) => setFormData({ ...formData, deposit: e.target.value })} 
                  type="number" 
                  min="0" 
                  step="1" 
                  required 
                />
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
                  disabled={loading}
                >
                  Add More Photos
                </Button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="aspect-square rounded-md overflow-hidden border relative group">
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`Item photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">First photo will be the cover image.</p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                className="flex-1 bg-[#8c1515] hover:bg-[#6f1111] text-white"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Item"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push("/profile/listings")}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}