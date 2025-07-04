"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addYoutubeVideo } from "@/app/actions/project-actions"
import { useToast } from "@/hooks/use-toast"
import { YouTubeVideo } from "@/components/youtube-video"

interface YouTubeAddProps {
  projectId: string
}

export function YouTubeAdd({ projectId }: YouTubeAddProps) {
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [title, setTitle] = useState("")
  const [isValid, setIsValid] = useState(false)
  const [adding, setAdding] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  function validateYoutubeUrl(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11
  }

  function handleUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    const url = e.target.value
    setYoutubeUrl(url)
    setIsValid(validateYoutubeUrl(url))
  }

  async function handleAdd() {
    if (!isValid) return

    setAdding(true)

    try {
      const result = await addYoutubeVideo(projectId, youtubeUrl, title)

      if (!result.success) throw new Error(result.message)

      toast({
        title: "Video added",
        description: "Your YouTube video has been added successfully",
      })

      // Reset form
      setYoutubeUrl("")
      setTitle("")
      setIsValid(false)

      // Refresh page
      router.refresh()
    } catch (error) {
      console.error("Error adding YouTube video:", error)
      toast({
        title: "Failed to add video",
        description: "There was an error adding your YouTube video",
        variant: "destructive",
      })
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="youtube-url">YouTube Video URL</Label>
        <Input
          id="youtube-url"
          placeholder="https://www.youtube.com/watch?v=..."
          value={youtubeUrl}
          onChange={handleUrlChange}
        />
        {youtubeUrl && !isValid && <p className="text-sm text-destructive">Please enter a valid YouTube URL</p>}
      </div>

      {isValid && (
        <>
          <div className="space-y-2">
            <Label htmlFor="video-title">Video Title (Optional)</Label>
            <Input
              id="video-title"
              placeholder="Title for the video"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Preview</Label>
            <YouTubeVideo youtubeUrl={youtubeUrl} title={title} />
          </div>

          <Button onClick={handleAdd} disabled={adding} className="w-full">
            {adding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add YouTube Video"
            )}
          </Button>
        </>
      )}
    </div>
  )
}

