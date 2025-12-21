"use client"

import { useState } from "react"
import { Heart } from "lucide-react"

export function LikeButton() {
  const [liked, setLiked] = useState(false)

  return (
    <button
      onClick={() => setLiked(!liked)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
        liked
          ? "border-red-500 text-red-500 bg-red-500/10"
          : "border-mehub-border text-mehub-text-secondary hover:border-red-500 hover:text-red-500"
      }`}
    >
      <Heart size={16} className={liked ? "fill-current" : ""} />
      {liked ? "Liked" : "Like"}
    </button>
  )
}