"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cva, type VariantProps } from "class-variance-authority"

const heroButtonVariants = cva(
  "relative inline-flex items-center justify-center text-lg font-medium text-white px-7 py-3 rounded-xl shadow-lg shadow-primary/30 transition-all duration-300 bg-gradient-to-br bg-[length:200%_200%] bg-left hover:bg-right active:shadow-md active:shadow-primary/10 [text-shadow:0_1px_1px_rgba(0,0,0,0.2)]",
  {
    variants: {
      variant: {
        default: "from-cc-red-900 via-cc-red-600 to-cc-orange-500",
        secondary: "from-cc-orange-500 via-cc-orange-500 to-cc-red-600",
        outline:
          "bg-transparent border-2 border-primary text-primary hover:bg-highlight/10 shadow-none active:shadow-none [text-shadow:none]",
      },
      size: {
        default: "",
        sm: "text-base px-5 py-2",
        lg: "text-xl px-8 py-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface HeroButtonProps extends ButtonProps, VariantProps<typeof heroButtonVariants> {
  "aria-label"?: string
}

const HeroButton = React.forwardRef<HTMLButtonElement, HeroButtonProps>(
  ({ className, variant, size, "aria-label": ariaLabel, children, ...props }, ref) => {
    // Ensure aria-label is provided for accessibility
    const buttonAriaLabel = ariaLabel || (typeof children === "string" ? children : undefined)

    if (!buttonAriaLabel && process.env.NODE_ENV === "development") {
      console.warn("HeroButton: No aria-label provided. For accessibility, please provide an aria-label.")
    }

    return (
      <Button
        className={cn(heroButtonVariants({ variant, size }), className)}
        ref={ref}
        aria-label={buttonAriaLabel}
        {...props}
      >
        {children}
      </Button>
    )
  },
)

HeroButton.displayName = "HeroButton"

export { HeroButton }
