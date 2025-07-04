"use client"

import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  title: string
  subtitle: string
}

export function HeroSection({ title, subtitle }: HeroSectionProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offsetTop = element.offsetTop - 80 // Adjust for header height
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
    }
  }

  return (
    <section id="home" className="py-20 md:py-32 flex items-center min-h-[70vh]">
      <div className="container mx-auto text-center px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">Welcome to my portfolio</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">{subtitle}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => scrollToSection("projects")} size="lg" className="w-full sm:w-auto">
            View My Work
          </Button>
          <Button onClick={() => scrollToSection("contact")} variant="outline" size="lg" className="w-full sm:w-auto">
            Get In Touch
          </Button>
        </div>
      </div>
    </section>
  )
}
