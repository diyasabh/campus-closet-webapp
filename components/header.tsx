"use client"

import Link from "next/link";
import { UserButton } from "@/components/user-button";

export function Header() {
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <span className="ml-2 text-lg font-medium">Campus Closet</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/browse" className="text-gray-600 hover:text-gray-900">Browse</Link>
          <Link href="/list" className="text-gray-600 hover:text-gray-900">List Item</Link>
          <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900">How It Works</Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <UserButton />
        </div>
      </div>
    </header>
  );
}