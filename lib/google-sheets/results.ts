import { readSheet, appendSheet, updateRow, SHEET_NAMES, rowsToObjects, objectToRow } from "./client"
import { type MatchResult, mockMatchResults } from "../mock-data"

const RESULT_HEADERS = [
  "id",
  "match_id",
  "team_id",
  "placement",
  "kills",
  "points",
  "screenshot_url",
  "verified",
  "created_at",
]

export async function getAllResults(): Promise<MatchResult[]> {
  const rows = await readSheet(SHEET_NAMES.MATCH_RESULTS)

  if (!rows) {
    console.log("[v0] Using mock results data")
    return mockMatchResults
  }

  const results = rowsToObjects<any>(rows, RESULT_HEADERS)

  return results.map((result) => ({
    ...result,
    placement: Number.parseInt(result.placement) || 0,
    kills: Number.parseInt(result.kills) || 0,
    points: Number.parseInt(result.points) || 0,
    verified: result.verified === "true" || result.verified === true,
  }))
}

export async function getResultsByMatchId(matchId: string): Promise<MatchResult[]> {
  const results = await getAllResults()
  return results.filter((r) => r.match_id === matchId)
}

export async function getResultsByTeamId(teamId: string): Promise<MatchResult[]> {
  const results = await getAllResults()
  return results.filter((r) => r.team_id === teamId)
}

export async function createResult(result: MatchResult): Promise<MatchResult | null> {
  const resultRow = objectToRow(
    {
      ...result,
      verified: result.verified.toString(),
    },
    RESULT_HEADERS,
  )

  const response = await appendSheet(SHEET_NAMES.MATCH_RESULTS, [resultRow])

  if (!response) {
    console.error("[v0] Failed to create result")
    return null
  }

  return result
}

export async function updateResult(id: string, updates: Partial<MatchResult>): Promise<MatchResult | null> {
  const results = await getAllResults()
  const resultIndex = results.findIndex((r) => r.id === id)

  if (resultIndex === -1) {
    return null
  }

  const updatedResult = { ...results[resultIndex], ...updates }
  const resultRow = objectToRow(
    {
      ...updatedResult,
      verified: updatedResult.verified.toString(),
    },
    RESULT_HEADERS,
  )

  await updateRow(SHEET_NAMES.MATCH_RESULTS, resultIndex + 2, resultRow)

  return updatedResult
}

export async function getUnverifiedResultsCount(): Promise<number> {
  const results = await getAllResults()
  return results.filter((r) => !r.verified).length
}
