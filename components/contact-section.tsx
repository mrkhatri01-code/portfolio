"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { submitContactForm } from "@/app/actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sending...
        </>
      ) : (
        "Send Message"
      )}
    </Button>
  )
}

export function ContactSection() {
  const [formState, setFormState] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const [showForm, setShowForm] = useState(true)

  async function handleSubmit(formData: FormData) {
    const result = await submitContactForm(formData)
    setFormState(result)

    if (result.success) {
      setShowForm(false)
    }
  }

  function handleReset() {
    setFormState(null)
    setShowForm(true)
  }

  return (
    <section id="contact" className="py-16 bg-muted/40">
      <div className="container px-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-2">Get In Touch</h2>
          <p className="text-muted-foreground text-center mb-8">
            Have a question or want to work together? Send me a message!
          </p>

          {showForm ? (
            <form action={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Your name" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="Your email" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" placeholder="Your message" rows={5} required />
              </div>

              {formState && !formState.success && <div className="text-destructive text-sm">{formState.message}</div>}

              <SubmitButton />
            </form>
          ) : (
            <div className="text-center space-y-4 py-8">
              <div className="flex justify-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold">Message Sent!</h3>
              <p className="text-muted-foreground">Thank you for reaching out. I'll get back to you soon.</p>
              <Button onClick={handleReset} variant="outline" className="mt-4">
                Send Another Message
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

