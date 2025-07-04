"use server"

import { createServerSupabaseClient } from "@/lib/supabase"

export async function createAdminUser() {
  const supabase = createServerSupabaseClient()

  const adminEmail = "admin@khatriprabhakar.com.np"
  const adminPassword = "9824566591"

  try {
    // Check if user already exists
    const { data: existingUsers, error: checkError } = await supabase.auth.admin.listUsers()

    if (checkError) throw checkError

    const userExists = existingUsers.users.some((user) => user.email === adminEmail)

    if (userExists) {
      return {
        success: true,
        message: "Admin user already exists",
        exists: true,
      }
    }

    // Create the admin user
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { role: "admin" },
    })

    if (error) throw error

    return {
      success: true,
      message: "Admin user created successfully!",
      exists: false,
    }
  } catch (error) {
    console.error("Error creating admin user:", error)
    return {
      success: false,
      message: "Failed to create admin user. Please try again.",
      exists: false,
    }
  }
}

export async function checkAdminExists() {
  const supabase = createServerSupabaseClient()

  try {
    const { data, error } = await supabase.auth.admin.listUsers()

    if (error) throw error

    const adminExists = data.users.some((user) => user.email === "admin@khatriprabhakar.com.np")

    return {
      exists: adminExists,
    }
  } catch (error) {
    console.error("Error checking admin user:", error)
    return {
      exists: false,
    }
  }
}
