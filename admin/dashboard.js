// DOM Elements
const themeToggle = document.getElementById("admin-theme-toggle")
const logoutButton = document.getElementById("logout-button")
const dashboardTabs = document.querySelectorAll(".dashboard-tab")
const dashboardSections = document.querySelectorAll(".dashboard-section")
const projectsCards = document.getElementById("projects-cards")
const experienceCards = document.getElementById("experience-cards")
const educationCards = document.getElementById("education-cards")
const messageList = document.getElementById("message-list")
const unreadBadge = document.getElementById("unread-badge")
const confirmationModal = document.getElementById("confirmation-modal")
const modalOverlay = document.querySelector(".modal-overlay")
const modalClose = document.querySelector(".modal-close")
const cancelAction = document.getElementById("cancel-action")
const confirmAction = document.getElementById("confirm-action")
const confirmationMessage = document.getElementById("confirmation-message")

// Declare lucide variable
let lucide

// Check if user is logged in
async function checkAuth() {
  const user = await window.db.getCurrentUser()
  if (!user) {
    window.location.href = "login.html"
  }
}

// Theme Toggle
function initTheme() {
  // Check if theme is stored in localStorage
  const storedTheme = localStorage.getItem("theme")

  if (storedTheme) {
    document.documentElement.classList.toggle("dark", storedTheme === "dark")
  } else {
    // Check system preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    document.documentElement.classList.toggle("dark", prefersDark)
    localStorage.setItem("theme", prefersDark ? "dark" : "light")
  }
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains("dark")
  document.documentElement.classList.toggle("dark", !isDark)
  localStorage.setItem("theme", isDark ? "light" : "dark")
}

// Handle logout
async function handleLogout() {
  try {
    await window.db.signOut()
    window.location.href = "login.html"
  } catch (error) {
    console.error("Error logging out:", error)
    // Redirect anyway
    window.location.href = "login.html"
  }
}

// Handle tab switching
function handleTabSwitch() {
  dashboardTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Update active tab
      dashboardTabs.forEach((t) => t.classList.remove("active"))
      tab.classList.add("active")

      // Show corresponding section
      const tabId = tab.getAttribute("data-tab")
      dashboardSections.forEach((section) => {
        section.classList.remove("active")
        if (section.id === `${tabId}-section`) {
          section.classList.add("active")
        }
      })

      // Update URL hash
      window.location.hash = tabId
    })
  })

  // Check URL hash on page load
  const hash = window.location.hash.substring(1)
  if (hash) {
    const tab = document.querySelector(`.dashboard-tab[data-tab="${hash}"]`)
    if (tab) {
      tab.click()
    }
  }
}

// Load projects
async function loadProjects() {
  if (!projectsCards) return

  projectsCards.innerHTML = '<div class="loading">Loading projects...</div>'

  try {
    const projects = await window.db.getProjects()

    projectsCards.innerHTML = ""

    if (projects.length === 0) {
      projectsCards.innerHTML = `
        <div class="dashboard-card">
          <div class="dashboard-card-header">
            <div>
              <h3 class="dashboard-card-title">No Projects</h3>
              <p class="dashboard-card-subtitle">You haven't created any projects yet.</p>
            </div>
          </div>
          <div class="dashboard-card-content">
            <p>Add your first project to get started.</p>
          </div>
          <div class="dashboard-card-footer">
            <a href="projects/new.html" class="button primary">Add Project</a>
          </div>
        </div>
      `
      return
    }

    projects.forEach((project) => {
      const projectCard = document.createElement("div")
      projectCard.className = "dashboard-card"
      projectCard.innerHTML = `
        <div class="dashboard-card-header">
          <div>
            <h3 class="dashboard-card-title">${project.title}</h3>
            <p class="dashboard-card-subtitle">/${project.slug}</p>
          </div>
          <div class="dashboard-card-actions">
            <a href="projects/${project.id}.html" class="button outline">Manage</a>
            <a href="projects/edit/${project.id}.html" class="button outline">
              <i data-lucide="pencil" class="icon"></i>
              Edit
            </a>
            <button class="button outline delete-button" data-id="${project.id}" data-type="project">
              <i data-lucide="trash-2" class="icon"></i>
              Delete
            </button>
          </div>
        </div>
        <div class="dashboard-card-content">
          <p>${project.description}</p>
        </div>
      `
      projectsCards.appendChild(projectCard)
    })

    // Add event listeners to delete buttons
    const deleteButtons = projectsCards.querySelectorAll(".delete-button")
    deleteButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.getAttribute("data-id")
        const type = button.getAttribute("data-type")
        openConfirmationModal(id, type)
      })
    })

    // Re-initialize Lucide icons
    if (typeof lucide !== "undefined") {
      lucide.createIcons()
    }
  } catch (error) {
    console.error("Error loading projects:", error)
    projectsCards.innerHTML = `
      <div class="dashboard-card">
        <div class="dashboard-card-header">
          <div>
            <h3 class="dashboard-card-title">Error Loading Projects</h3>
            <p class="dashboard-card-subtitle">There was a problem loading your projects.</p>
          </div>
        </div>
        <div class="dashboard-card-content">
          <p>${error.message || "Please try again later."}</p>
        </div>
      </div>
    `
  }
}

