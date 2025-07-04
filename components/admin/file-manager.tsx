"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Upload, Trash2, File, X, ExternalLink, FileText, ImageIcon, LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { uploadProjectFile, deleteProjectFile, listProjectFiles } from "@/app/actions/file-actions"
import { useToast } from "@/hooks/use-toast"
import type { FileMetadata } from "@/lib/storage-service"
import Image from "next/image"

interface FileManagerProps {
  projectId: string
}

export function FileManager({ projectId }: FileManagerProps) {
  const [files, setFiles] = useState<FileMetadata[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileUrl, setFileUrl] = useState("")
  const [bulkUrls, setBulkUrls] = useState("")
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Load files on component mount
  useEffect(() => {
    const loadFiles = async () => {
      setIsLoading(true)
      try {
        const result = await listProjectFiles(projectId)
        if (result.success) {
          setFiles(result.data || [])
        }
      } catch (error) {
        console.error("Error loading files:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFiles()
  }, [projectId])

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 10MB",
          variant: "destructive",
        })
        return
      }

      setSelectedFile(file)

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setFilePreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        setFilePreview(null)
      }
    }
  }

  // Handle single file upload
  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!selectedFile && !fileUrl) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload or enter a file URL",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("projectId", projectId)

      if (selectedFile) {
        formData.append("file", selectedFile)
      } else if (fileUrl) {
        // Handle URL-based "uploads"
        formData.append("fileUrl", fileUrl)
      }

      const result = await uploadProjectFile(formData)

      if (!result.success) {
        throw new Error(result.message)
      }

      toast({
        title: "File uploaded",
        description: result.message,
      })

      // Reset form
      setSelectedFile(null)
      setFileUrl("")
      setFilePreview(null)

      // Refresh file list
      const filesResult = await listProjectFiles(projectId)
      if (filesResult.success) {
        setFiles(filesResult.data || [])
      }

      // Refresh page
      router.refresh()
    } catch (error) {
      console.error("Error uploading file:", error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  // Handle bulk URL upload
  const handleBulkUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!bulkUrls.trim()) {
      toast({
        title: "No URLs entered",
        description: "Please enter at least one URL",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Split by newlines, commas, or spaces
      const urls = bulkUrls
        .split(/[\n,\s]+/)
        .map((url) => url.trim())
        .filter((url) => url.length > 0)

      if (urls.length === 0) {
        throw new Error("No valid URLs found")
      }

      let successCount = 0
      let failCount = 0

      // Process each URL
      for (const url of urls) {
        const formData = new FormData()
        formData.append("projectId", projectId)
        formData.append("fileUrl", url)

        try {
          const result = await uploadProjectFile(formData)
          if (result.success) {
            successCount++
          } else {
            failCount++
            console.error(`Failed to upload ${url}: ${result.message}`)
          }
        } catch (err) {
          failCount++
          console.error(`Error processing ${url}:`, err)
        }
      }

      // Show results
      if (successCount > 0) {
        toast({
          title: `${successCount} files uploaded successfully`,
          description: failCount > 0 ? `${failCount} files failed to upload` : undefined,
          variant: failCount > 0 ? "default" : "default",
        })
      } else {
        toast({
          title: "Upload failed",
          description: "None of the URLs could be processed",
          variant: "destructive",
        })
      }

      // Reset form
      setBulkUrls("")

      // Refresh file list
      const filesResult = await listProjectFiles(projectId)
      if (filesResult.success) {
        setFiles(filesResult.data || [])
      }

      // Refresh page
      router.refresh()
    } catch (error) {
      console.error("Error processing bulk upload:", error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to process URLs",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  // Handle file deletion
  const handleDelete = async (fileId: string, fileName: string) => {
    if (!confirm("Are you sure you want to delete this file? This action cannot be undone.")) {
      return
    }

    try {
      const result = await deleteProjectFile(fileId, fileName, projectId)

      if (!result.success) {
        throw new Error(result.message)
      }

      toast({
        title: "File deleted",
        description: result.message,
      })

      // Update local state
      setFiles(files.filter((file) => file.id !== fileId))

      // Refresh page
      router.refresh()
    } catch (error) {
      console.error("Error deleting file:", error)
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Failed to delete file",
        variant: "destructive",
      })
    }
  }

  // Format file size
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "Unknown size"

    const units = ["B", "KB", "MB", "GB"]
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

  // Get file icon based on type
  const getFileIcon = (type: string) => {
    if (type.startsWith("image/") || type === "image") {
      return <ImageIcon className="h-4 w-4 text-blue-500" />
    } else if (type.startsWith("application/pdf")) {
      return <FileText className="h-4 w-4 text-red-500" />
    } else {
      return <File className="h-4 w-4 text-gray-500" />
    }
  }

  // Detect file type from URL
  const getFileTypeFromUrl = (url: string): string => {
    const extension = url.split(".").pop()?.toLowerCase() || ""

    // Image types
    if (["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(extension)) {
      return "image"
    }

    // Document types
    if (["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"].includes(extension)) {
      return "document"
    }

    return "other"
  }

  return (
    <Tabs defaultValue="upload">
      <TabsList className="mb-4">
        <TabsTrigger value="upload">Upload Files</TabsTrigger>
        <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
        <TabsTrigger value="manage">Manage Files ({files.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="upload">
        <Card>
          <CardHeader>
            <CardTitle>Upload Files</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file">Select File</Label>
                <Input id="file" name="file" type="file" onChange={handleFileChange} className="cursor-pointer" />
                <p className="text-xs text-muted-foreground">Maximum file size: 10MB</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fileUrl">Or Enter File URL</Label>
                <Input
                  id="fileUrl"
                  name="fileUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                />
              </div>

              {selectedFile && (
                <div className="space-y-2">
                  <Label>Selected File</Label>
                  <div className="flex items-center gap-2 p-2 border rounded">
                    {getFileIcon(selectedFile.type)}
                    <span className="text-sm flex-1 truncate">{selectedFile.name}</span>
                    <span className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedFile(null)
                        setFilePreview(null)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {filePreview && (
                    <div className="mt-2">
                      <Label>Preview</Label>
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg border mt-1">
                        <Image src={filePreview || "/placeholder.svg"} alt="Preview" fill className="object-contain" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <Button type="submit" disabled={isUploading || (!selectedFile && !fileUrl)} className="w-full">
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload File
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="bulk">
        <Card>
          <CardHeader>
            <CardTitle>Bulk Upload URLs</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBulkUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bulkUrls">Enter Multiple URLs</Label>
                <Textarea
                  id="bulkUrls"
                  name="bulkUrls"
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
                  value={bulkUrls}
                  onChange={(e) => setBulkUrls(e.target.value)}
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  Enter one URL per line, or separate with commas or spaces
                </p>
              </div>

              <Button type="submit" disabled={isUploading || !bulkUrls.trim()} className="w-full">
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading {bulkUrls.split(/[\n,\s]+/).filter((url) => url.trim().length > 0).length} Files...
                  </>
                ) : (
                  <>
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Upload Multiple Files
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="manage">
        <Card>
          <CardHeader>
            <CardTitle>Manage Files</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : files.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No files found for this project.</p>
            ) : (
              <div className="space-y-4">
                {files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {getFileIcon(file.type)}
                      <span className="truncate">{file.name}</span>
                      {file.size > 0 && (
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatFileSize(file.size)}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      {file.url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={file.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(file.id, file.name)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
