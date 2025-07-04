"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// Create education entry
export async function createEducation(formData: FormData) {
  const supabase = createServerSupabaseClient()

  const institution = formData.get("institution") as string
  const degree = formData.get("degree") as string
  const fieldOfStudy = formData.get("fieldOfStudy") as string
  const startDate = formData.get("startDate") as string
  const endDate = (formData.get("endDate") as string) || null
  const current = formData.get("current") === "on"
  const description = (formData.get("description") as string) || null
  const location = (formData.get("location") as string) || null

  if (!institution || !degree || !fieldOfStudy || !startDate) {
    return {
      success: false,
      message: "Required fields are missing",
    }
  }

  try {
    // Get current highest display order
    const { data: existingItems } = await supabase
      .from("education")
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1)

    const displayOrder = existingItems && existingItems.length > 0 ? existingItems[0].display_order + 1 : 0

    // Insert education
    const { error } = await supabase.from("education").insert([
      {
        institution,
        degree,
        field_of_study: fieldOfStudy,
        start_date: startDate,
        end_date: current ? null : endDate,
        current,
        description,
        location,
        display_order: displayOrder,
      },
    ])

    if (error) throw error

    revalidatePath("/")

    return {
      success: true,
      message: "Education added successfully!",
    }
  } catch (error) {
    console.error("Error adding education:", error)
    return {
      success: false,
      message: "Failed to add education. Please try again.",
    }
  }
}

// Update education entry
export async function updateEducation(id: string, formData: FormData) {
  const supabase = createServerSupabaseClient()

  const institution = formData.get("institution") as string
  const degree = formData.get("degree") as string
  const fieldOfStudy = formData.get("fieldOfStudy") as string
  const startDate = formData.get("startDate") as string
  const endDate = (formData.get("endDate") as string) || null
  const current = formData.get("current") === "on"
  const description = (formData.get("description") as string) || null
  const location = (formData.get("location") as string) || null

  if (!institution || !degree || !fieldOfStudy || !startDate) {
    return {
      success: false,
      message: "Required fields are missing",
    }
  }

  try {
    // Update education
    const { error } = await supabase
      .from("education")
      .update({
        institution,
        degree,
        field_of_study: fieldOfStudy,
        start_date: startDate,
        end_date: current ? null : endDate,
        current,
        description,
        location,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) throw error

    revalidatePath("/")

    return {
      success: true,
      message: "Education updated successfully!",
    }
  } catch (error) {
    console.error("Error updating education:", error)
    return {
      success: false,
      message: "Failed to update education. Please try again.",
    }
  }
}

// Delete education entry
export async function deleteEducation(id: string) {
  const supabase = createServerSupabaseClient()

  try {
    const { error } = await supabase.from("education").delete().eq("id", id)

    if (error) throw error

    revalidatePath("/")

    return {
      success: true,
      message: "Education deleted successfully!",
    }
  } catch (error) {
    console.error("Error deleting education:", error)
    return {
      success: false,
      message: "Failed to delete education. Please try again.",
    }
  }
}

// Update education display order
export async function updateEducationOrder(id: string, newOrder: number) {
  const supabase = createServerSupabaseClient()

  try {
    const { error } = await supabase.from("education").update({ display_order: newOrder }).eq("id", id)

    if (error) throw error

    revalidatePath("/")

    return {
      success: true,
      message: "Education order updated successfully!",
    }
  } catch (error) {
    console.error("Error updating education order:", error)
    return {
      success: false,
      message: "Failed to update education order. Please try again.",
    }
  }
}
