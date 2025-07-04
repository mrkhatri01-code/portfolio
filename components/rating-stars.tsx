"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingStarsProps {
  value: number
  max?: number
  size?: "sm" | "md" | "lg"
  readOnly?: boolean
  onChange?: (value: number) => void
  className?: string
}

export function RatingStars({ value, max = 5, size = "md", readOnly = false, onChange, className }: RatingStarsProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  const handleClick = (index: number) => {
    if (readOnly) return
    onChange?.(index + 1)
  }

  const handleMouseEnter = (index: number) => {
    if (readOnly) return
    setHoverValue(index + 1)
  }

  const handleMouseLeave = () => {
    if (readOnly) return
    setHoverValue(null)
  }

  const displayValue = hoverValue !== null ? hoverValue : value

  return (
    <div className={cn("flex items-center", className)} onMouseLeave={handleMouseLeave}>
      {Array.from({ length: max }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            sizeClasses[size],
            "transition-colors",
            index < displayValue ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground",
            !readOnly && "cursor-pointer",
          )}
          onClick={() => handleClick(index)}
          onMouseEnter={() => handleMouseEnter(index)}
        />
      ))}
    </div>
  )
}

