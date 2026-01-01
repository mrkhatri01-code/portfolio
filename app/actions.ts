"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// Contact form submission
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

// Admin actions for projects
export async function createProject(formData: FormData) {
  const supabase = createServerSupabaseClient()

  const title = formData.get("title") as string
  const slug = formData.get("slug") as string
  const description = formData.get("description") as string
  const category = formData.get("category") as string
  const featured = formData.get("featured") === "on"

  if (!title || !slug || !description || !category) {
    return {
      success: false,
      message: "All fields are required",
    }
  }

  try {
    // Insert project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert([
        {
          title,
          slug,
          description,
          category,
          featured,
        },
      ])
      .select()

    if (projectError) throw projectError

    revalidatePath("/")
    revalidatePath("/projects")

    return {
      success: true,
      message: "Project created successfully!",
      projectId: project[0].id,
    }
  } catch (error) {
    console.error("Error creating project:", error)
    return {
      success: false,
      message: "Failed to create project. Please try again.",
    }
  }
}

export async function uploadProjectImage(projectId: string, imageUrl: string, altText = "") {
  const supabase = createServerSupabaseClient()

  try {
    // Get current highest display order
    const { data: existingImages } = await supabase
      .from("project_images")
      .select("display_order")
      .eq("project_id", projectId)
      .order("display_order", { ascending: false })
      .limit(1)

    const displayOrder = existingImages && existingImages.length > 0 ? existingImages[0].display_order + 1 : 0

    // Insert image
    const { error } = await supabase.from("project_images").insert([
      {
        project_id: projectId,
        image_url: imageUrl,
        alt_text: altText,
        display_order: displayOrder,
      },
    ])

    if (error) throw error

    revalidatePath(`/projects/${projectId}`)

    return {
      success: true,
      message: "Image uploaded successfully!",
    }
  } catch (error) {
    console.error("Error uploading project image:", error)
    return {
      success: false,
      message: "Failed to upload image. Please try again.",
    }
  }
}

export async function addYoutubeVideo(projectId: string, youtubeUrl: string, title = "") {
  const supabase = createServerSupabaseClient()

  try {
    // Get current highest display order
    const { data: existingVideos } = await supabase
      .from("project_videos")
      .select("display_order")
      .eq("project_id", projectId)
      .order("display_order", { ascending: false })
      .limit(1)

    const displayOrder = existingVideos && existingVideos.length > 0 ? existingVideos[0].display_order + 1 : 0

    // Insert video
    const { error } = await supabase.from("project_videos").insert([
      {
        project_id: projectId,
        youtube_url: youtubeUrl,
        title,
        display_order: displayOrder,
      },
    ])

    if (error) throw error

    revalidatePath(`/projects/${projectId}`)

    return {
      success: true,
      message: "Video added successfully!",
    }
  } catch (error) {
    console.error("Error adding YouTube video:", error)
    return {
      success: false,
      message: "Failed to add video. Please try again.",
    }
  }
}

export async function createBlog(formData: FormData) {
  const supabase = createServerSupabaseClient()

  const title = formData.get("title") as string
  const slug = formData.get("slug") as string
  const excerpt = formData.get("excerpt") as string
  const content = formData.get("content") as string
  const seoTitle = formData.get("seoTitle") as string
  const seoDescription = formData.get("seoDescription") as string
  const seoKeywords = formData.get("seoKeywords") as string
  const featuredImage = formData.get("featuredImage") as string
  const published = formData.get("published") === "on"

  if (!title || !slug || !excerpt || !content) {
    return { success: false, message: "Required fields missing" }
  }

  try {
    const { data: blog, error } = await supabase
      .from("blogs")
      .insert([
        {
          title,
          slug,
          excerpt,
          content,
          seo_title: seoTitle || title,
          seo_description: seoDescription || excerpt,
          seo_keywords: seoKeywords,
          featured_image: featuredImage,
          published,
          published_at: published ? new Date().toISOString() : null,
          author_id: "system", // Will be updated with actual user auth
        },
      ])
      .select()

    if (error) throw error

    revalidatePath("/blog")
    revalidatePath("/")

    return { success: true, message: "Blog created successfully!", blogId: blog[0].id }
  } catch (error) {
    console.error("Error creating blog:", error)
    return { success: false, message: "Failed to create blog" }
  }
}

