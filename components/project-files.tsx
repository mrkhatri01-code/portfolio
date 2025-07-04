"use client"

import { useState, useEffect } from "react"
import { File, Download, Loader2, FileText, ImageIcon, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { listProjectFiles } from "@/app/actions/file-actions"
import type { FileMetadata } from "@/lib/storage-service"
import Image from "next/image"

interface ProjectFilesProps {
  projectId: string
}

export function ProjectFiles({ projectId }: ProjectFilesProps) {
  const [files, setFiles] = useState<FileMetadata[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

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

  // Format file size
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return ""

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
    if (type.startsWith("image/")) {
      return <ImageIcon className="h-4 w-4 text-blue-500" />
    } else if (type.startsWith("application/pdf")) {
      return <FileText className="h-4 w-4 text-red-500" />
    } else {
      return <File className="h-4 w-4 text-gray-500" />
    }
  }

  // Check if file is an image
  const isImage = (type: string) => {
    return type.startsWith("image/")
  }

  // Group files by type
  const imageFiles = files.filter((file) => isImage(file.type))
  const documentFiles = files.filter((file) => !isImage(file.type))

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : files.length === 0 ? (
        <p className="text-center py-4 text-muted-foreground">No files available for this project</p>
      ) : (
        <>
          {/* Image Gallery */}
          {imageFiles.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Project Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {imageFiles.map((file) => (
                  <div
                    key={file.id}
                    className="relative aspect-square border rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setSelectedImage(file.url)}
                  >
                    <Image src={file.url || "/placeholder.svg"} alt={file.name} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Document Files */}
          {documentFiles.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Project Files</h3>
              <div className="space-y-3">
                {documentFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-2">
                      {getFileIcon(file.type)}
                      <span className="text-sm">{file.name}</span>
                      {file.size > 0 && (
                        <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                      )}
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={file.url} target="_blank" rel="noopener noreferrer" download>
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Image Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70 z-10"
              onClick={() => setSelectedImage(null)}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt="Full size image"
              width={1200}
              height={800}
              className="object-contain max-h-[90vh] w-auto mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  )
}
