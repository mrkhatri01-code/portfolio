"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { createBlog, updateBlog } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"
import RichEditor from "@/components/admin/rich-editor"

interface BlogEditorProps {
  blog?: any
}

export function AdminBlogEditor({ blog }: BlogEditorProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [title, setTitle] = useState(blog?.title || "")
  const [slug, setSlug] = useState(blog?.slug || "")
  const [excerpt, setExcerpt] = useState(blog?.excerpt || "")
  const [content, setContent] = useState(blog?.content || "")
  const [seoTitle, setSeoTitle] = useState(blog?.seo_title || "")
  const [seoDescription, setSeoDescription] = useState(blog?.seo_description || "")
  const [seoKeywords, setSeoKeywords] = useState(blog?.seo_keywords || "")
  const [featuredImage, setFeaturedImage] = useState(blog?.featured_image || "")
  const [published, setPublished] = useState(blog?.published || false)
  const [loading, setLoading] = useState(false)

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    if (!blog) {
      setSlug(generateSlug(newTitle))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append("title", title)
    formData.append("slug", slug)
    formData.append("excerpt", excerpt)
    formData.append("content", content)
    formData.append("seoTitle", seoTitle)
    formData.append("seoDescription", seoDescription)
    formData.append("seoKeywords", seoKeywords)
    formData.append("featuredImage", featuredImage)
    if (published) formData.append("published", "on")

    try {
      const result = blog ? await updateBlog(blog.id, formData) : await createBlog(formData)

      if (result.success) {
        toast({ title: result.message })
        router.push("/admin/blog")
      } else {
        toast({ title: result.message, variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "An error occurred", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">{blog ? "Edit Post" : "Create New Post"}</h2>

        {/* Basic Info */}
        <div className="space-y-4 mb-6">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={handleTitleChange} placeholder="Post title" required />
          </div>

          <div>
            <Label>Slug</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="post-slug" required />
          </div>

          <div>
            <Label>Excerpt</Label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief summary of the post"
              rows={3}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <Label>Featured Image URL</Label>
            <Input
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        {/* Content Editor */}
        <div className="mb-6">
          <Label>Content</Label>
          <RichEditor value={content} onChange={setContent} />
        </div>

        {/* SEO Section */}
        <div className="space-y-4 mb-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-bold">SEO Settings</h3>

          <div>
            <Label>SEO Title</Label>
            <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder={title} maxLength={60} />
            <p className="text-xs text-muted-foreground mt-1">{seoTitle.length}/60 characters</p>
          </div>

          <div>
            <Label>Meta Description</Label>
            <textarea
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder={excerpt}
              maxLength={160}
              rows={2}
              className="w-full px-3 py-2 border rounded-md"
            />
            <p className="text-xs text-muted-foreground mt-1">{seoDescription.length}/160 characters</p>
          </div>

          <div>
            <Label>Keywords (comma-separated)</Label>
            <Input
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>
        </div>

        {/* Publish Section */}
        <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg mb-6">
          <Checkbox
            id="published"
            checked={published}
            onCheckedChange={(checked) => setPublished(checked as boolean)}
          />
          <Label htmlFor="published" className="cursor-pointer">
            Publish this post
          </Label>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : blog ? "Update Post" : "Create Post"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </Card>
    </form>
  )
}
