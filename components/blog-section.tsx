import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getBlogs } from "@/lib/data"
import { ArrowRight } from "lucide-react"

export async function BlogSection() {
  const blogs = await getBlogs()
  const featuredBlogs = blogs.slice(0, 3)

  if (!featuredBlogs || featuredBlogs.length === 0) {
    return null
  }

  return (
    <section id="blog" className="container py-12 md:py-20">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Blog Posts</h2>
        <p className="text-lg text-muted-foreground">Insights and articles on design and development</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {featuredBlogs.map((blog: any) => (
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
                <div className="flex flex-wrap gap-2 mb-3">
                  {blog.categories?.slice(0, 2).map((cat: any) => (
                    <Badge key={cat.category?.id} variant="secondary" className="text-xs">
                      {cat.category?.name}
                    </Badge>
                  ))}
                </div>

                <h3 className="text-lg font-bold mb-2 line-clamp-2">{blog.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{blog.excerpt}</p>

                <div className="flex items-center gap-2 text-primary font-medium text-sm">
                  Read More <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Link href="/blog">
        <Button size="lg" variant="outline">
          View All Posts
        </Button>
      </Link>
    </section>
  )
}
