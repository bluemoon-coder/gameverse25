// Mock data to replace Supabase for development/preview

export interface Team {
  id: string
  team_name: string
  college: string
  game: "BGMI" | "Free Fire" | "Clash Royale"
  captain_name: string
  captain_email: string
  captain_phone: string
  player_names: string[]
  total_points: number
  matches_played: number
  wins: number
  created_at: string
}

export interface Match {
  id: string
  game: "BGMI" | "Free Fire" | "Clash Royale"
  match_number: number
  match_date: string
  status: "scheduled" | "in_progress" | "completed"
  created_at: string
}

export interface MatchResult {
  id: string
  match_id: string
  team_id: string
  placement: number
  kills: number
  points: number
  screenshot_url: string
  verified: boolean
  created_at: string
}

export interface AdminUser {
  id: string
  email: string
  created_at: string
}

export interface User {
  id: string
  email: string
  password: string
  name: string
  role: "admin" | "player"
  teamId?: string
  college?: string
  createdAt: string
}

// Mock Teams Data
export const mockTeams: Team[] = [
  {
    id: "1",
    team_name: "Phoenix Legends",
    college: "MIT College",
    game: "BGMI",
    captain_name: "Rahul Sharma",
    captain_email: "rahul@example.com",
    captain_phone: "9876543210",
    player_names: ["Rahul Sharma", "Amit Kumar", "Priya Singh", "Rohan Verma"],
    total_points: 2450,
    matches_played: 12,
    wins: 5,
    created_at: "2025-01-15T10:00:00Z",
  },
  {
    id: "2",
    team_name: "Thunder Squad",
    college: "Delhi University",
    game: "BGMI",
    captain_name: "Vikram Patel",
    captain_email: "vikram@example.com",
    captain_phone: "9876543211",
    player_names: ["Vikram Patel", "Sneha Reddy", "Arjun Mehta", "Kavya Iyer"],
    total_points: 2380,
    matches_played: 12,
    wins: 4,
    created_at: "2025-01-16T11:00:00Z",
  },
  {
    id: "3",
    team_name: "Fire Dragons",
    college: "IIT Bombay",
    game: "Free Fire",
    captain_name: "Aditya Gupta",
    captain_email: "aditya@example.com",
    captain_phone: "9876543212",
    player_names: ["Aditya Gupta", "Neha Joshi", "Karan Singh", "Pooja Nair"],
    total_points: 1890,
    matches_played: 10,
    wins: 3,
    created_at: "2025-01-17T12:00:00Z",
  },
  {
    id: "4",
    team_name: "Royal Clash",
    college: "St. Xavier's College",
    game: "Clash Royale",
    captain_name: "Sanjay Kumar",
    captain_email: "sanjay@example.com",
    captain_phone: "9876543213",
    player_names: ["Sanjay Kumar", "Riya Sharma"],
    total_points: 1650,
    matches_played: 8,
    wins: 6,
    created_at: "2025-01-18T13:00:00Z",
  },
  {
    id: "5",
    team_name: "Elite Warriors",
    college: "Pune University",
    game: "BGMI",
    captain_name: "Deepak Rao",
    captain_email: "deepak@example.com",
    captain_phone: "9876543214",
    player_names: ["Deepak Rao", "Anjali Desai", "Rohit Kulkarni", "Meera Patil"],
    total_points: 2100,
    matches_played: 11,
    wins: 3,
    created_at: "2025-01-19T14:00:00Z",
  },
  {
    id: "6",
    team_name: "Storm Riders",
    college: "Chennai Institute",
    game: "Free Fire",
    captain_name: "Karthik Raj",
    captain_email: "karthik@example.com",
    captain_phone: "9876543215",
    player_names: ["Karthik Raj", "Divya Menon", "Suresh Babu", "Lakshmi Iyer"],
    total_points: 1750,
    matches_played: 9,
    wins: 4,
    created_at: "2025-01-20T15:00:00Z",
  },
  {
    id: "7",
    team_name: "Victory Squad",
    college: "Bangalore College",
    game: "Clash Royale",
    captain_name: "Arjun Nair",
    captain_email: "arjun@example.com",
    captain_phone: "9876543216",
    player_names: ["Arjun Nair", "Priya Menon"],
    total_points: 1420,
    matches_played: 7,
    wins: 4,
    created_at: "2025-01-21T16:00:00Z",
  },
]