// Load experience
async function loadExperience() {
  if (!experienceCards) return

  experienceCards.innerHTML = '<div class="loading">Loading experience...</div>'

  try {
    const experience = await window.db.getExperience()

    experienceCards.innerHTML = ""

    if (experience.length === 0) {
      experienceCards.innerHTML = `
        <div class="dashboard-card">
          <div class="dashboard-card-header">
            <div>
              <h3 class="dashboard-card-title">No Experience</h3>
              <p class="dashboard-card-subtitle">You haven't added any work experience yet.</p>
            </div>
          </div>
          <div class="dashboard-card-content">
            <p>Add your first experience to get started.</p>
          </div>
          <div class="dashboard-card-footer">
            <a href="experience/new.html" class="button primary">Add Experience</a>
          </div>
        </div>
      `
      return
    }

    experience.forEach((exp) => {
      const expCard = document.createElement("div")
      expCard.className = "dashboard-card"

      const endDate = exp.current
        ? "Present"
        : new Date(exp.end_date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
          })

      expCard.innerHTML = `
        <div class="dashboard-card-header">
          <div>
            <h3 class="dashboard-card-title">${exp.position}</h3>
            <p class="dashboard-card-subtitle">${exp.company}</p>
          </div>
          <div class="dashboard-card-actions">
            <a href="experience/edit/${exp.id}.html" class="button outline">
              <i data-lucide="pencil" class="icon"></i>
              Edit
            </a>
            <button class="button outline delete-button" data-id="${exp.id}" data-type="experience">
              <i data-lucide="trash-2" class="icon"></i>
              Delete
            </button>
          </div>
        </div>
        <div class="dashboard-card-content">
          <p>${new Date(exp.start_date).toLocaleDateString()} - ${endDate}</p>
          ${exp.location ? `<p>${exp.location}</p>` : ""}
        </div>
      `

      experienceCards.appendChild(expCard)
    })

    // Add event listeners to delete buttons
    const deleteButtons = experienceCards.querySelectorAll(".delete-button")
    deleteButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.getAttribute("data-id")
        const type = button.getAttribute("data-type")
        openConfirmationModal(id, type)
      })
    })

    // Re-initialize Lucide icons
    if (typeof lucide !== "undefined") {
      lucide.createIcons()
    }
  } catch (error) {
    console.error("Error loading experience:", error)
    experienceCards.innerHTML = `
      <div class="dashboard-card">
        <div class="dashboard-card-header">
          <div>
            <h3 class="dashboard-card-title">Error Loading Experience</h3>
            <p class="dashboard-card-subtitle">There was a problem loading your experience.</p>
          </div>
        </div>
        <div class="dashboard-card-content">
          <p>${error.message || "Please try again later."}</p>
        </div>
      </div>
    `
  }
}

