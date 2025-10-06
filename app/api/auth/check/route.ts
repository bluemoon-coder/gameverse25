import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/actions/auth-actions"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({
      authenticated: true,
      role: user.role,
      name: user.name,
      email: user.email,
    })
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
