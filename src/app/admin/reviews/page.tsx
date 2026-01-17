import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getSessionProfileFromCookie } from "@/lib/sessionUtils"
import { redirect } from "next/navigation"
import { Role } from "@prisma/client"
import { prismaClient } from "@/dal/prismaClient"
import { Star, Trash2 } from "lucide-react"

export default async function AdminReviewsPage() {
  const profile = await getSessionProfileFromCookie()

  if (!profile || profile.role !== Role.Admin) {
    redirect('/dashboard')
  }

  const reviews = await prismaClient.review.findMany({
    include: {
      user: {
        select: {
          id: true,
          username: true,
        }
      },
      script: {
        select: {
          id: true,
          title: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-mehub-text">Reviews Management</h1>
            <p className="text-mehub-text-secondary mt-1">Monitor and moderate user reviews</p>
          </div>
          <Link href="/admin">
            <Button variant="outline" className="border-mehub-border text-mehub-text">
              Back to Admin
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-mehub-card border-mehub-border p-6">
            <h3 className="text-mehub-text-secondary text-sm mb-2">Total Reviews</h3>
            <p className="text-4xl font-bold text-mehub-text">{reviews.length}</p>
          </Card>
          <Card className="bg-mehub-card border-mehub-border p-6">
            <h3 className="text-mehub-text-secondary text-sm mb-2">Average Rating</h3>
            <p className="text-4xl font-bold text-mehub-text">
              {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)} ★
            </p>
          </Card>
          <Card className="bg-mehub-card border-mehub-border p-6">
            <h3 className="text-mehub-text-secondary text-sm mb-2">With Comments</h3>
            <p className="text-4xl font-bold text-mehub-text">
              {reviews.filter(r => r.comment).length}
            </p>
          </Card>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="bg-mehub-card border-mehub-border p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <Link
                      href={`/script/${review.script.id}`}
                      className="text-mehub-primary hover:underline font-semibold"
                    >
                      {review.script.title}
                    </Link>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-500"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-mehub-text-secondary text-sm mb-2">
                    by <span className="text-mehub-text font-medium">{review.user.username}</span> on{" "}
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                  {review.comment && (
                    <p className="text-mehub-text mt-2">{review.comment}</p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

