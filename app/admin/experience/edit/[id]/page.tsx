import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ExperienceForm } from "@/components/admin/experience-form"
import { createServerSupabaseClient } from "@/lib/supabase"

interface EditExperiencePageProps {
  params: {
    id: string
  }
}

export default async function EditExperiencePage({ params }: EditExperiencePageProps) {
  const { id } = params
  const supabase = createServerSupabaseClient()

  // Get experience
  const { data: experience, error } = await supabase.from("experience").select("*").eq("id", id).single()

  if (error || !experience) {
    notFound()
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <Button asChild variant="ghost" className="-ml-4">
          <Link href="/admin/dashboard?tab=experience">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Experience
          </Link>
        </Button>
      </div>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Experience</h1>
        <ExperienceForm mode="edit" experience={experience} />
      </div>
    </div>
  )
}

