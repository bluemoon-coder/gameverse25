import { readSheet, appendSheet, updateRow, writeSheet, SHEET_NAMES, rowsToObjects, objectToRow } from "./client"
import { type Team, mockTeams } from "../mock-data"

const TEAM_HEADERS = [
  "id",
  "team_name",
  "college",
  "game",
  "captain_name",
  "captain_email",
  "captain_phone",
  "player_names",
  "total_points",
  "matches_played",
  "wins",
  "created_at",
]

export async function getAllTeams(): Promise<Team[]> {
  const rows = await readSheet(SHEET_NAMES.TEAMS)

  if (!rows) {
    console.log("[v0] Using mock teams data")
    return mockTeams
  }

  const teams = rowsToObjects<any>(rows, TEAM_HEADERS)

  return teams.map((team) => ({
    ...team,
    player_names: team.player_names ? JSON.parse(team.player_names) : [],
    total_points: Number.parseInt(team.total_points) || 0,
    matches_played: Number.parseInt(team.matches_played) || 0,
    wins: Number.parseInt(team.wins) || 0,
  }))
}

export async function getTeamById(id: string): Promise<Team | null> {
  const teams = await getAllTeams()
  return teams.find((t) => t.id === id) || null
}

export async function getTeamsByGame(game: string): Promise<Team[]> {
  const teams = await getAllTeams()
  return teams.filter((t) => t.game === game)
}

export async function createTeam(team: Team): Promise<Team | null> {
  const teamRow = objectToRow(
    {
      ...team,
      player_names: JSON.stringify(team.player_names),
    },
    TEAM_HEADERS,
  )

  const result = await appendSheet(SHEET_NAMES.TEAMS, [teamRow])

  if (!result) {
    console.error("[v0] Failed to create team")
    return null
  }

  return team
}

export async function updateTeam(id: string, updates: Partial<Team>): Promise<Team | null> {
  const teams = await getAllTeams()
  const teamIndex = teams.findIndex((t) => t.id === id)

  if (teamIndex === -1) {
    return null
  }

  const updatedTeam = { ...teams[teamIndex], ...updates }
  const teamRow = objectToRow(
    {
      ...updatedTeam,
      player_names: JSON.stringify(updatedTeam.player_names),
    },
    TEAM_HEADERS,
  )

  // Row index is teamIndex + 2 (1 for 0-based to 1-based, 1 for header row)
  await updateRow(SHEET_NAMES.TEAMS, teamIndex + 2, teamRow)

  return updatedTeam
}

export async function deleteTeam(id: string): Promise<boolean> {
  const teams = await getAllTeams()
  const teamIndex = teams.findIndex((t) => t.id === id)

  if (teamIndex === -1) {
    return false
  }

  // Filter out the team to delete
  const updatedTeams = teams.filter((t) => t.id !== id)

  // Convert all teams back to rows
  const rows = [
    TEAM_HEADERS,
    ...updatedTeams.map((team) =>
      objectToRow(
        {
          ...team,
          player_names: JSON.stringify(team.player_names),
        },
        TEAM_HEADERS,
      ),
    ),
  ]

  // Write back to sheet
  await writeSheet(SHEET_NAMES.TEAMS, rows)

  return true
}
