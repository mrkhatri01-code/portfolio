"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createResource, updateResource } from "@/app/actions/resource-actions"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ResourceFormProps {
  resource?: {
    id: string
    name: string
    description: string
    logo_url: string | null
    link_url: string
  }
  mode: "create" | "edit"
}

export function ResourceForm({ resource, mode }: ResourceFormProps) {
  const [name, setName] = useState(resource?.name || "")
  const [description, setDescription] = useState(resource?.description || "")
  const [logoUrl, setLogoUrl] = useState(resource?.logo_url || "")
  const [linkUrl, setLinkUrl] = useState(resource?.link_url || "")
  const [isLoading, setIsLoading] = useState(false)
  const [logoPreviewError, setLogoPreviewError] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("basic")
  const [isValidUrl, setIsValidUrl] = useState(true)

  const router = useRouter()
  const { toast } = useToast()

  // Validate URL format
  useEffect(() => {
    if (logoUrl) {
      try {
        new URL(logoUrl)
        setIsValidUrl(true)
      } catch (e) {
        setIsValidUrl(false)
      }
    } else {
      setIsValidUrl(true) // Empty is valid
    }
  }, [logoUrl])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate link URL
    try {
      new URL(linkUrl)
    } catch (e) {
      toast({
        title: "Invalid link URL",
        description: "Please enter a valid URL for the resource link",
        variant: "destructive",
      })
      return
    }

    // Validate logo URL if provided
    if (logoUrl && !isValidUrl) {
      toast({
        title: "Invalid logo URL",
        description: "Please enter a valid URL for the logo",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("description", description)
      formData.append("logoUrl", logoUrl)
      formData.append("linkUrl", linkUrl)

      let result

      if (mode === "create") {
        result = await createResource(formData)
      } else {
        result = await updateResource(resource!.id, formData)
      }

      if (!result.success) {
        throw new Error(result.message)
      }

      toast({
        title: mode === "create" ? "Resource added" : "Resource updated",
        description: result.message,
      })

      // Redirect to admin dashboard
      router.push("/admin/dashboard?tab=resources")
      router.refresh()
    } catch (error) {
      console.error("Error submitting resource:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save resource",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === "create" ? "Add Resource" : "Edit Resource"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="logo">Logo</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Resource Name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description of the resource"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkUrl">Link URL *</Label>
                <Input
                  id="linkUrl"
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  The URL where users will be directed when they click on this resource
                </p>
              </div>
            </TabsContent>

            <TabsContent value="logo" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input
                  id="logoUrl"
                  type="url"
                  value={logoUrl}
                  onChange={(e) => {
                    setLogoUrl(e.target.value)
                    setLogoPreviewError(false)
                  }}
                  placeholder="https://example.com/logo.png"
                  className={!isValidUrl && logoUrl ? "border-red-500" : ""}
                />
                <p className="text-xs text-muted-foreground">
                  URL to the resource's logo image. Use a square image for best results.
                </p>

                {!isValidUrl && logoUrl && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Please enter a valid URL for the logo</AlertDescription>
                  </Alert>
                )}
              </div>

              {logoUrl && isValidUrl && (
                <div className="mt-4 space-y-2">
                  <Label>Logo Preview</Label>
                  <div className="border rounded p-4 flex items-center justify-center bg-white dark:bg-gray-800">
                    {logoPreviewError ? (
                      <div className="text-center p-4">
                        <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Unable to load image preview. The URL may be invalid or the image may not be accessible.
                        </p>
                      </div>
                    ) : (
                      <div className="relative h-24 w-24">
                        <Image
                          src={logoUrl || "/placeholder.svg"}
                          alt="Logo preview"
                          fill
                          className="object-contain"
                          onError={() => setLogoPreviewError(true)}
                          unoptimized
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Make sure the image is accessible and doesn't require authentication to view.
                  </p>
                </div>
              )}

              <div className="mt-4 p-4 border rounded bg-muted/50">
                <h4 className="font-medium mb-2">Logo Tips</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                  <li>Use PNG or SVG formats for best quality</li>
                  <li>Ensure the logo has a transparent background</li>
                  <li>Square logos work best (1:1 aspect ratio)</li>
                  <li>Make sure the URL is publicly accessible</li>
                  <li>If the logo doesn't appear, a fallback will be shown</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "create" ? "Adding..." : "Updating..."}
              </>
            ) : mode === "create" ? (
              "Add Resource"
            ) : (
              "Update Resource"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