// Load education
async function loadEducation() {
  if (!educationCards) return

  educationCards.innerHTML = '<div class="loading">Loading education...</div>'

  try {
    const education = await window.db.getEducation()

    educationCards.innerHTML = ""

    if (education.length === 0) {
      educationCards.innerHTML = `
        <div class="dashboard-card">
          <div class="dashboard-card-header">
            <div>
              <h3 class="dashboard-card-title">No Education</h3>
              <p class="dashboard-card-subtitle">You haven't added any education yet.</p>
            </div>
          </div>
          <div class="dashboard-card-content">
            <p>Add your first education to get started.</p>
          </div>
          <div class="dashboard-card-footer">
            <a href="education/new.html" class="button primary">Add Education</a>
          </div>
        </div>
      `
      return
    }

    education.forEach((edu) => {
      const eduCard = document.createElement("div")
      eduCard.className = "dashboard-card"

      const endDate = edu.current
        ? "Present"
        : new Date(edu.end_date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
          })

      eduCard.innerHTML = `
        <div class="dashboard-card-header">
          <div>
            <h3 class="dashboard-card-title">${edu.institution}</h3>
            <p class="dashboard-card-subtitle">${edu.degree} in ${edu.field_of_study}</p>
          </div>
          <div class="dashboard-card-actions">
            <a href="education/edit/${edu.id}.html" class="button outline">
              <i data-lucide="pencil" class="icon"></i>
              Edit
            </a>
            <button class="button outline delete-button" data-id="${edu.id}" data-type="education">
              <i data-lucide="trash-2" class="icon"></i>
              Delete
            </button>
          </div>
        </div>
        <div class="dashboard-card-content">
          <p>${new Date(edu.start_date).toLocaleDateString()} - ${endDate}</p>
          ${edu.location ? `<p>${edu.location}</p>` : ""}
        </div>
      `

      educationCards.appendChild(eduCard)
    })

    // Add event listeners to delete buttons
    const deleteButtons = educationCards.querySelectorAll(".delete-button")
    deleteButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.getAttribute("data-id")
        const type = button.getAttribute("data-type")
        openConfirmationModal(id, type)
      })
    })

    // Re-initialize Lucide icons
    if (typeof lucide !== "undefined") {
      lucide.createIcons()
    }
  } catch (error) {
    console.error("Error loading education:", error)
    educationCards.innerHTML = `
      <div class="dashboard-card">
        <div class="dashboard-card-header">
          <div>
            <h3 class="dashboard-card-title">Error Loading Education</h3>
            <p class="dashboard-card-subtitle">There was a problem loading your education.</p>
          </div>
        </div>
        <div class="dashboard-card-content">
          <p>${error.message || "Please try again later."}</p>
        </div>
      </div>
    `
  }
}

// Load messages
async function loadMessages() {
  if (!messageList) return

  messageList.innerHTML = '<div class="loading">Loading messages...</div>'

  try {
    const messages = await window.db.getMessages()

    messageList.innerHTML = ""

    if (messages.length === 0) {
      messageList.innerHTML = `
        <div class="dashboard-card">
          <div class="dashboard-card-header">
            <div>
              <h3 class="dashboard-card-title">No Messages</h3>
              <p class="dashboard-card-subtitle">You haven't received any messages yet.</p>
            </div>
          </div>
        </div>
      `
      return
    }

    // Count unread messages
    const unreadCount = messages.filter((msg) => !msg.read).length
    if (unreadBadge) {
      unreadBadge.textContent = unreadCount
      unreadBadge.style.display = unreadCount > 0 ? "inline-flex" : "none"
    }

    // Show only the first 3 messages
    const recentMessages = messages.slice(0, 3)

    recentMessages.forEach((message) => {
      const messageCard = document.createElement("div")
      messageCard.className = `message-card ${message.read ? "" : "unread"}`

      messageCard.innerHTML = `
        <div class="message-header">
          <div>
            <h3 class="message-sender">${message.name}</h3>
            <a href="mailto:${message.email}" class="message-email">${message.email}</a>
          </div>
          <div class="message-meta">
            ${!message.read ? '<span class="message-status"></span>' : ""}
            <span class="message-date">${new Date(message.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        <div class="message-content">
          <p>${message.message}</p>
        </div>
        <div class="message-actions">
          ${
            !message.read
              ? `<button class="button outline mark-read-button" data-id="${message.id}">
              <i data-lucide="eye" class="icon"></i>
              Mark as Read
            </button>`
              : `<button class="button outline mark-unread-button" data-id="${message.id}">
              <i data-lucide="eye-off" class="icon"></i>
              Mark as Unread
            </button>`
          }
          <button class="button outline delete-button" data-id="${message.id}" data-type="message">
            <i data-lucide="trash-2" class="icon"></i>
            Delete
          </button>
        </div>
      `

      messageList.appendChild(messageCard)
    })

    // Add event listeners to mark read/unread buttons
    const markReadButtons = messageList.querySelectorAll(".mark-read-button")
    markReadButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        const id = button.getAttribute("data-id")
        await markMessageAsRead(id, true)
      })
    })

    const markUnreadButtons = messageList.querySelectorAll(".mark-unread-button")
    markUnreadButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        const id = button.getAttribute("data-id")
        await markMessageAsRead(id, false)
      })
    })

    // Add event listeners to delete buttons
    const deleteButtons = messageList.querySelectorAll(".delete-button")
    deleteButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.getAttribute("data-id")
        const type = button.getAttribute("data-type")
        openConfirmationModal(id, type)
      })
    })

    // Re-initialize Lucide icons
    if (typeof lucide !== "undefined") {
      lucide.createIcons()
    }
  } catch (error) {
    console.error("Error loading messages:", error)
    messageList.innerHTML = `
      <div class="dashboard-card">
        <div class="dashboard-card-header">
          <div>
            <h3 class="dashboard-card-title">Error Loading Messages</h3>
            <p class="dashboard-card-subtitle">There was a problem loading your messages.</p>
          </div>
        </div>
        <div class="dashboard-card-content">
          <p>${error.message || "Please try again later."}</p>
        </div>
      </div>
    `
  }
}

