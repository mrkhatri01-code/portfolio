import type { Metadata } from "next"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getBlogsByTag, getSettings } from "@/lib/data"
import { ArrowLeft } from "lucide-react"

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return {
    title: `Posts tagged with "${params.slug.replace(/-/g, " ")}"`,
    description: "Browse blog posts by tag",
  }
}

export default async function BlogTagPage({ params }: { params: { slug: string } }) {
  const blogs = await getBlogsByTag(params.slug)
  const settings = await getSettings()
  const tagName = params.slug.replace(/-/g, " ").charAt(0).toUpperCase() + params.slug.replace(/-/g, " ").slice(1)

  return (
    <div className="flex min-h-screen flex-col">
      <Header siteTitle={settings?.site_title || "My Portfolio"} />

      <main className="flex-1">
        <div className="container py-12 md:py-16">
          <Link href="/blog">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Posts tagged with <Badge className="ml-2">{tagName}</Badge>
            </h1>
            <p className="text-xl text-muted-foreground">Showing {blogs.length} posts</p>
          </div>

          {blogs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog: any) => (
                <Link key={blog.id} href={`/blog/${blog.slug}`}>
                  <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    {blog.featured_image && (
                      <div className="aspect-video overflow-hidden bg-muted">
                        <img
                          src={blog.featured_image || "/placeholder.svg"}
                          alt={blog.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h2 className="text-lg font-bold mb-2 line-clamp-2">{blog.title}</h2>
                      <p className="text-sm text-muted-foreground line-clamp-2">{blog.excerpt}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">No posts found with this tag.</p>
            </Card>
          )}
        </div>
      </main>

      <Footer siteTitle={settings?.site_title || "My Portfolio"} siteDescription="" socialLinks={{}} />
    </div>
  )
}
