"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ImageGalleryProps {
  images: {
    id: string
    image_url: string
    alt_text?: string | null
  }[]
  className?: string
}

export function ImageGallery({ images, className }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  // If no images, return null
  if (!images || images.length === 0) {
    return null
  }

  const currentImage = images[currentIndex]
  const hasMultipleImages = images.length > 1

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const openLightbox = () => {
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main image display */}
      <div className="relative aspect-video overflow-hidden rounded-lg border">
        <Image
          src={currentImage.image_url || `/placeholder.svg?height=600&width=1200`}
          alt={currentImage.alt_text || "Project image"}
          fill
          className="object-cover transition-all duration-300 hover:scale-105"
          priority
        />

        {/* Zoom button */}
        <Button
          size="icon"
          variant="secondary"
          className="absolute bottom-4 right-4 opacity-80 hover:opacity-100"
          onClick={openLightbox}
        >
          <ZoomIn className="h-4 w-4" />
          <span className="sr-only">Zoom image</span>
        </Button>

        {/* Navigation arrows for multiple images */}
        {hasMultipleImages && (
          <>
            <Button
              size="icon"
              variant="secondary"
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous image</span>
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next image</span>
            </Button>
          </>
        )}
      </div>

      {/* Thumbnail navigation */}
      {hasMultipleImages && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              className={cn(
                "relative h-16 w-24 flex-shrink-0 overflow-hidden rounded border transition-all",
                index === currentIndex ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100",
              )}
              onClick={() => setCurrentIndex(index)}
            >
              <Image
                src={image.image_url || `/placeholder.svg?height=100&width=150`}
                alt={image.alt_text || `Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <Button size="icon" variant="secondary" className="absolute -right-4 -top-4 z-10" onClick={closeLightbox}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>

            <div className="relative h-auto max-h-[80vh] w-auto max-w-[80vw]">
              <Image
                src={currentImage.image_url || `/placeholder.svg?height=1200&width=1800`}
                alt={currentImage.alt_text || "Project image"}
                width={1200}
                height={800}
                className="h-auto max-h-[80vh] w-auto max-w-[80vw] rounded-lg object-contain"
              />
            </div>

            {hasMultipleImages && (
              <div className="absolute left-0 right-0 bottom-[-60px] flex justify-center space-x-4">
                <Button size="sm" variant="outline" onClick={prevImage}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button size="sm" variant="outline" onClick={nextImage}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

