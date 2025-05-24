"use client";

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import ClothingCard from "@/components/clothing-card"
import { Filter, SlidersHorizontal, SearchIcon } from "lucide-react"

export default function BrowsePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sizeFilter, setSizeFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [priceRange, setPriceRange] = useState([0, 30])
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("newest")
  const [visibleItems, setVisibleItems] = useState(6)
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    const fetchListings = async () => {
      const { data, error } = await supabase
        .from("listing")
        .select("*")
        .order("id", { ascending: false })

      if (error) {
        console.error("Error fetching listings:", error.message)
      } else {
        setItems(data)
      }
    }

    fetchListings()
  }, [])

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      searchTerm === "" ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase());
  
    const matchesSize = sizeFilter === "" || item.size === sizeFilter;
 
    const matchesCategory = categoryFilter === "" || item.category === categoryFilter;
  
    const matchesPrice = Number(item.fee) >= priceRange[0] && Number(item.fee) <= priceRange[1];

    return matchesSearch && matchesSize && matchesCategory && matchesPrice;
  });

  const loadMore = () => {
    setVisibleItems((prev) => Math.min(prev + 6, filteredItems.length));
  };

  return (
    <main className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="font-serif text-3xl font-bold mb-4 md:mb-0 text-black">
          Browse Clothing
        </h1>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="md:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters - Desktop (always visible) and Mobile (toggleable) */}
        <div
          className={`w-full md:w-64 flex-shrink-0 ${
            showFilters ? "block" : "hidden md:block"
          }`}
        >
          <div className="bg-white p-4 rounded-lg border mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif font-semibold text-lg text-black">
                Filters
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setShowFilters(false)}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="category">
                <AccordionTrigger>Category</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="category-all"
                        checked={categoryFilter === ""}
                        onCheckedChange={() => setCategoryFilter("")}
                      />
                      <Label htmlFor="category-all" className="text-black">
                        All Categories
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="category-formal"
                        checked={categoryFilter === "formal"}
                        onCheckedChange={() => setCategoryFilter("formal")}
                      />
                      <Label htmlFor="category-formal" className="text-black">
                        Formal Wear
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="category-casual"
                        checked={categoryFilter === "casual"}
                        onCheckedChange={() => setCategoryFilter("casual")}
                      />
                      <Label htmlFor="category-casual" className="text-black">
                        Casual
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="category-outerwear"
                        checked={categoryFilter === "outerwear"}
                        onCheckedChange={() => setCategoryFilter("outerwear")}
                      />
                      <Label
                        htmlFor="category-outerwear"
                        className="text-black"
                      >
                        Outerwear
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="category-athletic"
                        checked={categoryFilter === "athletic"}
                        onCheckedChange={() => setCategoryFilter("athletic")}
                      />
                      <Label htmlFor="category-athletic" className="text-black">
                        Athletic
                      </Label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="size">
                <AccordionTrigger>Size</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="size-all"
                        checked={sizeFilter === ""}
                        onCheckedChange={() => setSizeFilter("")}
                      />
                      <Label htmlFor="size-all" className="text-black">
                        All Sizes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="size-xs"
                        checked={sizeFilter === "XS"}
                        onCheckedChange={() => setSizeFilter("XS")}
                      />
                      <Label htmlFor="size-xs" className="text-black">
                        XS
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="size-s"
                        checked={sizeFilter === "S"}
                        onCheckedChange={() => setSizeFilter("S")}
                      />
                      <Label htmlFor="size-s" className="text-black">
                        S
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="size-m"
                        checked={sizeFilter === "M"}
                        onCheckedChange={() => setSizeFilter("M")}
                      />
                      <Label htmlFor="size-m" className="text-black">
                        M
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="size-l"
                        checked={sizeFilter === "L"}
                        onCheckedChange={() => setSizeFilter("L")}
                      />
                      <Label htmlFor="size-l" className="text-black">
                        L
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="size-xl"
                        checked={sizeFilter === "XL"}
                        onCheckedChange={() => setSizeFilter("XL")}
                      />
                      <Label htmlFor="size-xl" className="text-black">
                        XL
                      </Label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="price">
                <AccordionTrigger>Price Range ($/day)</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <Slider
                      defaultValue={[0, 100]}
                      max={100}
                      step={1}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="mt-6"
                    />
                    <div className="flex items-center justify-between">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  setSearchTerm("");
                  setSizeFilter("");
                  setCategoryFilter("");
                  setPriceRange([0, 100]);
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search Bar */}
          <div className="relative mb-6">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search by name, brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Results Count */}
          <p className="text-sm text-black mb-4">
            Showing {Math.min(visibleItems, filteredItems.length)} of{" "}
            {filteredItems.length} items
          </p>

          {/* Items Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.slice(0, visibleItems).map((item) => (
                <ClothingCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-black">
                No items match your search criteria
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setSizeFilter("");
                  setCategoryFilter("");
                  setPriceRange([0, 100]);
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Load More Button */}
          {visibleItems < filteredItems.length && (
            <div className="mt-8 text-center">
              <Button onClick={loadMore} variant="outline">
                Load More
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
