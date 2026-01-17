import { Header } from "@/components/header"
import { AdminCategoryForm } from "@/components/admin-category-form"
import { CategoryList } from "@/components/category-list"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getSessionProfileFromCookie } from "@/lib/sessionUtils"
import { redirect } from "next/navigation"
import { Role } from "@prisma/client"
import { getCategories } from "@/dal/categories"

export default async function AdminCategoriesPage() {
  const profile = await getSessionProfileFromCookie()

  if (!profile || profile.role !== Role.Admin) {
    redirect('/dashboard')
  }

  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-mehub-text">Categories Management</h1>
            <p className="text-mehub-text-secondary mt-1">Create and manage script categories</p>
          </div>
          <Link href="/admin">
            <Button variant="outline" className="border-mehub-border text-mehub-text">
              Back to Admin
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Form */}
          <Card className="bg-mehub-card border-mehub-border p-6">
            <h2 className="text-2xl font-bold text-mehub-text mb-6">Create New Category</h2>
            <AdminCategoryForm />
          </Card>

          {/* Categories List */}
          <Card className="bg-mehub-card border-mehub-border p-6">
            <h2 className="text-2xl font-bold text-mehub-text mb-6">Existing Categories</h2>
            <CategoryList categories={categories} />
          </Card>
        </div>
      </div>
    </div>
  )
}

