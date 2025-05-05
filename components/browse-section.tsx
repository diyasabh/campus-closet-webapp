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
    id: 1,
    name: "Formal Dress",
    brand: "Reformation",
    size: "S",
    price: 15,
    deposit: 50,
    image: "/placeholder.svg?height=400&width=300",
    owner: "Emma S.",
  },
  {
    id: 2,
    name: "Blazer",
    brand: "J.Crew",
    size: "M",
    price: 12,
    deposit: 40,
    image: "/placeholder.svg?height=400&width=300",
    owner: "James L.",
  },
  {
    id: 3,
    name: "Winter Coat",
    brand: "Patagonia",
    size: "L",
    price: 20,
    deposit: 80,
    image: "/placeholder.svg?height=400&width=300",
    owner: "Alex W.",
  },
  {
    id: 4,
    name: "Cocktail Dress",
    brand: "Zara",
    size: "XS",
    price: 18,
    deposit: 45,
    image: "/placeholder.svg?height=400&width=300",
    owner: "Sophia R.",
  },
  {
    id: 5,
    name: "Suit",
    brand: "Hugo Boss",
    size: "L",
    price: 25,
    deposit: 100,
    image: "/placeholder.svg?height=400&width=300",
    owner: "Michael T.",
  },
  {
    id: 6,
    name: "Denim Jacket",
    brand: "Levi's",
    size: "M",
    price: 10,
    deposit: 30,
    image: "/placeholder.svg?height=400&width=300",
    owner: "Olivia P.",
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
