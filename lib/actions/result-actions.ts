"use server"

import { getAllResults, createResult, updateResult as updateResultSheet } from "@/lib/google-sheets"
import { getMatchById } from "@/lib/google-sheets"
import { revalidatePath } from "next/cache"
import { verifySession } from "@/lib/auth/session"
import type { MatchResult } from "@/lib/mock-data"

export interface SubmitResultData {
  matchId: string
  teamId: string
  kills: number
  placement: number
  screenshotUrl?: string
}

export async function submitMatchResult(data: SubmitResultData) {
  try {
    const match = await getMatchById(data.matchId)

    if (!match) {
      return { success: false, error: "Match not found" }
    }

    // Calculate points based on game type
    const totalPoints = calculatePoints(match.game, data.placement, data.kills)

    // Check if result already exists
    const results = await getAllResults()
    const existingResult = results.find((r) => r.match_id === data.matchId && r.team_id === data.teamId)

    let result: MatchResult

    if (existingResult) {
      // Update existing result
      result = {
        ...existingResult,
        kills: data.kills,
        placement: data.placement,
        total_points: totalPoints,
        screenshot_url: data.screenshotUrl || null,
        verified: false,
        updated_at: new Date().toISOString(),
      }

      await updateResultSheet(existingResult.id, result)
    } else {
      // Insert new result
      result = {
        id: `result_${Date.now()}`,
        match_id: data.matchId,
        team_id: data.teamId,
        kills: data.kills,
        placement: data.placement,
        total_points: totalPoints,
        screenshot_url: data.screenshotUrl || null,
        verified: false,
        created_at: new Date().toISOString(),
      }

      await createResult(result)
    }

    revalidatePath(`/matches/${data.matchId}`)
    revalidatePath("/admin/results")

    return { success: true, data: result }
  } catch (error) {
    console.error("[v0] Submit result exception:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

function calculatePoints(game: string, placement: number, kills: number): number {
  // Simple point calculation - adjust based on your rules
  const placementPoints = Math.max(0, 25 - placement)
  const killPoints = kills * 1
  return placementPoints + killPoints
}

export async function verifyMatchResult(resultId: string, verified: boolean) {
  try {
    const session = await verifySession()

    if (!session || session.role !== "admin") {
      return { success: false, error: "Unauthorized - Admin access required" }
    }

    const results = await getAllResults()
    const result = results.find((r) => r.id === resultId)

    if (!result) {
      return { success: false, error: "Result not found" }
    }

    const updatedResult = {
      ...result,
      verified,
      verified_at: verified ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }

    await updateResultSheet(resultId, updatedResult)

    revalidatePath("/admin/results")

    return { success: true }
  } catch (error) {
    console.error("[v0] Verify result exception:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function updateMatchResult(resultId: string, kills: number, placement: number) {
  try {
    const session = await verifySession()

    if (!session || session.role !== "admin") {
      return { success: false, error: "Unauthorized - Admin access required" }
    }

    const results = await getAllResults()
    const result = results.find((r) => r.id === resultId)

    if (!result) {
      return { success: false, error: "Result not found" }
    }

    const match = await getMatchById(result.match_id)

    if (!match) {
      return { success: false, error: "Match not found" }
    }

    const totalPoints = calculatePoints(match.game, placement, kills)

    const updatedResult = {
      ...result,
      kills,
      placement,
      total_points: totalPoints,
      updated_at: new Date().toISOString(),
    }

    await updateResultSheet(resultId, updatedResult)

    revalidatePath("/admin/results")

    return { success: true }
  } catch (error) {
    console.error("[v0] Update result exception:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getPendingResults() {
  try {
    const session = await verifySession()

    if (!session || session.role !== "admin") {
      return { success: false, error: "Unauthorized - Admin access required" }
    }

    const results = await getAllResults()
    const pendingResults = results.filter((r) => !r.verified)

    return { success: true, data: pendingResults }
  } catch (error) {
    console.error("[v0] Get pending results exception:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
