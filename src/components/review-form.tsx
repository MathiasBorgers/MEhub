"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useReviews } from "@/hooks/useReviews"
import { useToast } from "@/hooks/use-toast"

interface ReviewFormProps {
  scriptId: string
  onSuccess?: () => void
  existingReview?: {
    id: string
    rating: number
    comment: string | null
  }
}

export function ReviewForm({ scriptId, onSuccess, existingReview }: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState(existingReview?.comment || "")
  const { createReview, updateReview, isCreating, isUpdating } = useReviews()
  const { toast } = useToast()

  const isEditMode = !!existingReview

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting.",
        variant: "destructive"
      })
      return
    }

    try {
      if (isEditMode) {
        // Update existing review
        await updateReview({
          id: existingReview.id,
          rating,
          comment: comment.trim() || null
        })

        toast({
          title: "Review updated",
          description: "Your review has been updated successfully!",
        })
      } else {
        // Create new review
        await createReview({
          scriptId,
          rating,
          comment: comment.trim() || null
        })

        toast({
          title: "Review submitted",
          description: "Thank you for your review!",
        })

        // Reset form (only for create mode)
        setRating(0)
        setComment("")
      }

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      // Error is already handled by useReviews hook
      console.error('Review submission error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Rating Stars */}
      <div>
        <label className="block text-mehub-text font-medium mb-2">
          Your Rating *
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-colors"
            >
              <Star
                size={32}
                className={
                  star <= (hoveredRating || rating)
                    ? "text-mehub-secondary fill-current"
                    : "text-mehub-border"
                }
              />
            </button>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="block text-mehub-text font-medium mb-2">
          Your Review (Optional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this script..."
          className="w-full px-4 py-3 bg-mehub-bg border border-mehub-border rounded-lg text-mehub-text placeholder:text-mehub-text-secondary focus:outline-none focus:border-mehub-primary min-h-[120px]"
          maxLength={1000}
        />
        <div className="text-right text-xs text-mehub-text-secondary mt-1">
          {comment.length}/1000
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={(isCreating || isUpdating) || rating === 0}
        className="w-full bg-mehub-secondary text-mehub-bg hover:bg-mehub-secondary/90 disabled:opacity-50"
      >
        {isCreating || isUpdating
          ? (isEditMode ? "Updating..." : "Submitting...")
          : (isEditMode ? "Update Review" : "Submit Review")}
      </Button>
    </form>
  )
}

