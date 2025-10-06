import { google } from "googleapis"

// Google Sheets configuration
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || ""
const SHEETS_API_KEY = process.env.GOOGLE_SHEETS_API_KEY || ""

// Sheet names
export const SHEET_NAMES = {
  TEAMS: "Teams",
  MATCHES: "Matches",
  MATCH_RESULTS: "MatchResults",
  ADMIN_USERS: "AdminUsers",
}

// Initialize Google Sheets API client
export function getSheetsClient() {
  if (!SHEETS_API_KEY) {
    console.warn("[v0] Google Sheets API key not found, using mock data")
    return null
  }

  const auth = new google.auth.GoogleAuth({
    credentials: SHEETS_API_KEY ? JSON.parse(SHEETS_API_KEY) : undefined,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })

  return google.sheets({ version: "v4", auth })
}

// Helper to convert sheet rows to objects
export function rowsToObjects<T>(rows: any[][], headers: string[]): T[] {
  if (!rows || rows.length === 0) return []

  return rows.slice(1).map((row) => {
    const obj: any = {}
    headers.forEach((header, index) => {
      obj[header] = row[index] || ""
    })
    return obj as T
  })
}

// Helper to convert object to row
export function objectToRow(obj: any, headers: string[]): any[] {
  return headers.map((header) => obj[header] || "")
}

// Read data from a sheet
export async function readSheet(sheetName: string) {
  const sheets = getSheetsClient()

  if (!sheets || !SPREADSHEET_ID) {
    return null
  }

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:Z`,
    })

    return response.data.values || []
  } catch (error) {
    console.error(`[v0] Error reading sheet ${sheetName}:`, error)
    return null
  }
}

// Write data to a sheet
export async function writeSheet(sheetName: string, values: any[][]) {
  const sheets = getSheetsClient()

  if (!sheets || !SPREADSHEET_ID) {
    return null
  }

  try {
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:Z`,
      valueInputOption: "RAW",
      requestBody: {
        values,
      },
    })

    return response.data
  } catch (error) {
    console.error(`[v0] Error writing to sheet ${sheetName}:`, error)
    return null
  }
}

// Append data to a sheet
export async function appendSheet(sheetName: string, values: any[][]) {
  const sheets = getSheetsClient()

  if (!sheets || !SPREADSHEET_ID) {
    return null
  }

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:Z`,
      valueInputOption: "RAW",
      requestBody: {
        values,
      },
    })

    return response.data
  } catch (error) {
    console.error(`[v0] Error appending to sheet ${sheetName}:`, error)
    return null
  }
}

// Update a specific row
export async function updateRow(sheetName: string, rowIndex: number, values: any[]) {
  const sheets = getSheetsClient()

  if (!sheets || !SPREADSHEET_ID) {
    return null
  }

  try {
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A${rowIndex}:Z${rowIndex}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [values],
      },
    })

    return response.data
  } catch (error) {
    console.error(`[v0] Error updating row in sheet ${sheetName}:`, error)
    return null
  }
}

export const getGoogleSheetsClient = getSheetsClient
export const getSheetData = readSheet
export const appendSheetData = appendSheet
export const updateSheetData = writeSheet
