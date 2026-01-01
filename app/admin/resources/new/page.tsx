import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ResourceForm } from "@/components/admin/resource-form"

export const metadata = {
  title: "Add New Resource",
}

export default function NewResourcePage() {
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
        <h1 className="text-3xl font-bold mb-8">Add New Resource</h1>
        <ResourceForm mode="create" />
      </div>
    </div>
  )
}
