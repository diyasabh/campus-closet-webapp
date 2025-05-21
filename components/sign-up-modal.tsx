"use client"

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleMode: () => void; // Toggle between sign up and sign in
}

export function SignUpModal({ isOpen, onClose, onToggleMode }: SignUpModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    instagram: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { signUp } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!formData.email.endsWith("@stanford.edu")) {
      newErrors.email = "Only @stanford.edu email addresses are allowed";
    }

    // Instagram validation (optional but if provided, should start with @)
    if (formData.instagram.trim() && !formData.instagram.startsWith("@")) {
      newErrors.instagram = "Instagram handle should start with @";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      setErrors({});

      try {
        const result = await signUp({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          instagram: formData.instagram,
          password: formData.password,
        });

        if (result.success) {
          setIsSuccess(true);
          // Reset form and close modal after successful submission
          setTimeout(() => {
            setIsSuccess(false);
            onClose();
            setFormData({
              name: "",
              email: "",
              instagram: "",
              password: "",
              confirmPassword: "",
              phone: "",
            });
          }, 1500);
        } else {
          setErrors({ form: result.error || "Sign up failed" });
        }
      } catch (error) {
        setErrors({ form: "An unexpected error occurred" });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Account"
      description="Join Stanford's clothing rental community"
    >
      {isSuccess ? (
        <div className="py-8 text-center">
          <div className="mb-4 mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Account Created!</h3>
          <p className="text-sm text-gray-500">Welcome to Campus Closet</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {errors.form && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.form}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Jane Cardinal"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Stanford Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="jcardinal@stanford.edu"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            <p className="text-xs text-gray-500">Only @stanford.edu email addresses are accepted</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="(650) 123-4567"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram Handle (Optional)</Label>
            <Input
              id="instagram"
              name="instagram"
              placeholder="@stanfordstudent"
              value={formData.instagram}
              onChange={handleChange}
              className={errors.instagram ? "border-red-500" : ""}
            />
            {errors.instagram && <p className="text-red-500 text-sm">{errors.instagram}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            <p className="text-xs text-gray-500">Must be at least 8 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? "border-red-500" : ""}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500 mt-4">
            <p>
              Already have an account?{" "}
              <button type="button" onClick={onToggleMode} className="text-primary hover:underline">
                Sign In
              </button>
            </p>
          </div>
        </form>
      )}
    </Modal>
  );
}