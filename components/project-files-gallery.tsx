"use client"

import { useState } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, ExternalLink, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FileMetadata } from "@/lib/storage-service"

interface ProjectFilesGalleryProps {
  files: FileMetadata[]
}

export function ProjectFilesGallery({ files }: ProjectFilesGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState<string | null>(null)

  // Filter files by type
  const imageFiles = files.filter((file) => file.type === "image")
  const documentFiles = files.filter((file) => file.type === "document" || file.type === "other")

  // Open lightbox
  const openLightbox = (imageUrl: string) => {
    setCurrentImage(imageUrl)
    setLightboxOpen(true)
  }

  // Close lightbox
  const closeLightbox = () => {
    setLightboxOpen(false)
    setCurrentImage(null)
  }

  if (files.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="images" className="w-full">
        <TabsList>
          <TabsTrigger value="images">Images ({imageFiles.length})</TabsTrigger>
          <TabsTrigger value="documents">Documents ({documentFiles.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="images" className="mt-6">
          {imageFiles.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No images available for this project.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {imageFiles.map((file) => (
                <Card key={file.id} className="overflow-hidden">
                  <div className="relative aspect-square cursor-pointer" onClick={() => openLightbox(file.url)}>
                    <Image
                      src={file.url || "/placeholder.svg"}
                      alt={file.name}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=300&width=300"
                      }}
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          {documentFiles.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No documents available for this project.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {documentFiles.map((file) => (
                <Card key={file.id}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="bg-muted rounded-md p-2">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate" title={file.name}>
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate" title={file.url}>
                        {file.url}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={file.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Lightbox */}
      {lightboxOpen && currentImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-black/50 text-white hover:bg-black/70"
              onClick={closeLightbox}
            >
              <X className="h-6 w-6" />
            </Button>
            <div className="relative h-full w-full">
              <Image
                src={currentImage || "/placeholder.svg"}
                alt="Enlarged view"
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

