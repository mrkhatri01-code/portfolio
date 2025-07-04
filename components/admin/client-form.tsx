"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient, updateClient } from "@/app/actions/client-actions"

interface ClientFormProps {
  client?: {
    id: string
    name: string
    description?: string
    logo_url?: string
    website_url?: string
    instagram_url?: string
    twitter_url?: string
    linkedin_url?: string
    facebook_url?: string
    youtube_url?: string
    tiktok_url?: string
    featured: boolean
  }
  isEditing?: boolean
}

export function ClientForm({ client, isEditing = false }: ClientFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      let result

      if (isEditing && client) {
        result = await updateClient(client.id, formData)
      } else {
        result = await createClient(formData)
      }

      if (result.success) {
        setSuccess(result.message)
        // Redirect after a short delay to show the success message
        setTimeout(() => {
          router.push("/admin/clients")
        }, 1000)
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
      {success && <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">{success}</div>}

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Client Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={client?.name || ""}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="logo_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Logo URL
          </label>
          <input
            id="logo_url"
            name="logo_url"
            type="url"
            defaultValue={client?.logo_url || ""}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            placeholder="https://example.com/logo.png"
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Enter a direct URL to the client&apos;s logo image
          </p>
        </div>

        <div>
          <label htmlFor="website_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Website URL
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
              <i className="fa-solid fa-globe"></i>
            </span>
            <input
              id="website_url"
              name="website_url"
              type="url"
              defaultValue={client?.website_url || ""}
              className="block w-full flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="instagram_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Instagram URL
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-pink-500 dark:border-gray-700 dark:bg-gray-800">
                <i className="fa-brands fa-instagram"></i>
              </span>
              <input
                id="instagram_url"
                name="instagram_url"
                type="url"
                defaultValue={client?.instagram_url || ""}
                className="block w-full flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="https://instagram.com/username"
              />
            </div>
          </div>

          <div>
            <label htmlFor="twitter_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Twitter URL
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-blue-400 dark:border-gray-700 dark:bg-gray-800">
                <i className="fa-brands fa-x-twitter"></i>
              </span>
              <input
                id="twitter_url"
                name="twitter_url"
                type="url"
                defaultValue={client?.twitter_url || ""}
                className="block w-full flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="https://twitter.com/username"
              />
            </div>
          </div>

          <div>
            <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              LinkedIn URL
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-blue-700 dark:border-gray-700 dark:bg-gray-800">
                <i className="fa-brands fa-linkedin"></i>
              </span>
              <input
                id="linkedin_url"
                name="linkedin_url"
                type="url"
                defaultValue={client?.linkedin_url || ""}
                className="block w-full flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </div>

          <div>
            <label htmlFor="facebook_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Facebook URL
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-blue-600 dark:border-gray-700 dark:bg-gray-800">
                <i className="fa-brands fa-facebook"></i>
              </span>
              <input
                id="facebook_url"
                name="facebook_url"
                type="url"
                defaultValue={client?.facebook_url || ""}
                className="block w-full flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="https://facebook.com/username"
              />
            </div>
          </div>

          <div>
            <label htmlFor="youtube_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              YouTube URL
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-red-600 dark:border-gray-700 dark:bg-gray-800">
                <i className="fa-brands fa-youtube"></i>
              </span>
              <input
                id="youtube_url"
                name="youtube_url"
                type="url"
                defaultValue={client?.youtube_url || ""}
                className="block w-full flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="https://youtube.com/c/username"
              />
            </div>
          </div>

          <div>
            <label htmlFor="tiktok_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              TikTok URL
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                <i className="fa-brands fa-tiktok"></i>
              </span>
              <input
                id="tiktok_url"
                name="tiktok_url"
                type="url"
                defaultValue={client?.tiktok_url || ""}
                className="block w-full flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="https://tiktok.com/@username"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="featured"
            name="featured"
            type="checkbox"
            defaultChecked={client?.featured || false}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-700 dark:bg-gray-800"
          />
          <label htmlFor="featured" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Feature this client on the homepage
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? "Saving..." : isEditing ? "Update Client" : "Add Client"}
        </button>
      </div>
    </form>
  )
}
