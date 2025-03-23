"use server"

/**
 * Uploads a project file - currently disabled
 */
export async function uploadProjectFile(formData: FormData) {
  return {
    success: false,
    message: "File upload is currently disabled due to storage limitations",
  }
}

/**
 * Deletes a project file - currently disabled
 */
export async function deleteProjectFile(projectId: string, filePath: string) {
  return {
    success: false,
    message: "File deletion is currently disabled due to storage limitations",
  }
}

/**
 * Lists project files - currently disabled
 */
export async function listProjectFiles(projectId: string) {
  return {
    success: true,
    data: [],
  }
}

/**
 * Uploads a profile image - currently disabled
 */
export async function updateProfileImage(formData: FormData) {
  return {
    success: false,
    message: "Profile image upload is currently disabled due to storage limitations",
  }
}

/**
 * Uploads a resume file - currently disabled
 */
export async function updateResume(formData: FormData) {
  return {
    success: false,
    message: "Resume upload is currently disabled due to storage limitations",
  }
}

/**
 * Uploads an attachment file - currently disabled
 */
export async function uploadAttachment(formData: FormData) {
  return {
    success: false,
    message: "Attachment upload is currently disabled due to storage limitations",
  }
}

/**
 * Deletes an attachment file - currently disabled
 */
export async function deleteAttachment(filePath: string) {
  return {
    success: false,
    message: "Attachment deletion is currently disabled due to storage limitations",
  }
}

