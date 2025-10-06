"use server"

import {
  getAllMatches,
  getMatchById,
  createMatch as createMatchSheet,
  updateMatch as updateMatchSheet,
} from "@/lib/google-sheets"
import { revalidatePath } from "next/cache"
import { verifySession } from "@/lib/auth/session"
import type { Match } from "@/lib/mock-data"

export interface CreateMatchData {
  game: "BGMI" | "Free Fire" | "Clash Royale"
  matchNumber: number
  matchDate: string
  status?: "scheduled" | "in_progress" | "completed" | "cancelled"
}

export async function createMatch(data: CreateMatchData) {
  try {
    const session = await verifySession()

    if (!session || session.role !== "admin") {
      return { success: false, error: "Unauthorized - Admin access required" }
    }

    const matches = await getAllMatches()
    const existingMatch = matches.find((m) => m.game === data.game && m.match_number === data.matchNumber)

    if (existingMatch) {
      return {
        success: false,
        error: `Match ${data.matchNumber} already exists for ${data.game}`,
      }
    }

    const newMatch: Match = {
      id: `match_${Date.now()}`,
      game: data.game,
      match_number: data.matchNumber,
      match_date: data.matchDate,
      status: data.status || "scheduled",
      created_at: new Date().toISOString(),
    }

    const match = await createMatchSheet(newMatch)

    if (!match) {
      return { success: false, error: "Failed to create match" }
    }

    revalidatePath("/admin/matches")
    revalidatePath("/matches")

    return { success: true, data: match }
  } catch (error) {
    console.error("[v0] Create match exception:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function updateMatchStatus(
  matchId: string,
  status: "scheduled" | "in_progress" | "completed" | "cancelled",
) {
  try {
    const session = await verifySession()

    if (!session || session.role !== "admin") {
      return { success: false, error: "Unauthorized - Admin access required" }
    }

    const updatedMatch = await updateMatchSheet(matchId, { status })

    if (!updatedMatch) {
      return { success: false, error: "Failed to update match status" }
    }

    revalidatePath("/admin/matches")
    revalidatePath("/matches")

    return { success: true }
  } catch (error) {
    console.error("[v0] Update match status exception:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getMatches(game?: string) {
  try {
    const matches = await getAllMatches()

    const filteredMatches = game ? matches.filter((m) => m.game === game) : matches

    return { success: true, data: filteredMatches }
  } catch (error) {
    console.error("[v0] Get matches exception:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getMatchWithResults(matchId: string) {
  try {
    const match = await getMatchById(matchId)

    if (!match) {
      return { success: false, error: "Match not found" }
    }

    const results: any[] = []

    return {
      success: true,
      data: {
        match,
        results,
      },
    }
  } catch (error) {
    console.error("[v0] Get match with results exception:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function deleteMatch(matchId: string) {
  try {
    const session = await verifySession()

    if (!session || session.role !== "admin") {
      return { success: false, error: "Unauthorized - Admin access required" }
    }

    // TODO: Implement delete in Google Sheets

    revalidatePath("/admin/matches")
    revalidatePath("/matches")

    return { success: true }
  } catch (error) {
    console.error("[v0] Delete match exception:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
