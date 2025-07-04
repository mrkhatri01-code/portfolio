"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Loader2, Upload, X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  updateSiteSettings,
  updateProfileImageUrl as updateProfileImage,
  updateResume,
} from "@/app/actions/settings-actions"
import { useToast } from "@/hooks/use-toast"

interface SettingsFormProps {
  settings: {
    id: string
    site_title: string
    site_description: string
    about_text: string | null
    profile_image_url: string | null
    resume_url: string | null
    instagram_url: string | null
    behance_url: string | null
    github_url: string | null
    linkedin_url: string | null
    facebook_url?: string | null
    twitter_url?: string | null
    discord_url?: string | null
    youtube_url?: string | null
  }
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const [siteTitle, setSiteTitle] = useState(settings.site_title)
  const [siteDescription, setSiteDescription] = useState(settings.site_description)
  const [aboutText, setAboutText] = useState(settings.about_text || "")
  const [instagramUrl, setInstagramUrl] = useState(settings.instagram_url || "")
  const [behanceUrl, setBehanceUrl] = useState(settings.behance_url || "")
  const [githubUrl, setGithubUrl] = useState(settings.github_url || "")
  const [linkedinUrl, setLinkedinUrl] = useState(settings.linkedin_url || "")
  const [facebookUrl, setFacebookUrl] = useState(settings.facebook_url || "")
  const [twitterUrl, setTwitterUrl] = useState(settings.twitter_url || "")
  const [discordUrl, setDiscordUrl] = useState(settings.discord_url || "")
  const [youtubeUrl, setYoutubeUrl] = useState(settings.youtube_url || "")

  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)
  const [resume, setResume] = useState<File | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isUploadingResume, setIsUploadingResume] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  const router = useRouter()
  const { toast } = useToast()

  // Add these state variables
  const [profileImageUrl, setProfileImageUrl] = useState("")
  const [isAddingImageUrl, setIsAddingImageUrl] = useState(false)

  // Initialize storage buckets when component mounts
  useEffect(() => {
    const initStorage = async () => {
      try {
        await fetch("/api/init-storage")
      } catch (error) {
        console.error("Error initializing storage:", error)
      }
    }

    initStorage()
  }, [])

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    setProfileImage(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setProfileImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if file is a PDF
    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF file",
        variant: "destructive",
      })
      return
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a PDF smaller than 10MB",
        variant: "destructive",
      })
      return
    }

    setResume(file)
  }

  const handleUploadProfileImage = async () => {
    if (!profileImage) return

    setIsUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append("file", profileImage)

      const result = await updateProfileImage(formData)

      if (!result.success) {
        throw new Error(result.message)
      }

      toast({
        title: "Profile image updated",
        description: result.message,
      })

      // Reset form
      setProfileImage(null)
      setProfileImagePreview(null)

      // Refresh page
      router.refresh()
    } catch (error) {
      console.error("Error uploading profile image:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your profile image",
        variant: "destructive",
      })
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleUploadResume = async () => {
    if (!resume) return

    setIsUploadingResume(true)

    try {
      const formData = new FormData()
      formData.append("file", resume)

      const result = await updateResume(formData)

      if (!result.success) {
        throw new Error(result.message)
      }

      toast({
        title: "Resume updated",
        description: result.message,
      })

      // Reset form
      setResume(null)

      // Refresh page
      router.refresh()
    } catch (error) {
      console.error("Error uploading resume:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your resume",
        variant: "destructive",
      })
    } finally {
      setIsUploadingResume(false)
    }
  }

  // Add this function to handle adding image URL
  const handleAddProfileImageUrl = async () => {
    if (!profileImageUrl) return

    setIsAddingImageUrl(true)

    try {
      // Validate URL
      try {
        new URL(profileImageUrl)
      } catch (e) {
        throw new Error("Please enter a valid URL")
      }

      // Update profile with the URL directly
      const formData = new FormData()
      formData.append("imageUrl", profileImageUrl)

      const result = await updateProfileImage(formData)

      if (!result.success) {
        throw new Error(result.message)
      }

      toast({
        title: "Profile image updated",
        description: result.message,
      })

      // Reset form
      setProfileImageUrl("")

      // Refresh page
      router.refresh()
    } catch (error) {
      console.error("Error setting profile image URL:", error)
      toast({
        title: "Update failed",
        description: "There was an error updating your profile image",
        variant: "destructive",
      })
    } finally {
      setIsAddingImageUrl(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("siteTitle", siteTitle)
      formData.append("siteDescription", siteDescription)
      formData.append("aboutText", aboutText)
      formData.append("instagramUrl", instagramUrl)
      formData.append("behanceUrl", behanceUrl)
      formData.append("githubUrl", githubUrl)
      formData.append("linkedinUrl", linkedinUrl)
      formData.append("facebookUrl", facebookUrl)
      formData.append("twitterUrl", twitterUrl)
      formData.append("discordUrl", discordUrl)
      formData.append("youtubeUrl", youtubeUrl)

      const updateResult = await updateSiteSettings(formData)

      if (!updateResult.success) {
        throw new Error(updateResult.message)
      }

      toast({
        title: "Settings updated",
        description: updateResult.message,
      })

      // Refresh page
      router.refresh()
    } catch (error) {
      console.error("Error updating settings:", error)
      toast({
        title: "Update failed",
        description: "There was an error updating your settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle tab change safely
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <Tabs defaultValue="general" value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="mb-6">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="social">Social Links</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteTitle">Site Title</Label>
                <Input
                  id="siteTitle"
                  value={siteTitle}
                  onChange={(e) => setSiteTitle(e.target.value)}
                  placeholder="My Portfolio"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                  placeholder="Showcasing my best work in design, development, and creative projects"
                  rows={2}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aboutText">About Text</Label>
                <Textarea
                  id="aboutText"
                  value={aboutText}
                  onChange={(e) => setAboutText(e.target.value)}
                  placeholder="Tell visitors about yourself..."
                  rows={6}
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>

      <TabsContent value="profile">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6">
                <div className="relative h-24 w-24 rounded-full overflow-hidden border">
                  <Image
                    src={profileImagePreview || settings.profile_image_url || "/profile.png"}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <Tabs defaultValue="url" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="upload">Upload File</TabsTrigger>
                      <TabsTrigger value="url">Use URL</TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="space-y-4 pt-4">
                      {profileImage ? (
                        <div className="flex items-center gap-2">
                          <Button onClick={handleUploadProfileImage} disabled={isUploadingImage}>
                            {isUploadingImage ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              "Upload Image"
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setProfileImage(null)
                              setProfileImagePreview(null)
                            }}
                            disabled={isUploadingImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="flex items-center gap-2 p-2 border border-dashed rounded cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => {
                            const input = document.getElementById("profileImage")
                            if (input) {
                              input.click()
                            }
                          }}
                        >
                          <Upload className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Click to upload a new profile image</span>
                        </div>
                      )}
                      <Input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfileImageChange}
                      />
                    </TabsContent>

                    <TabsContent value="url" className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Input
                          placeholder="https://example.com/image.jpg"
                          value={profileImageUrl}
                          onChange={(e) => setProfileImageUrl(e.target.value)}
                        />
                        <Button
                          onClick={handleAddProfileImageUrl}
                          disabled={isAddingImageUrl || !profileImageUrl}
                          className="w-full"
                        >
                          {isAddingImageUrl ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Adding...
                            </>
                          ) : (
                            "Use Image URL"
                          )}
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resume</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6">
                <div className="h-12 w-12 flex items-center justify-center bg-muted rounded">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>

                <div className="flex-1">
                  {resume ? (
                    <div className="flex items-center gap-2">
                      <Button onClick={handleUploadResume} disabled={isUploadingResume}>
                        {isUploadingResume ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          "Upload Resume"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setResume(null)}
                        disabled={isUploadingResume}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div
                        className="flex items-center gap-2 p-2 border border-dashed rounded cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => {
                          const input = document.getElementById("resume")
                          if (input) {
                            input.click()
                          }
                        }}
                      >
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Click to upload a new resume (PDF)</span>
                      </div>
                      {settings.resume_url && (
                        <div className="mt-2">
                          <a
                            href={settings.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            View current resume
                          </a>
                        </div>
                      )}
                    </>
                  )}
                  <Input
                    id="resume"
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleResumeChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="social">
        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="instagramUrl">Instagram URL</Label>
                <Input
                  id="instagramUrl"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/yourusername"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebookUrl">Facebook URL</Label>
                <Input
                  id="facebookUrl"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  placeholder="https://facebook.com/yourusername"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitterUrl">Twitter URL</Label>
                <Input
                  id="twitterUrl"
                  value={twitterUrl}
                  onChange={(e) => setTwitterUrl(e.target.value)}
                  placeholder="https://twitter.com/yourusername"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtubeUrl">YouTube URL</Label>
                <Input
                  id="youtubeUrl"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtube.com/c/yourchannel"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discordUrl">Discord URL</Label>
                <Input
                  id="discordUrl"
                  value={discordUrl}
                  onChange={(e) => setDiscordUrl(e.target.value)}
                  placeholder="https://discord.gg/yourinvite"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="behanceUrl">Behance URL</Label>
                <Input
                  id="behanceUrl"
                  value={behanceUrl}
                  onChange={(e) => setBehanceUrl(e.target.value)}
                  placeholder="https://behance.net/yourusername"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input
                  id="githubUrl"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/yourusername"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                <Input
                  id="linkedinUrl"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/yourusername"
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

