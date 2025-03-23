document.addEventListener("DOMContentLoaded", () => {
  // Theme toggle functionality
  const themeToggle = document.getElementById("theme-toggle")

  // Function to set theme
  function setTheme(themeName) {
    localStorage.setItem("theme", themeName)
    document.documentElement.classList.toggle("dark", themeName === "dark")

    // Update aria-label
    themeToggle.setAttribute("aria-label", `Switch to ${themeName === "dark" ? "light" : "dark"} theme`)

    // Log for debugging
    console.log(`Theme set to: ${themeName}`)
  }

  // Initialize theme based on local storage or system preference
  function initTheme() {
    // Check if theme is stored in localStorage
    const storedTheme = localStorage.getItem("theme")

    if (storedTheme) {
      setTheme(storedTheme)
    } else {
      // Check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setTheme(prefersDark ? "dark" : "light")
    }
  }

  // Toggle theme when button is clicked
  themeToggle.addEventListener("click", () => {
    const currentTheme =
      localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")

    const newTheme = currentTheme === "dark" ? "light" : "dark"
    setTheme(newTheme)
  })

  // Initialize theme on page load
  initTheme()

  // Listen for system theme changes
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      setTheme(e.matches ? "dark" : "light")
    }
  })
})

