"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast bg-white text-[#0F172A] border-[#E5E7EB] shadow-lg rounded-lg",
          description: "group-[.toast]:text-[#64748B]",
          actionButton:
            "group-[.toast]:bg-[#0992C2] group-[.toast]:text-white hover:group-[.toast]:bg-[#0781AC]",
          cancelButton:
            "group-[.toast]:bg-[#F1F5F9] group-[.toast]:text-[#64748B] hover:group-[.toast]:bg-[#E2E8F0]",
          success:
            "!bg-green-600 !text-white !border-green-700",
          error:
            "!bg-red-600 !text-white !border-red-700",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
