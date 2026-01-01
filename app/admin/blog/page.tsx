"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { createClientSupabaseClient } from "@/lib/supabase"
import { Trash2, Edit, Plus } from "lucide-react"

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    const supabase = createClientSupabaseClient()
    const { data, error } = await supabase
      .from("blogs")
      .select(`*, categories:blog_category_relations(category:blog_categories(name))`)
      .order("created_at", { ascending: false })

    if (!error && data) {
      setBlogs(data)
    }
    setLoading(false)
  }

  const deleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return

    const supabase = createClientSupabaseClient()

    // Delete relations
    await supabase.from("blog_category_relations").delete().eq("blog_id", id)
    await supabase.from("blog_tag_relations").delete().eq("blog_id", id)

    // Delete blog
    const { error } = await supabase.from("blogs").delete().eq("id", id)

    if (!error) {
      setBlogs(blogs.filter((b) => b.id !== id))
    }
  }

  const filteredBlogs = blogs.filter((blog) => blog.title.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Blog Posts</h1>
            <p className="text-muted-foreground">Manage your blog posts</p>
          </div>
          <Link href="/admin/blog/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </Link>
        </div>

        <Card className="p-6 mb-6">
          <Input
            placeholder="Search blog posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </Card>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : filteredBlogs.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">No blog posts found</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBlogs.map((blog) => (
              <Card key={blog.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">{blog.title}</h3>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant={blog.published ? "default" : "secondary"}>
                        {blog.published ? "Published" : "Draft"}
                      </Badge>
                      {blog.categories?.map((cat: any) => (
                        <Badge key={cat.category?.name} variant="outline">
                          {cat.category?.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/blog/${blog.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteBlog(blog.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{blog.excerpt}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
