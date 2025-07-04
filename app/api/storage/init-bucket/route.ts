import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // This is now a no-op since we're not using storage buckets
    return NextResponse.json({
      success: true,
      message: "Storage initialization skipped - using direct URLs instead",
      exists: true,
    })
  } catch (error) {
    console.error("Error in init-bucket API:", error)
    return NextResponse.json(
      { success: false, message: `Server error: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}

