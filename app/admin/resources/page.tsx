import Link from "next/link"
import { getResources } from "@/app/actions/resource-actions"
import { PlusCircle, Pencil, Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DeleteResourceButton } from "@/components/admin/delete-resource-button"

export const metadata = {
  title: "Manage Resources",
}

export default async function ResourcesPage() {
  const resources = await getResources()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i>
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">Manage Resources</h1>
        </div>
        <Link
          href="/admin/resources/new"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Resource
        </Link>
      </div>

      {resources.length === 0 ? (
        <div className="rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/30">
          <div className="flex">
            <div className="flex-shrink-0"></div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">No resources found</h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>You haven&apos;t added any resources yet. Click the button above to add your first resource.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {resources.map((resource) => (
            <Card key={resource.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    {resource.logo_url ? (
                      <div className="w-10 h-10 bg-muted/50 rounded-md flex items-center justify-center overflow-hidden">
                        <img
                          src={resource.logo_url || "/placeholder.svg"}
                          alt={resource.name}
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
                      <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center">
                        <span className="text-primary font-semibold text-lg">
                          {resource.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <CardTitle>{resource.name}</CardTitle>
                      <div className="text-xs text-muted-foreground mt-1">
                        <a
                          href={resource.link_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center hover:text-primary"
                        >
                          {(() => {
                            try {
                              return new URL(resource.link_url).hostname.replace("www.", "")
                            } catch (e) {
                              return resource.link_url
                            }
                          })()}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/resources/edit/${resource.id}`}>
                        <Pencil className="mr-1 h-3 w-3" />
                        Edit
                      </Link>
                    </Button>
                    <DeleteResourceButton resourceId={resource.id} resourceName={resource.name}>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="mr-1 h-3 w-3" />
                        Delete
                      </Button>
                    </DeleteResourceButton>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground whitespace-pre-line line-clamp-2">
                  {resource.description || "No description provided."}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
