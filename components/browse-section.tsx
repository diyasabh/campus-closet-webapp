"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ClothingCard from "./clothing-card"
import { SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

export default function BrowseSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [visibleItems, setVisibleItems] = useState(6);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      const { data, error } = await supabase
        .from("listing")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error("Error fetching listings:", error.message);
      } else {
        setItems(data);
      }
    };

    fetchListings();
  }, []);

  console.log(items)

  const filteredItems = items
    .filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchTerm.toLowerCase());
      console.log(matchesSearch)
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.fee - b.fee;
      if (sortBy === "price-high") return b.fee - a.fee;
      return b.id - a.id; // newest first
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

      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          placeholder="Search by name, brand..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <p className="text-sm text-black mb-4">
        Showing {Math.min(visibleItems, filteredItems.length)} of {filteredItems.length} items
      </p>

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
            onClick={() => setSearchTerm("")}
          >
            Clear Search
          </Button>
        </div>
      )}

      {visibleItems < filteredItems.length && (
        <div className="mt-8 text-center">
          <Button onClick={loadMore} variant="outline">
            Load More
          </Button>
        </div>
      )}
    </main>
  );
}
