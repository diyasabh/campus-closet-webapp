// app/edit-item/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useSupabaseAnalytics } from "@/hooks/useSupabaseAnalytics";

interface ClothingItem {
  id: number;
  name: string;
  brand: string;
  size: string;
  category: string;
  fee: number;
  deposit: number;
  description: string;
  photo: string;
  owner: string;
  user_id: string;
}

export default function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { trackUserEngagement } = useSupabaseAnalytics();
  const [loading, setLoading] = useState(false);
  const [fetchingItem, setFetchingItem] = useState(true);
  const [itemId, setItemId] = useState<string>("");
  const [formData, setFormData] = useState<ClothingItem>({
    id: 0,
    name: "",
    brand: "",
    size: "",
    category: "",
    fee: 0,
    deposit: 0,
    description: "",
    photo: "",
    owner: "",
    user_id: "",
  });

  // Resolve params and fetch item data
  useEffect(() => {
    const loadItem = async () => {
      try {
        const resolvedParams = await params;
        const id = resolvedParams.id;
        setItemId(id);

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          alert("You must be logged in to edit items");
          router.push('/');
          return;
        }

        // Fetch the item from Supabase
        const { data: item, error } = await supabase
          .from('listing')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching item:', error);
          alert('Item not found');
          router.push('/profile/listings');
          return;
        }

        // Check if user owns this item
        if (item.user_id !== user.id) {
          alert("You can only edit your own items");
          router.push('/profile/listings');
          return;
        }

        // Populate form with existing data
        setFormData({
          id: item.id,
          name: item.name || "",
          brand: item.brand || "",
          size: item.size || "",
          category: item.category || "",
          fee: item.fee || 0,
          deposit: item.deposit || 0,
          description: item.description || "",
          photo: item.photo || "",
          owner: item.owner || "",
          user_id: item.user_id || "",
        });

        // Track edit page view
        trackUserEngagement('edit_item_page_view', {
          item_id: item.id,
          item_name: item.name
        });

      } catch (error: any) {
        console.error('Error loading item:', error);
        alert('Error loading item');
        router.push('/profile/listings');
      } finally {
        setFetchingItem(false);
      }
    };

    loadItem();
  }, [params, router, trackUserEngagement]);

  const handleInputChange = (field: keyof ClothingItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);

      // Track edit attempt
      trackUserEngagement('item_edit_attempt', {
        item_id: formData.id,
        item_name: formData.name
      });

      // Update the item in Supabase
      const { error } = await supabase
        .from('listing')
        .update({
          name: formData.name,
          brand: formData.brand,
          size: formData.size,
          category: formData.category,
          fee: formData.fee,
          deposit: formData.deposit,
          description: formData.description,
          photo: formData.photo || '/placeholder.svg',
          owner: formData.owner,
          updated_at: new Date().toISOString()
        })
        .eq('id', formData.id);

      if (error) {
        console.error('Error updating item:', error);
        alert(`Error updating item: ${error.message}`);
        
        // Track edit failure
        trackUserEngagement('item_edit_failed', {
          item_id: formData.id,
          error: error.message
        });
        return;
      }

      // Track successful edit
      trackUserEngagement('item_edit_success', {
        item_id: formData.id,
        item_name: formData.name
      });

      alert("Item updated successfully!");
      
      // Redirect back to listings
      router.push('/profile/listings');
      
    } catch (error: any) {
      console.error('Unexpected error:', error);
      alert(`Unexpected error: ${error.message}`);
      
      // Track unexpected errors
      trackUserEngagement('item_edit_error', {
        item_id: formData.id,
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
      return;
    }

    try {
      setLoading(true);

      // Track delete attempt
      trackUserEngagement('item_delete_attempt', {
        item_id: formData.id,
        item_name: formData.name
      });

      // Delete the item from Supabase
      const { error } = await supabase
        .from('listing')
        .delete()
        .eq('id', formData.id);

      if (error) {
        console.error('Error deleting item:', error);
        alert(`Error deleting item: ${error.message}`);
        return;
      }

      // Track successful deletion
      trackUserEngagement('item_delete_success', {
        item_id: formData.id,
        item_name: formData.name
      });

      alert("Item deleted successfully!");
      
      // Redirect back to listings
      router.push('/profile/listings');
      
    } catch (error: any) {
      console.error('Unexpected error:', error);
      alert(`Unexpected error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingItem) {
    return (
      <main className="max-w-2xl mx-auto py-12 px-4">
        <div className="text-center">
          <p>Loading item...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Edit Your Item</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Item Name */}
            <div>
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Blue Evening Dress"
                required
              />
            </div>

            {/* Brand */}
            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                type="text"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                placeholder="e.g., H&M, Zara, etc."
              />
            </div>

            {/* Size */}
            <div>
              <Label htmlFor="size">Size *</Label>
              <Select value={formData.size} onValueChange={(value) => handleInputChange('size', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XS">XS</SelectItem>
                  <SelectItem value="S">S</SelectItem>
                  <SelectItem value="M">M</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="XL">XL</SelectItem>
                  <SelectItem value="XXL">XXL</SelectItem>
                  <SelectItem value="Free">Free Size</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="party">Party</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="athletic">Athletic</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="outerwear">Outerwear</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fee">Daily Rental Fee ($) *</Label>
                <Input
                  id="fee"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.fee}
                  onChange={(e) => handleInputChange('fee', parseFloat(e.target.value) || 0)}
                  placeholder="10.00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="deposit">Security Deposit ($) *</Label>
                <Input
                  id="deposit"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.deposit}
                  onChange={(e) => handleInputChange('deposit', parseFloat(e.target.value) || 0)}
                  placeholder="15.00"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your item, its condition, any special notes..."
                rows={4}
                required
              />
            </div>

            {/* Photo URL */}
            <div>
              <Label htmlFor="photo">Photo URL</Label>
              <Input
                id="photo"
                type="url"
                value={formData.photo}
                onChange={(e) => handleInputChange('photo', e.target.value)}
                placeholder="https://example.com/your-photo.jpg"
              />
              <p className="text-sm text-gray-500 mt-1">
                Upload your photo to a service like Imgur or Google Drive and paste the link here
              </p>
              {formData.photo && (
                <div className="mt-2">
                  <img 
                    src={formData.photo} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover rounded-md border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Owner Name */}
            <div>
              <Label htmlFor="owner">Your Name *</Label>
              <Input
                id="owner"
                type="text"
                value={formData.owner}
                onChange={(e) => handleInputChange('owner', e.target.value)}
                placeholder="Your display name"
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
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
                onClick={() => router.push('/profile/listings')}
                disabled={loading}
              >
                Cancel
              </Button>
              
              <Button 
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}