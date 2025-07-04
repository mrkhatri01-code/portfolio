import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectForm } from "@/components/admin/project-form"
import { FileManager } from "@/components/admin/file-manager"
import { YouTubeManager } from "@/components/admin/youtube-manager"
import { getProjectBySlug } from "@/lib/data"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

interface ProjectEditPageProps {
  params: {
    id: string
  }
}

export default async function ProjectEditPage({ params }: ProjectEditPageProps) {
  const { id } = params

  try {
    const project = await getProjectBySlug(id)

    if (!project) {
      return (
        <div className="container py-8">
          <Button asChild variant="ghost" className="-ml-4 mb-2">
            <Link href="/admin/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>

          <Alert variant="destructive" className="my-8">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Project not found. The project may have been deleted or there was an error connecting to the database.
            </AlertDescription>
          </Alert>
        </div>
      )
    }

    return (
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button asChild variant="ghost" className="-ml-4 mb-2">
              <Link href="/admin/projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Edit Project: {project.title}</h1>
          </div>
        </div>

        <Tabs defaultValue="details">
          <TabsList className="mb-8">
            <TabsTrigger value="details">Project Details</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="videos">YouTube Videos</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <ProjectForm project={project} />
          </TabsContent>

          <TabsContent value="files">
            <FileManager projectId={project.id} />
          </TabsContent>

          <TabsContent value="videos">
            <YouTubeManager projectId={project.id} initialVideos={project.videos || []} />
          </TabsContent>
        </Tabs>
      </div>
    )
  } catch (error) {
    console.error("Error in ProjectEditPage:", error)

    return (
      <div className="container py-8">
        <Button asChild variant="ghost" className="-ml-4 mb-2">
          <Link href="/admin/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>

        <Alert variant="destructive" className="my-8">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was an error loading the project. Please try again later or contact support if the problem persists.
          </AlertDescription>
        </Alert>
      </div>
    )
  }
}

