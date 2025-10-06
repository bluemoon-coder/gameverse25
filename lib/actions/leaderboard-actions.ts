"use server"

import { getAllTeams, getAllResults } from "@/lib/google-sheets"

export async function getOverallLeaderboard() {
  try {
    const teams = await getAllTeams()

    const sortedTeams = teams.sort((a, b) => (b.total_points || 0) - (a.total_points || 0)).slice(0, 100)

    return { success: true, data: sortedTeams }
  } catch (error) {
    console.error("[v0] Get overall leaderboard exception:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getGameLeaderboard(game: "BGMI" | "Free Fire" | "Clash Royale") {
  try {
    const teams = await getAllTeams()

    const gameTeams = teams
      .filter((t) => t.game === game)
      .sort((a, b) => (b.total_points || 0) - (a.total_points || 0))
      .slice(0, 50)

    return { success: true, data: gameTeams }
  } catch (error) {
    console.error("[v0] Get game leaderboard exception:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getCollegeLeaderboard() {
  try {
    const teams = await getAllTeams()

    // Aggregate points by college
    const collegeMap = new Map<string, { college_name: string; total_points: number; team_count: number }>()

    teams.forEach((team) => {
      const existing = collegeMap.get(team.college_name) || {
        college_name: team.college_name,
        total_points: 0,
        team_count: 0,
      }

      collegeMap.set(team.college_name, {
        college_name: team.college_name,
        total_points: existing.total_points + (team.total_points || 0),
        team_count: existing.team_count + 1,
      })
    })

    const collegeLeaderboard = Array.from(collegeMap.values()).sort((a, b) => b.total_points - a.total_points)

    return { success: true, data: collegeLeaderboard }
  } catch (error) {
    console.error("[v0] Get college leaderboard exception:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getTeamStats(teamId: string) {
  try {
    const teams = await getAllTeams()
    const team = teams.find((t) => t.id === teamId)

    if (!team) {
      return { success: false, error: "Team not found" }
    }

    const results = await getAllResults()
    const teamResults = results.filter((r) => r.team_id === teamId && r.verified)

    const stats = {
      totalMatches: teamResults.length,
      totalKills: teamResults.reduce((sum, r) => sum + (r.kills || 0), 0),
      totalPoints: team.total_points || 0,
      avgKills: teamResults.length
        ? (teamResults.reduce((sum, r) => sum + (r.kills || 0), 0) / teamResults.length).toFixed(1)
        : "0",
      avgPlacement: teamResults.length
        ? (teamResults.reduce((sum, r) => sum + (r.placement || 0), 0) / teamResults.length).toFixed(1)
        : "0",
      bestPlacement: teamResults.length ? Math.min(...teamResults.map((r) => r.placement || 999)) : 0,
    }

    return {
      success: true,
      data: {
        team,
        results: teamResults,
        stats,
      },
    }
  } catch (error) {
    console.error("[v0] Get team stats exception:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
