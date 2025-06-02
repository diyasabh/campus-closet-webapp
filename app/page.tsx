import Hero from "@/components/hero"
import BrowseSection from "@/components/browse-section"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
 return (
   <main className="min-h-screen">
     <Hero />
     <BrowseSection />

     {/* How It Works Section */}
     <section className="py-16 px-4 bg-gray-50">
       <div className="max-w-6xl mx-auto">
         <h2 className="font-serif text-3xl font-bold text-center mb-12">How Campus Closet Works</h2>

         <div className="grid md:grid-cols-3 gap-8">
           <div className="bg-white p-6 rounded-xl shadow-sm">
             <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
               <span className="text-[#8c1515] font-bold text-xl">1</span>
             </div>
             <h3 className="font-serif text-xl font-semibold mb-2">Browse Listings</h3>
             <p className="text-gray-600">
               Explore clothing items from fellow Stanford students. Filter by size, brand, or style.
             </p>
           </div>

           <div className="bg-white p-6 rounded-xl shadow-sm">
             <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
               <span className="text-[#8c1515] font-bold text-xl">2</span>
             </div>
             <h3 className="font-serif text-xl font-semibold mb-2">Rent Items</h3>
             <p className="text-gray-600">
               Pay a small rental fee and deposit. Arrange pickup on campus with the owner.
             </p>
           </div>

           <div className="bg-white p-6 rounded-xl shadow-sm">
             <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
               <span className="text-[#8c1515] font-bold text-xl">3</span>
             </div>
             <h3 className="font-serif text-xl font-semibold mb-2">List Your Clothes</h3>
             <p className="text-gray-600">
               Make money from clothes you rarely wear by listing them for others to rent.
             </p>
           </div>
         </div>

         <div className="mt-12 text-center">
           <Button className="bg-[#8c1515] hover:bg-[#6f1111] text-white">
             <Link href="/browse" className="w-full h-full flex items-center justify-center">
               Start Browsing
             </Link>
           </Button>
         </div>
       </div>
     </section>

     {/* Testimonials */}
     <section className="py-16 px-4">
       <div className="max-w-6xl mx-auto">
         <h2 className="font-serif text-3xl font-bold text-center mb-12">What Students Say</h2>

         <div className="grid md:grid-cols-2 gap-8">
           <div className="bg-white p-6 rounded-xl shadow-sm border">
             <p className="italic text-gray-600 mb-4">
               "I found the perfect dress for the spring formal without having to buy something I'd only wear once!"
             </p>
             <div className="flex items-center">
               <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
               <div>
                 <p className="font-medium">Sarah J.</p>
                 <p className="text-sm text-gray-500">Class of 2025</p>
               </div>
             </div>
           </div>

           <div className="bg-white p-6 rounded-xl shadow-sm border">
             <p className="italic text-gray-600 mb-4">
               "Bookstore ran out of the stoles we wanted for grad photos. Campus Closet saved our group photos!"
             </p>
             <div className="flex items-center">
               <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
               <div>
                 <p className="font-medium">Michael W.</p>
                 <p className="text-sm text-gray-500">Class of 2024</p>
               </div>
             </div>
           </div>

         </div>
       </div>
     </section>
   </main>
 )
}