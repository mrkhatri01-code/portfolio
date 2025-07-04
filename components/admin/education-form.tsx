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
import { createEducation, updateEducation } from "@/app/actions/education-actions"
import { useToast } from "@/hooks/use-toast"

interface EducationFormProps {
  education?: {
    id: string
    institution: string
    degree: string
    field_of_study: string
    start_date: string
    end_date: string | null
    current: boolean
    description: string | null
    location: string | null
  }
  mode: "create" | "edit"
}

export function EducationForm({ education, mode }: EducationFormProps) {
  const [institution, setInstitution] = useState(education?.institution || "")
  const [degree, setDegree] = useState(education?.degree || "")
  const [fieldOfStudy, setFieldOfStudy] = useState(education?.field_of_study || "")
  const [startDate, setStartDate] = useState(education?.start_date ? education.start_date.split("T")[0] : "")
  const [endDate, setEndDate] = useState(education?.end_date ? education.end_date.split("T")[0] : "")
  const [current, setCurrent] = useState(education?.current || false)
  const [description, setDescription] = useState(education?.description || "")
  const [location, setLocation] = useState(education?.location || "")
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("institution", institution)
      formData.append("degree", degree)
      formData.append("fieldOfStudy", fieldOfStudy)
      formData.append("startDate", startDate)
      if (!current && endDate) formData.append("endDate", endDate)
      if (current) formData.append("current", "on")
      if (description) formData.append("description", description)
      if (location) formData.append("location", location)

      let result

      if (mode === "create") {
        result = await createEducation(formData)
      } else {
        result = await updateEducation(education!.id, formData)
      }

      if (!result.success) {
        throw new Error(result.message)
      }

      toast({
        title: mode === "create" ? "Education added" : "Education updated",
        description: result.message,
      })

      // Redirect to admin dashboard
      router.push("/admin/dashboard?tab=education")
      router.refresh()
    } catch (error) {
      console.error("Error submitting education:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save education",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === "create" ? "Add Education" : "Edit Education"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="institution">Institution</Label>
            <Input
              id="institution"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="University or School Name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="degree">Degree</Label>
            <Input
              id="degree"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              placeholder="Bachelor's, Master's, etc."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fieldOfStudy">Field of Study</Label>
            <Input
              id="fieldOfStudy"
              value={fieldOfStudy}
              onChange={(e) => setFieldOfStudy(e.target.value)}
              placeholder="Computer Science, Design, etc."
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
              I am currently studying here
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
              placeholder="Additional details about your education..."
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
              "Add Education"
            ) : (
              "Update Education"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
