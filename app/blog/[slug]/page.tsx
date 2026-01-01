import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getBlogBySlug, getBlogs, getSettings } from "@/lib/data"
import { ArrowLeft, Calendar, User } from "lucide-react"

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const blog = await getBlogBySlug(params.slug)

  if (!blog) {
    return {
      title: "Blog Not Found",
      description: "The blog post you're looking for doesn't exist.",
    }
  }

  return {
    title: blog.seo_title || blog.title,
    description: blog.seo_description || blog.excerpt,
    keywords: blog.seo_keywords,
    authors: [{ name: "Blog Author" }],
    openGraph: {
      title: blog.seo_title || blog.title,
      description: blog.seo_description || blog.excerpt,
      type: "article",
      publishedTime: blog.published_at,
      images: blog.featured_image ? [{ url: blog.featured_image, alt: blog.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.seo_title || blog.title,
      description: blog.seo_description || blog.excerpt,
      images: blog.featured_image ? [blog.featured_image] : [],
    },
  }
}

export async function generateStaticParams() {
  const blogs = await getBlogs()
  return blogs.map((blog: any) => ({
    slug: blog.slug,
  }))
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const blog = await getBlogBySlug(params.slug)
  const settings = await getSettings()

  if (!blog) {
    notFound()
  }

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.seo_title || blog.title,
    description: blog.seo_description || blog.excerpt,
    image: blog.featured_image ? [blog.featured_image] : undefined,
    datePublished: blog.published_at,
    dateModified: blog.updated_at || blog.published_at,
    author: {
      "@type": "Person",
      name: settings?.site_title || "Blog Author",
    },
    keywords: blog.seo_keywords,
  }

  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }} />

      <Header siteTitle={settings?.site_title || "My Portfolio"} />

      <main className="flex-1">
        <article className="container py-12 md:py-16 max-w-3xl">
          <Link href="/blog">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.categories?.map((cat: any) => (
                <Badge key={cat.category?.id}>{cat.category?.name}</Badge>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">{blog.title}</h1>

            <div className="flex items-center gap-6 text-muted-foreground mb-6 flex-wrap">
              {blog.published_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={blog.published_at}>
                    {new Date(blog.published_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
              )}
              {blog.author_id && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>By Author</span>
                </div>
              )}
              {blog.views && (
                <div>
                  <span>{blog.views[0]?.view_count || 0} views</span>
                </div>
              )}
            </div>
          </header>

          {blog.featured_image && (
            <div className="aspect-video overflow-hidden rounded-lg mb-8 bg-muted">
              <img
                src={blog.featured_image || "/placeholder.svg"}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none mb-8">
            {blog.content && (
              <div
                dangerouslySetInnerHTML={{
                  __html: blog.content.replace(/^#\s+/gm, "## "), // Ensure H2+ for article content
                }}
              />
            )}
          </div>

          <div className="border-t pt-8">
            <div className="flex flex-wrap gap-2">
              <span className="text-muted-foreground">Tags:</span>
              {blog.tags?.map((tag: any) => (
                <Link key={tag.tag?.id} href={`/blog/tag/${tag.tag?.slug}`}>
                  <Badge variant="outline">{tag.tag?.name}</Badge>
                </Link>
              ))}
            </div>
          </div>
        </article>
      </main>

      <Footer siteTitle={settings?.site_title || "My Portfolio"} siteDescription="" socialLinks={{}} />
    </div>
  )
}
