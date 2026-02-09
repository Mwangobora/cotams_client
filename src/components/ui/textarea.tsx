import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#0F172A] shadow-sm transition-all duration-150 placeholder:text-[#94A3B8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0AC4E0]/30 focus-visible:border-[#0AC4E0] disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#F8FAFC]",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
