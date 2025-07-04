"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createExperience, updateExperience } from "@/app/actions/experience-actions"
import { useToast } from "@/hooks/use-toast"

interface ExperienceFormProps {
  experience?: {
    id: string
    company: string
    position: string
    start_date: string
    end_date: string | null
    current: boolean
    description: string | null
    location: string | null
    company_url: string | null
  }
  mode: "create" | "edit"
}

export function ExperienceForm({ experience, mode }: ExperienceFormProps) {
  const [company, setCompany] = useState(experience?.company || "")
  const [position, setPosition] = useState(experience?.position || "")
  const [startDate, setStartDate] = useState(experience?.start_date ? experience.start_date.split("T")[0] : "")
  const [endDate, setEndDate] = useState(experience?.end_date ? experience.end_date.split("T")[0] : "")
  const [current, setCurrent] = useState(experience?.current || false)
  const [description, setDescription] = useState(experience?.description || "")
  const [location, setLocation] = useState(experience?.location || "")
  const [companyUrl, setCompanyUrl] = useState(experience?.company_url || "")
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("company", company)
      formData.append("position", position)
      formData.append("startDate", startDate)
      if (!current && endDate) formData.append("endDate", endDate)
      if (current) formData.append("current", "on")
      if (description) formData.append("description", description)
      if (location) formData.append("location", location)
      if (companyUrl) formData.append("companyUrl", companyUrl)

      let result

      if (mode === "create") {
        result = await createExperience(formData)
      } else {
        result = await updateExperience(experience!.id, formData)
      }

      if (!result.success) {
        throw new Error(result.message)
      }

      toast({
        title: mode === "create" ? "Experience added" : "Experience updated",
        description: result.message,
      })

      // Redirect to admin dashboard
      router.push("/admin/dashboard?tab=experience")
      router.refresh()
    } catch (error) {
      console.error("Error submitting experience:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save experience",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === "create" ? "Add Experience" : "Edit Experience"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company Name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyUrl">Company URL (Optional)</Label>
            <Input
              id="companyUrl"
              value={companyUrl}
              onChange={(e) => setCompanyUrl(e.target.value)}
              placeholder="https://company-website.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Job Title"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={current}
                required={!current}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="current" checked={current} onCheckedChange={(checked) => setCurrent(checked as boolean)} />
            <label
              htmlFor="current"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I currently work here
            </label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location (Optional)</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, Country"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your responsibilities and achievements..."
              rows={3}
            />
          </div>
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
              "Add Experience"
            ) : (
              "Update Experience"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
