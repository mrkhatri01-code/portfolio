import { createServerSupabaseClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Get the user
    const {
      data: { users },
      error: getUserError,
    } = await supabase.auth.admin.listUsers({
      filter: {
        email: email,
      },
    })

    if (getUserError || !users || users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user = users[0]

    // Update the user to confirm their email
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, { email_confirm: true })

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error confirming user:", error)
    return NextResponse.json({ error: "Failed to confirm user" }, { status: 500 })
  }
}
