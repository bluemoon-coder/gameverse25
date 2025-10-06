import { readSheet, appendSheet, updateRow, SHEET_NAMES, rowsToObjects, objectToRow } from "./client"
import { type Match, mockMatches } from "../mock-data"

const MATCH_HEADERS = ["id", "game", "match_number", "match_date", "status", "created_at"]

export async function getAllMatches(): Promise<Match[]> {
  const rows = await readSheet(SHEET_NAMES.MATCHES)

  if (!rows) {
    console.log("[v0] Using mock matches data")
    return mockMatches
  }

  const matches = rowsToObjects<any>(rows, MATCH_HEADERS)

  return matches.map((match) => ({
    ...match,
    match_number: Number.parseInt(match.match_number) || 0,
  }))
}

export async function getMatchById(id: string): Promise<Match | null> {
  const matches = await getAllMatches()
  return matches.find((m) => m.id === id) || null
}

export async function getUpcomingMatches(): Promise<Match[]> {
  const matches = await getAllMatches()
  return matches
    .filter((m) => m.status === "scheduled" || m.status === "in_progress")
    .sort((a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime())
    .slice(0, 3)
}

export async function createMatch(match: Match): Promise<Match | null> {
  const matchRow = objectToRow(match, MATCH_HEADERS)
  const result = await appendSheet(SHEET_NAMES.MATCHES, [matchRow])

  if (!result) {
    console.error("[v0] Failed to create match")
    return null
  }

  return match
}

export async function updateMatch(id: string, updates: Partial<Match>): Promise<Match | null> {
  const matches = await getAllMatches()
  const matchIndex = matches.findIndex((m) => m.id === id)

  if (matchIndex === -1) {
    return null
  }

  const updatedMatch = { ...matches[matchIndex], ...updates }
  const matchRow = objectToRow(updatedMatch, MATCH_HEADERS)

  await updateRow(SHEET_NAMES.MATCHES, matchIndex + 2, matchRow)

  return updatedMatch
}

export async function getMatchesByGame(game: string): Promise<Match[]> {
  const matches = await getAllMatches()
  return matches.filter((m) => m.game === game)
}
