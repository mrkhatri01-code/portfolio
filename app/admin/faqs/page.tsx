import Link from "next/link"
import { getFAQs } from "@/app/actions/faq-actions"
import { PlusCircle, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DeleteFAQButton } from "@/components/admin/delete-faq-button"

export const metadata = {
  title: "Manage FAQs",
}

export default async function FAQsPage() {
  const faqs = await getFAQs()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i>
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">Manage FAQs</h1>
        </div>
        <Link
          href="/admin/faqs/new"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New FAQ
        </Link>
      </div>

      {faqs.length === 0 ? (
        <div className="rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/30">
          <div className="flex">
            <div className="flex-shrink-0"></div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">No FAQs found</h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>You haven&apos;t added any FAQs yet. Click the button above to add your first FAQ.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {faqs.map((faq) => (
            <Card key={faq.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{faq.question}</CardTitle>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/faqs/edit/${faq.id}`}>
                        <Pencil className="mr-1 h-3 w-3" />
                        Edit
                      </Link>
                    </Button>
                    <DeleteFAQButton faqId={faq.id} faqQuestion={faq.question}>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="mr-1 h-3 w-3" />
                        Delete
                      </Button>
                    </DeleteFAQButton>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground whitespace-pre-line line-clamp-2">{faq.answer}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
