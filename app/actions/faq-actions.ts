"use server"

import { faqManager } from "@/lib/data-manager/faq-manager"
import { revalidatePath } from "next/cache"

// Get all FAQs
export async function getFAQs() {
  try {
    return await faqManager.getOrdered()
  } catch (error) {
    console.error("Error fetching FAQs:", error)
    return []
  }
}

// Get FAQ by ID
export async function getFAQById(id: string) {
  try {
    return await faqManager.getById(id)
  } catch (error) {
    console.error(`Error fetching FAQ with ID ${id}:`, error)
    return null
  }
}

// Create FAQ
export async function createFAQ(formData: FormData) {
  try {
    const question = formData.get("question") as string
    const answer = formData.get("answer") as string

    if (!question || !answer) {
      return {
        success: false,
        message: "Question and answer are required",
      }
    }

    // Get current highest display order
    const faqs = await faqManager.getOrdered()
    const displayOrder = faqs.length > 0 ? faqs[faqs.length - 1].display_order + 1 : 0

    const faq = await faqManager.create({
      question,
      answer,
      display_order: displayOrder,
    })

    revalidatePath("/admin/dashboard")
    revalidatePath("/admin/faqs")
    revalidatePath("/")
    revalidatePath("/faqs")

    return {
      success: true,
      message: "FAQ created successfully",
      faq,
    }
  } catch (error) {
    console.error("Error creating FAQ:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred while creating the FAQ",
    }
  }
}

// Update FAQ
export async function updateFAQ(id: string, formData: FormData) {
  try {
    const question = formData.get("question") as string
    const answer = formData.get("answer") as string

    if (!question || !answer) {
      return {
        success: false,
        message: "Question and answer are required",
      }
    }

    const faq = await faqManager.update(id, {
      question,
      answer,
      updated_at: new Date().toISOString(),
    })

    revalidatePath("/admin/dashboard")
    revalidatePath("/admin/faqs")
    revalidatePath("/")
    revalidatePath("/faqs")

    return {
      success: true,
      message: "FAQ updated successfully",
      faq,
    }
  } catch (error) {
    console.error(`Error updating FAQ with ID ${id}:`, error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred while updating the FAQ",
    }
  }
}

// Delete FAQ
export async function deleteFAQ(id: string) {
  try {
    await faqManager.delete(id)

    revalidatePath("/admin/dashboard")
    revalidatePath("/admin/faqs")
    revalidatePath("/")
    revalidatePath("/faqs")

    return {
      success: true,
      message: "FAQ deleted successfully",
    }
  } catch (error) {
    console.error(`Error deleting FAQ with ID ${id}:`, error)
    return {
      success: false,
      message: "Failed to delete FAQ",
    }
  }
}

// Update FAQ display order
export async function updateFAQOrder(id: string, newOrder: number) {
  try {
    await faqManager.updateOrder(id, newOrder)

    revalidatePath("/admin/dashboard")
    revalidatePath("/admin/faqs")
    revalidatePath("/")
    revalidatePath("/faqs")

    return {
      success: true,
      message: "FAQ order updated successfully",
    }
  } catch (error) {
    console.error(`Error updating FAQ order for ID ${id}:`, error)
    return {
      success: false,
      message: "Failed to update FAQ order",
    }
  }
}
