import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getSessionProfileFromCookie } from "@/lib/sessionUtils"
import { redirect } from "next/navigation"
import { Role } from "@/generated/prisma/enums"
import {
  Users,
  FileText,
  FolderTree,
  Tags,
  MessageSquare,
  Download,
  Shield,
} from "lucide-react"

export default async function AdminDashboardPage() {
  const profile = await getSessionProfileFromCookie()

  if (!profile) {
    redirect('/login')
  }

  // Only admins can access this page
  if (profile.role !== Role.Admin) {
    redirect('/dashboard')
  }

  const adminSections = [
    {
      title: "Users Management",
      description: "Manage all users, roles, and permissions",
      icon: Users,
      href: "/admin/users",
      color: "bg-blue-500",
    },
    {
      title: "Scripts Management",
      description: "Review, edit, and manage all scripts",
      icon: FileText,
      href: "/admin/scripts",
      color: "bg-green-500",
    },
    {
      title: "Categories",
      description: "Create and manage script categories",
      icon: FolderTree,
      href: "/admin/categories",
      color: "bg-purple-500",
    },
    {
      title: "Tags",
      description: "Manage tags for script organization",
      icon: Tags,
      href: "/admin/tags",
      color: "bg-orange-500",
    },
    {
      title: "Reviews",
      description: "Monitor and moderate user reviews",
      icon: MessageSquare,
      href: "/admin/reviews",
      color: "bg-pink-500",
    },
    {
      title: "Downloads",
      description: "View download statistics and logs",
      icon: Download,
      href: "/admin/downloads",
      color: "bg-cyan-500",
    },
    {
      title: "Sessions",
      description: "Manage active user sessions",
      icon: Shield,
      href: "/admin/sessions",
      color: "bg-red-500",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="text-mehub-primary" size={32} />
            <h1 className="text-4xl font-bold text-mehub-text">Admin Dashboard</h1>
          </div>
          <p className="text-mehub-text-secondary">Manage all aspects of the MEhub platform</p>
        </div>

        {/* Admin Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminSections.map((section) => {
            const Icon = section.icon
            return (
              <Link key={section.href} href={section.href as never}>
                <Card className="bg-mehub-card border-mehub-border p-6 hover:border-mehub-primary transition-colors cursor-pointer h-full">
                  <div className={`${section.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-mehub-text mb-2">{section.title}</h3>
                  <p className="text-mehub-text-secondary text-sm">{section.description}</p>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-mehub-text mb-6">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/admin/categories">
              <Button variant="outline" className="border-mehub-border text-mehub-text hover:bg-mehub-card">
                Create Category
              </Button>
            </Link>
            <Link href="/admin/tags">
              <Button variant="outline" className="border-mehub-border text-mehub-text hover:bg-mehub-card">
                Create Tag
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="outline" className="border-mehub-border text-mehub-text hover:bg-mehub-card">
                View All Users
              </Button>
            </Link>
            <Link href="/admin/scripts">
              <Button variant="outline" className="border-mehub-border text-mehub-text hover:bg-mehub-card">
                View All Scripts
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

