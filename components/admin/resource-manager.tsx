"use client"

import { CardDescription } from "@/components/ui/card"

import { CardFooter } from "@/components/ui/card"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Pencil, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { deleteResource } from "@/app/actions/resource-actions"
import { useToast } from "@/hooks/use-toast"

interface Resource {
  id: string
  name: string
  description: string
  logo_url: string
  link_url: string
  display_order: number
}

interface ResourceManagerProps {
  initialResources: Resource[]
}

export function ResourceManager({ initialResources }: ResourceManagerProps) {
  const [resources, setResources] = useState<Resource[]>(initialResources)
  const router = useRouter()
  const { toast } = useToast()

  // Update local state when initialResources changes
  useEffect(() => {
    setResources(initialResources)
  }, [initialResources])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource? This action cannot be undone.")) {
      return
    }

    try {
      const result = await deleteResource(id)

      if (!result.success) {
        throw new Error(result.message)
      }

      toast({
        title: "Resource deleted",
        description: result.message,
      })

      // Update local state
      setResources((prev) => prev.filter((item) => item.id !== id))

      // Refresh the page
      router.refresh()
    } catch (error) {
      console.error("Error deleting resource:", error)
      toast({
        title: "Delete failed",
        description: "There was an error deleting the resource",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Resources</h2>
        <Button asChild>
          <Link href="/admin/resources/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Resource
          </Link>
        </Button>
      </div>

      {resources.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You haven't created any resources yet. Add your first resource to get started.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/admin/resources/new">
                <Plus className="mr-2 h-4 w-4" />
                Add New Resource
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid gap-6">
          {resources.map((resource) => (
            <Card key={resource.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{resource.name}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/resources/edit/${resource.id}`}>
                        <Pencil className="mr-1 h-3 w-3" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(resource.id)}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  <Link href={resource.link_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {resource.link_url}
                  </Link>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
