import Image from "next/image"
import { YouTubeStats } from "@/components/youtube-stats"

interface AboutSectionProps {
  aboutText: string
  profileImageUrl?: string | null
}

export function AboutSection({ aboutText, profileImageUrl }: AboutSectionProps) {
  return (
    <section id="about" className="py-16">
      <div className="container px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight mb-6">About Me</h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              {aboutText.split("\n").map((paragraph, index) => (
                <p key={index} className="text-muted-foreground mb-4">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Add YouTube Stats component */}
            <div className="mt-6">
              <YouTubeStats channelIds={["UCWXvzUlgSvef7TSFinvnhMQ", "UCjvS_RkeBuRZeqDwD2TLsHg"]} className="mt-4" />
            </div>
          </div>

          <div className="order-1 md:order-2 flex justify-center md:justify-end">
            <div className="aspect-square relative rounded-xl overflow-hidden border w-full max-w-sm">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/about-image-HAETCXMaegRQELCsP356hZbehkfpW5.jpeg"
                alt="About Me"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 400px"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

