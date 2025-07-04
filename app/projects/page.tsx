import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RatingStars } from "@/components/rating-stars"
import { getSettings, getProjects } from "@/lib/data"

export default async function ProjectsPage() {
  const settings = await getSettings()
  const projects = await getProjects()

  const siteTitle = settings?.site_title || "My Portfolio"
  const siteDescription =
    settings?.site_description || "Showcasing my best work in design, development, and creative projects"

  // Safely extract social links, handling potential undefined values
  const socialLinks = {
    instagram: settings?.instagram_url || undefined,
    behance: settings?.behance_url || undefined,
    github: settings?.github_url || undefined,
    linkedin: settings?.linkedin_url || undefined,
    facebook: settings?.facebook_url || undefined,
    twitter: settings?.twitter_url || undefined,
    discord: settings?.discord_url || undefined,
    youtube: settings?.youtube_url || undefined,
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header siteTitle={siteTitle} />

      <main className="flex-1 py-16">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start mb-12">
            <div>
              <Button asChild variant="ghost" className="mb-4 -ml-4">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              <h1 className="text-4xl font-bold tracking-tight mb-2">All Projects</h1>
              <p className="text-muted-foreground">Browse through all my work and creative projects</p>
            </div>
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
                  <CardFooter>
                    <div className="flex justify-between w-full">
                      <Button asChild variant="ghost">
                        <Link href={`/projects/${project.slug}`}>
                          View Project <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>

                      {project.external_url && (
                        <Button asChild variant="outline" size="icon">
                          <a
                            href={project.external_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Visit project"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer siteTitle={siteTitle} siteDescription={siteDescription} socialLinks={socialLinks} />
    </div>
  )
}
