import { notFound } from "next/navigation"
import { ClientForm } from "@/components/admin/client-form"
import { getClientById } from "@/app/actions/client-actions"

interface EditClientPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: EditClientPageProps) {
  const client = await getClientById(params.id)
  return {
    title: client ? `Edit ${client.name}` : "Edit Client",
  }
}

export default async function EditClientPage({ params }: EditClientPageProps) {
  const client = await getClientById(params.id)

  if (!client) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Client: {client.name}</h1>
      <div className="rounded-md bg-white p-6 shadow dark:bg-gray-800">
        <ClientForm client={client} isEditing />
      </div>
    </div>
  )
}

