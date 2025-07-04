// Add Supabase configuration at the top of scripts.js
const SUPABASE_URL = "https://aabzcizbrvgzaolmbozw.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhYnpjaXpicnZnemFvbG1ib3p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NDAxNjUsImV4cCI6MjA1ODAxNjE2NX0.6nYX20MTA2hMdPYcbR8-Gb5TWgOqiyaIxdniBiZ8XIA"

// Initialize Supabase client for the frontend
let supabaseClient

// DOM Elements
const header = document.querySelector(".header")
const mobileMenuButton = document.querySelector(".mobile-menu-button")
const mobileMenu = document.querySelector(".mobile-menu")
const mobileMenuClose = document.querySelector(".mobile-menu-close")
const themeToggle = document.getElementById("theme-toggle")
const mobileThemeToggle = document.getElementById("mobile-theme-toggle")
const contactForm = document.getElementById("contact-form")
const formError = document.getElementById("form-error")
const formSuccess = document.getElementById("form-success")
const projectsGrid = document.getElementById("projects-grid")
const experienceGrid = document.getElementById("experience-grid")
const educationGrid = document.getElementById("education-grid")
const aboutText = document.getElementById("about-text")
const aboutImage = document.getElementById("about-image")
const socialLinks = document.getElementById("social-links")

// Declare supabase
const supabase = window.supabase

// Declare lucide
const lucide = window.lucide

// Initialize Supabase
function initSupabase() {
  if (typeof supabase !== "undefined") {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  } else {
    console.error("Supabase client not loaded")
  }
}

// Load projects from Supabase
async function loadProjects() {
  if (!projectsGrid) return

  projectsGrid.innerHTML = '<div class="loading">Loading projects...</div>'

  try {
    if (!supabaseClient) {
      throw new Error("Supabase client not initialized")
    }

    // Fetch featured projects from Supabase
    const { data: projects, error } = await supabaseClient
      .from("projects")
      .select("*")
      .eq("featured", true)
      .order("created_at", { ascending: false })

    if (error) throw error

    projectsGrid.innerHTML = ""

    if (!projects || projects.length === 0) {
      projectsGrid.innerHTML = '<div class="loading">No projects found</div>'
      return
    }

    projects.forEach((project) => {
      const projectCard = document.createElement("div")
      projectCard.className = "project-card"

      // Get first image for the project or use placeholder
      const imageUrl =
        project.image_url || `https://via.placeholder.com/600x400?text=${encodeURIComponent(project.title)}`

      projectCard.innerHTML = `
        <img src="${imageUrl}" alt="${project.title}" class="project-image">
        <div class="project-content">
          <div class="project-header">
            <h3 class="project-title">${project.title}</h3>
            <span class="project-category">${project.category}</span>
          </div>
          <p class="project-description">${project.description}</p>
        </div>
        <div class="project-footer">
          <a href="projects/${project.slug}.html" class="button outline">
            View Project <i data-lucide="arrow-right" class="icon"></i>
          </a>
        </div>
      `

      projectsGrid.appendChild(projectCard)
    })

    // Re-initialize Lucide icons
    if (typeof lucide !== "undefined") {
      lucide.createIcons()
    }
  } catch (error) {
    console.error("Error loading projects:", error)
    projectsGrid.innerHTML = '<div class="loading">Error loading projects</div>'
  }
}

// Load experience from Supabase
async function loadExperience() {
  if (!experienceGrid) return

  experienceGrid.innerHTML = '<div class="loading">Loading experience...</div>'

  try {
    if (!supabaseClient) {
      throw new Error("Supabase client not initialized")
    }

    // Fetch experience from Supabase
    const { data: experience, error } = await supabaseClient
      .from("experience")
      .select("*")
      .order("display_order", { ascending: true })

    if (error) throw error

    experienceGrid.innerHTML = ""

    if (!experience || experience.length === 0) {
      experienceGrid.innerHTML = '<div class="loading">No experience found</div>'
      return
    }

    experience.forEach((exp) => {
      const expCard = document.createElement("div")
      expCard.className = "experience-card"

      const endDate = exp.current
        ? "Present"
        : new Date(exp.end_date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
          })

      expCard.innerHTML = `
        <div class="experience-header">
          <h3 class="experience-title">${exp.position}</h3>
          <p class="experience-company">${exp.company}</p>
          <div class="experience-date">
            <i data-lucide="calendar" class="icon"></i>
            ${new Date(exp.start_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
            })} - ${endDate}
          </div>
          ${
            exp.location
              ? `
            <div class="experience-location">
              <i data-lucide="map-pin" class="icon"></i>
              ${exp.location}
            </div>
          `
              : ""
          }
        </div>
        ${
          exp.description
            ? `
          <div class="experience-description">
            <p>${exp.description}</p>
          </div>
        `
            : ""
        }
      `

      experienceGrid.appendChild(expCard)
    })

    // Re-initialize Lucide icons
    if (typeof lucide !== "undefined") {
      lucide.createIcons()
    }
  } catch (error) {
    console.error("Error loading experience:", error)
    experienceGrid.innerHTML = '<div class="loading">Error loading experience</div>'
  }
}

