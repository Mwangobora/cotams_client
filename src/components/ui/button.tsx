import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#0992C2] text-primary-foreground shadow hover:bg-[#0781AC] active:bg-[#066D91]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-border bg-transparent shadow-sm hover:bg-accent/10 dark:hover:bg-[#020617]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent/10 hover:text-accent-foreground",
        link: "text-[#0992C2] underline-offset-4 hover:underline hover:text-[#0781AC]",
        accent:
          "bg-[#0AC4E0] text-accent-foreground shadow-sm hover:bg-[#08B0C9] active:bg-[#079DB4] font-semibold",
        "ghost-edit":
          "text-[#64748B] hover:bg-[#F1F5F9] active:bg-[#E2E8F0] focus-visible:ring-[#0AC4E0] dark:text-[#94A3B8] dark:hover:bg-[#0B1220] dark:active:bg-[#0F172A]",
        "ghost-delete":
          "text-[#DC2626] hover:bg-[#FEE2E2] active:bg-[#FECACA] focus-visible:ring-[#DC2626] dark:text-[#F87171] dark:hover:bg-[#450A0A] dark:active:bg-[#7F1D1D] dark:focus-visible:ring-[#F87171]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
