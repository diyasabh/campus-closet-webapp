"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ListItemPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    size: "",
    category: "",
    price: "",
    deposit: "",
    description: "",
  });
  
  const [photos, setPhotos] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/");
    }
  }, [loading, isAuthenticated, router]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setPhotos([...photos, reader.result as string]);
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Item name is required";
    }
    
    if (!formData.size) {
      newErrors.size = "Size is required";
    }
    
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    
    if (!formData.price.trim()) {
      newErrors.price = "Rental fee is required";
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Rental fee must be a positive number";
    }
    
    if (!formData.deposit.trim()) {
      newErrors.deposit = "Security deposit is required";
    } else if (isNaN(Number(formData.deposit)) || Number(formData.deposit) <= 0) {
      newErrors.deposit = "Security deposit must be a positive number";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (photos.length === 0) {
      newErrors.photos = "At least one photo is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm() && user) {
      setIsSubmitting(true);
      
      try {
        // Generate a unique ID
        const itemId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        
        // Create new item object
        const newItem = {
          id: itemId,
          title: formData.title,
          brand: formData.brand,
          size: formData.size,
          category: formData.category,
          price: Number(formData.price),
          deposit: Number(formData.deposit),
          description: formData.description,
          photos: photos,
          userId: user.id,
          createdAt: new Date().toISOString(),
        };
        
        // Get existing items from localStorage
        const itemsJson = localStorage.getItem('clothingItems');
        const items = itemsJson ? JSON.parse(itemsJson) : [];
        
        // Add new item
        items.push(newItem);
        
        // Save updated items
        localStorage.setItem('clothingItems', JSON.stringify(items));
        
        // Redirect to listings page
        router.push("/profile/listings");
      } catch (error) {
        console.error('Error creating listing:', error);
        setErrors({ form: "An error occurred while creating your listing" });
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Redirecting, handled in useEffect
  }
  
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">List Your Item</h1>
      
      {errors.form && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {errors.form}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="title">Item Name</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Black Formal Dress"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>
            
            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g., Zara, H&M, etc."
              />
            </div>
            
            <div>
              <Label htmlFor="size">Size</Label>
              <select
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${errors.size ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">Select size</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
                <option value="FREE">Free Size</option>
                <option value="N/A">N/A</option>
              </select>
              {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size}</p>}
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${errors.category ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">Select category</option>
                <option value="Dresses">Dresses</option>
                <option value="Tops">Tops</option>
                <option value="Bottoms">Bottoms</option>
                <option value="Outerwear">Outerwear</option>
                <option value="Formal">Formal Wear</option>
                <option value="Accessories">Accessories</option>
                <option value="Costumes">Costumes</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>
            
            <div>
              <Label htmlFor="price">Rental Fee ($ per day)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
            
            <div>
              <Label htmlFor="deposit">Security Deposit ($)</Label>
              <Input
                id="deposit"
                name="deposit"
                type="number"
                min="0"
                step="0.01"
                value={formData.deposit}
                onChange={handleChange}
                className={errors.deposit ? "border-red-500" : ""}
              />
              {errors.deposit && <p className="text-red-500 text-sm mt-1">{errors.deposit}</p>}
            </div>
          </div>
          
          <div className="mb-6">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe your item, including condition, fit, and any other relevant details."
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
          
          <div className="mb-6">
            <Label>Photos</Label>
            <div className="mt-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative h-32 bg-gray-100 rounded overflow-hidden">
                    <img src={photo} alt={`Item photo ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
                
                {photos.length < 6 && (
                  <label className="h-32 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                    <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-sm text-gray-500">Add Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="text-sm text-gray-500">Upload up to 6 photos. First photo will be the cover image.</p>
              {errors.photos && <p className="text-red-500 text-sm mt-1">{errors.photos}</p>}
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <Button
              type="submit"
              className="bg-[#8c1515] hover:bg-[#6f1111] text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Listing Item..." : "List Item"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}