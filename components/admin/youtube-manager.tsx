"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { YouTubeVideo } from "@/components/youtube-video"
import { addYoutubeVideo, deleteYoutubeVideo } from "@/app/actions/project-actions"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Video {
  id: string
  youtube_url: string
  title: string | null
  display_order: number
}

interface YouTubeManagerProps {
  projectId: string
  initialVideos: Video[]
}

export function YouTubeManager({ projectId, initialVideos }: YouTubeManagerProps) {
  const [videos, setVideos] = useState<Video[]>(initialVideos || [])
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [title, setTitle] = useState("")
  const [isValid, setIsValid] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const { toast } = useToast()

  // Update local state when initialVideos changes
  useEffect(() => {
    setVideos(initialVideos || [])
  }, [initialVideos])

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

    setIsAdding(true)
    setError(null)

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
      setError(error instanceof Error ? error.message : "Failed to add video")
      toast({
        title: "Failed to add video",
        description: "There was an error adding your YouTube video",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  async function handleDelete(videoId: string) {
    if (!confirm("Are you sure you want to delete this video? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)
    setError(null)

    try {
      const result = await deleteYoutubeVideo(videoId)

      if (!result.success) throw new Error(result.message)

      toast({
        title: "Video deleted",
        description: "The YouTube video has been deleted successfully",
      })

      // Update local state
      setVideos((prev) => prev.filter((video) => video.id !== videoId))

      // Refresh page
      router.refresh()
    } catch (error) {
      console.error("Error deleting YouTube video:", error)
      setError(error instanceof Error ? error.message : "Failed to delete video")
      toast({
        title: "Failed to delete video",
        description: "There was an error deleting the YouTube video",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Add YouTube Video</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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

              <Button onClick={handleAdd} disabled={isAdding} className="w-full">
                {isAdding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add YouTube Video
                  </>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Videos ({videos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {videos.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No videos added yet. Add your first YouTube video above.
            </div>
          ) : (
            <div className="space-y-6">
              {videos.map((video) => (
                <div key={video.id} className="border-b pb-6 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{video.title || "Untitled Video"}</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(video.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                  <YouTubeVideo youtubeUrl={video.youtube_url} title={video.title || undefined} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
