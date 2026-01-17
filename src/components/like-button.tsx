"use client"

import { useState, useTransition } from "react"
import { Heart } from "lucide-react"
import { toggleScriptLikeAction } from "@/serverFunctions/scriptLikes"
import { useToast } from "@/hooks/use-toast"

interface LikeButtonProps {
  scriptId: string
  initialLiked: boolean
  initialLikeCount: number
  isLoggedIn?: boolean
}

export function LikeButton({ scriptId, initialLiked, initialLikeCount, isLoggedIn = true }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const handleToggleLike = () => {
    if (!isLoggedIn) {
      toast({
        title: "Login required",
        description: "Please log in to like scripts.",
        variant: "destructive",
      })
      return
    }

    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append("scriptId", scriptId)

        const result = await toggleScriptLikeAction({ success: false }, formData)

        if (result && "success" in result && result.success && result.data) {
          const newLiked = result.data.liked
          setLiked(newLiked)
          setLikeCount((prev) => (newLiked ? prev + 1 : prev - 1))
        } else if (result && "errors" in result && result.errors) {
          const errorMessage =
            typeof result.errors === 'object' &&
            'errors' in result.errors &&
            Array.isArray(result.errors.errors) &&
            result.errors.errors.length > 0
              ? result.errors.errors[0]
              : "Failed to toggle like"

          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Like toggle error:", error)
        toast({
          title: "Error",
          description: "Failed to toggle like. Please try again.",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <button
      onClick={handleToggleLike}
      disabled={isPending}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all disabled:opacity-50 ${
        liked
          ? "border-orange-500 text-orange-500 bg-orange-500/10"
          : "border-mehub-border text-mehub-text-secondary hover:border-orange-500 hover:text-orange-500"
      }`}
    >
      <Heart size={16} className={liked ? "fill-current" : ""} />
      <span>{liked ? "Liked" : "Like"}</span>
      {likeCount > 0 && <span className="text-xs opacity-75">({likeCount})</span>}
    </button>
  )
}