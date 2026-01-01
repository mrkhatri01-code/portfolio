import type { Metadata } from "next"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getBlogs, getSettings } from "@/lib/data"
import { ArrowRight, Calendar, User } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog | Prabhakar Portfolio",
  description: "Read articles about design, development, and creative projects",
  keywords: "blog, articles, design, development",
  openGraph: {
    title: "Blog | Prabhakar Portfolio",
    description: "Read articles about design, development, and creative projects",
    type: "website",
  },
}

export default async function BlogPage() {
  const blogs = await getBlogs()
  const settings = await getSettings()

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Blog",
    description: "Articles about design, development, and creative projects",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement:
        blogs?.map((blog: any, idx: number) => ({
          "@type": "BlogPosting",
          position: idx + 1,
          headline: blog.title,
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${blog.slug}`,
          image: blog.featured_image,
          datePublished: blog.published_at,
        })) || [],
    },
  }

  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <Header siteTitle={settings?.site_title || "My Portfolio"} />

      <main className="flex-1">
        <div className="container py-12 md:py-16">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Insights, tutorials, and thoughts on design, development, and creative projects.
            </p>
          </div>

          {blogs && blogs.length > 0 ? (
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
                      <div className="flex flex-wrap gap-2 mb-4">
                        {blog.categories?.map((cat: any) => (
                          <Badge key={cat.category?.id} variant="secondary" className="text-xs">
                            {cat.category?.name}
                          </Badge>
                        ))}
                      </div>

                      <h2 className="text-xl font-bold mb-2 line-clamp-2">{blog.title}</h2>

                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{blog.excerpt}</p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                        {blog.published_at && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(blog.published_at).toLocaleDateString()}
                          </div>
                        )}
                        {blog.author_id && (
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            Author
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-primary font-medium text-sm">
                        Read More <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No blog posts published yet.</p>
            </div>
          )}
        </div>
      </main>

      <Footer siteTitle={settings?.site_title || "My Portfolio"} siteDescription="" socialLinks={{}} />
    </div>
  )
}
