import { RatingStars } from "@/components/rating-stars"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDate } from "@/lib/utils"

interface Rating {
  id: string
  user_name: string
  user_email: string
  rating: number
  comment?: string
  created_at: string
}

interface RatingsDisplayProps {
  ratings: Rating[]
  averageRating: number | null
}

export function RatingsDisplay({ ratings, averageRating }: RatingsDisplayProps) {
  if (!ratings || ratings.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No ratings yet. Be the first to rate this project!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Project Ratings</h3>
        {averageRating !== null && (
          <div className="flex items-center gap-2">
            <RatingStars value={averageRating} readOnly />
            <span className="text-sm font-medium">
              {averageRating.toFixed(1)} ({ratings.length} {ratings.length === 1 ? "review" : "reviews"})
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {ratings.map((rating) => (
          <Card key={rating.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarFallback>{rating.user_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{rating.user_name}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(rating.created_at)}</p>
                  </div>
                </div>
                <RatingStars value={rating.rating} readOnly size="sm" />
              </div>
            </CardHeader>
            {rating.comment && (
              <CardContent>
                <p className="text-sm">{rating.comment}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

