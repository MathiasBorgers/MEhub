import React from "react"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Star, Download, Share2 } from "lucide-react"
import { mockScripts, mockReviews } from "@/lib/mock-data"
import { ImageGallery } from "@/components/image-gallery"
import { LikeButton } from "@/components/like-button"

export default async function ScriptDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const script = mockScripts.find((s) => s.id === resolvedParams.id)

  if (!script) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-mehub-text">Script not found</p>
        </div>
      </div>
    )
  }

  const scriptReviews = mockReviews.filter((r) => r.scriptId === script.id)
  const relatedScripts = mockScripts.filter((s) => s.category === script.category && s.id !== script.id).slice(0, 3)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % script.screenshots.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + script.screenshots.length) % script.screenshots.length)
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
          <Link href={`/marketplace?category=${script.category}`} className="hover:text-mehub-primary">
            {script.category}
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
                  Updated <span className="text-mehub-primary">{script.updatedAt}</span>
                </div>
                <div>
                  Category <span className="text-mehub-primary">{script.category}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {script.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-mehub-hover text-mehub-text-secondary text-xs rounded-full">
                    {tag}
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

            {/* Files */}
            <div className="bg-mehub-card border border-mehub-border rounded-lg p-6">
              <h3 className="font-bold text-mehub-text mb-4">Included Files</h3>
              <div className="space-y-3">
                {script.files.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-mehub-bg rounded-lg border border-mehub-border"
                  >
                    <div>
                      <div className="font-medium text-mehub-text">{file.name}</div>
                      <div className="text-mehub-text-secondary text-sm">
                        {file.type} • {file.size}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-mehub-border text-mehub-text hover:bg-mehub-hover bg-transparent"
                    >
                      <Download size={16} className="mr-1" /> Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-mehub-card border border-mehub-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-mehub-text">Reviews</h2>
                <Button className="bg-mehub-secondary text-mehub-bg hover:bg-mehub-secondary/90">Leave a Review</Button>
              </div>

              {scriptReviews.length === 0 ? (
                <p className="text-mehub-text-secondary">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="space-y-4">
                  {scriptReviews.map((review) => (
                    <div key={review.id} className="pb-4 border-b border-mehub-border last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={review.author.avatar || "/placeholder.svg"}
                            alt={review.author.username}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <div className="font-medium text-mehub-text flex items-center gap-1">
                              {review.author.username}
                              {review.author.verified && <span className="text-mehub-primary text-xs">✓</span>}
                            </div>
                            <div className="text-mehub-text-secondary text-sm">{review.createdAt}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < review.rating ? "text-mehub-secondary" : "text-mehub-border"}
                              fill="currentColor"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-mehub-text-secondary">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
                      <div className="text-3xl font-bold text-mehub-primary">{script.rating}</div>
                      <div className="flex flex-col">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < Math.round(script.rating) ? "text-mehub-secondary" : "text-mehub-border"}
                              fill="currentColor"
                            />
                          ))}
                        </div>
                        <div className="text-mehub-text-secondary text-xs">{script.reviewCount} reviews</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-mehub-border">
                    <div className="text-mehub-text-secondary text-sm mb-1">Downloads</div>
                    <div className="text-2xl font-bold text-mehub-text flex items-center gap-2">
                      <Download size={20} className="text-mehub-primary" />
                      {script.downloads}
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full border border-mehub-border bg-mehub-success text-mehub-bg hover:bg-orange-500 hover:border-orange-500 hover:text-white text-base"
                  >
                    <Download size={20} className="mr-2" />
                    Download Script
                  </Button>

                  <div className="flex gap-2">
                    <LikeButton />
                    <Button
                      size="lg"
                      variant="outline"
                      className="flex-1 border-mehub-border text-mehub-text hover:bg-mehub-hover bg-transparent"
                    >
                      <Share2 size={20} />
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Author Card */}
              <Card className="bg-mehub-card border-mehub-border p-6">
                <h3 className="font-bold text-mehub-text mb-4">About Author</h3>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={script.author.avatar || "/placeholder.svg"}
                    alt={script.author.username}
                    className="w-12 h-12 rounded-full border-2 border-mehub-border"
                  />
                  <div>
                    <div className="font-medium text-mehub-text flex items-center gap-1">
                      {script.author.username}
                      {script.author.verified && <span className="text-mehub-primary">✓</span>}
                    </div>
                    <div className="text-mehub-text-secondary text-sm">{script.author.role}</div>
                  </div>
                </div>
                <p className="text-mehub-text-secondary text-sm mb-4">{script.author.bio}</p>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center">
                    <div className="font-bold text-mehub-primary">{script.author.stats.scriptsUploaded}</div>
                    <div className="text-mehub-text-secondary text-xs">Scripts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-mehub-secondary">{script.author.stats.totalDownloads}</div>
                    <div className="text-mehub-text-secondary text-xs">Downloads</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-mehub-success">{script.author.stats.averageRating}</div>
                    <div className="text-mehub-text-secondary text-xs">Avg Rating</div>
                  </div>
                </div>

                <Link href={`/profile/${script.author.username}`}>
                  <Button className="w-full bg-mehub-primary text-mehub-bg hover:bg-mehub-primary/90">
                    View Profile
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>

        {/* Related Scripts */}
        {relatedScripts.length > 0 && (
          <section className="mt-16 pt-8 border-t border-mehub-border">
            <h2 className="text-2xl font-bold text-mehub-text mb-6">Related Scripts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedScripts.map((relScript) => (
                <Link key={relScript.id} href={`/script/${relScript.id}`}>
                  <Card className="bg-mehub-card border-mehub-border hover:border-mehub-primary transition-colors h-full cursor-pointer">
                    <div className="p-6 space-y-4">
                      <img
                        src={relScript.screenshots[0] || "/placeholder.svg"}
                        alt={relScript.title}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-bold text-mehub-text line-clamp-2">{relScript.title}</h3>
                        <p className="text-mehub-text-secondary text-sm mt-2 line-clamp-2">{relScript.description}</p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-mehub-border">
                        <div className="flex items-center gap-1">
                          <Star size={16} className="text-mehub-secondary" fill="currentColor" />
                          <span className="text-mehub-text text-sm">{relScript.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-mehub-text-secondary text-sm">
                          <Download size={14} />
                          {relScript.downloads}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
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
