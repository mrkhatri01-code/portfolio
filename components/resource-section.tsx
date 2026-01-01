"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

interface Resource {
  id: string
  name: string
  description: string
  logo_url: string | null
  link_url: string
  display_order: number
}

interface ResourceSectionProps {
  resources: Resource[]
}

export function ResourceSection({ resources }: ResourceSectionProps) {
  if (!resources || resources.length === 0) {
    return null
  }

  return (
    <section id="resources" className="py-16 bg-muted/40">
      <div className="container px-4">
        <h2 className="text-3xl font-bold tracking-tight mb-6 text-center">Recommended Resources</h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          A collection of valuable tools, websites, and learning materials that I recommend
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ResourceCard({ resource }: { resource: Resource }) {
  const [imageError, setImageError] = useState(false)

  // Extract domain from URL for display
  const getDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname.replace("www.", "")
      return domain
    } catch (e) {
      return url
    }
  }

  return (
    <Link href={resource.link_url} target="_blank" rel="noopener noreferrer" className="block h-full">
      <div className="border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow h-full flex flex-col">
        <div className="p-6 flex-1">
          <div className="flex items-center gap-4 mb-4">
            {resource.logo_url && !imageError ? (
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src={resource.logo_url || "/placeholder.svg"}
                  alt={`${resource.name} logo`}
                  fill
                  className="object-contain"
                  onError={() => setImageError(true)}
                  unoptimized={resource.logo_url.startsWith("http")}
                />
              </div>
            ) : (
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-semibold text-lg">{resource.name.charAt(0).toUpperCase()}</span>
              </div>
            )}
            <div>
              <h3 className="text-lg font-medium">{resource.name}</h3>
              <p className="text-xs text-muted-foreground">{getDomain(resource.link_url)}</p>
            </div>
          </div>

          {resource.description && <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>}
        </div>

        <div className="border-t p-4">
          <span className="text-sm text-primary flex items-center">
            Visit Resource <ExternalLink className="ml-1 h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  )
}
