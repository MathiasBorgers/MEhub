import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getSessionProfileFromCookie } from "@/lib/sessionUtils"
import { redirect } from "next/navigation"
import { Role } from "@/generated/prisma/enums"
import { getScripts } from "@/dal/scripts"
import { Edit2, Trash2, Eye } from "lucide-react"

export default async function AdminScriptsPage() {
  const profile = await getSessionProfileFromCookie()

  if (!profile || profile.role !== Role.Admin) {
    redirect('/dashboard')
  }

  const scripts = await getScripts({ limit: 100 })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-mehub-text">Scripts Management</h1>
            <p className="text-mehub-text-secondary mt-1">Manage all scripts on the platform</p>
          </div>
          <Link href="/admin">
            <Button variant="outline" className="border-mehub-border text-mehub-text">
              Back to Admin
            </Button>
          </Link>
        </div>

        <Card className="bg-mehub-card border-mehub-border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-mehub-border">
                <tr>
                  <th className="text-left p-4 text-mehub-text font-semibold">Title</th>
                  <th className="text-left p-4 text-mehub-text font-semibold">Author</th>
                  <th className="text-left p-4 text-mehub-text font-semibold">Category</th>
                  <th className="text-left p-4 text-mehub-text font-semibold">Downloads</th>
                  <th className="text-left p-4 text-mehub-text font-semibold">Rating</th>
                  <th className="text-left p-4 text-mehub-text font-semibold">Status</th>
                  <th className="text-right p-4 text-mehub-text font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {scripts.map((script) => (
                  <tr key={script.id} className="border-b border-mehub-border hover:bg-mehub-bg">
                    <td className="p-4">
                      <Link href={`/script/${script.id}`} className="text-mehub-primary hover:underline">
                        {script.title}
                      </Link>
                    </td>
                    <td className="p-4 text-mehub-text">{script.author.username}</td>
                    <td className="p-4 text-mehub-text">{script.category.name}</td>
                    <td className="p-4 text-mehub-text">{script._count.scriptDownloads}</td>
                    <td className="p-4 text-mehub-text">
                      {script.averageRating?.toFixed(1) || 'N/A'} ★
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        script.isActive 
                          ? 'bg-green-500/20 text-green-500' 
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {script.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/script/${script.id}`}>
                          <Button size="sm" variant="outline" className="border-mehub-border">
                            <Eye size={16} />
                          </Button>
                        </Link>
                        <Link href={`/admin/scripts/${script.id}/edit` as never}>
                          <Button size="sm" variant="outline" className="border-mehub-border">
                            <Edit2 size={16} />
                          </Button>
                        </Link>
                        <Button size="sm" variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}

