"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface FAQ {
  id: string
  question: string
  answer: string
  display_order: number
}

interface FAQSectionProps {
  faqs: FAQ[]
}

export function FAQSection({ faqs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  if (!faqs || faqs.length === 0) {
    return null
  }

  return (
    <section id="faq" className="py-16 bg-muted/40">
      <div className="container px-4">
        <h2 className="text-3xl font-bold tracking-tight mb-12 text-center">Frequently Asked Questions</h2>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={faq.id} className="border rounded-lg overflow-hidden bg-card">
              <button
                className="flex justify-between items-center w-full p-4 text-left font-medium focus:outline-none"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-content-${index}`}
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-muted-foreground transition-transform duration-200",
                    openIndex === index ? "transform rotate-180" : "",
                  )}
                />
              </button>
              <div
                id={`faq-content-${index}`}
                className={cn(
                  "px-4 overflow-hidden transition-all duration-200",
                  openIndex === index ? "pb-4 max-h-96" : "max-h-0",
                )}
                aria-hidden={openIndex !== index}
              >
                <div className="prose prose-sm dark:prose-invert">
                  {faq.answer.split("\n").map((paragraph, i) => (
                    <p key={i} className="text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
