import { Header } from "@/components/header"
import { getScriptById } from "@/dal/scripts"
import { getCategories } from "@/dal/categories"
import { getTags } from "@/dal/tags"
import { notFound, redirect } from "next/navigation"
import { getSessionProfileFromCookie } from "@/lib/sessionUtils"
import { Role } from "@/generated/prisma/enums"
import { ScriptEditForm } from "@/components/script-edit-form"

interface EditScriptPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditScriptPage({ params }: EditScriptPageProps) {
  const { id } = await params

  // Get current user
  const profile = await getSessionProfileFromCookie()

  if (!profile) {
    redirect('/login')
  }

  // Get the script
  const script = await getScriptById(id)

  if (!script) {
    notFound()
  }

  // Check authorization: must be owner or admin
  if (script.authorId !== profile.id && profile.role !== Role.Admin) {
    redirect('/dashboard')
  }

  // Get categories and tags for the form
  const [categories, tags] = await Promise.all([
    getCategories(),
    getTags()
  ])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-mehub-text mb-2">Edit Script</h1>
          <p className="text-mehub-text-secondary">Update your script details and code</p>
        </div>

        <ScriptEditForm
          script={script}
          categories={categories}
          tags={tags}
        />
      </div>
    </div>
  )
}

