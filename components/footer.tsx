import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="relative h-10 w-10 mr-2">
                <Image
                  src="/images/hanger-logo.png"
                  alt="Campus Closet"
                  fill
                  style={{ objectFit: "contain" }}
                  className="scale-110"
                />
              </div>
              <span className="font-serif font-bold text-xl text-[#8c1515]">Campus Closet</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Sustainable fashion for the Stanford community. Rent, share, and reduce waste while looking your best.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Navigation</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-base text-gray-500 hover:text-gray-900">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/browse" className="text-base text-gray-500 hover:text-gray-900">
                  Browse
                </Link>
              </li>
              <li>
                <Link href="/list" className="text-base text-gray-500 hover:text-gray-900">
                  List Item
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-base text-gray-500 hover:text-gray-900">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/privacy" className="text-base text-gray-500 hover:text-gray-900">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-base text-gray-500 hover:text-gray-900">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-base text-gray-500 hover:text-gray-900">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-base text-gray-500 hover:text-gray-900">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-400 text-center">
            &copy; {new Date().getFullYear()} Campus Closet. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
