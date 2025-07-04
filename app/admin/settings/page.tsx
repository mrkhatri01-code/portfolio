import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SettingsForm } from "@/components/admin/settings-form"
import { createServerSupabaseClient } from "@/lib/supabase"

export default async function SettingsPage() {
  const supabase = createServerSupabaseClient()

  // Get settings
  const { data: settings, error } = await supabase.from("settings").select("*").single()

  if (error && !error.message.includes("No rows found")) {
    notFound()
  }

  // If no settings exist, create default settings
  const defaultSettings = {
    id: "",
    site_title: "My Portfolio",
    site_description: "Showcasing my best work in design, development, and creative projects",
    about_text: null,
    profile_image_url: null,
    resume_url: null,
    instagram_url: null,
    behance_url: null,
    github_url: null,
    linkedin_url: null,
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <Button asChild variant="ghost" className="-ml-4">
          <Link href="/admin/dashboard?tab=settings">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Site Settings</h1>
        <SettingsForm settings={settings || defaultSettings} />
      </div>
    </div>
  )
}

