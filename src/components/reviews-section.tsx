"use client"

import { Star, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ReviewForm } from "@/components/review-form"
import { useReviews } from "@/hooks/useReviews"
import { useToast } from "@/hooks/use-toast"
import type { Review } from "@/generated/prisma/client"

interface ReviewWithUser extends Review {
  user: {
    id: string
    username: string
    avatar: string | null
  }
}

interface ReviewsSectionProps {
  scriptId: string
  reviews: ReviewWithUser[]
  currentUserId?: string
  userHasReviewed: boolean
}

export function ReviewsSection({ scriptId, reviews, currentUserId, userHasReviewed }: ReviewsSectionProps) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null)
  const { deleteReview, isDeleting } = useReviews()
  const { toast } = useToast()

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return
    }

    try {
      await deleteReview(reviewId)
      toast({
        title: "Success",
        description: "Review deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete review",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="bg-mehub-card border border-mehub-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-mehub-text">
          Reviews ({reviews.length})
        </h2>

        {currentUserId && !userHasReviewed && !showReviewForm && (
          <Button
            onClick={() => setShowReviewForm(true)}
            className="bg-mehub-secondary text-mehub-bg hover:bg-mehub-secondary/90"
          >
            Leave a Review
          </Button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="mb-6 p-4 bg-mehub-bg rounded-lg border border-mehub-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-mehub-text">Write Your Review</h3>
            <button
              onClick={() => setShowReviewForm(false)}
              className="text-mehub-text-secondary hover:text-mehub-text"
            >
              Cancel
            </button>
          </div>
          <ReviewForm
            scriptId={scriptId}
            onSuccess={() => {
              setShowReviewForm(false)
            }}
          />
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <p className="text-mehub-text-secondary text-center py-8">
          No reviews yet. Be the first to review!
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const isOwnReview = currentUserId === review.userId
            const isEditing = editingReviewId === review.id

            return (
              <div
                key={review.id}
                className="p-4 bg-mehub-bg rounded-lg border border-mehub-border"
              >
                {isEditing ? (
                  /* Edit Mode */
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-mehub-text">Edit Your Review</h3>
                      <button
                        onClick={() => setEditingReviewId(null)}
                        className="text-mehub-text-secondary hover:text-mehub-text"
                      >
                        Cancel
                      </button>
                    </div>
                    <ReviewForm
                      scriptId={scriptId}
                      existingReview={{
                        id: review.id,
                        rating: review.rating,
                        comment: review.comment,
                      }}
                      onSuccess={() => {
                        setEditingReviewId(null)
                      }}
                    />
                  </div>
                ) : (
                  /* Display Mode */
                  <>
                    {/* Review Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {/* User Avatar */}
                        <img
                          src={review.user.avatar || '/placeholder-user.jpg'}
                          alt={review.user.username}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="font-medium text-mehub-text">
                            {review.user.username}
                          </div>
                          <div className="text-xs text-mehub-text-secondary">
                            {formatDate(review.createdAt)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Rating Stars */}
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              className={
                                star <= review.rating
                                  ? "text-mehub-secondary fill-current"
                                  : "text-mehub-border"
                              }
                            />
                          ))}
                        </div>

                        {/* Edit/Delete Buttons (only for own reviews) */}
                        {isOwnReview && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingReviewId(review.id)}
                              className="text-mehub-text-secondary hover:text-mehub-secondary transition-colors"
                              title="Edit review"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(review.id)}
                              disabled={isDeleting}
                              className="text-mehub-text-secondary hover:text-red-500 transition-colors disabled:opacity-50"
                              title="Delete review"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Review Comment */}
                    {review.comment && (
                      <p className="text-mehub-text">{review.comment}</p>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

