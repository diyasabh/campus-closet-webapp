import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"
import { forwardRef } from "react"

interface PillButtonProps extends ButtonProps {
  variant?: "primary" | "secondary" | "outline"
}

const PillButton = forwardRef<HTMLButtonElement, PillButtonProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "rounded-full px-8 py-6 h-auto text-base font-medium shadow-md transition-all duration-200 hover:shadow-lg",
          variant === "primary" && "bg-[#8c1515] hover:bg-[#7a1313] text-white border-0",
          variant === "secondary" && "bg-white text-[#8c1515] hover:bg-gray-50 border-0",
          variant === "outline" && "bg-transparent border-2 border-white text-white hover:bg-white/10",
          className,
        )}
        {...props}
      >
        {children}
      </Button>
    )
  },
)

PillButton.displayName = "PillButton"

export { PillButton }