// Mark message as read/unread
async function markMessageAsRead(id, read) {
  try {
    const result = await window.db.markMessageAsRead(id, read)

    if (!result.success) {
      throw new Error(result.error || "Failed to update message")
    }

    // Reload messages
    await loadMessages()
  } catch (error) {
    console.error("Error marking message as read:", error)
    alert(`Error: ${error.message || "Failed to update message"}`)
  }
}

// Confirmation modal
function openConfirmationModal(id, type) {
  // Set confirmation message based on type
  let message = "Are you sure you want to delete this item? This action cannot be undone."

  switch (type) {
    case "project":
      message = "Are you sure you want to delete this project? This will also delete all associated images and videos."
      break
    case "experience":
      message = "Are you sure you want to delete this experience entry?"
      break
    case "education":
      message = "Are you sure you want to delete this education entry?"
      break
    case "message":
      message = "Are you sure you want to delete this message?"
      break
  }

  confirmationMessage.textContent = message

  // Store item ID and type for confirmation
  confirmAction.setAttribute("data-id", id)
  confirmAction.setAttribute("data-type", type)

  // Show modal
  confirmationModal.classList.add("open")
}

function closeConfirmationModal() {
  confirmationModal.classList.remove("open")
}

// Handle delete confirmation
async function handleDeleteConfirmation() {
  const id = confirmAction.getAttribute("data-id")
  const type = confirmAction.getAttribute("data-type")

  // Disable confirm button and show loading state
  confirmAction.disabled = true
  confirmAction.innerHTML = '<i data-lucide="loader-2" class="icon spin"></i> Deleting...'

  try {
    // Delete item based on type
    let result

    switch (type) {
      case "project":
        result = await window.db.deleteProject(id)
        break
      case "experience":
        result = await window.db.deleteExperience(id)
        break
      case "education":
        result = await window.db.deleteEducation(id)
        break
      case "message":
        result = await window.db.deleteMessage(id)
        break
    }

    if (!result.success) {
      throw new Error(result.error || "Failed to delete item")
    }

    // Close modal
    closeConfirmationModal()

    // Reload data
    switch (type) {
      case "project":
        await loadProjects()
        break
      case "experience":
        await loadExperience()
        break
      case "education":
        await loadEducation()
        break
      case "message":
        await loadMessages()
        break
    }
  } catch (error) {
    console.error(`Error deleting ${type}:`, error)
    alert(`Error: ${error.message || "Failed to delete item"}`)

    // Reset confirm button
    confirmAction.disabled = false
    confirmAction.innerHTML = "Delete"
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Check if user is logged in
    await checkAuth()

    // Initialize theme
    initTheme()

    // Add event listeners
    if (themeToggle) themeToggle.addEventListener("click", toggleTheme)
    if (logoutButton) logoutButton.addEventListener("click", handleLogout)

    // Handle tab switching
    handleTabSwitch()

    // Load data
    await Promise.all([loadProjects(), loadExperience(), loadEducation(), loadMessages()])

    // Confirmation modal event listeners
    if (modalOverlay) modalOverlay.addEventListener("click", closeConfirmationModal)
    if (modalClose) modalClose.addEventListener("click", closeConfirmationModal)
    if (cancelAction) cancelAction.addEventListener("click", closeConfirmationModal)
    if (confirmAction) confirmAction.addEventListener("click", handleDeleteConfirmation)
  } catch (error) {
    console.error("Error initializing dashboard:", error)
  }
})
