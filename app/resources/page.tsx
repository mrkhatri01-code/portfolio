import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { getSettings, getResources } from "@/lib/data"

export const metadata = {
  title: "Recommended Resources",
  description: "A collection of valuable tools, websites, and learning materials that I recommend",
}

export default async function ResourcesPage() {
  const settings = await getSettings()
  const resources = await getResources()

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
          <Button asChild variant="ghost" className="mb-8 -ml-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <div className="max-w-3xl mx-auto mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Recommended Resources</h1>
            <p className="text-muted-foreground">
              A collection of valuable tools, websites, and learning materials that I recommend
            </p>
          </div>

          {resources && resources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {resources.map((resource) => (
                <Link
                  key={resource.id}
                  href={resource.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  <div className="border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow h-full p-6">
                    <div className="flex items-center gap-4 mb-4">
                      {resource.logo_url ? (
                        <div className="relative w-12 h-12 flex-shrink-0 bg-muted/50 rounded-full flex items-center justify-center overflow-hidden">
                          <img
                            src={resource.logo_url || "/placeholder.svg"}
                            alt={`${resource.name} logo`}
                            className="w-full h-full object-contain p-1"
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).style.display = "none"
                              ;(e.target as HTMLImageElement).parentElement!.innerHTML = `
                                <span class="text-primary font-semibold text-lg">
                                  ${resource.name.charAt(0).toUpperCase()}
                                </span>
                              `
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-primary font-semibold text-lg">
                            {resource.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-medium">{resource.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {(() => {
                            try {
                              return new URL(resource.link_url).hostname.replace("www.", "")
                            } catch (e) {
                              return resource.link_url
                            }
                          })()}
                        </p>
                      </div>
                    </div>

                    {resource.description && <p className="text-sm text-muted-foreground">{resource.description}</p>}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No resources available at the moment.</p>
            </div>
          )}
        </div>
      </main>

      <Footer siteTitle={siteTitle} siteDescription={siteDescription} socialLinks={socialLinks} />
    </div>
  )
}
