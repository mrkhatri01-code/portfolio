import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EducationForm } from "@/components/admin/education-form"

export default function NewEducationPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <Button asChild variant="ghost" className="-ml-4">
          <Link href="/admin/dashboard?tab=education">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Education
          </Link>
        </Button>
      </div>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Add Education</h1>
        <EducationForm mode="create" />
      </div>
    </div>
  )
}

