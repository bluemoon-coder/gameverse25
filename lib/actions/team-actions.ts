"use server"

import { getAllTeams, createTeam } from "@/lib/google-sheets"
import { revalidatePath } from "next/cache"
import type { Team } from "@/lib/mock-data"

export interface TeamRegistrationData {
  teamName: string
  collegeName: string
  game: "BGMI" | "Free Fire" | "Clash Royale"
  captainName: string
  captainEmail: string
  captainPhone: string
  player2Name?: string
  player2Email?: string
  player3Name?: string
  player3Email?: string
  player4Name?: string
  player4Email?: string
  player5Name?: string
  player5Email?: string
}

export async function registerTeam(data: TeamRegistrationData) {
  try {
    // Check if team name already exists
    const existingTeams = await getAllTeams()
    const teamExists = existingTeams.some((t) => t.team_name === data.teamName)

    if (teamExists) {
      return {
        success: false,
        error: "Team name already exists. Please choose a different name.",
      }
    }

    // Create new team
    const newTeam: Team = {
      id: `team_${Date.now()}`,
      team_name: data.teamName,
      college_name: data.collegeName,
      game: data.game,
      captain_name: data.captainName,
      captain_email: data.captainEmail,
      captain_phone: data.captainPhone,
      player_2_name: data.player2Name || null,
      player_2_email: data.player2Email || null,
      player_3_name: data.player3Name || null,
      player_3_email: data.player3Email || null,
      player_4_name: data.player4Name || null,
      player_4_email: data.player4Email || null,
      player_5_name: data.player5Name || null,
      player_5_email: data.player5Email || null,
      total_points: 0,
      matches_played: 0,
      wins: 0,
      created_at: new Date().toISOString(),
    }

    const team = await createTeam(newTeam)

    if (!team) {
      return {
        success: false,
        error: "Failed to register team. Please try again.",
      }
    }

    revalidatePath("/register")
    revalidatePath("/teams")

    return {
      success: true,
      data: team,
    }
  } catch (error) {
    console.error("[v0] Team registration exception:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    }
  }
}

export async function getTeamsByGame(game: string) {
  try {
    const teams = await getAllTeams()
    const filteredTeams = teams.filter((t) => t.game === game)

    return { success: true, data: filteredTeams }
  } catch (error) {
    console.error("[v0] Get teams exception:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
