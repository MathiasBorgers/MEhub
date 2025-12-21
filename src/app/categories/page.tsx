import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { mockCategories } from "@/lib/mock-data"

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-mehub-text mb-3">Browse Categories</h1>
          <p className="text-mehub-text-secondary text-lg">Find RS3 automation scripts for any activity</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCategories.map((category) => (
            <Link key={category.id} href={`/marketplace?category=${encodeURIComponent(category.name)}`}>
              <Card className="bg-mehub-card border-mehub-border hover:border-mehub-primary transition-colors h-full cursor-pointer group">
                <div className="p-8 text-center space-y-4">
                  {/* Icon */}
                  <div className="text-6xl group-hover:scale-110 transition-transform">{category.icon}</div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-mehub-text">{category.name}</h3>

                  {/* Description */}
                  <p className="text-mehub-text-secondary">{category.description}</p>

                  {/* Script Count */}
                  <div className="pt-4 border-t border-mehub-border">
                    <div className="text-3xl font-bold text-mehub-primary">{category.scriptCount}</div>
                    <div className="text-mehub-text-secondary text-sm">Scripts available</div>
                  </div>

                  {/* CTA Button */}
                  <Button className="w-full bg-mehub-primary text-mehub-bg hover:bg-mehub-primary/90">
                    Explore Category
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>
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
