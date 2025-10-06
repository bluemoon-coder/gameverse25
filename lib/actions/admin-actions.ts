"use server"

import { getAllTeams, getAllMatches, getAllResults, deleteTeam as deleteTeamSheet } from "@/lib/google-sheets"
import { revalidatePath } from "next/cache"
import { verifySession } from "@/lib/auth/session"

export async function checkAdminStatus() {
  try {
    const session = await verifySession()

    return {
      success: true,
      isAdmin: session?.role === "admin",
      user: session || null,
    }
  } catch (error) {
    console.error("[v0] Check admin status exception:", error)
    return { success: false, isAdmin: false }
  }
}

export async function getAdminStats() {
  try {
    const session = await verifySession()

    if (!session || session.role !== "admin") {
      return { success: false, error: "Unauthorized - Admin access required" }
    }

    const [teams, matches, results] = await Promise.all([getAllTeams(), getAllMatches(), getAllResults()])

    const pendingResults = results.filter((r) => !r.verified)
    const verifiedResults = results.filter((r) => r.verified)

    return {
      success: true,
      data: {
        totalTeams: teams.length,
        totalMatches: matches.length,
        pendingResults: pendingResults.length,
        verifiedResults: verifiedResults.length,
      },
    }
  } catch (error) {
    console.error("[v0] Get admin stats exception:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getAllTeamsAdmin() {
  try {
    const session = await verifySession()

    if (!session || session.role !== "admin") {
      return { success: false, error: "Unauthorized - Admin access required" }
    }

    const teams = await getAllTeams()

    return { success: true, data: teams }
  } catch (error) {
    console.error("[v0] Get all teams exception:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function deleteTeam(teamId: string) {
  try {
    const session = await verifySession()

    if (!session || session.role !== "admin") {
      return { success: false, error: "Unauthorized - Admin access required" }
    }

    await deleteTeamSheet(teamId)

    revalidatePath("/admin/teams")
    revalidatePath("/leaderboard")

    return { success: true }
  } catch (error) {
    console.error("[v0] Delete team exception:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
