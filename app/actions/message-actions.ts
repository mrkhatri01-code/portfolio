"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// Submit contact form
export async function submitContactForm(formData: FormData) {
  const supabase = createServerSupabaseClient()

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const message = formData.get("message") as string

  if (!name || !email || !message) {
    return {
      success: false,
      message: "All fields are required",
    }
  }

  try {
    const { error } = await supabase.from("messages").insert([{ name, email, message }])

    if (error) throw error

    return {
      success: true,
      message: "Message sent successfully!",
    }
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return {
      success: false,
      message: "Failed to send message. Please try again.",
    }
  }
}

// Get all messages
export async function getMessages() {
  const supabase = createServerSupabaseClient()

  try {
    const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false })

    if (error) throw error

    return {
      success: true,
      messages: data || [],
    }
  } catch (error) {
    console.error("Error fetching messages:", error)
    return {
      success: false,
      messages: [],
    }
  }
}

// Mark message as read
export async function markMessageAsRead(id: string, read = true) {
  const supabase = createServerSupabaseClient()

  try {
    const { error } = await supabase.from("messages").update({ read }).eq("id", id)

    if (error) throw error

    revalidatePath("/admin/messages")

    return {
      success: true,
      message: `Message marked as ${read ? "read" : "unread"}`,
    }
  } catch (error) {
    console.error("Error updating message:", error)
    return {
      success: false,
      message: "Failed to update message. Please try again.",
    }
  }
}

// Delete message
export async function deleteMessage(id: string) {
  const supabase = createServerSupabaseClient()

  try {
    const { error } = await supabase.from("messages").delete().eq("id", id)

    if (error) throw error

    revalidatePath("/admin/messages")

    return {
      success: true,
      message: "Message deleted successfully!",
    }
  } catch (error) {
    console.error("Error deleting message:", error)
    return {
      success: false,
      message: "Failed to delete message. Please try again.",
    }
  }
}

