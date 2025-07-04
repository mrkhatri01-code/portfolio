"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

interface ImageUploadProps {
  onChange: (url: string) => void
  value: string
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value }) => {
  const [file, setFile] = useState<File>()
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    if (!fileList || fileList.length === 0) {
      setFile(undefined)
      return
    }

    setFile(fileList[0])
  }

  async function handleUploadFile() {
    if (!file) return

    setUploading(true)

    try {
      toast({
        title: "Feature not available",
        description:
          "File upload functionality is currently disabled due to storage limitations. Please use image URLs instead.",
        variant: "destructive",
      })
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

  return (
    <div>
      <div className="flex items-center gap-4">
        <Input type="file" id="image-upload" onChange={handleFileChange} />
        <Button onClick={handleUploadFile} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </div>
      <Input
        type="text"
        placeholder="Image URL"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-4"
      />
    </div>
  )
}

export default ImageUpload

