import { Header } from "@/components/header"
import { ScriptUploadForm } from "@/components/script-upload-form"
import { getCategories } from "@/dal/categories"
import { getTags } from "@/dal/tags"
import { getSessionProfileFromCookie } from "@/lib/sessionUtils"
import { redirect } from "next/navigation"
import { Role } from "@/generated/prisma/enums"

export default async function UploadPage() {
  // Check authentication and authorization
  const profile = await getSessionProfileFromCookie()

  if (!profile) {
    redirect('/login')
  }

  // Only Developers and Admins can upload scripts
  if (profile.role !== Role.Developer && profile.role !== Role.Admin) {
    redirect('/dashboard')
  }

  // Fetch categories and tags from database
  const [categories, tags] = await Promise.all([
    getCategories(),
    getTags(),
  ])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-mehub-text mb-2">Upload Your Script</h1>
          <p className="text-mehub-text-secondary">Share your automation script with the community</p>
        </div>

        {/* Upload Form */}
        <ScriptUploadForm categories={categories} tags={tags} />
      </div>
    </div>
  )
}
