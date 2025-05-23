"use client"

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleMode: () => void; // Toggle between sign in and sign up
}

export function SignInModal({ isOpen, onClose, onToggleMode }: SignInModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { signIn } = useAuth();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!email.endsWith("@stanford.edu")) {
      newErrors.email = "Only @stanford.edu email addresses are allowed";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
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
        const result = await signIn(email, password);

        if (result.success) {
          setIsSuccess(true);
          // Reset form and close modal after successful submission
          setTimeout(() => {
            setIsSuccess(false);
            onClose();
            setEmail("");
            setPassword("");
          }, 1500);
        } else {
          setErrors({ form: result.error || "Sign in failed" });
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
      title="Sign In to Campus Closet"
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
          <h3 className="text-lg font-medium text-gray-900">Sign In Successful!</h3>
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
            <Label htmlFor="email">Stanford Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="jcardinal@stanford.edu"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.email;
                    return newErrors;
                  });
                }
              }}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            <p className="text-xs text-gray-500">Only @stanford.edu email addresses are accepted</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.password;
                    return newErrors;
                  });
                }
              }}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500 mt-4">
            <p>
              Don't have an account?{" "}
              <button type="button" onClick={onToggleMode} className="text-primary hover:underline">
                Create Account
              </button>
            </p>
          </div>
        </form>
      )}
    </Modal>
  );
}