// Load education from Supabase
async function loadEducation() {
  if (!educationGrid) return

  educationGrid.innerHTML = '<div class="loading">Loading education...</div>'

  try {
    if (!supabaseClient) {
      throw new Error("Supabase client not initialized")
    }

    // Fetch education from Supabase
    const { data: education, error } = await supabaseClient
      .from("education")
      .select("*")
      .order("display_order", { ascending: true })

    if (error) throw error

    educationGrid.innerHTML = ""

    if (!education || education.length === 0) {
      educationGrid.innerHTML = '<div class="loading">No education found</div>'
      return
    }

    education.forEach((edu) => {
      const eduCard = document.createElement("div")
      eduCard.className = "education-card"

      const endDate = edu.current
        ? "Present"
        : new Date(edu.end_date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
          })

      eduCard.innerHTML = `
        <div class="education-header">
          <h3 class="education-institution">${edu.institution}</h3>
          <p class="education-degree">${edu.degree} in ${edu.field_of_study}</p>
          <div class="education-date">
            <i data-lucide="calendar" class="icon"></i>
            ${new Date(edu.start_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
            })} - ${endDate}
          </div>
          ${
            edu.location
              ? `
            <div class="education-location">
              <i data-lucide="map-pin" class="icon"></i>
              ${edu.location}
            </div>
          `
              : ""
          }
        </div>
        ${
          edu.description
            ? `
          <div class="education-description">
            <p>${edu.description}</p>
          </div>
        `
            : ""
        }
      `

      educationGrid.appendChild(eduCard)
    })

    // Re-initialize Lucide icons
    if (typeof lucide !== "undefined") {
      lucide.createIcons()
    }
  } catch (error) {
    console.error("Error loading education:", error)
    educationGrid.innerHTML = '<div class="loading">Error loading education</div>'
  }
}

// Load about section from Supabase
async function loadAboutSection() {
  if (!aboutText || !aboutImage) return

  try {
    if (!supabaseClient) {
      throw new Error("Supabase client not initialized")
    }

    // Fetch settings from Supabase
    const { data: settings, error } = await supabaseClient.from("settings").select("*").single()

    if (error && !error.message.includes("No rows found")) throw error

    // Load about text
    if (settings && settings.about_text) {
      aboutText.innerHTML = settings.about_text
        .split("\n")
        .map((paragraph) => `<p>${paragraph}</p>`)
        .join("")
    } else {
      aboutText.innerHTML = '<p class="loading">No about information available</p>'
    }

    // Load about image
    if (settings && settings.profile_image_url) {
      aboutImage.src = settings.profile_image_url
    }
  } catch (error) {
    console.error("Error loading about section:", error)
    aboutText.innerHTML = '<p class="loading">Error loading about information</p>'
  }
}

