"use server"

import { resourceManager } from "@/lib/data-manager/resource-manager"
import { revalidatePath } from "next/cache"

// Get all resources
export async function getResources() {
  try {
    return await resourceManager.getOrdered()
  } catch (error) {
    console.error("Error fetching resources:", error)
    return []
  }
}

// Get resource by ID
export async function getResourceById(id: string) {
  try {
    return await resourceManager.getById(id)
  } catch (error) {
    console.error(`Error fetching resource with ID ${id}:`, error)
    return null
  }
}

// Create resource
export async function createResource(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const logoUrl = formData.get("logoUrl") as string
    const linkUrl = formData.get("linkUrl") as string

    if (!name || !linkUrl) {
      return {
        success: false,
        message: "Name and Link URL are required",
      }
    }

    // Get current highest display order
    const resources = await resourceManager.getOrdered()
    const displayOrder = resources.length > 0 ? resources[resources.length - 1].display_order + 1 : 0

    const resource = await resourceManager.create({
      name,
      description: description || null,
      logo_url: logoUrl || null,
      link_url: linkUrl,
      display_order: displayOrder,
    })

    revalidatePath("/admin/dashboard")
    revalidatePath("/admin/resources")
    revalidatePath("/")

    return {
      success: true,
      message: "Resource created successfully",
      resource,
    }
  } catch (error) {
    console.error("Error creating resource:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred while creating the resource",
    }
  }
}

// Update resource
export async function updateResource(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const logoUrl = formData.get("logoUrl") as string
    const linkUrl = formData.get("linkUrl") as string

    if (!name || !linkUrl) {
      return {
        success: false,
        message: "Name and Link URL are required",
      }
    }

    const resource = await resourceManager.update(id, {
      name,
      description: description || null,
      logo_url: logoUrl || null,
      link_url: linkUrl,
      updated_at: new Date().toISOString(),
    })

    revalidatePath("/admin/dashboard")
    revalidatePath("/admin/resources")
    revalidatePath("/")

    return {
      success: true,
      message: "Resource updated successfully",
      resource,
    }
  } catch (error) {
    console.error(`Error updating resource with ID ${id}:`, error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred while updating the resource",
    }
  }
}

// Delete resource
export async function deleteResource(id: string) {
  try {
    await resourceManager.delete(id)

    revalidatePath("/admin/dashboard")
    revalidatePath("/admin/resources")
    revalidatePath("/")

    return {
      success: true,
      message: "Resource deleted successfully",
    }
  } catch (error) {
    console.error(`Error deleting resource with ID ${id}:`, error)
    return {
      success: false,
      message: "Failed to delete resource",
    }
  }
}

// Update resource display order
export async function updateResourceOrder(id: string, newOrder: number) {
  try {
    await resourceManager.updateOrder(id, newOrder)

    revalidatePath("/admin/dashboard")
    revalidatePath("/admin/resources")
    revalidatePath("/")

    return {
      success: true,
      message: "Resource order updated successfully",
    }
  } catch (error) {
    console.error(`Error updating resource order for ID ${id}:`, error)
    return {
      success: false,
      message: "Failed to update resource order",
    }
  }
}
