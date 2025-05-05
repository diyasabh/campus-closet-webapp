import { Inter, Playfair_Display } from "next/font/google"

// Load Playfair Display font for headers
export const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "700"],
})

// Use Inter as the primary font for body text
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})
