"use server"

import { createSession, deleteSession, getSession } from "@/lib/auth/session"
import { getUserByEmail, createUser } from "@/lib/google-sheets/users"
import { redirect } from "next/navigation"
import { mockUsers } from "@/lib/mock-data"

// Simple password hashing (in production, use bcrypt)
async function hashPassword(password: string): Promise<string> {
  // For demo purposes, we'll use a simple hash
  // In production, use bcrypt or similar
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const hash = await hashPassword(password)
  return hash === hashedPassword
}

export async function login(email: string, password: string) {
  try {
    // Try to get user from Google Sheets
    const user = await getUserByEmail(email)

    // Fallback to mock users if Google Sheets not configured
    if (!user) {
      const mockUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())
      if (mockUser && mockUser.password === password) {
        await createSession({
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
          teamId: mockUser.teamId,
          college: mockUser.college,
        })
        return { success: true }
      }
      return { success: false, error: "Invalid email or password" }
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return { success: false, error: "Invalid email or password" }
    }

    // Create session
    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      teamId: user.teamId,
      college: user.college,
    })

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "An error occurred during login" }
  }
}

export async function register(email: string, password: string, name: string, college: string, teamId?: string) {
  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return { success: false, error: "Email already registered" }
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await createUser({
      email,
      password: hashedPassword,
      name,
      role: "player",
      teamId,
      college,
    })

    // Create session
    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      teamId: user.teamId,
      college: user.college,
    })

    return { success: true }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, error: "An error occurred during registration" }
  }
}

export async function logout() {
  await deleteSession()
  redirect("/login")
}

export async function getCurrentUser() {
  return await getSession()
}
