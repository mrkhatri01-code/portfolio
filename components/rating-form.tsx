"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RatingStars } from "@/components/rating-stars"
import { submitRating } from "@/app/actions/rating-actions"
import { useToast } from "@/hooks/use-toast"

interface RatingFormProps {
  projectId: string
  onSuccess?: () => void
}

export function RatingForm({ projectId, onSuccess }: RatingFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("projectId", projectId)
      formData.append("name", name)
      formData.append("email", email)
      formData.append("rating", rating.toString())
      formData.append("comment", comment)

      const result = await submitRating(formData)

      if (!result.success) {
        throw new Error(result.message)
      }

      toast({
        title: "Rating submitted",
        description: "Thank you for your feedback!",
      })

      // Reset form
      setName("")
      setEmail("")
      setRating(5)
      setComment("")

      // Refresh the page
      router.refresh()

      // Call onSuccess callback if provided
      onSuccess?.()
    } catch (error) {
      console.error("Error submitting rating:", error)
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Failed to submit rating",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rate This Project</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rating">Your Rating</Label>
            <RatingStars value={rating} onChange={setRating} size="lg" className="py-2" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comment (Optional)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this project"
              rows={3}
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Rating"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
