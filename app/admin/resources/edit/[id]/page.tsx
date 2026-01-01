import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ResourceForm } from "@/components/admin/resource-form"
import { getResourceById } from "@/app/actions/resource-actions"

interface EditResourcePageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: EditResourcePageProps) {
  const resource = await getResourceById(params.id)
  return {
    title: resource ? `Edit Resource: ${resource.name}` : "Edit Resource",
  }
}

export default async function EditResourcePage({ params }: EditResourcePageProps) {
  const { id } = params
  const resource = await getResourceById(id)

  if (!resource) {
    notFound()
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <Button asChild variant="ghost" className="-ml-4">
          <Link href="/admin/resources">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resources
          </Link>
        </Button>
      </div>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Resource</h1>
        <ResourceForm mode="edit" resource={resource} />
      </div>
    </div>
  )
}
