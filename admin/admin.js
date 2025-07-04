// DOM Elements
const themeToggle = document.getElementById("admin-theme-toggle")
const loginForm = document.getElementById("login-form")
const loginError = document.getElementById("login-error")

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

// Handle login form submission
async function handleLoginForm() {
  if (!loginForm) return

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    // Reset error message
    loginError.textContent = ""

    // Get form data
    const email = loginForm.elements.email.value
    const password = loginForm.elements.password.value

    // Show loading state
    const submitButton = loginForm.querySelector(".login-button")
    submitButton.querySelector(".button-text").classList.add("hidden")
    submitButton.querySelector(".button-loading").classList.remove("hidden")
    submitButton.disabled = true

    try {
      // Sign in with Supabase
      const result = await window.db.signIn(email, password)

      if (!result.success) {
        throw new Error(result.error || "Invalid email or password")
      }

      // Redirect to dashboard
      window.location.href = "dashboard.html"
    } catch (error) {
      // Show error
      loginError.textContent = error.message

      // Reset button state
      submitButton.querySelector(".button-text").classList.remove("hidden")
      submitButton.querySelector(".button-loading").classList.add("hidden")
      submitButton.disabled = false
    }
  })
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Initialize theme
  initTheme()

  // Add event listeners
  if (themeToggle) themeToggle.addEventListener("click", toggleTheme)

  // Handle login form
  handleLoginForm()
})
