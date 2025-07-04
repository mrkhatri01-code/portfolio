"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Trash2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RatingStars } from "@/components/rating-stars"
import { deleteRating, verifyRating } from "@/app/actions/rating-actions"
import { useToast } from "@/hooks/use-toast"
import { formatDate } from "@/lib/utils"

interface Rating {
  id: string
  project_id: string
  user_name: string
  user_email: string
  rating: number
  comment: string | null
  created_at: string
  verified: boolean
  project?: {
    title: string
    slug: string
  }
}

interface RatingsManagerProps {
  initialRatings: Rating[]
}

export function RatingsManager({ initialRatings }: RatingsManagerProps) {
  const [ratings, setRatings] = useState<Rating[]>(initialRatings)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Update local state when initialRatings changes
  useEffect(() => {
    setRatings(initialRatings)
  }, [initialRatings])

  const handleVerify = async (id: string) => {
    setIsLoading(true)

    try {
      const result = await verifyRating(id)

      if (!result.success) {
        throw new Error(result.message)
      }

      toast({
        title: "Rating verified",
        description: result.message,
      })

      // Update local state
      setRatings((prev) => prev.map((rating) => (rating.id === id ? { ...rating, verified: true } : rating)))

      // Refresh the page
      router.refresh()
    } catch (error) {
      console.error("Error verifying rating:", error)
      toast({
        title: "Verification failed",
        description: "There was an error verifying the rating",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this rating? This action cannot be undone.")) {
      return
    }

    setIsLoading(true)

    try {
      const result = await deleteRating(id)

      if (!result.success) {
        throw new Error(result.message)
      }

      toast({
        title: "Rating deleted",
        description: result.message,
      })

      // Update local state
      setRatings((prev) => prev.filter((rating) => rating.id !== id))

      // Refresh the page
      router.refresh()
    } catch (error) {
      console.error("Error deleting rating:", error)
      toast({
        title: "Delete failed",
        description: "There was an error deleting the rating",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Ratings</h2>
      </div>

      {ratings.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Ratings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No ratings have been submitted yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {ratings.map((rating) => (
            <Card key={rating.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {rating.user_name}
                      {rating.verified ? (
                        <Badge variant="success" className="bg-green-500">
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline">Unverified</Badge>
                      )}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">
                      <a href={`mailto:${rating.user_email}`} className="hover:underline">
                        {rating.user_email}
                      </a>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{formatDate(rating.created_at)}</div>
                    {rating.project && (
                      <div className="mt-2">
                        <Badge variant="outline">Project: {rating.project.title}</Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <RatingStars value={rating.rating} readOnly size="sm" />
                    {!rating.verified && (
                      <Button variant="outline" size="sm" onClick={() => handleVerify(rating.id)} disabled={isLoading}>
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Verify
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(rating.id)}
                      disabled={isLoading}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {rating.comment && (
                <CardContent>
                  <p className="text-sm whitespace-pre-line">{rating.comment}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

