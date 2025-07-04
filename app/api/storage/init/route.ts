import { initializeStorage } from "@/app/actions/file-actions"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await initializeStorage()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error initializing storage:", error)
    return NextResponse.json(
      { success: false, message: "Failed to initialize storage", error: String(error) },
      { status: 500 },
    )
  }
}
