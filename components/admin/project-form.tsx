"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createProject, updateProject } from "@/app/actions/project-actions"
import { useToast } from "@/hooks/use-toast"
import { slugify } from "@/lib/utils"

interface ProjectFormProps {
  project?: {
    id: string
    title: string
    slug: string
    description: string
    category: string
    featured: boolean
    external_url?: string
    main_image_url?: string
  }
  mode: "create" | "edit"
}

export function ProjectForm({ project, mode }: ProjectFormProps) {
  const [title, setTitle] = useState(project?.title || "")
  const [slug, setSlug] = useState(project?.slug || "")
  const [description, setDescription] = useState(project?.description || "")
  const [category, setCategory] = useState(project?.category || "")
  const [featured, setFeatured] = useState(project?.featured || false)
  const [externalUrl, setExternalUrl] = useState(project?.external_url || "")
  const [mainImageUrl, setMainImageUrl] = useState(project?.main_image_url || "")
  const [imagePreviewError, setImagePreviewError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [autoSlug, setAutoSlug] = useState(!project)

  const router = useRouter()
  const { toast } = useToast()

  // Auto-generate slug from title if autoSlug is enabled
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)

    if (autoSlug) {
      setSlug(slugify(newTitle))
    }
  }

  // Validate image URL
  const validateImageUrl = (url: string) => {
    if (!url) return true // Empty URL is valid (optional field)
    try {
      new URL(url)
      return true
    } catch (e) {
      return false
    }
  }

  // Handle image URL change
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setMainImageUrl(url)
    setImagePreviewError(false) // Reset error state
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate image URL if provided
    if (mainImageUrl && !validateImageUrl(mainImageUrl)) {
      toast({
        title: "Invalid image URL",
        description: "Please enter a valid URL for the main image",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Validate external URL if provided
    if (externalUrl && !validateImageUrl(externalUrl)) {
      toast({
        title: "Invalid external URL",
        description: "Please enter a valid URL for the external link",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("slug", slug)
      formData.append("description", description)
      formData.append("category", category)
      if (featured) formData.append("featured", "on")
      if (externalUrl) formData.append("externalUrl", externalUrl)
      if (mainImageUrl) formData.append("mainImageUrl", mainImageUrl)

      let result

      if (mode === "create") {
        result = await createProject(formData)
      } else {
        result = await updateProject(project!.id, formData)
      }

      if (!result.success) {
        throw new Error(result.message)
      }

      toast({
        title: mode === "create" ? "Project created" : "Project updated",
        description: result.message,
      })

      // Redirect to project page or admin dashboard
      if (mode === "create" && result.projectId) {
        router.push(`/admin/dashboard?tab=projects`)
      } else if (mode === "edit" && result.slug) {
        router.push(`/projects/${result.slug}`)
      } else {
        router.push("/admin/dashboard?tab=projects")
      }

      // Force a refresh to update the data
      router.refresh()
    } catch (error) {
      console.error("Error submitting project:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save project",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === "create" ? "Create New Project" : "Edit Project"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input id="title" value={title} onChange={handleTitleChange} placeholder="My Awesome Project" required />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="slug">URL Slug</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="auto-slug"
                  checked={autoSlug}
                  onCheckedChange={(checked) => setAutoSlug(checked as boolean)}
                />
                <label htmlFor="auto-slug" className="text-sm text-muted-foreground cursor-pointer">
                  Auto-generate
                </label>
              </div>
            </div>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="my-awesome-project"
              disabled={autoSlug}
              required
            />
            <p className="text-xs text-muted-foreground">
              This will be used in the URL: /projects/<span className="font-mono">{slug || "slug"}</span>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Web Development"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mainImageUrl">Main Image URL</Label>
            <Input
              id="mainImageUrl"
              value={mainImageUrl}
              onChange={handleImageUrlChange}
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-muted-foreground">
              Enter a URL to an image that will be displayed as the main image for this project
            </p>

            {mainImageUrl && (
              <div className="mt-2">
                <Label>Image Preview</Label>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border mt-1">
                  <Image
                    src={mainImageUrl || "/placeholder.svg"}
                    alt="Preview"
                    fill
                    className="object-cover"
                    onError={() => setImagePreviewError(true)}
                  />
                </div>
                {imagePreviewError && (
                  <p className="text-sm text-destructive mt-1">Unable to load image preview. Please check the URL.</p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="externalUrl">External URL (Optional)</Label>
            <Input
              id="externalUrl"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://example.com/my-project"
            />
            <p className="text-xs text-muted-foreground">
              If provided, a link to this URL will be displayed on the project page
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project..."
              rows={5}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="featured" checked={featured} onCheckedChange={(checked) => setFeatured(checked as boolean)} />
            <label
              htmlFor="featured"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Feature this project on the homepage
            </label>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "create" ? "Creating..." : "Updating..."}
              </>
            ) : mode === "create" ? (
              "Create Project"
            ) : (
              "Update Project"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
