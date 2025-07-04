import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
}

interface ProjectsSectionProps {
  projects: Project[]
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="py-16 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2 text-center md:text-left">Featured Projects</h2>
            <p className="text-muted-foreground text-center md:text-left">
              Showcasing my best work and creative projects
            </p>
          </div>
          <Button asChild variant="outline" className="mt-4 md:mt-0">
            <Link href="/projects" className="flex items-center">
              View All Projects <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden group">
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={project.main_image_url || `/placeholder.svg?height=300&width=600`}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                    <Badge variant="outline" className="whitespace-normal text-center">
                      {project.category}
                    </Badge>
                  </div>
                  {project.averageRating !== undefined && project.averageRating !== null && (
                    <div className="flex items-center gap-2 mt-2">
                      <RatingStars value={project.averageRating} readOnly size="sm" />
                      <span className="text-xs text-muted-foreground">
                        {project.averageRating.toFixed(1)} ({project.ratings?.length || 0})
                      </span>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-3">{project.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button asChild variant="ghost">
                    <Link href={`/projects/${project.slug}`}>
                      View Project <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  {project.external_url && (
                    <Button asChild variant="outline" size="icon">
                      <a href={project.external_url} target="_blank" rel="noopener noreferrer" title="Visit project">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
