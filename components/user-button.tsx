"use client"

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { SignInModal } from "@/components/sign-in-modal";
import { SignUpModal } from "@/components/sign-up-modal";

export function UserButton() {
  const { user, signOut, isAuthenticated } = useAuth();
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  //toggle between sign in and sign up modals
  const toggleAuthMode = () => {
    setIsSignInOpen((prev) => !prev);
    setIsSignUpOpen((prev) => !prev);
  };

  //close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {isAuthenticated ? (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 focus:outline-none"
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
              {user?.name.charAt(0).toUpperCase()}
            </div>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-50">
              <div className="px-4 py-2 text-sm text-gray-700 border-b">
                Signed in as<br />
                <span className="font-medium">{user?.name}</span>
              </div>
              <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Your Profile
              </Link>
              <Link href="/profile/listings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Your Listings
              </Link>
              <button
                onClick={() => {
                  signOut();
                  setIsDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      ) : (
        <Button
          onClick={() => setIsSignInOpen(true)}
          className="bg-[#8c1515] hover:bg-[#6f1111] text-white"
        >
          Sign In
        </Button>
      )}

      <SignInModal 
        isOpen={isSignInOpen} 
        onClose={() => setIsSignInOpen(false)} 
        onToggleMode={toggleAuthMode} 
      />
      
      <SignUpModal 
        isOpen={isSignUpOpen} 
        onClose={() => setIsSignUpOpen(false)} 
        onToggleMode={toggleAuthMode} 
      />
    </>
  );
}