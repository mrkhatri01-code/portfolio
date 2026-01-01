"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Pencil, Trash2, Plus, ExternalLink, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { deleteProject } from "@/app/actions/project-actions"
import { useToast } from "@/hooks/use-toast"
import { RatingStars } from "@/components/rating-stars"

interface Project {
  id: string
  title: string
  slug: string
  description: string
  category: string
  featured: boolean
  created_at: string
  updated_at: string
  main_image_url?: string | null
  external_url?: string | null
  averageRating?: number | null
  ratings?: any[]
  videos?: {
    id: string
    youtube_url: string
    title: string | null
  }[]
}

interface ProjectManagerProps {
  initialProjects: Project[]
}

export function ProjectManager({ initialProjects }: ProjectManagerProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const router = useRouter()
  const { toast } = useToast()

  // Update local state when initialProjects changes
  useEffect(() => {
    setProjects(initialProjects)
  }, [initialProjects])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return
    }

    try {
      const result = await deleteProject(id)

      if (!result.success) {
        throw new Error(result.message)
      }

      toast({
        title: "Project deleted",
        description: result.message,
      })

      // Update local state
      setProjects((prev) => prev.filter((item) => item.id !== id))

      // Refresh the page
      router.refresh()
    } catch (error) {
      console.error("Error deleting project:", error)
      toast({
        title: "Delete failed",
        description: "There was an error deleting the project",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Project
          </Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Projects</CardTitle>
            <CardDescription>
              You haven't created any projects yet. Add your first project to get started.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/admin/projects/new">
                <Plus className="mr-2 h-4 w-4" />
                Add New Project
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <div className="grid md:grid-cols-[300px_1fr] gap-6">
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={project.main_image_url || `/placeholder.svg?height=300&width=600`}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{project.title}</h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant="outline" className="whitespace-normal">
                          {project.category}
                        </Badge>
                        {project.featured && <Badge>Featured</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">/{project.slug}</p>

                      {project.averageRating !== undefined && project.averageRating !== null && (
                        <div className="flex items-center gap-2 mt-2">
                          <RatingStars value={project.averageRating} readOnly size="sm" />
                          <span className="text-sm text-muted-foreground">
                            {project.averageRating.toFixed(1)} ({project.ratings?.length || 0} reviews)
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/projects/${project.id}`}>Manage</Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/projects/edit/${project.id}`}>
                          <Pencil className="mr-1 h-3 w-3" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(project.id)}
                      >
                        <Trash2 className="mr-1 h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-muted-foreground line-clamp-3 h-[4.5rem] overflow-hidden">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.external_url && (
                      <Button asChild variant="outline" size="sm">
                        <a href={project.external_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-1 h-3 w-3" />
                          External Link
                        </a>
                      </Button>
                    )}

                    <Button asChild variant="outline" size="sm">
                      <Link href={`/projects/${project.slug}`} target="_blank">
                        <ExternalLink className="mr-1 h-3 w-3" />
                        View Project
                      </Link>
                    </Button>

                    {project.videos && project.videos.length > 0 && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Youtube className="h-3 w-3" />
                        {project.videos.length} {project.videos.length === 1 ? "Video" : "Videos"}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
