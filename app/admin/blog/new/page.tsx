import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { AdminBlogEditor } from "@/components/admin/blog-editor"

export const metadata: Metadata = {
  title: "Create New Blog Post",
  robots: "noindex, nofollow",
}

export default function NewBlogPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container py-8">
        <Link href="/admin/blog">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Posts
          </Button>
        </Link>

        <AdminBlogEditor />
      </div>
    </div>
  )
}
