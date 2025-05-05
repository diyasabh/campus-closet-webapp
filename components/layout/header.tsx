"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, Search, User } from "lucide-react"
import { SignInModal } from "@/components/sign-in-modal"
import { HeroButton } from "@/components/ui/hero-button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)

  const openSignInModal = () => {
    setIsSignInModalOpen(true)
    setIsMenuOpen(false) // Close mobile menu if open
  }

  return (
    <header className="sticky top-0 bg-card z-50 shadow-sm border-b border-surface-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative h-14 w-14 my-1">
              <Image
                src="/images/hanger-logo.png"
                alt="Campus Closet"
                fill
                style={{ objectFit: "contain" }}
                priority
                className="scale-110"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/browse"
              className="text-primary hover:text-primary/80 font-medium transition-colors relative group"
            >
              Browse
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-highlight scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
            <Link
              href="/list"
              className="text-primary hover:text-primary/80 font-medium transition-colors relative group"
            >
              List Item
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-highlight scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
            <Link
              href="/how-it-works"
              className="text-primary hover:text-primary/80 font-medium transition-colors relative group"
            >
              How It Works
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-highlight scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary hover:text-primary/80 hover:bg-highlight/20 focus-ring"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary hover:text-primary/80 hover:bg-highlight/20 focus-ring"
            >
              <User className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            <HeroButton onClick={openSignInModal} size="sm">
              Sign In
            </HeroButton>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-primary hover:text-primary/80 hover:bg-highlight/20 focus-ring"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-card border-t border-surface-subtle">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/browse"
              className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-highlight/20"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse
            </Link>
            <Link
              href="/list"
              className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-highlight/20"
              onClick={() => setIsMenuOpen(false)}
            >
              List Item
            </Link>
            <Link
              href="/how-it-works"
              className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-highlight/20"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-surface-subtle bg-surface/30">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-highlight flex items-center justify-center text-primary">
                  <User className="h-5 w-5" />
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-primary">Guest User</div>
                <div className="text-sm font-medium text-primary-hover">Not signed in</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <HeroButton className="w-full justify-center" onClick={openSignInModal} size="sm">
                Sign In
              </HeroButton>
            </div>
          </div>
        </div>
      )}

      {/* Sign In Modal */}
      <SignInModal isOpen={isSignInModalOpen} onClose={() => setIsSignInModalOpen(false)} />
    </header>
  )
}
