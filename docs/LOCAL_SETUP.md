# Local Development Setup Guide

Complete guide to set up GameVerse '25 on your local machine.

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- A code editor (VS Code recommended)
- Git installed

## Step 1: Clone the Repository

\`\`\`bash
git clone <your-repository-url>
cd gameverse25
\`\`\`

## Step 2: Install Dependencies

\`\`\`bash
npm install
# or
yarn install
\`\`\`

This will install all required packages including Next.js, React, Tailwind CSS, and other dependencies.

## Step 3: Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`bash
cp .env.example .env.local
\`\`\`

### Required Variables

\`\`\`env
# Authentication (REQUIRED)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
\`\`\`

### Optional Variables (for Google Sheets integration)

\`\`\`env
# Google Sheets Integration (Optional - uses mock data if not set)
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id-here
GOOGLE_SHEETS_API_KEY=your-google-api-key-here
\`\`\`

**Note**: If you don't set up Google Sheets, the app will automatically use mock data for development.

## Step 4: Generate JWT Secret

For the `JWT_SECRET`, generate a secure random string:

\`\`\`bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use an online generator
# https://generate-secret.vercel.app/32
\`\`\`

Copy the generated string and paste it as your `JWT_SECRET` value.

## Step 5: Run Development Server

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

The app will start at `http://localhost:3000`

## Step 6: Test the Application

### Using Mock Data (Default)

The app comes with pre-populated mock data including:
- Sample teams from different colleges
- Scheduled matches for all three games
- Leaderboard rankings
- Mock user accounts

### Default Test Accounts

**Admin Account:**
\`\`\`
Email: admin@gameverse.com
Password: admin123
\`\`\`

**Player Account:**
\`\`\`
Email: player@college.edu
Password: player123
\`\`\`

### Test the Features

1. **Homepage** (`/`) - View tournament overview and stats
2. **Login** (`/login`) - Test authentication with mock accounts
3. **Player Dashboard** (`/dashboard`) - View team stats and matches
4. **Admin Panel** (`/admin`) - Manage tournaments (admin account required)
5. **Leaderboard** (`/leaderboard`) - View rankings
6. **Tournament Bracket** (`/bracket`) - View Clash Royale bracket

## Step 7: Optional - Set Up Google Sheets

If you want to use real data storage instead of mock data, follow the [Google Sheets Setup Guide](./GOOGLE_SHEETS_SETUP.md).

## Development Tips

### Hot Reload

Next.js supports hot module replacement. Changes to your code will automatically refresh the browser.

### Debugging

Use the browser console to see debug logs. The app uses `console.log("[v0] ...")` for debugging.

### Mobile Testing

Test mobile responsiveness:
1. Open Chrome DevTools (F12)
2. Click the device toolbar icon (Ctrl+Shift+M)
3. Select a mobile device preset

Or test on your actual phone:
1. Find your local IP address
2. Access `http://YOUR_IP:3000` from your phone
3. Make sure both devices are on the same network

### Code Structure

\`\`\`
app/                 # Pages and routes
components/          # Reusable React components
lib/                 # Business logic and utilities
  ├── actions/      # Server actions
  ├── auth/         # Authentication
  └── google-sheets/ # Data layer
\`\`\`

## Common Issues

### Port Already in Use

If port 3000 is already in use:

\`\`\`bash
# Use a different port
npm run dev -- -p 3001
\`\`\`

### Module Not Found Errors

\`\`\`bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
\`\`\`

### Environment Variables Not Loading

- Restart the development server after changing `.env.local`
- Make sure the file is named exactly `.env.local`
- Check that variables don't have quotes around values

## Next Steps

- [Deploy to Vercel](./VERCEL_DEPLOYMENT.md)
- [Set up Google Sheets](./GOOGLE_SHEETS_SETUP.md)
- [Learn about Admin features](./ADMIN_GUIDE.md)
- [Customize the app](#customization)

## Customization

### Change Branding

Edit `app/layout.tsx` to change the site title and metadata.

### Add More Games

1. Update game types in `lib/mock-data.ts`
2. Add game-specific logic in result calculation
3. Update UI components to display new games

### Modify Scoring

Edit the point calculation logic in `lib/google-sheets/results.ts`

## Getting Help

- Check the [main README](../README.md)
- Review other documentation in `/docs`
- Open an issue on GitHub
