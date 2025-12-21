"use client"

import { Star } from "lucide-react"

interface RatingStarsProps {
  rating: number
  interactive?: boolean
  onRate?: (rating: number) => void
}

export function RatingStars({ rating, interactive = false, onRate }: RatingStarsProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => interactive && onRate?.(star)}
          className={interactive ? "cursor-pointer" : ""}
        >
          <Star
            size={20}
            className={star <= Math.round(rating) ? "text-mehub-secondary" : "text-mehub-border"}
            fill={star <= Math.round(rating) ? "currentColor" : "none"}
          />
        </button>
      ))}
    </div>
  )
}
