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
import { createFAQ, updateFAQ } from "@/app/actions/faq-actions"
import { useToast } from "@/hooks/use-toast"

interface FAQFormProps {
  faq?: {
    id: string
    question: string
    answer: string
  }
  mode: "create" | "edit"
}

export function FAQForm({ faq, mode }: FAQFormProps) {
  const [question, setQuestion] = useState(faq?.question || "")
  const [answer, setAnswer] = useState(faq?.answer || "")
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("question", question)
      formData.append("answer", answer)

      let result

      if (mode === "create") {
        result = await createFAQ(formData)
      } else {
        result = await updateFAQ(faq!.id, formData)
      }

      if (!result.success) {
        throw new Error(result.message)
      }

      toast({
        title: mode === "create" ? "FAQ added" : "FAQ updated",
        description: result.message,
      })

      // Redirect to admin dashboard
      router.push("/admin/dashboard?tab=faqs")
      router.refresh()
    } catch (error) {
      console.error("Error submitting FAQ:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save FAQ",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === "create" ? "Add FAQ" : "Edit FAQ"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter the question"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="answer">Answer</Label>
            <Textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter the answer"
              rows={5}
              required
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
              "Add FAQ"
            ) : (
              "Update FAQ"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
