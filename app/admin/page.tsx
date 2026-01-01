import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase"
import { BarChart3, FileText, Layers, Tags } from "lucide-react"

export const metadata: Metadata = {
  title: "Admin Dashboard | Blog Management",
  description: "Manage blog posts, categories, and tags",
  robots: "noindex, nofollow",
}

export default async function AdminPage() {
  const supabase = createServerSupabaseClient()

  // Fetch stats
  const [blogsResult, categoriesResult, tagsResult] = await Promise.all([
    supabase.from("blogs").select("id", { count: "exact" }),
    supabase.from("blog_categories").select("id", { count: "exact" }),
    supabase.from("blog_tags").select("id", { count: "exact" }),
  ])

  const blogCount = blogsResult.count || 0
  const categoryCount = categoriesResult.count || 0
  const tagCount = tagsResult.count || 0

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Blog Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your blog content, categories, and tags</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Blog Posts</p>
                <p className="text-3xl font-bold">{blogCount}</p>
              </div>
              <FileText className="h-8 w-8 text-primary opacity-50" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-3xl font-bold">{categoryCount}</p>
              </div>
              <Layers className="h-8 w-8 text-primary opacity-50" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tags</p>
                <p className="text-3xl font-bold">{tagCount}</p>
              </div>
              <Tags className="h-8 w-8 text-primary opacity-50" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Analytics</p>
                <p className="text-3xl font-bold">View</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary opacity-50" />
            </div>
          </Card>
        </div>

        {/* Actions Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="font-bold mb-4">Blog Posts</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create, edit, and manage blog posts with rich text editor and SEO optimization
            </p>
            <div className="flex gap-2">
              <Link href="/admin/blog/new">
                <Button>Create Post</Button>
              </Link>
              <Link href="/admin/blog">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-4">Categories</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Organize your blog posts with categories for better navigation and SEO
            </p>
            <div className="flex gap-2">
              <Link href="/admin/categories">
                <Button>Manage Categories</Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-4">Tags</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add tags to blog posts for improved searchability and content organization
            </p>
            <div className="flex gap-2">
              <Link href="/admin/tags">
                <Button>Manage Tags</Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-4">Settings</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Configure blog settings, SEO preferences, and site-wide options
            </p>
            <div className="flex gap-2">
              <Link href="/admin/settings">
                <Button variant="outline">View Settings</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
