"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Star, Download } from "lucide-react"
import type { ScriptWithRelations } from "@/dal/scripts"
import type { ReviewWithUser } from "@/dal/reviews"

interface ProfileTabsProps {
  scripts: ScriptWithRelations[]
  reviews: ReviewWithUser[]
}

export function ProfileTabs({ scripts, reviews }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<"scripts" | "reviews">("scripts")

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tabs */}
      <div className="flex gap-8 border-b border-mehub-border mb-8">
        <button
          onClick={() => setActiveTab("scripts")}
          className={`pb-4 px-1 font-medium text-lg transition-colors border-b-2 ${
            activeTab === "scripts"
              ? "text-mehub-primary border-mehub-primary"
              : "text-mehub-text-secondary border-transparent hover:text-mehub-text"
          }`}
        >
          Scripts ({scripts.length})
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`pb-4 px-1 font-medium text-lg transition-colors border-b-2 ${
            activeTab === "reviews"
              ? "text-mehub-primary border-mehub-primary"
              : "text-mehub-text-secondary border-transparent hover:text-mehub-text"
          }`}
        >
          Reviews ({reviews.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "scripts" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scripts.map((script) => (
            <Link key={script.id} href={`/script/${script.id}`}>
              <Card className="group cursor-pointer bg-mehub-card border-mehub-border hover:border-mehub-primary/50 transition-all duration-200 overflow-hidden">
                <div className="aspect-video bg-mehub-bg overflow-hidden">
                  <img
                    src={script.screenshots[0] || "/placeholder.svg"}
                    alt={script.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-mehub-text group-hover:text-mehub-primary transition-colors line-clamp-1">
                      {script.title}
                    </h3>
                    <span className="px-2 py-1 bg-mehub-hover text-mehub-text-secondary text-xs rounded-full ml-2">
                      v{script.version}
                    </span>
                  </div>

                  <p className="text-mehub-text-secondary text-sm mb-3 line-clamp-2">{script.description}</p>

                  <div className="flex items-center justify-between text-sm text-mehub-text-secondary">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-orange-400 fill-current" />
                      <span>{script.averageRating?.toFixed(1) || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download size={14} />
                      <span>{script._count.scriptDownloads}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
          
          {scripts.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-mehub-text-secondary">No scripts published yet</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Link key={review.id} href={`/script/${review.scriptId}`}>
              <Card className="group cursor-pointer bg-mehub-card border-mehub-border hover:border-mehub-primary/50 transition-all duration-200 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-mehub-text group-hover:text-mehub-primary transition-colors mb-1">
                      {review.script.title}
                    </h3>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < review.rating ? "text-orange-400 fill-current" : "text-mehub-border"}
                        />
                      ))}
                      <span className="text-mehub-text-secondary text-sm ml-2">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>
                  <span className="text-mehub-text-secondary text-sm">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-mehub-text-secondary text-sm">{review.comment}</p>
                )}
              </Card>
            </Link>
          ))}

          {reviews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-mehub-text-secondary">No reviews yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
