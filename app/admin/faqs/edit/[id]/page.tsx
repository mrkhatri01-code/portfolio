import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FAQForm } from "@/components/admin/faq-form"
import { getFAQById } from "@/app/actions/faq-actions"

interface EditFAQPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: EditFAQPageProps) {
  const faq = await getFAQById(params.id)
  return {
    title: faq ? `Edit FAQ: ${faq.question}` : "Edit FAQ",
  }
}

export default async function EditFAQPage({ params }: EditFAQPageProps) {
  const { id } = params
  const faq = await getFAQById(id)

  if (!faq) {
    notFound()
  }

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
        <h1 className="text-3xl font-bold mb-8">Edit FAQ</h1>
        <FAQForm mode="edit" faq={faq} />
      </div>
    </div>
  )
}
