"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ClothingCard from "@/components/clothing-card";

export default function ProfilePage() {
  const { user, loading, isAuthenticated, updateProfile, signOut } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    instagram: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [listings, setListings] = useState<any[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/");
    }
  }, [loading, isAuthenticated, router]);

  // Set form data from user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        instagram: user.instagram || "",
      });
    }
  }, [user]);

  // Fetch user listings
  useEffect(() => {
    const fetchListings = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("listing")
        .select("*")
        .eq("userId", user.id);

      if (error) {
        console.error("Error fetching listings:", error.message);
      } else {
        setListings(data || []);
      }

      setListingsLoading(false);
    };

    fetchListings();
  }, [user?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      if (!formData.name.trim()) throw new Error("Full name is required");
      if (!formData.phone.trim()) throw new Error("Phone number is required");

      const result = await updateProfile(formData);

      if (!result.success) throw new Error(result.error || "Profile update failed");

      setSuccessMessage("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      if (error instanceof Error) setError(error.message);
      else setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}

      {/* Profile Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Profile Information</h2>
          {!isEditing && <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} />
            </div>
            <div className="mb-4">
              <Label htmlFor="email">Stanford Email</Label>
              <Input id="email" type="email" value={user?.email} disabled className="bg-gray-100" />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            <div className="mb-4">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="mb-6">
              <Label htmlFor="instagram">Instagram Handle</Label>
              <Input
                id="instagram"
                name="instagram"
                type="text"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="@stanfordstudent"
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: user?.name || "",
                    phone: user?.phone || "",
                    instagram: user?.instagram || "",
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
              <p className="mt-1">{user?.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Stanford Email</h3>
              <p className="mt-1">{user?.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
              <p className="mt-1">{user?.phone}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Instagram Handle</h3>
              <p className="mt-1">{user?.instagram || "Not provided"}</p>
            </div>
          </div>
        )}
      </div>

      {/* Listings Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Listings</h2>
          <Link href="/list">
            <Button className="bg-[#8c1515] hover:bg-[#6f1111] text-white">List New Item</Button>
          </Link>
        </div>

        {listingsLoading ? (
          <p className="text-gray-600">Loading your listings...</p>
        ) : listings.length === 0 ? (
          <p className="text-gray-600">You haven't listed any items yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((item) => (
              <ClothingCard key={item.id} item={item} />
            ))}
          </div>
        )}

        <div className="mt-6">
          <Link href="/profile/listings">
            <Button className="w-full" variant="outline">
              View and Manage Your Listings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
