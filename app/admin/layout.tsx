import type React from "react"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage your portfolio content",
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check for admin session cookie
  const cookieStore = cookies()
  const adminSession = cookieStore.get("admin_session")

  // If no admin session, redirect to login
  if (!adminSession && !process.env.NODE_ENV.startsWith("dev")) {
    redirect("/admin/login")
  }

  return <div className="min-h-screen">{children}</div>
}

