import Image from "next/image"
import Link from "next/link"

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

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Clients</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Trusted by innovative companies around the world
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-8">
          {clients.map((client) => (
            <div
              key={client.id}
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
            >
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
              <h3 className="text-lg font-semibold text-center">{client.name}</h3>

              {/* Social Media Links with Font Awesome Icons */}
              <div className="mt-3 flex flex-wrap justify-center gap-3">
                {client.website_url && (
                  <Link
                    href={client.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-light transition-colors"
                    title="Website"
                  >
                    <i className="fa-solid fa-globe fa-lg"></i>
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
                    <i className="fa-brands fa-instagram fa-lg"></i>
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
                    <i className="fa-brands fa-x-twitter fa-lg"></i>
                    <span className="sr-only">Twitter</span>
                  </Link>
                )}
                {client.linkedin_url && (
                  <Link
                    href={client.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-700 dark:text-gray-400 dark:hover:text-blue-500 transition-colors"
                    title="LinkedIn"
                  >
                    <i className="fa-brands fa-linkedin fa-lg"></i>
                    <span className="sr-only">LinkedIn</span>
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
                    <i className="fa-brands fa-facebook fa-lg"></i>
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
                    <i className="fa-brands fa-youtube fa-lg"></i>
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
                    <i className="fa-brands fa-tiktok fa-lg"></i>
                    <span className="sr-only">TikTok</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
