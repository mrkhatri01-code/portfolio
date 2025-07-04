import Link from "next/link"
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
import { ProjectFiles } from "@/components/project-files"
import { ImageGallery } from "@/components/image-gallery"
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

  const formattedDate = new Date(project.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Prepare project images for the gallery
  const projectImages = [
    // Add main image as the first image if it exists
    ...(project.main_image_url
      ? [
          {
            id: "main-image",
            image_url: project.main_image_url,
            alt_text: `${project.title} main image`,
          },
        ]
      : []),
    // Add additional project images if they exist
    ...(project.project_images || []),
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header siteTitle={siteTitle} />

      <main className="flex-1 py-16">
        <div className="container">
          {/* Navigation button */}
          <div className="mb-8">
            <Button asChild variant="outline" className="group transition-all hover:bg-primary/10">
              <Link href="/projects" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Projects
              </Link>
            </Button>
          </div>

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

              {/* Replace single image with image gallery */}
              <div className="mb-8">
                <ImageGallery images={projectImages} />
              </div>

              <ProjectDescription description={project.description} className="max-w-3xl mb-8" />
            </div>

            <Tabs defaultValue="videos">
              <TabsList>
                <TabsTrigger value="videos">Videos</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
                <TabsTrigger value="ratings">Ratings & Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="videos" className="space-y-6 mt-6">
                <h2 className="text-2xl font-semibold">Project Videos</h2>
                {project.videos && project.videos.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {project.videos.map((video) => (
                      <div key={video.id} className="space-y-2">
                        {video.title && <h3 className="text-lg font-medium">{video.title}</h3>}
                        <YouTubeVideo youtubeUrl={video.youtube_url} title={video.title || undefined} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No videos available for this project.</p>
                )}
              </TabsContent>

              <TabsContent value="files" className="space-y-6 mt-6">
                <ProjectFiles projectId={project.id} />
              </TabsContent>

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

