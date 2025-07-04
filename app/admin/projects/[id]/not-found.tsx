import Link from "next/link"
import { FileQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-4 flex justify-center">
          <FileQuestion className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="mb-2 text-2xl font-bold">Project Not Found</h2>
        <p className="mb-6 text-muted-foreground">The project you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/admin/dashboard?tab=projects">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
