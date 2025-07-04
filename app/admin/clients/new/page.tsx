import { ClientForm } from "@/components/admin/client-form"

export const metadata = {
  title: "Add New Client",
}

export default function NewClientPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Add New Client</h1>
      <div className="rounded-md bg-white p-6 shadow dark:bg-gray-800">
        <ClientForm />
      </div>
    </div>
  )
}