export async function updateBlog(blogId: string, formData: FormData) {
  const supabase = createServerSupabaseClient()

  const title = formData.get("title") as string
  const slug = formData.get("slug") as string
  const excerpt = formData.get("excerpt") as string
  const content = formData.get("content") as string
  const seoTitle = formData.get("seoTitle") as string
  const seoDescription = formData.get("seoDescription") as string
  const seoKeywords = formData.get("seoKeywords") as string
  const featuredImage = formData.get("featuredImage") as string
  const published = formData.get("published") === "on"

  try {
    const { error } = await supabase
      .from("blogs")
      .update({
        title,
        slug,
        excerpt,
        content,
        seo_title: seoTitle || title,
        seo_description: seoDescription || excerpt,
        seo_keywords: seoKeywords,
        featured_image: featuredImage,
        published,
        published_at: published ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", blogId)

    if (error) throw error

    revalidatePath("/blog")
    revalidatePath(`/blog/${slug}`)
    revalidatePath("/")

    return { success: true, message: "Blog updated successfully!" }
  } catch (error) {
    console.error("Error updating blog:", error)
    return { success: false, message: "Failed to update blog" }
  }
}

export async function deleteBlog(blogId: string) {
  const supabase = createServerSupabaseClient()

  try {
    // Delete relations first
    await supabase.from("blog_category_relations").delete().eq("blog_id", blogId)
    await supabase.from("blog_tag_relations").delete().eq("blog_id", blogId)

    // Delete blog
    const { error } = await supabase.from("blogs").delete().eq("id", blogId)

    if (error) throw error

    revalidatePath("/blog")
    revalidatePath("/")

    return { success: true, message: "Blog deleted successfully!" }
  } catch (error) {
    console.error("Error deleting blog:", error)
    return { success: false, message: "Failed to delete blog" }
  }
}

export async function addBlogCategory(blogId: string, categoryId: string) {
  const supabase = createServerSupabaseClient()

  try {
    const { error } = await supabase
      .from("blog_category_relations")
      .insert([{ blog_id: blogId, category_id: categoryId }])

    if (error) throw error

    return { success: true, message: "Category added" }
  } catch (error) {
    console.error("Error adding category:", error)
    return { success: false, message: "Failed to add category" }
  }
}

export async function removeBlogCategory(blogId: string, categoryId: string) {
  const supabase = createServerSupabaseClient()

  try {
    const { error } = await supabase
      .from("blog_category_relations")
      .delete()
      .eq("blog_id", blogId)
      .eq("category_id", categoryId)

    if (error) throw error

    return { success: true, message: "Category removed" }
  } catch (error) {
    console.error("Error removing category:", error)
    return { success: false, message: "Failed to remove category" }
  }
}

export async function addBlogTag(blogId: string, tagId: string) {
  const supabase = createServerSupabaseClient()

  try {
    const { error } = await supabase.from("blog_tag_relations").insert([{ blog_id: blogId, tag_id: tagId }])

    if (error) throw error

    return { success: true, message: "Tag added" }
  } catch (error) {
    console.error("Error adding tag:", error)
    return { success: false, message: "Failed to add tag" }
  }
}

export async function removeBlogTag(blogId: string, tagId: string) {
  const supabase = createServerSupabaseClient()

  try {
    const { error } = await supabase.from("blog_tag_relations").delete().eq("blog_id", blogId).eq("tag_id", tagId)

    if (error) throw error

    return { success: true, message: "Tag removed" }
  } catch (error) {
    console.error("Error removing tag:", error)
    return { success: false, message: "Failed to remove tag" }
  }
}

export async function createCategory(name: string, description: string) {
  const supabase = createServerSupabaseClient()

  const slug = name.toLowerCase().replace(/\s+/g, "-")

  try {
    const { data, error } = await supabase.from("blog_categories").insert([{ name, description, slug }]).select()

    if (error) throw error

    return { success: true, message: "Category created", categoryId: data[0].id }
  } catch (error) {
    console.error("Error creating category:", error)
    return { success: false, message: "Failed to create category" }
  }
}

export async function updateCategory(categoryId: string, name: string, description: string) {
  const supabase = createServerSupabaseClient()

  const slug = name.toLowerCase().replace(/\s+/g, "-")

  try {
    const { error } = await supabase.from("blog_categories").update({ name, description, slug }).eq("id", categoryId)

    if (error) throw error

    return { success: true, message: "Category updated" }
  } catch (error) {
    console.error("Error updating category:", error)
    return { success: false, message: "Failed to update category" }
  }
}

export async function deleteCategory(categoryId: string) {
  const supabase = createServerSupabaseClient()

  try {
    // Delete relations first
    await supabase.from("blog_category_relations").delete().eq("category_id", categoryId)

    // Delete category
    const { error } = await supabase.from("blog_categories").delete().eq("id", categoryId)

    if (error) throw error

    return { success: true, message: "Category deleted" }
  } catch (error) {
    console.error("Error deleting category:", error)
    return { success: false, message: "Failed to delete category" }
  }
}

export async function createTag(name: string) {
  const supabase = createServerSupabaseClient()

  const slug = name.toLowerCase().replace(/\s+/g, "-")

  try {
    const { data, error } = await supabase.from("blog_tags").insert([{ name, slug }]).select()

    if (error) throw error

    return { success: true, message: "Tag created", tagId: data[0].id }
  } catch (error) {
    console.error("Error creating tag:", error)
    return { success: false, message: "Failed to create tag" }
  }
}

export async function updateTag(tagId: string, name: string) {
  const supabase = createServerSupabaseClient()

  const slug = name.toLowerCase().replace(/\s+/g, "-")

  try {
    const { error } = await supabase.from("blog_tags").update({ name, slug }).eq("id", tagId)

    if (error) throw error

    return { success: true, message: "Tag updated" }
  } catch (error) {
    console.error("Error updating tag:", error)
    return { success: false, message: "Failed to update tag" }
  }
}

export async function deleteTag(tagId: string) {
  const supabase = createServerSupabaseClient()

  try {
    // Delete relations first
    await supabase.from("blog_tag_relations").delete().eq("tag_id", tagId)

    // Delete tag
    const { error } = await supabase.from("blog_tags").delete().eq("id", tagId)

    if (error) throw error

    return { success: true, message: "Tag deleted" }
  } catch (error) {
    console.error("Error deleting tag:", error)
    return { success: false, message: "Failed to delete tag" }
  }
}
