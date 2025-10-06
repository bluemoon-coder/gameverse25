import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, Award, TrendingUp, Users, ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { getTeamById, getResultsByTeamId, getMatchById } from "@/lib/google-sheets"

async function getTeamDetails(teamId: string) {
  const team = await getTeamById(teamId)
  if (!team) return null

  const results = await getResultsByTeamId(teamId)

  // Fetch match details for each result
  const resultsWithMatches = await Promise.all(
    results
      .filter((r) => r.verified)
      .map(async (result) => {
        const match = await getMatchById(result.match_id)
        return {
          ...result,
          total_points: result.points,
          matches: match || {
            id: result.match_id,
            game: team.game,
            match_number: 0,
            match_date: result.created_at,
            status: "completed",
          },
        }
      }),
  )

  const stats = {
    totalMatches: resultsWithMatches.length,
    totalKills: resultsWithMatches.reduce((sum, r) => sum + (r.kills || 0), 0),
    totalPoints: team.total_points,
    avgKills: resultsWithMatches.length
      ? (resultsWithMatches.reduce((sum, r) => sum + (r.kills || 0), 0) / resultsWithMatches.length).toFixed(1)
      : "0",
    avgPlacement: resultsWithMatches.length
      ? (resultsWithMatches.reduce((sum, r) => sum + (r.placement || 0), 0) / resultsWithMatches.length).toFixed(1)
      : "0",
    bestPlacement: resultsWithMatches.length ? Math.min(...resultsWithMatches.map((r) => r.placement || 999)) : 0,
  }

  return {
    team: {
      ...team,
      college_name: team.college,
    },
    results: resultsWithMatches.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    stats,
  }
}

export default async function TeamDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const data = await getTeamDetails(id)

  if (!data) {
    notFound()
  }

  const { team, results, stats } = data

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <Link href="/leaderboard">
          <Button variant="ghost" size="sm" className="gap-2 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Leaderboard
          </Button>
        </Link>

        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">{team.team_name}</h1>
              <p className="text-xl text-muted-foreground">{team.college_name}</p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {team.game}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Captain: {team.captain_name}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Total Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{stats.totalPoints}</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Target className="h-4 w-4" />
                Total Kills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalKills}</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Award className="h-4 w-4" />
                Best Placement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">#{stats.bestPlacement || "-"}</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Matches Played
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalMatches}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Average Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Avg Kills per Match</span>
                <span className="text-2xl font-bold">{stats.avgKills}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Avg Placement</span>
                <span className="text-2xl font-bold">#{stats.avgPlacement}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {team.player_names?.map((player: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold">
                      {index + 1}
                    </div>
                    <span>{player}</span>
                    {index === 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        Captain
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Match History</CardTitle>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">No matches played yet</div>
            ) : (
              <div className="space-y-3">
                {results.map((result) => (
                  <Link key={result.id} href={`/matches/${result.matches.id}`}>
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-semibold">
                            {result.matches.game} - Match {result.matches.match_number}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(result.matches.match_date), "PPP")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Kills</p>
                          <p className="text-lg font-bold">{result.kills}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Place</p>
                          <p className="text-lg font-bold">#{result.placement}</p>
                        </div>
                        <div className="text-center min-w-[80px]">
                          <p className="text-sm text-muted-foreground">Points</p>
                          <p className="text-xl font-bold text-primary">{result.total_points}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
