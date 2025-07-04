"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// Create experience entry
export async function createExperience(formData: FormData) {
  const supabase = createServerSupabaseClient()

  const company = formData.get("company") as string
  const position = formData.get("position") as string
  const startDate = formData.get("startDate") as string
  const endDate = (formData.get("endDate") as string) || null
  const current = formData.get("current") === "on"
  const description = (formData.get("description") as string) || null
  const location = (formData.get("location") as string) || null
  const companyUrl = (formData.get("companyUrl") as string) || null

  if (!company || !position || !startDate) {
    return {
      success: false,
      message: "Required fields are missing",
    }
  }

  try {
    // Get current highest display order
    const { data: existingItems } = await supabase
      .from("experience")
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1)

    const displayOrder = existingItems && existingItems.length > 0 ? existingItems[0].display_order + 1 : 0

    // Insert experience
    const { error } = await supabase.from("experience").insert([
      {
        company,
        position,
        start_date: startDate,
        end_date: current ? null : endDate,
        current,
        description,
        location,
        display_order: displayOrder,
        company_url: companyUrl,
      },
    ])

    if (error) throw error

    revalidatePath("/")

    return {
      success: true,
      message: "Experience added successfully!",
    }
  } catch (error) {
    console.error("Error adding experience:", error)
    return {
      success: false,
      message: "Failed to add experience. Please try again.",
    }
  }
}

// Update experience entry
export async function updateExperience(id: string, formData: FormData) {
  const supabase = createServerSupabaseClient()

  const company = formData.get("company") as string
  const position = formData.get("position") as string
  const startDate = formData.get("startDate") as string
  const endDate = (formData.get("endDate") as string) || null
  const current = formData.get("current") === "on"
  const description = (formData.get("description") as string) || null
  const location = (formData.get("location") as string) || null
  const companyUrl = (formData.get("companyUrl") as string) || null

  if (!company || !position || !startDate) {
    return {
      success: false,
      message: "Required fields are missing",
    }
  }

  try {
    // Update experience
    const { error } = await supabase
      .from("experience")
      .update({
        company,
        position,
        start_date: startDate,
        end_date: current ? null : endDate,
        current,
        description,
        location,
        updated_at: new Date().toISOString(),
        company_url: companyUrl,
      })
      .eq("id", id)

    if (error) throw error

    revalidatePath("/")

    return {
      success: true,
      message: "Experience updated successfully!",
    }
  } catch (error) {
    console.error("Error updating experience:", error)
    return {
      success: false,
      message: "Failed to update experience. Please try again.",
    }
  }
}

// Delete experience entry
export async function deleteExperience(id: string) {
  const supabase = createServerSupabaseClient()

  try {
    const { error } = await supabase.from("experience").delete().eq("id", id)

    if (error) throw error

    revalidatePath("/")

    return {
      success: true,
      message: "Experience deleted successfully!",
    }
  } catch (error) {
    console.error("Error deleting experience:", error)
    return {
      success: false,
      message: "Failed to delete experience. Please try again.",
    }
  }
}

// Update experience display order
export async function updateExperienceOrder(id: string, newOrder: number) {
  const supabase = createServerSupabaseClient()

  try {
    const { error } = await supabase.from("experience").update({ display_order: newOrder }).eq("id", id)

    if (error) throw error

    revalidatePath("/")

    return {
      success: true,
      message: "Experience order updated successfully!",
    }
  } catch (error) {
    console.error("Error updating experience order:", error)
    return {
      success: false,
      message: "Failed to update experience order. Please try again.",
    }
  }
}
