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
            "group toast bg-card text-foreground border-border shadow-lg rounded-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground hover:group-[.toast]:bg-primary/80",
          cancelButton:
            "group-[.toast]:bg-secondary group-[.toast]:text-secondary-foreground hover:group-[.toast]:bg-secondary/80",
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
