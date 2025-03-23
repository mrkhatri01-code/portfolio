"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Upload, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClientSupabaseClient } from "@/lib/supabase"
import { uploadProjectImage } from "@/app/actions/project-actions"
import { STORAGE_BUCKETS } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

interface ImageUploadProps {
  projectId: string
}

export function ImageUpload({ projectId }: ImageUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState("")
  const [altText, setAltText] = useState("")
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload")
  const router = useRouter()
  const { toast } = useToast()

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0]

    if (!selectedFile) {
      setFile(null)
      setPreview(null)
      return
    }

    // Check if file is an image
    if (!selectedFile.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    setFile(selectedFile)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  // Function to ensure bucket exists using server API
  async function ensureBucketExists(bucketName: string): Promise<boolean> {
    try {
      const response = await fetch("/api/storage/init-bucket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bucketName }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to initialize storage bucket")
      }

      const data = await response.json()
      return data.success
    } catch (error) {
      console.error("Error ensuring bucket exists:", error)
      throw error
    }
  }

  async function handleUploadFile() {
    if (!file) return

    setUploading(true)

    try {
      const bucketName = STORAGE_BUCKETS.PROJECTS

      // Ensure bucket exists using server API
      const bucketInitialized = await ensureBucketExists(bucketName)

      if (!bucketInitialized) {
        throw new Error("Failed to initialize storage bucket")
      }

      // Now proceed with upload
      const supabase = createClientSupabaseClient()
      const fileName = `${Date.now()}-${file.name}`

      // Upload the file
      const { data, error } = await supabase.storage.from(bucketName).upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) {
        console.error("Storage upload error:", error)
        throw new Error(`Storage upload failed: ${error.message}`)
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(fileName)

      if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error("Failed to get public URL for uploaded file")
      }

      // Add to project_images table
      const result = await uploadProjectImage(projectId, publicUrlData.publicUrl, altText)

      if (!result.success) {
        throw new Error(result.message)
      }

      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully",
      })

      // Reset form
      setFile(null)
      setPreview(null)
      setAltText("")

      // Refresh page
      router.refresh()
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "There was an error uploading your image",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  async function handleAddImageUrl() {
    if (!imageUrl) return

    setUploading(true)

    try {
      // Validate URL
      try {
        new URL(imageUrl)
      } catch (e) {
        throw new Error("Please enter a valid URL")
      }

      // Add to project_images table directly
      const result = await uploadProjectImage(projectId, imageUrl, altText)

      if (!result.success) {
        throw new Error(result.message)
      }

      toast({
        title: "Image added",
        description: "Your image URL has been added successfully",
      })

      // Reset form
      setImageUrl("")
      setAltText("")

      // Refresh page
      router.refresh()
    } catch (error) {
      console.error("Error adding image URL:", error)
      toast({
        title: "Failed to add image",
        description: error instanceof Error ? error.message : "There was an error adding your image URL",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="upload" onValueChange={(value) => setActiveTab(value as "upload" | "url")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload File</TabsTrigger>
          <TabsTrigger value="url">Use URL</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">Project Image</Label>

            {preview ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                <Image src={preview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full"
                  onClick={() => {
                    setFile(null)
                    setPreview(null)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center border border-dashed rounded-lg p-12 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => document.getElementById("image")?.click()}
              >
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Drag and drop or click to upload</p>
                <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (max 5MB)</p>
              </div>
            )}

            <Input id="image" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>

          {preview && (
            <>
              <div className="space-y-2">
                <Label htmlFor="alt-text-upload">Alt Text</Label>
                <Input
                  id="alt-text-upload"
                  placeholder="Describe the image for accessibility"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                />
              </div>

              <Button onClick={handleUploadFile} disabled={uploading} className="w-full">
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload Image"
                )}
              </Button>
            </>
          )}
        </TabsContent>

        <TabsContent value="url" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image-url">Image URL</Label>
            <Input
              id="image-url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          {imageUrl && (
            <>
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                  <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt="Preview"
                    fill
                    className="object-cover"
                    onError={() => {
                      toast({
                        title: "Invalid image URL",
                        description: "The URL doesn't point to a valid image",
                        variant: "destructive",
                      })
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alt-text-url">Alt Text</Label>
                <Input
                  id="alt-text-url"
                  placeholder="Describe the image for accessibility"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                />
              </div>

              <Button onClick={handleAddImageUrl} disabled={uploading} className="w-full">
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Image URL"
                )}
              </Button>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

