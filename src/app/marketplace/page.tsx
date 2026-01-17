import { Header } from "@/components/header"
import { getScripts } from "@/dal/scripts"
import { getCategoriesWithScriptCount } from "@/dal/categories"
import { getTags } from "@/dal/tags"
import { MarketplaceClient } from "@/components/marketplace-client"

interface MarketplacePageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function MarketplacePage({ searchParams }: MarketplacePageProps) {
  const params = await searchParams
  const categoryParam = params.category
  const selectedCategoryName = categoryParam ? decodeURIComponent(categoryParam) : null

  // Fetch data from database
  const categories = await getCategoriesWithScriptCount()
  const tags = await getTags()

  // Find category by name if provided
  let categoryFilter = undefined
  if (selectedCategoryName) {
    const category = categories.find(c => c.name === selectedCategoryName)
    categoryFilter = category?.id
  }

  // Fetch scripts based on category filter
  const scripts = await getScripts({
    isActive: true,
    categoryId: categoryFilter,
    limit: 100,
    sortBy: 'downloads',
    sortOrder: 'desc'
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MarketplaceClient
        initialScripts={scripts}
        categories={categories}
        tags={tags}
        selectedCategory={selectedCategoryName}
      />

      {/* Footer */}
      <footer className="border-t border-mehub-border bg-mehub-card/50 py-8 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto text-center text-mehub-text-secondary text-sm">
          <p>&copy; 2025 MEhub. Made for developers, by developers.</p>
        </div>
      </footer>
    </div>
  )
}
