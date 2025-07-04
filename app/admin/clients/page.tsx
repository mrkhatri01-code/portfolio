import Link from "next/link"
import { getClients } from "@/app/actions/client-actions"
import { PlusCircle, Pencil, Trash2 } from "lucide-react"
import { DeleteClientButton } from "@/components/admin/delete-client-button"

export const metadata = {
  title: "Manage Clients",
}

export default async function ClientsPage() {
  const clients = await getClients()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i>
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">Manage Clients</h1>
        </div>
        <Link
          href="/admin/clients/new"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Client
        </Link>
      </div>

      {clients.length === 0 ? (
        <div className="rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/30">
          <div className="flex">
            <div className="flex-shrink-0"></div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">No clients found</h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>You haven&apos;t added any clients yet. Click the button above to add your first client.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  Client
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  Website
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  Featured
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  Social Media
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {clients.map((client) => (
                <tr key={client.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      {client.logo_url && (
                        <div className="h-10 w-10 flex-shrink-0 mr-3">
                          <img
                            className="h-10 w-10 object-contain"
                            src={client.logo_url || "/placeholder.svg"}
                            alt={client.name}
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg?height=40&width=40"
                            }}
                          />
                        </div>
                      )}
                      <div className="font-medium text-gray-900 dark:text-white">{client.name}</div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {client.website_url ? (
                      <a
                        href={client.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {new URL(client.website_url).hostname}
                      </a>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {client.featured ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        No
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <div className="flex space-x-2">
                      {client.instagram_url && (
                        <a
                          href={client.instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-500 hover:text-pink-600"
                        >
                          <i className="fa-brands fa-instagram"></i>
                          <span className="sr-only">Instagram</span>
                        </a>
                      )}
                      {client.facebook_url && (
                        <a
                          href={client.facebook_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <i className="fa-brands fa-facebook"></i>
                          <span className="sr-only">Facebook</span>
                        </a>
                      )}
                      {client.twitter_url && (
                        <a
                          href={client.twitter_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-500"
                        >
                          <i className="fa-brands fa-x-twitter"></i>
                          <span className="sr-only">Twitter</span>
                        </a>
                      )}
                      {client.linkedin_url && (
                        <a
                          href={client.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 hover:text-blue-800"
                        >
                          <i className="fa-brands fa-linkedin"></i>
                          <span className="sr-only">LinkedIn</span>
                        </a>
                      )}
                      {client.youtube_url && (
                        <a
                          href={client.youtube_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-600 hover:text-red-700"
                        >
                          <i className="fa-brands fa-youtube"></i>
                          <span className="sr-only">YouTube</span>
                        </a>
                      )}
                      {client.tiktok_url && (
                        <a
                          href={client.tiktok_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-800 hover:text-black dark:text-gray-200 dark:hover:text-white"
                        >
                          <i className="fa-brands fa-tiktok"></i>
                          <span className="sr-only">TikTok</span>
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/admin/clients/edit/${client.id}`} className="text-primary hover:text-primary-dark">
                        <Pencil className="h-5 w-5" />
                        <span className="sr-only">Edit</span>
                      </Link>
                      <DeleteClientButton clientId={client.id} clientName={client.name}>
                        <Trash2 className="h-5 w-5 text-red-500 hover:text-red-700" />
                        <span className="sr-only">Delete</span>
                      </DeleteClientButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

