# GameVerse '25 - Tournament Management System

A comprehensive tournament management platform for BGMI, Free Fire, and Clash Royale competitions. Built with Next.js 15, featuring real-time leaderboards, match scheduling, result submission, and admin controls.

## Features

- **Multi-Game Support**: BGMI, Free Fire, and Clash Royale tournaments
- **Authentication System**: Separate login for players and admins with JWT-based sessions
- **Player Dashboard**: View team stats, upcoming matches, and performance history
- **Admin Panel**: Manage teams, matches, results, and app settings
- **Tournament Bracket**: Visual bracket system for Clash Royale tournaments
- **Result Submission**: Screenshot upload or manual entry options
- **Leaderboard**: Real-time rankings across all games and colleges
- **Mobile-First Design**: Optimized for mobile devices with responsive navigation

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Authentication**: JWT with HTTP-only cookies
- **Data Storage**: Google Sheets API (or mock data for development)
- **Deployment**: Vercel

## Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Local Development

See [LOCAL_SETUP.md](./docs/LOCAL_SETUP.md) for detailed local setup instructions.

\`\`\`bash
# Clone the repository
git clone <your-repo-url>
cd gameverse25

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the app.

### Vercel Deployment

See [VERCEL_DEPLOYMENT.md](./docs/VERCEL_DEPLOYMENT.md) for detailed deployment instructions.

## Documentation

- [Local Setup Guide](./docs/LOCAL_SETUP.md) - Complete guide for local development
- [Vercel Deployment Guide](./docs/VERCEL_DEPLOYMENT.md) - Deploy to Vercel
- [Google Sheets Setup](./docs/GOOGLE_SHEETS_SETUP.md) - Configure Google Sheets integration
- [Admin Guide](./docs/ADMIN_GUIDE.md) - Admin panel features and usage
- [Player Guide](./docs/PLAYER_GUIDE.md) - Player dashboard and features

## Default Credentials

For testing with mock data:

**Admin Account:**
- Email: `admin@gameverse.com`
- Password: `admin123`

**Player Account:**
- Email: `player@college.edu`
- Password: `player123`

## Project Structure

\`\`\`
gameverse25/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── dashboard/         # Player dashboard
│   ├── login/             # Authentication pages
│   └── ...
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   ├── auth/             # Authentication components
│   ├── results/          # Result submission components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utility functions and actions
│   ├── actions/          # Server actions
│   ├── auth/             # Authentication logic
│   └── google-sheets/    # Google Sheets integration
└── docs/                  # Documentation files
\`\`\`

## Environment Variables

Required environment variables:

\`\`\`env
# Authentication
JWT_SECRET=your-secret-key-here

# Google Sheets (Optional - uses mock data if not set)
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id
GOOGLE_SHEETS_API_KEY=your-api-key
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please open an issue on GitHub or contact the development team.