// Mock Matches Data
export const mockMatches: Match[] = [
  {
    id: "1",
    game: "BGMI",
    match_number: 1,
    match_date: "2025-02-01T15:00:00Z",
    status: "scheduled",
    created_at: "2025-01-20T10:00:00Z",
  },
  {
    id: "2",
    game: "BGMI",
    match_number: 2,
    match_date: "2025-02-02T15:00:00Z",
    status: "scheduled",
    created_at: "2025-01-20T10:00:00Z",
  },
  {
    id: "3",
    game: "Free Fire",
    match_number: 1,
    match_date: "2025-02-03T16:00:00Z",
    status: "scheduled",
    created_at: "2025-01-20T10:00:00Z",
  },
  {
    id: "4",
    game: "Clash Royale",
    match_number: 1,
    match_date: "2025-01-25T14:00:00Z",
    status: "completed",
    created_at: "2025-01-20T10:00:00Z",
  },
  {
    id: "5",
    game: "BGMI",
    match_number: 3,
    match_date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    status: "in_progress",
    created_at: "2025-01-20T10:00:00Z",
  },
]

// Mock Match Results
export const mockMatchResults: MatchResult[] = [
  {
    id: "1",
    match_id: "4",
    team_id: "4",
    placement: 1,
    kills: 0,
    points: 100,
    screenshot_url: "/placeholder.svg",
    verified: true,
    created_at: "2025-01-25T15:00:00Z",
  },
  {
    id: "2",
    match_id: "4",
    team_id: "7",
    placement: 2,
    kills: 0,
    points: 75,
    screenshot_url: "/placeholder.svg",
    verified: true,
    created_at: "2025-01-25T15:00:00Z",
  },
  {
    id: "3",
    match_id: "4",
    team_id: "1",
    placement: 3,
    kills: 15,
    points: 65,
    screenshot_url: "/placeholder.svg",
    verified: true,
    created_at: "2025-01-25T15:00:00Z",
  },
]

// Mock Users Data
export const mockUsers: User[] = [
  {
    id: "admin-1",
    email: "admin@gameverse.com",
    password: "admin123",
    name: "Admin User",
    role: "admin",
    createdAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "player-1",
    email: "rahul@example.com",
    password: "player123",
    name: "Rahul Sharma",
    role: "player",
    teamId: "1",
    college: "MIT College",
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "player-2",
    email: "vikram@example.com",
    password: "player123",
    name: "Vikram Patel",
    role: "player",
    teamId: "2",
    college: "Delhi University",
    createdAt: "2025-01-16T11:00:00Z",
  },
  {
    id: "player-3",
    email: "aditya@example.com",
    password: "player123",
    name: "Aditya Gupta",
    role: "player",
    teamId: "3",
    college: "IIT Bombay",
    createdAt: "2025-01-17T12:00:00Z",
  },
]

// Mock Admin Users
export const mockAdminUsers: AdminUser[] = [
  {
    id: "admin-1",
    email: "admin@gameverse.com",
    created_at: "2025-01-01T00:00:00Z",
  },
]

// Helper functions to simulate database queries
export const mockDb = {
  teams: {
    findAll: () => mockTeams,
    findById: (id: string) => mockTeams.find((t) => t.id === id),
    findByGame: (game: string) => mockTeams.filter((t) => t.game === game),
    count: () => mockTeams.length,
  },
  matches: {
    findAll: () => mockMatches,
    findById: (id: string) => mockMatches.find((m) => m.id === id),
    findUpcoming: () =>
      mockMatches
        .filter((m) => m.status === "scheduled" || m.status === "in_progress")
        .sort((a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime())
        .slice(0, 3),
    count: () => mockMatches.length,
  },
  matchResults: {
    findAll: () => mockMatchResults,
    findByMatchId: (matchId: string) => mockMatchResults.filter((r) => r.match_id === matchId),
    findByTeamId: (teamId: string) => mockMatchResults.filter((r) => r.team_id === teamId),
    countUnverified: () => mockMatchResults.filter((r) => !r.verified).length,
    countVerified: () => mockMatchResults.filter((r) => r.verified).length,
  },
  adminUsers: {
    findById: (id: string) => mockAdminUsers.find((u) => u.id === id),
  },
  users: {
    findAll: () => mockUsers,
    findById: (id: string) => mockUsers.find((u) => u.id === id),
    findByEmail: (email: string) => mockUsers.find((u) => u.email === email),
    count: () => mockUsers.length,
  },
}
