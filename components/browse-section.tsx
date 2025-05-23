"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ClothingCard from "./clothing-card"
import Link from "next/link"
import { PillButton } from "@/components/ui/pill-button"

// Sample data for demonstration
const SAMPLE_ITEMS = [
  {
    id: 15,
    name: "Sequin Skirt",
    brand: "Unknown",
    size: "S",
    category: "Going out",
    itemType: "Skirt",
    price: 7,
    deposit: 10,
    image: "/images/diya-sabharwal-sequin-skirt.jpg",
    owner: "Diya Sabharwal",
    condition: "Excellent",
  },
  {
    id: 16,
    name: "Red Mini Dress",
    brand: "Windsor",
    size: "S",
    category: "Going Out",
    itemType: "Dress",
    price: 3,
    deposit: 10,
    image: "/images/red-mini-dress-diya.jpg",
    owner: "Diya Sabharwal",
    condition: "Like New (worn once)",
  },
  {
    id: 17,
    name: "Unique Indian Headpiece",
    brand: "locally sourced",
    size: "N/A",
    category: "Going Out, Formalwear",
    itemType: "Jewellry",
    price: 5,
    deposit: 5,
    image: "/images/yesterday3.jpg",
    owner: "Diya Sabharwal",
    condition: "Like New",
  },
  {
    id: 18,
    name: "Long Blue Evening Dress",
    brand: "(Tulum, Mexico)",
    size: "Free",
    category: "formal",
    price: 10,
    deposit: 15,
    image: "/images/long_bluedress.jpg",
    owner: "NaYoung S.",
    condition: "Like New",
  },
  {
    id: 19,
    name: "Blue Midi Dress",
    brand: "H&M",
    size: "S",
    category: "formal",
    price: 5,
    deposit: 10,
    image: "/images/midi_bluedress.jpg",
    owner: "NaYoung S.",
    condition: "Excellent",
  },
  {
    id: 20,
    name: "Piglet Onesie",
    brand: "Amazon",
    size: "M",
    category: "casual",
    price: 5,
    deposit: 10,
    image: "/images/piglet_onsie.jpg",
    owner: "NaYoung S.",
    condition: "Like New",
  },
]

export default function BrowseSection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sizeFilter, setSizeFilter] = useState("")

  const filteredItems = SAMPLE_ITEMS.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSize = sizeFilter === "" || item.size === sizeFilter

    return matchesSearch && matchesSize
  })

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-serif text-3xl font-bold mb-8">Browse Available Items</h2>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search by name or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="w-full md:w-48">
            <Select value={sizeFilter} onValueChange={setSizeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                <SelectItem value="XS">XS</SelectItem>
                <SelectItem value="S">S</SelectItem>
                <SelectItem value="M">M</SelectItem>
                <SelectItem value="L">L</SelectItem>
                <SelectItem value="XL">XL</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <ClothingCard key={item.id} item={item} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/browse" className="inline-block">
            <PillButton variant="outline" className="border-[#8c1515] text-[#8c1515] hover:bg-[#8c1515]/5">
              View All Items
            </PillButton>
          </Link>
        </div>
      </div>
    </section>
  )
}