// Load social links from Supabase
async function loadSocialLinks() {
  if (!socialLinks) return

  try {
    if (!supabaseClient) {
      throw new Error("Supabase client not initialized")
    }

    // Fetch settings from Supabase
    const { data: settings, error } = await supabaseClient.from("settings").select("*").single()

    if (error && !error.message.includes("No rows found")) throw error

    socialLinks.innerHTML = ""

    if (settings) {
      const { instagram_url, behance_url, github_url, linkedin_url } = settings

      if (instagram_url) {
        socialLinks.innerHTML += `
          <a href="${instagram_url}" target="_blank" rel="noopener noreferrer" class="social-link">
            <i data-lucide="instagram" class="icon"></i>
            <span class="sr-only">Instagram</span>
          </a>
        `
      }

      if (behance_url) {
        socialLinks.innerHTML += `
          <a href="${behance_url}" target="_blank" rel="noopener noreferrer" class="social-link">
            <i data-lucide="figma" class="icon"></i>
            <span class="sr-only">Behance</span>
          </a>
        `
      }

      if (github_url) {
        socialLinks.innerHTML += `
          <a href="${github_url}" target="_blank" rel="noopener noreferrer" class="social-link">
            <i data-lucide="github" class="icon"></i>
            <span class="sr-only">GitHub</span>
          </a>
        `
      }

      if (linkedin_url) {
        socialLinks.innerHTML += `
          <a href="${linkedin_url}" target="_blank" rel="noopener noreferrer" class="social-link">
            <i data-lucide="linkedin" class="icon"></i>
            <span class="sr-only">LinkedIn</span>
          </a>
        `
      }
    }

    // Re-initialize Lucide icons
    if (typeof lucide !== "undefined") {
      lucide.createIcons()
    }
  } catch (error) {
    console.error("Error loading social links:", error)
  }
}

// Handle contact form submission
function handleContactForm() {
  if (!contactForm) return

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    // Reset error message
    formError.textContent = ""

    // Get form data
    const name = contactForm.elements.name.value
    const email = contactForm.elements.email.value
    const message = contactForm.elements.message.value

    // Validate form
    if (!name || !email || !message) {
      formError.textContent = "All fields are required"
      return
    }

    // Show loading state
    const submitButton = contactForm.querySelector(".submit-button")
    submitButton.querySelector(".button-text").classList.add("hidden")
    submitButton.querySelector(".button-loading").classList.remove("hidden")
    submitButton.disabled = true

    try {
      if (!supabaseClient) {
        throw new Error("Supabase client not initialized")
      }

      // Submit form to Supabase
      const { error } = await supabaseClient.from("messages").insert([{ name, email, message }])

      if (error) throw error

      // Hide form and show success message
      contactForm.classList.add("hidden")
      formSuccess.classList.remove("hidden")

      // Reset form
      contactForm.reset()
    } catch (error) {
      console.error("Error submitting form:", error)
      formError.textContent = "There was an error submitting your message. Please try again."

      // Reset button state
      submitButton.querySelector(".button-text").classList.remove("hidden")
      submitButton.querySelector(".button-loading").classList.add("hidden")
      submitButton.disabled = false
    }
  })
}

// Reset contact form
function resetContactForm() {
  if (!contactForm || !formSuccess) return

  formSuccess.classList.add("hidden")
  contactForm.classList.remove("hidden")
}

// Initialize theme
function initTheme() {
  const darkThemeSelected = localStorage.getItem("theme") !== null && localStorage.getItem("theme") === "dark"
  themeToggle.checked = darkThemeSelected
  mobileThemeToggle.checked = darkThemeSelected
  if (darkThemeSelected) {
    document.body.setAttribute("data-theme", "dark")
  } else {
    document.body.removeAttribute("data-theme")
  }
}

// Toggle theme
function toggleTheme() {
  if (themeToggle.checked) {
    document.body.setAttribute("data-theme", "dark")
    localStorage.setItem("theme", "dark")
  } else {
    document.body.removeAttribute("data-theme")
    localStorage.removeItem("theme")
  }
  mobileThemeToggle.checked = themeToggle.checked
}

// Handle scroll
function handleScroll() {
  if (window.scrollY > 50) {
    header.classList.add("header-shadow")
  } else {
    header.classList.remove("header-shadow")
  }
}

// Toggle mobile menu
function toggleMobileMenu() {
  mobileMenu.classList.toggle("mobile-menu-open")
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Supabase
  initSupabase()

  // Initialize theme
  initTheme()

  // Add event listeners
  if (themeToggle) themeToggle.addEventListener("click", toggleTheme)
  if (mobileThemeToggle) mobileThemeToggle.addEventListener("click", toggleTheme)
  if (mobileMenuButton) mobileMenuButton.addEventListener("click", toggleMobileMenu)
  if (mobileMenuClose) mobileMenuClose.addEventListener("click", toggleMobileMenu)

  // Handle scroll events
  window.addEventListener("scroll", handleScroll)

  // Load data from Supabase
  loadProjects()
  loadExperience()
  loadEducation()
  loadAboutSection()
  loadSocialLinks()

  // Handle contact form
  handleContactForm()

  // Initialize scroll position
  handleScroll()
})
