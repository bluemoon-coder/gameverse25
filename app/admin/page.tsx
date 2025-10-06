import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/actions/auth-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Trophy, Clock, CheckCircle2, LogOut, Shield } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/actions/auth-actions"
import { getAllTeams, getAllMatches, getAllResults } from "@/lib/google-sheets"
import { mockDb } from "@/lib/mock-data"

async function getAdminStats() {
  try {
    const [teams, matches, results] = await Promise.all([getAllTeams(), getAllMatches(), getAllResults()])

    return {
      totalTeams: teams.length,
      totalMatches: matches.length,
      pendingResults: results.filter((r) => !r.verified).length,
      verifiedResults: results.filter((r) => r.verified).length,
    }
  } catch (error) {
    // Fallback to mock data
    return {
      totalTeams: mockDb.teams.count(),
      totalMatches: mockDb.matches.count(),
      pendingResults: mockDb.matchResults.countUnverified(),
      verifiedResults: mockDb.matchResults.countVerified(),
    }
  }
}

export default async function AdminDashboard() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    redirect("/dashboard")
  }

  const stats = await getAdminStats()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-6 pb-24 md:pb-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
            </div>
            <p className="text-muted-foreground">Welcome back, {user.name}</p>
          </div>
          <form action={logout}>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Teams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl sm:text-3xl font-bold">{stats.totalTeams}</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Total Matches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl sm:text-3xl font-bold">{stats.totalMatches}</p>
            </CardContent>
          </Card>

          <Card className="border-yellow-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl sm:text-3xl font-bold text-yellow-500">{stats.pendingResults}</p>
            </CardContent>
          </Card>

          <Card className="border-green-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Verified
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl sm:text-3xl font-bold text-green-500">{stats.verifiedResults}</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/admin/teams">
            <Card className="border-primary/20 hover:border-primary/40 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5" />
                  Manage Teams
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">View, edit, and delete registered teams</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/matches">
            <Card className="border-primary/20 hover:border-primary/40 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Trophy className="h-5 w-5" />
                  Manage Matches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Create and manage tournament matches</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/results">
            <Card className="border-primary/20 hover:border-primary/40 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle2 className="h-5 w-5" />
                  Verify Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Review and verify submitted match results</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link href="/leaderboard">
            <Button variant="outline" className="w-full gap-2 bg-transparent">
              <Trophy className="h-4 w-4" />
              View Leaderboard
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full gap-2 bg-transparent">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
