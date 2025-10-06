// Export all Google Sheets functions
export * from "./teams"
export * from "./matches"
export * from "./results"
export * from "./client"
export * from "./users"
export * from "./settings"

import * as teams from "./teams"
import * as matches from "./matches"
import * as results from "./results"
import * as users from "./users"
import * as settings from "./settings"

export const sheetsDB = {
  teams,
  matches,
  results,
  users,
  settings,
}
