import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, MapPin, CreditCard, MessageSquare, Shield, RefreshCw, Search, Filter, Upload, DollarSign } from "lucide-react"
import type { Metadata } from "next"
import "./how-it-works.css"

export const metadata: Metadata = {
  title: "How It Works | Campus Closet",
  description: "Learn how Campus Closet works - rent clothes from fellow Stanford students or list your own items for rent.",
}

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="hero-section">
          <h1 className="hero-title">How Campus Closet Works</h1>
          <p className="hero-description">
            Join Stanford's sustainable fashion community. Rent clothes from fellow students or list your own items for rent.
          </p>
        </div>

        {/* Main Steps */}
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">
              <span className="step-number-text">1</span>
            </div>
            <h3 className="step-title">Browse Listings</h3>
            <p className="step-description">
              Explore clothing items from fellow Stanford students. Filter by size, brand, or style to find exactly what you need.
            </p>
            <ul className="step-list">
              <li className="step-list-item">
                <Search className="step-icon" />
                <span>Search by category or keyword</span>
              </li>
              <li className="step-list-item">
                <Filter className="step-icon" />
                <span>Filter by size and style</span>
              </li>
              <li className="step-list-item">
                <MapPin className="step-icon" />
                <span>Find items available on campus</span>
              </li>
            </ul>
          </div>

          <div className="step-card">
            <div className="step-number">
              <span className="step-number-text">2</span>
            </div>
            <h3 className="step-title">Rent Items</h3>
            <p className="step-description">
              Pay a small rental fee and deposit. Arrange pickup on campus with the owner.
            </p>
            <ul className="step-list">
              <li className="step-list-item">
                <CreditCard className="step-icon" />
                <span>Secure payment processing</span>
              </li>
              <li className="step-list-item">
                <Calendar className="step-icon" />
                <span>Flexible rental periods</span>
              </li>
              <li className="step-list-item">
                <MessageSquare className="step-icon" />
                <span>Easy communication with owners</span>
              </li>
            </ul>
          </div>

          <div className="step-card">
            <div className="step-number">
              <span className="step-number-text">3</span>
            </div>
            <h3 className="step-title">List Your Clothes</h3>
            <p className="step-description">
              Make money from clothes you rarely wear by listing them for others to rent.
            </p>
            <ul className="step-list">
              <li className="step-list-item">
                <Upload className="step-icon" />
                <span>Easy listing process</span>
              </li>
              <li className="step-list-item">
                <DollarSign className="step-icon" />
                <span>Set your own prices</span>
              </li>
              <li className="step-list-item">
                <Shield className="step-icon" />
                <span>Secure deposit system</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Additional Information */}
        <div className="info-grid">
          <div className="info-card">
            <h3 className="info-title">Rental Policy</h3>
            <ul className="info-list">
              <li className="info-list-item">
                <RefreshCw className="info-icon" />
                <div>
                  <p className="info-item-title">Return Policy</p>
                  <p className="info-item-description">Items must be returned in the same condition within the agreed rental period.</p>
                </div>
              </li>
              <li className="info-list-item">
                <Shield className="info-icon" />
                <div>
                  <p className="info-item-title">Deposit Protection</p>
                  <p className="info-item-description">Deposits are fully refunded upon safe return of items.</p>
                </div>
              </li>
              <li className="info-list-item">
                <MessageSquare className="info-icon" />
                <div>
                  <p className="info-item-title">Communication</p>
                  <p className="info-item-description">All communication happens through our secure messaging system.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="info-card">
            <h3 className="info-title">Safety & Trust</h3>
            <ul className="info-list">
              <li className="info-list-item">
                <Shield className="info-icon" />
                <div>
                  <p className="info-item-title">Verified Users</p>
                  <p className="info-item-description">All users must verify their Stanford email address.</p>
                </div>
              </li>
              <li className="info-list-item">
                <CreditCard className="info-icon" />
                <div>
                  <p className="info-item-title">Secure Payments</p>
                  <p className="info-item-description">All transactions are processed securely through our platform.</p>
                </div>
              </li>
              <li className="info-list-item">
                <MapPin className="info-icon" />
                <div>
                  <p className="info-item-title">Campus-Only</p>
                  <p className="info-item-description">All rentals and exchanges happen on Stanford campus.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="cta-section">
          <div className="cta-container">
            <h2 className="cta-title">Ready to Get Started?</h2>
            <p className="cta-description">Join Stanford's sustainable fashion community today.</p>
            <div className="cta-buttons">
              <Button className="cta-button-primary">
                <Link href="/browse" className="w-full h-full flex items-center justify-center">
                  Browse Items
                </Link>
              </Button>
              <Button variant="outline" className="cta-button-secondary">
                <Link href="/list" className="w-full h-full flex items-center justify-center">
                  List Your Items
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 