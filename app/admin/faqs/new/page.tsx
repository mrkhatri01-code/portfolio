import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FAQForm } from "@/components/admin/faq-form"

export const metadata = {
  title: "Add New FAQ",
}

export default function NewFAQPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <Button asChild variant="ghost" className="-ml-4">
          <Link href="/admin/faqs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to FAQs
          </Link>
        </Button>
      </div>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Add New FAQ</h1>
        <FAQForm mode="create" />
      </div>
    </div>
  )
}
