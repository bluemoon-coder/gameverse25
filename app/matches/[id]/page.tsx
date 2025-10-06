import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Trophy, Target, Award } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { getMatchById, getResultsByMatchId, getTeamById } from "@/lib/google-sheets"

async function getMatchWithResults(matchId: string) {
  const match = await getMatchById(matchId)
  if (!match) return null

  const results = await getResultsByMatchId(matchId)

  // Fetch team details for each result
  const resultsWithTeams = await Promise.all(
    results
      .filter((r) => r.verified)
      .map(async (result) => {
        const team = await getTeamById(result.team_id)
        return {
          ...result,
          total_points: result.points,
          teams: team
            ? {
                id: team.id,
                team_name: team.team_name,
                college_name: team.college,
              }
            : null,
        }
      }),
  )

  return {
    match,
    results: resultsWithTeams.sort((a, b) => b.total_points - a.total_points),
  }
}

export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getMatchWithResults(id)

  if (!data) {
    notFound()
  }

  const { match, results } = data

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/matches">
            <Button variant="ghost" size="sm" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Matches
            </Button>
          </Link>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                {match.game} - Match {match.match_number}
              </h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(match.match_date), "PPP")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{format(new Date(match.match_date), "p")}</span>
                </div>
              </div>
            </div>
            <StatusBadge status={match.status} />
          </div>
        </div>

        {results.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-semibold mb-2">No Results Yet</p>
              <p className="text-muted-foreground">
                Results will be displayed once the match is completed and verified
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Top 3 Podium */}
            {results.length >= 3 && (
              <div className="grid grid-cols-3 gap-4 mb-8">
                {/* 2nd Place */}
                <Card className="border-gray-400/50 mt-8">
                  <CardHeader className="text-center pb-3">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-400/20">
                      <span className="text-2xl font-bold text-gray-400">2</span>
                    </div>
                    <CardTitle className="text-lg">{results[1].teams?.team_name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{results[1].teams?.college_name}</p>
                  </CardHeader>
                  <CardContent className="text-center space-y-2">
                    <div className="text-3xl font-bold text-gray-400">{results[1].total_points}</div>
                    <p className="text-xs text-muted-foreground">Points</p>
                    <div className="flex justify-center gap-4 text-sm pt-2">
                      <div>
                        <p className="font-semibold">{results[1].kills}</p>
                        <p className="text-xs text-muted-foreground">Kills</p>
                      </div>
                      <div>
                        <p className="font-semibold">#{results[1].placement}</p>
                        <p className="text-xs text-muted-foreground">Place</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 1st Place */}
                <Card className="border-yellow-500/50 relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Trophy className="h-8 w-8 text-yellow-500" />
                  </div>
                  <CardHeader className="text-center pb-3 pt-8">
                    <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/20">
                      <span className="text-3xl font-bold text-yellow-500">1</span>
                    </div>
                    <CardTitle className="text-xl">{results[0].teams?.team_name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{results[0].teams?.college_name}</p>
                  </CardHeader>
                  <CardContent className="text-center space-y-2">
                    <div className="text-4xl font-bold text-yellow-500">{results[0].total_points}</div>
                    <p className="text-xs text-muted-foreground">Points</p>
                    <div className="flex justify-center gap-4 text-sm pt-2">
                      <div>
                        <p className="font-semibold">{results[0].kills}</p>
                        <p className="text-xs text-muted-foreground">Kills</p>
                      </div>
                      <div>
                        <p className="font-semibold">#{results[0].placement}</p>
                        <p className="text-xs text-muted-foreground">Place</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 3rd Place */}
                <Card className="border-orange-600/50 mt-8">
                  <CardHeader className="text-center pb-3">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-600/20">
                      <span className="text-2xl font-bold text-orange-600">3</span>
                    </div>
                    <CardTitle className="text-lg">{results[2].teams?.team_name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{results[2].teams?.college_name}</p>
                  </CardHeader>
                  <CardContent className="text-center space-y-2">
                    <div className="text-3xl font-bold text-orange-600">{results[2].total_points}</div>
                    <p className="text-xs text-muted-foreground">Points</p>
                    <div className="flex justify-center gap-4 text-sm pt-2">
                      <div>
                        <p className="font-semibold">{results[2].kills}</p>
                        <p className="text-xs text-muted-foreground">Kills</p>
                      </div>
                      <div>
                        <p className="font-semibold">#{results[2].placement}</p>
                        <p className="text-xs text-muted-foreground">Place</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Full Results Table */}
            <Card>
              <CardHeader>
                <CardTitle>Full Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.map((result, index) => (
                    <div
                      key={result.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold">{result.teams?.team_name}</p>
                          <p className="text-sm text-muted-foreground">{result.teams?.college_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">{result.kills}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Kills</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center gap-1">
                            <Award className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">#{result.placement}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Place</p>
                        </div>
                        <div className="text-center min-w-[80px]">
                          <p className="text-2xl font-bold text-primary">{result.total_points}</p>
                          <p className="text-xs text-muted-foreground">Points</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
    scheduled: { variant: "secondary", label: "Scheduled" },
    in_progress: { variant: "default", label: "Live" },
    completed: { variant: "outline", label: "Completed" },
    cancelled: { variant: "destructive", label: "Cancelled" },
  }

  const config = variants[status] || variants.scheduled

  return <Badge variant={config.variant}>{config.label}</Badge>
}
