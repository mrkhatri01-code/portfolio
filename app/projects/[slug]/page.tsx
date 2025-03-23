import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { YouTubeVideo } from "@/components/youtube-video"
import { RatingStars } from "@/components/rating-stars"
import { RatingForm } from "@/components/rating-form"
import { RatingsDisplay } from "@/components/ratings-display"
import { ProjectDescription } from "@/components/project-description"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getSettings, getProjectBySlug } from "@/lib/data"

interface ProjectPageProps {
  params: {
    slug: string
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = params
  const settings = await getSettings()
  const project = await getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const siteTitle = settings?.site_title || "My Portfolio"
  const siteDescription =
    settings?.site_description || "Showcasing my best work in design, development, and creative projects"

  const socialLinks = {
    instagram: settings?.instagram_url,
    behance: settings?.behance_url,
    github: settings?.github_url,
    linkedin: settings?.linkedin_url,
    facebook: settings?.facebook_url,
    twitter: settings?.twitter_url,
    discord: settings?.discord_url,
    youtube: settings?.youtube_url,
  }

  const formattedDate = new Date(project.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Header siteTitle={siteTitle} />

      <main className="flex-1 py-16">
        <div className="container">
          <Button asChild variant="ghost" className="mb-8 -ml-4">
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>

          <div className="grid gap-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-4">{project.title}</h1>
              <div className="flex items-center gap-4 mb-6">
                <Badge variant="outline">{project.category}</Badge>
                <span className="text-sm text-muted-foreground">{formattedDate}</span>
                {project.averageRating !== null && (
                  <div className="flex items-center gap-2">
                    <RatingStars value={project.averageRating} readOnly />
                    <span className="text-sm">
                      ({project.ratings?.length || 0} {project.ratings?.length === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                )}
              </div>

              {project.external_url && (
                <div className="mb-4">
                  <Button asChild variant="outline">
                    <a
                      href={project.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visit Project
                    </a>
                  </Button>
                </div>
              )}

              <div className="aspect-video relative rounded-lg overflow-hidden border mb-8">
                <Image
                  src={project.main_image_url || `/placeholder.svg?height=600&width=1200`}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <ProjectDescription description={project.description} className="max-w-3xl mb-8" />
            </div>

            <Tabs defaultValue="ratings">
              <TabsList>
                {project.videos && project.videos.length > 0 && <TabsTrigger value="videos">Videos</TabsTrigger>}
                <TabsTrigger value="ratings">Ratings & Reviews</TabsTrigger>
              </TabsList>

              {project.videos && project.videos.length > 0 && (
                <TabsContent value="videos" className="space-y-6 mt-6">
                  <h2 className="text-2xl font-semibold">Project Videos</h2>
                  <div className="grid grid-cols-1 gap-6">
                    {project.videos.map((video) => (
                      <div key={video.id} className="space-y-2">
                        {video.title && <h3 className="text-lg font-medium">{video.title}</h3>}
                        <YouTubeVideo youtubeUrl={video.youtube_url} title={video.title || undefined} />
                      </div>
                    ))}
                  </div>
                </TabsContent>
              )}

              <TabsContent value="ratings" className="space-y-8 mt-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <RatingForm projectId={project.id} />
                  </div>
                  <div>
                    <RatingsDisplay ratings={project.ratings || []} averageRating={project.averageRating} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer siteTitle={siteTitle} siteDescription={siteDescription} socialLinks={socialLinks} />
    </div>
  )
}

