import React from "react"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Star, Download } from "lucide-react"
import { ImageGallery } from "@/components/image-gallery"
import { LikeButton } from "@/components/like-button"
import { DownloadButton } from "@/components/download-button"
import { ReviewsSection } from "@/components/reviews-section"
import { getScriptById } from "@/dal/scripts"
import { getLikeCount, getScriptLike } from "@/dal/scriptLikes"
import { getReviews, getReviewByUserAndScript } from "@/dal/reviews"
import { getSessionProfileFromCookie } from "@/lib/sessionUtils"
import { notFound } from "next/navigation"
import { LuaCodeViewer } from "@/components/lua-code-viewer"

export default async function ScriptDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const scriptData = await getScriptById(resolvedParams.id)

  if (!scriptData) {
    notFound()
  }

  // Get current user profile (optional - user might not be logged in)
  const sessionProfile = await getSessionProfileFromCookie()

  // Get like info
  const likeCount = await getLikeCount(resolvedParams.id)
  const userLiked = sessionProfile ? await getScriptLike(sessionProfile.id, resolvedParams.id) : null

  // Get reviews
  const reviews = await getReviews({ scriptId: resolvedParams.id })
  const userReview = sessionProfile ? await getReviewByUserAndScript(sessionProfile.id, resolvedParams.id) : null

  // Type assertion to include role and bio which are included in the query
  const script = scriptData as typeof scriptData & {
    author: typeof scriptData.author & { role: string; bio: string | null }
  }


  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="text-mehub-text-secondary text-sm mb-6 flex items-center gap-2">
          <Link href="/marketplace" className="hover:text-mehub-primary">
            Marketplace
          </Link>
          <span>/</span>
          <Link href={`/marketplace?category=${script.category.slug}`} className="hover:text-mehub-primary">
            {script.category.name}
          </Link>
          <span>/</span>
          <span className="text-mehub-text">{script.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <Card className="bg-mehub-card border-mehub-border overflow-hidden">
              <ImageGallery screenshots={script.screenshots} />
            </Card>

            {/* Script Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-mehub-text mb-2">{script.title}</h1>
                  <p className="text-mehub-text-secondary text-lg">{script.description}</p>
                </div>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap gap-4 text-sm text-mehub-text-secondary mb-6">
                <div>
                  Version <span className="text-mehub-primary">{script.version}</span>
                </div>
                <div>
                  Updated <span className="text-mehub-primary">{new Date(script.updatedAt).toLocaleDateString()}</span>
                </div>
                <div>
                  Category <span className="text-mehub-primary">{script.category.name}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {script.tags.map((scriptTag) => (
                  <span key={scriptTag.tag.id} className="px-3 py-1 bg-mehub-hover text-mehub-text-secondary text-xs rounded-full">
                    {scriptTag.tag.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-mehub-card border border-mehub-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-mehub-text mb-4">About this script</h2>
              <p className="text-mehub-text-secondary leading-relaxed mb-6">{script.fullDescription}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Features */}
                <div>
                  <h3 className="font-bold text-mehub-text mb-4 flex items-center gap-2">
                    <span className="text-mehub-primary">✨</span> Features
                  </h3>
                  <ul className="space-y-2">
                    {script.features.map((feature, idx) => (
                      <li key={idx} className="text-mehub-text-secondary flex items-start gap-2">
                        <span className="text-mehub-primary mt-1">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="font-bold text-mehub-text mb-4 flex items-center gap-2">
                    <span className="text-mehub-secondary">📋</span> Requirements
                  </h3>
                  <ul className="space-y-2">
                    {script.requirements.map((req, idx) => (
                      <li key={idx} className="text-mehub-text-secondary flex items-start gap-2">
                        <span className="text-mehub-secondary">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Lua Code Viewer - Only show if luaContent exists */}
            {script.luaContent && (
              <LuaCodeViewer code={script.luaContent} title={`${script.title} - Source Code`} />
            )}

            {/* Reviews Section */}
            <ReviewsSection
              scriptId={script.id}
              reviews={reviews}
              currentUserId={sessionProfile?.id}
              userHasReviewed={!!userReview}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Download Card - Fixed on desktop */}
            <div className="sticky top-24 space-y-6">
              <Card className="bg-mehub-primary/10 border-mehub-primary p-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-mehub-text-secondary text-sm mb-1">Rating</div>
                    <div className="flex items-center gap-2">
                      <div className="text-3xl font-bold text-mehub-primary">
                        {script.averageRating ? script.averageRating.toFixed(1) : 'N/A'}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < Math.round(script.averageRating || 0) ? "text-mehub-secondary" : "text-mehub-border"}
                              fill="currentColor"
                            />
                          ))}
                        </div>
                        <div className="text-mehub-text-secondary text-xs">{script._count.reviews} reviews</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-mehub-border">
                    <div className="text-mehub-text-secondary text-sm mb-1">Downloads</div>
                    <div className="text-2xl font-bold text-mehub-text flex items-center gap-2">
                      <Download size={20} className="text-mehub-primary" />
                      {script._count.scriptDownloads}
                    </div>
                  </div>

                  <DownloadButton
                    scriptId={script.id}
                    scriptTitle={script.title}
                    luaContent={script.luaContent}
                    size="lg"
                    className="w-full border border-mehub-border bg-mehub-success text-mehub-bg hover:bg-orange-500 hover:border-orange-500 hover:text-white text-base"
                  />

                  <LikeButton
                    scriptId={script.id}
                    initialLiked={!!userLiked}
                    initialLikeCount={likeCount}
                    isLoggedIn={!!sessionProfile}
                  />
                </div>
              </Card>

              {/* Author Card */}
              <Card className="bg-mehub-card border-mehub-border p-6">
                <h3 className="font-bold text-mehub-text mb-4">About Author</h3>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={script.author.avatar || "/placeholder-user.jpg"}
                    alt={script.author.username}
                    className="w-12 h-12 rounded-full border-2 border-mehub-border"
                  />
                  <div>
                    <div className="font-medium text-mehub-text flex items-center gap-1">
                      {script.author.username}
                    </div>
                    <div className="text-mehub-text-secondary text-sm">{script.author.role}</div>
                  </div>
                </div>
                {script.author.bio && (
                  <p className="text-mehub-text-secondary text-sm mb-4">{script.author.bio}</p>
                )}

                <Link href={`/profile/${script.author.username}`}>
                  <Button className="w-full bg-mehub-primary text-mehub-bg hover:bg-mehub-primary/90">
                    View Profile
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>

        {/* Related Scripts - TODO: Implement related scripts query */}
      </div>

      {/* Footer */}
      <footer className="border-t border-mehub-border bg-mehub-card/50 py-8 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto text-center text-mehub-text-secondary text-sm">
          <p>&copy; 2025 MEhub. Made for developers, by developers.</p>
        </div>
      </footer>
    </div>
  )
}
