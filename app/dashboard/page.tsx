import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/actions/auth-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Users, Calendar, TrendingUp, LogOut } from "lucide-react"
import { logout } from "@/lib/actions/auth-actions"
import { getTeamById, getMatchesByGame, getResultsByTeamId } from "@/lib/google-sheets"
import { mockDb } from "@/lib/mock-data"
import Link from "next/link"

async function getPlayerStats(teamId: string) {
  try {
    const team = await getTeamById(teamId)
    if (!team) return null

    const matches = await getMatchesByGame(team.game)
    const results = await getResultsByTeamId(teamId)

    return { team, matches, results }
  } catch (error) {
    // Fallback to mock data
    const team = mockDb.teams.findById(teamId)
    if (!team) return null

    const matches = mockDb.matches.findAll().filter((m) => m.game === team.game)
    const results = mockDb.matchResults.findByTeamId(teamId)

    return { team, matches, results }
  }
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // Admin redirect
  if (user.role === "admin") {
    redirect("/admin")
  }

  const playerStats = user.teamId ? await getPlayerStats(user.teamId) : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-6 pb-24 md:pb-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Welcome, {user.name}</h1>
            <p className="text-muted-foreground">{user.college}</p>
          </div>
          <form action={logout}>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>

        {/* Stats Overview */}
        {playerStats?.team ? (
          <div className="space-y-6">
            {/* Team Info Card */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{playerStats.team.team_name}</CardTitle>
                    <CardDescription>{playerStats.team.college}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {playerStats.team.game}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                    <Trophy className="h-5 w-5 text-primary mb-1" />
                    <p className="text-2xl font-bold">{playerStats.team.total_points}</p>
                    <p className="text-xs text-muted-foreground">Total Points</p>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-500 mb-1" />
                    <p className="text-2xl font-bold">{playerStats.team.matches_played}</p>
                    <p className="text-xs text-muted-foreground">Matches</p>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-500 mb-1" />
                    <p className="text-2xl font-bold">{playerStats.team.wins}</p>
                    <p className="text-xs text-muted-foreground">Wins</p>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                    <Users className="h-5 w-5 text-purple-500 mb-1" />
                    <p className="text-2xl font-bold">{playerStats.team.player_names.length}</p>
                    <p className="text-xs text-muted-foreground">Players</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs for Details */}
            <Tabs defaultValue="team" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="matches">Matches</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
              </TabsList>

              <TabsContent value="team" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>Your squad for {playerStats.team.game}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {playerStats.team.player_names.map((player, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="font-semibold text-primary">{player.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="font-medium">{player}</p>
                              {index === 0 && <p className="text-xs text-muted-foreground">Captain</p>}
                            </div>
                          </div>
                          {index === 0 && <Badge variant="outline">Captain</Badge>}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="matches" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Matches</CardTitle>
                    <CardDescription>Your scheduled {playerStats.team.game} matches</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {playerStats.matches.filter((m) => m.status !== "completed").length > 0 ? (
                      <div className="space-y-3">
                        {playerStats.matches
                          .filter((m) => m.status !== "completed")
                          .slice(0, 5)
                          .map((match) => (
                            <div
                              key={match.id}
                              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                            >
                              <div>
                                <p className="font-medium">Match #{match.match_number}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(match.match_date).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                              <Badge variant={match.status === "in_progress" ? "default" : "secondary"}>
                                {match.status === "in_progress" ? "Live" : "Scheduled"}
                              </Badge>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">No upcoming matches scheduled</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="results" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Match Results</CardTitle>
                    <CardDescription>Your recent performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {playerStats.results.length > 0 ? (
                      <div className="space-y-3">
                        {playerStats.results.slice(0, 10).map((result) => (
                          <div key={result.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                              <p className="font-medium">Match Result</p>
                              <p className="text-sm text-muted-foreground">
                                Placement: #{result.placement} • Kills: {result.kills}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-primary">{result.points}</p>
                              <p className="text-xs text-muted-foreground">points</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">No results available yet</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Link href="/leaderboard">
                <Button variant="outline" className="w-full gap-2 bg-transparent">
                  <Trophy className="h-4 w-4" />
                  View Leaderboard
                </Button>
              </Link>
              <Link href="/matches">
                <Button variant="outline" className="w-full gap-2 bg-transparent">
                  <Calendar className="h-4 w-4" />
                  All Matches
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Team Assigned</CardTitle>
              <CardDescription>
                You haven't been assigned to a team yet. Contact the admin to join a team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4 py-8">
                <Users className="h-16 w-16 text-muted-foreground" />
                <p className="text-center text-muted-foreground">
                  Once you're assigned to a team, you'll be able to view your stats and match history here.
                </p>
                <Link href="/">
                  <Button>Back to Home</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
