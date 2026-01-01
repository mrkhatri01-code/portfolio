import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { getSettings, getFAQs } from "@/lib/data"

export const metadata = {
  title: "Frequently Asked Questions",
  description: "Find answers to common questions about our services and projects",
}

export default async function FAQsPage() {
  const settings = await getSettings()
  const faqs = await getFAQs()

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
            <h1 className="text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h1>
            <p className="text-muted-foreground">Find answers to common questions about our services and projects</p>
          </div>

          {faqs && faqs.length > 0 ? (
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <div key={faq.id} className="border rounded-lg overflow-hidden bg-card">
                  <div className="p-4">
                    <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
                    <div className="prose prose-sm dark:prose-invert">
                      {faq.answer.split("\n").map((paragraph, i) => (
                        <p key={i} className="text-muted-foreground">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No FAQs available at the moment.</p>
            </div>
          )}
        </div>
      </main>

      <Footer siteTitle={siteTitle} siteDescription={siteDescription} socialLinks={socialLinks} />
    </div>
  )
}
