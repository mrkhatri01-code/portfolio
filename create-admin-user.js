// This is a script to create an admin user in Supabase
// You can run this in your browser console while on your Supabase dashboard

// Replace these with your desired admin credentials
const adminEmail = "admin@example.com"
const adminPassword = "your-secure-password"

// Get the current project's API key and URL from the page
const apiKey = document.querySelector('meta[name="supabase-key"]')?.content
const apiUrl = document.querySelector('meta[name="supabase-url"]')?.content

if (!apiKey || !apiUrl) {
  console.error("Could not find Supabase API key or URL on this page")
  console.error("Please run this script on your Supabase dashboard")
  throw new Error("Missing Supabase credentials")
}

// Create a Supabase client
const supabase = supabase.createClient(apiUrl, apiKey)

// Create the admin user
async function createAdminUser() {
  try {
    // Check if user already exists
    const {
      data: { users },
      error: getUsersError,
    } = await supabase.auth.admin.listUsers()

    if (getUsersError) {
      throw getUsersError
    }

    const existingUser = users.find((user) => user.email === adminEmail)

    if (existingUser) {
      console.log("Admin user already exists:", existingUser)
      return
    }

    // Create the user
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
    })

    if (error) {
      throw error
    }

    console.log("Admin user created successfully:", data)
  } catch (error) {
    console.error("Error creating admin user:", error)
  }
}

// Run the function
createAdminUser()

