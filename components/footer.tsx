import Link from "next/link"
import Image from "next/image"
import { Lock } from "lucide-react"

interface FooterProps {
  siteTitle: string
  siteDescription: string
  socialLinks: {
    instagram?: string
    behance?: string
    github?: string
    linkedin?: string
    facebook?: string
    twitter?: string
    discord?: string
    youtube?: string
    tiktok?: string
  }
}

export function Footer({ siteTitle, siteDescription, socialLinks }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-8 md:py-12 px-4">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile-FYwmgktVCXq3rLF2zP2S6eaTFYtKPX.png"
                alt={siteTitle}
                width={40}
                height={40}
                className="rounded-full object-cover"
                loading="lazy"
              />
              <h3 className="text-lg font-semibold">{siteTitle}</h3>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">{siteDescription}</p>
            <Link
              href="/admin/login"
              className="inline-flex items-center text-xs text-muted-foreground hover:text-primary transition-colors mt-4"
            >
              <Lock className="h-3 w-3 mr-1" />
              Admin Access
            </Link>
          </div>

          <div className="flex gap-6 justify-center md:justify-end flex-wrap">
            {socialLinks.instagram && (
              <Link
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#E1306C] transition-colors"
                title="Instagram"
                aria-label="Visit our Instagram page"
              >
                <i className="fab fa-instagram text-xl"></i>
                <span className="sr-only">Instagram</span>
              </Link>
            )}

            {socialLinks.facebook && (
              <Link
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#1877F2] transition-colors"
                title="Facebook"
                aria-label="Visit our Facebook page"
              >
                <i className="fab fa-facebook text-xl"></i>
                <span className="sr-only">Facebook</span>
              </Link>
            )}

            {socialLinks.twitter && (
              <Link
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#1DA1F2] transition-colors"
                title="Twitter"
                aria-label="Visit our Twitter page"
              >
                <i className="fab fa-twitter text-xl"></i>
                <span className="sr-only">Twitter</span>
              </Link>
            )}

            {socialLinks.youtube && (
              <Link
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#FF0000] transition-colors"
                title="YouTube"
                aria-label="Visit our YouTube channel"
              >
                <i className="fab fa-youtube text-xl"></i>
                <span className="sr-only">YouTube</span>
              </Link>
            )}

            {socialLinks.tiktok && (
              <Link
                href={socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#000000] dark:hover:text-white transition-colors"
                title="TikTok"
                aria-label="Visit our TikTok page"
              >
                <i className="fab fa-tiktok text-xl"></i>
                <span className="sr-only">TikTok</span>
              </Link>
            )}

            {socialLinks.discord && (
              <Link
                href={socialLinks.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#5865F2] transition-colors"
                title="Discord"
                aria-label="Join our Discord server"
              >
                <i className="fab fa-discord text-xl"></i>
                <span className="sr-only">Discord</span>
              </Link>
            )}

            {socialLinks.behance && (
              <Link
                href={socialLinks.behance}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#1769FF] transition-colors"
                title="Behance"
                aria-label="Visit our Behance portfolio"
              >
                <i className="fab fa-behance text-xl"></i>
                <span className="sr-only">Behance</span>
              </Link>
            )}

            {socialLinks.github && (
              <Link
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="GitHub"
                aria-label="Visit our GitHub profile"
              >
                <i className="fab fa-github text-xl"></i>
                <span className="sr-only">GitHub</span>
              </Link>
            )}

            {socialLinks.linkedin && (
              <Link
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#0A66C2] transition-colors"
                title="LinkedIn"
                aria-label="Visit our LinkedIn profile"
              >
                <i className="fab fa-linkedin text-xl"></i>
                <span className="sr-only">LinkedIn</span>
              </Link>
            )}
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          © {currentYear} {siteTitle}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
