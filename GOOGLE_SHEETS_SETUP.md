# Google Sheets Setup Guide

This app now uses Google Sheets as its database. Follow these steps to set it up:

## 1. Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "GameVerse 2025 Tournament"
4. Copy the Spreadsheet ID from the URL (the long string between `/d/` and `/edit`)

## 2. Create Required Sheets

Create the following sheets (tabs) in your spreadsheet:

### Teams Sheet
Columns: `id`, `team_name`, `college`, `game`, `captain_name`, `captain_email`, `captain_phone`, `player_names`, `total_points`, `matches_played`, `wins`, `created_at`

### Matches Sheet
Columns: `id`, `game`, `match_number`, `match_date`, `status`, `created_at`

### MatchResults Sheet
Columns: `id`, `match_id`, `team_id`, `placement`, `kills`, `points`, `screenshot_url`, `verified`, `created_at`

### AdminUsers Sheet
Columns: `id`, `email`, `created_at`

## 3. Set Up Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API
4. Create a Service Account:
   - Go to "IAM & Admin" > "Service Accounts"
   - Click "Create Service Account"
   - Give it a name and description
   - Grant it "Editor" role
   - Create a JSON key and download it

## 4. Share Your Sheet

1. Open your Google Sheet
2. Click "Share" in the top right
3. Add the service account email (from the JSON key) as an Editor

## 5. Set Environment Variables

Add these to your Vercel project or `.env.local`:

\`\`\`
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_SHEETS_API_KEY={"type":"service_account","project_id":"..."}
\`\`\`

The `GOOGLE_SHEETS_API_KEY` should be the entire contents of your service account JSON key file (as a single-line string).

## 6. Add Sample Data

You can manually add rows to your sheets, or the app will fall back to mock data if the sheets are empty.

## Notes

- The app automatically falls back to mock data if Google Sheets is not configured
- Make sure your service account has edit permissions on the sheet
- The `player_names` column should contain JSON arrays (e.g., `["Player 1","Player 2"]`)
- The `verified` column in MatchResults should be `true` or `false`
