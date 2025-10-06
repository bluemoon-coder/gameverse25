import { getGoogleSheetsClient } from "./client"

export interface AppSettings {
  screenshotUploadEnabled: boolean
  manualEntryEnabled: boolean
  autoVerifyResults: boolean
}

export async function getAppSettings(): Promise<AppSettings> {
  const client = getGoogleSheetsClient()

  if (!client) {
    // Return default settings in mock mode
    return {
      screenshotUploadEnabled: true,
      manualEntryEnabled: true,
      autoVerifyResults: false,
    }
  }

  try {
    const response = await client.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID!,
      range: "Settings!A2:C2",
    })

    const row = response.data.values?.[0]

    if (!row) {
      // Return defaults if no settings found
      return {
        screenshotUploadEnabled: true,
        manualEntryEnabled: true,
        autoVerifyResults: false,
      }
    }

    return {
      screenshotUploadEnabled: row[0] === "TRUE",
      manualEntryEnabled: row[1] === "TRUE",
      autoVerifyResults: row[2] === "TRUE",
    }
  } catch (error) {
    console.error("[v0] Error fetching settings:", error)
    // Return defaults on error
    return {
      screenshotUploadEnabled: true,
      manualEntryEnabled: true,
      autoVerifyResults: false,
    }
  }
}

export async function updateAppSettings(settings: AppSettings): Promise<boolean> {
  const client = getGoogleSheetsClient()

  if (!client) {
    console.log("[v0] Mock mode: Settings update simulated")
    return true
  }

  try {
    await client.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID!,
      range: "Settings!A2:C2",
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [
            settings.screenshotUploadEnabled ? "TRUE" : "FALSE",
            settings.manualEntryEnabled ? "TRUE" : "FALSE",
            settings.autoVerifyResults ? "TRUE" : "FALSE",
          ],
        ],
      },
    })

    return true
  } catch (error) {
    console.error("[v0] Error updating settings:", error)
    return false
  }
}
