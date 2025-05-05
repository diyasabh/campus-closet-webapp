import Link from "next/link"
import Image from "next/image"
import { HeroButton } from "@/components/ui/hero-button"

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/campus-closet-hero.png"
          alt="Stanford students with red hangers"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center" }}
          className="z-0"
        />
        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/80 to-[#000000]/60 z-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-24 md:py-32 lg:py-40">
          <div className="max-w-2xl">
            <h1 className="font-playfair font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-white mb-6 leading-tight">
              <span className="text-[#E27272]">
                Campus <span className="italic">Closet</span>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8">
              Rent stylish clothes from fellow Stanford students. Save money, reduce waste, and refresh your wardrobe
              sustainably.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/browse">
                <HeroButton aria-label="Browse available clothes">Browse Clothes</HeroButton>
              </Link>
              <Link href="/list">
                <HeroButton variant="secondary" aria-label="List your items for rent">
                  List Your Items
                </HeroButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
