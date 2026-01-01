"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef } from "react"

interface Client {
  id: string
  name: string
  description?: string
  logo_url: string
  website_url?: string
  instagram_url?: string
  twitter_url?: string
  linkedin_url?: string
  facebook_url?: string
  youtube_url?: string
  tiktok_url?: string
  featured: boolean
}

interface ClientsSectionProps {
  clients: Client[]
}

export function ClientsSection({ clients }: ClientsSectionProps) {
  if (!clients || clients.length === 0) return null

  // Create a ref for the slider
  const sliderRef = useRef<HTMLDivElement>(null)

  // Effect to handle the animation
  useEffect(() => {
    const slider = sliderRef.current
    if (!slider) return

    // Function to check if slider needs resetting
    const checkPosition = () => {
      const rect = slider.getBoundingClientRect()
      if (rect.right < window.innerWidth) {
        // Reset position when all slides have passed
        slider.style.transition = "none"
        slider.style.transform = "translateX(0)"
        setTimeout(() => {
          slider.style.transition = "transform 30s linear infinite"
        }, 50)
      }
    }

    // Set interval to check position
    const interval = setInterval(checkPosition, 5000)

    return () => clearInterval(interval)
  }, [])

  // Duplicate clients array to create a seamless loop
  const duplicatedClients = [...clients, ...clients, ...clients]

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Clients</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Trusted by innovative companies around the world
            </p>
          </div>
        </div>

        {/* Slider container */}
        <div className="clients-slider-container">
          <div className="clients-slider" ref={sliderRef}>
            {duplicatedClients.map((client, index) => (
              <div
                key={`${client.id}-${index}`}
                className="client-slide"
                style={{
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                <div className="client-card bg-white rounded-lg shadow-sm transition-all hover:shadow-md dark:bg-gray-800 p-4">
                  <div className="relative w-full h-32 mb-4 flex items-center justify-center">
                    {client.logo_url ? (
                      <Image
                        src={client.logo_url || "/placeholder.svg"}
                        alt={client.name}
                        width={150}
                        height={150}
                        className="object-contain max-h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded">
                        <span className="text-lg font-medium text-gray-500 dark:text-gray-400">{client.name}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-center truncate">{client.name}</h3>

                  {/* Social Media Links with Font Awesome Icons */}
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    {client.website_url && (
                      <Link
                        href={client.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-light transition-colors"
                        title="Website"
                      >
                        <i className="fa-solid fa-globe"></i>
                        <span className="sr-only">Website</span>
                      </Link>
                    )}
                    {client.instagram_url && (
                      <Link
                        href={client.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-colors"
                        title="Instagram"
                      >
                        <i className="fa-brands fa-instagram"></i>
                        <span className="sr-only">Instagram</span>
                      </Link>
                    )}
                    {client.twitter_url && (
                      <Link
                        href={client.twitter_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-400 dark:text-gray-400 dark:hover:text-blue-300 transition-colors"
                        title="Twitter"
                      >
                        <i className="fa-brands fa-x-twitter"></i>
                        <span className="sr-only">Twitter</span>
                      </Link>
                    )}
                    {client.facebook_url && (
                      <Link
                        href={client.facebook_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                        title="Facebook"
                      >
                        <i className="fa-brands fa-facebook"></i>
                        <span className="sr-only">Facebook</span>
                      </Link>
                    )}
                    {client.youtube_url && (
                      <Link
                        href={client.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                        title="YouTube"
                      >
                        <i className="fa-brands fa-youtube"></i>
                        <span className="sr-only">YouTube</span>
                      </Link>
                    )}
                    {client.tiktok_url && (
                      <Link
                        href={client.tiktok_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
                        title="TikTok"
                      >
                        <i className="fa-brands fa-tiktok"></i>
                        <span className="sr-only">TikTok</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
