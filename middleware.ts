import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Always allow access to admin routes
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
