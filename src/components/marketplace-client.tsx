"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Star, Download } from "lucide-react"
import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import type { ScriptWithRelations } from "@/dal/scripts"
import type { CategoryWithScriptCount } from "@/dal/categories"
import type { Tag } from "@prisma/client"

type SortOption = "trending" | "recent" | "top-rated" | "downloads"

interface MarketplaceClientProps {
  initialScripts: ScriptWithRelations[]
  categories: CategoryWithScriptCount[]
  tags: Tag[]
  selectedCategory: string | null
}

export function MarketplaceClient({ initialScripts, categories, tags, selectedCategory }: MarketplaceClientProps) {
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortOption>("trending")
  const [minRating, setMinRating] = useState(0)

  const handleCategoryFilter = (categoryName: string | null) => {
    if (categoryName === null) {
      router.push("/marketplace")
    } else {
      router.push(`/marketplace?category=${encodeURIComponent(categoryName)}`)
    }
  }

  // Filter and sort scripts
  const filteredScripts = useMemo(() => {
    let scripts = [...initialScripts]

    // Filter by search query (client-side)
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      scripts = scripts.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          s.author.username.toLowerCase().includes(query),
      )
    }

    // Filter by tags (client-side)
    if (selectedTags.length > 0) {
      scripts = scripts.filter((s) =>
        selectedTags.some((tagId) => s.tags.some(st => st.tagId === tagId))
      )
    }

    // Filter by rating (client-side)
    scripts = scripts.filter((s) => (s.averageRating || 0) >= minRating)

    // Sort
    scripts.sort((a, b) => {
      switch (sortBy) {
        case "trending":
          return b._count.scriptDownloads - a._count.scriptDownloads
        case "top-rated":
          return (b.averageRating || 0) - (a.averageRating || 0)
        case "recent":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "downloads":
          return b._count.scriptDownloads - a._count.scriptDownloads
        default:
          return 0
      }
    })

    return scripts
  }, [initialScripts, searchQuery, selectedTags, sortBy, minRating])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-mehub-text mb-2">Script Marketplace</h1>
        <p className="text-mehub-text-secondary">
          {selectedCategory ? `Browsing: ${selectedCategory}` : "Browse and download RS3 automation scripts"}
        </p>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Search */}
            <div>
              <h3 className="font-semibold text-mehub-text mb-3">Search</h3>
              <input
                type="text"
                placeholder="Search scripts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 bg-mehub-card border border-mehub-border rounded-lg text-mehub-text placeholder-mehub-text-secondary outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 hover:border-orange-500/50 transition-all"
              />
            </div>

            {/* Categories Filter */}
              <div>
                <h3 className="font-semibold text-mehub-text mb-3">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryFilter(null)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-all ${
                      selectedCategory === null
                        ? "bg-mehub-primary text-mehub-bg font-medium hover:bg-orange-500"
                        : "text-mehub-text-secondary hover:text-orange-500 hover:bg-mehub-hover/30 hover:border-l-2 hover:border-orange-500"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryFilter(cat.name)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-all ${
                        selectedCategory === cat.name
                          ? "bg-mehub-primary text-mehub-bg font-medium hover:bg-orange-500"
                          : "text-mehub-text-secondary hover:text-orange-500 hover:bg-mehub-hover/30 hover:border-l-2 hover:border-orange-500"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

            {/* Rating Filter */}
            <div>
              <h3 className="font-semibold text-mehub-text mb-3">Minimum Rating</h3>
              <div className="space-y-2">
                {[0, 3, 3.5, 4, 4.5].map((rating) => (
                  <label
                    key={rating}
                    className="flex items-center gap-2 text-mehub-text-secondary hover:text-orange-500 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      checked={minRating === rating}
                      onChange={() => setMinRating(rating)}
                      className="w-4 h-4 accent-orange-500"
                    />
                    <span>{rating === 0 ? "All Ratings" : `${rating}+ stars`}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags Filter */}
            <div>
              <h3 className="font-semibold text-mehub-text mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 8).map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => {
                      setSelectedTags((prev) => (prev.includes(tag.id) ? prev.filter((t) => t !== tag.id) : [...prev, tag.id]))
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      selectedTags.includes(tag.id)
                        ? "bg-mehub-primary text-mehub-bg hover:bg-orange-500"
                        : "bg-mehub-card border border-mehub-border text-mehub-text-secondary hover:border-orange-500 hover:text-orange-500 hover:shadow-md hover:shadow-orange-500/20"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-mehub-border">
            <div className="text-mehub-text-secondary font-medium">{filteredScripts.length} scripts found</div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 bg-mehub-card border border-mehub-border rounded-lg text-mehub-text outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 hover:border-orange-500/50 transition-all"
            >
              <option value="trending">Trending</option>
              <option value="top-rated">Top Rated</option>
              <option value="downloads">Most Downloaded</option>
              <option value="recent">Recently Added</option>
            </select>
          </div>

          {/* Scripts Grid */}
          {filteredScripts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-mehub-text-secondary">No scripts found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredScripts.map((script) => (
                <Link key={script.id} href={`/script/${script.id}`}>
                  <Card className="bg-mehub-card border border-mehub-border hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 h-full cursor-pointer">
                    <div className="p-6 space-y-4">
                      <img
                        src={script.screenshots[0] || "/placeholder.svg"}
                        alt={script.title}
                        className="w-full h-40 object-cover rounded-lg hover:opacity-90 hover:shadow-md hover:shadow-orange-500/20 transition-all"
                      />

                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-mehub-text line-clamp-2 flex-1">{script.title}</h3>
                          <span className="ml-2 px-2 py-1 bg-mehub-primary/20 text-mehub-primary text-xs rounded font-medium hover:bg-orange-500/20 hover:text-orange-500 transition-colors">
                            v{script.version}
                          </span>
                        </div>
                        <p className="text-mehub-text-secondary text-sm line-clamp-2">{script.description}</p>
                      </div>

                      {/* Author */}
                      <div className="flex items-center gap-2 py-2 border-y border-mehub-border">
                        <img
                          src={script.author.avatar || "/placeholder-user.jpg"}
                          alt={script.author.username}
                          className="w-8 h-8 rounded-full hover:ring-2 hover:ring-orange-500 transition-all"
                        />
                        <div>
                          <div className="text-mehub-text text-sm font-medium flex items-center gap-1">
                            {script.author.username}
                          </div>
                          <div className="text-mehub-text-secondary text-xs">{script.category.name}</div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {script.tags.slice(0, 3).map((st) => (
                          <span
                            key={st.tagId}
                            className="px-2 py-1 bg-mehub-hover/20 text-mehub-text-secondary text-xs rounded hover:bg-orange-500/30 hover:text-orange-500 hover:shadow-sm hover:shadow-orange-500/20 transition-all"
                          >
                            {st.tag.name}
                          </span>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between pt-2 border-t border-mehub-border">
                        <div className="flex items-center gap-3 text-mehub-text-secondary">
                          <div className="flex items-center gap-1 hover:text-orange-500 transition-colors">
                            <Star size={14} className="text-mehub-secondary" fill="currentColor" />
                            {script.averageRating?.toFixed(1) || "N/A"}
                          </div>
                          <div className="flex items-center gap-1 hover:text-orange-500 transition-colors">
                            <Download size={14} />
                            {script._count.scriptDownloads}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline" className="border-mehub-border text-mehub-text hover:bg-orange-500/10 hover:border-orange-500 hover:text-orange-500 transition-all bg-transparent"
                        >
                          Download
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

