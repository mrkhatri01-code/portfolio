"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

interface HeaderProps {
  siteTitle: string
}

export function Header({ siteTitle }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)

      // Determine active section based on scroll position
      const sections = ["home", "projects", "experience", "education", "about", "contact"]
      const scrollPosition = window.scrollY + 100 // Offset for header

      for (const section of sections.reverse()) {
        const element = document.getElementById(section)
        if (element && scrollPosition >= element.offsetTop) {
          setActiveSection(section)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false)

    // Handle "home" section specially
    if (sectionId === "home") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
      return
    }

    const element = document.getElementById(sectionId)
    if (element) {
      const offsetTop = element.offsetTop - 80 // Adjust for header height
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
    }
  }

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [mobileMenuOpen])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        scrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-background",
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile-FYwmgktVCXq3rLF2zP2S6eaTFYtKPX.png"
            alt={siteTitle}
            width={40}
            height={40}
            className="rounded-full object-cover"
            priority
          />
          <span className="font-semibold">{siteTitle}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => scrollToSection("home")}
            className={cn(
              "text-sm font-medium hover:text-primary transition-colors",
              activeSection === "home" && "text-primary",
            )}
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection("projects")}
            className={cn(
              "text-sm font-medium hover:text-primary transition-colors",
              activeSection === "projects" && "text-primary",
            )}
          >
            Projects
          </button>
          <button
            onClick={() => scrollToSection("experience")}
            className={cn(
              "text-sm font-medium hover:text-primary transition-colors",
              activeSection === "experience" && "text-primary",
            )}
          >
            Experience
          </button>
          <button
            onClick={() => scrollToSection("education")}
            className={cn(
              "text-sm font-medium hover:text-primary transition-colors",
              activeSection === "education" && "text-primary",
            )}
          >
            Education
          </button>
          <button
            onClick={() => scrollToSection("about")}
            className={cn(
              "text-sm font-medium hover:text-primary transition-colors",
              activeSection === "about" && "text-primary",
            )}
          >
            About
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className={cn(
              "text-sm font-medium hover:text-primary transition-colors",
              activeSection === "contact" && "text-primary",
            )}
          >
            Contact
          </button>
          <ThemeToggle />
        </nav>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-background md:hidden">
            <div className="container flex h-16 items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile-FYwmgktVCXq3rLF2zP2S6eaTFYtKPX.png"
                  alt={siteTitle}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <span className="font-semibold">{siteTitle}</span>
              </Link>

              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-6 w-6" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>

            <nav className="container flex flex-col gap-4 py-8">
              <button
                onClick={() => scrollToSection("home")}
                className={cn(
                  "text-lg font-medium hover:text-primary text-left transition-colors py-2",
                  activeSection === "home" && "text-primary",
                )}
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("projects")}
                className={cn(
                  "text-lg font-medium hover:text-primary text-left transition-colors py-2",
                  activeSection === "projects" && "text-primary",
                )}
              >
                Projects
              </button>
              <button
                onClick={() => scrollToSection("experience")}
                className={cn(
                  "text-lg font-medium hover:text-primary text-left transition-colors py-2",
                  activeSection === "experience" && "text-primary",
                )}
              >
                Experience
              </button>
              <button
                onClick={() => scrollToSection("education")}
                className={cn(
                  "text-lg font-medium hover:text-primary text-left transition-colors py-2",
                  activeSection === "education" && "text-primary",
                )}
              >
                Education
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className={cn(
                  "text-lg font-medium hover:text-primary text-left transition-colors py-2",
                  activeSection === "about" && "text-primary",
                )}
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className={cn(
                  "text-lg font-medium hover:text-primary text-left transition-colors py-2",
                  activeSection === "contact" && "text-primary",
                )}
              >
                Contact
              </button>
              <div className="mt-4">
                <ThemeToggle />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

