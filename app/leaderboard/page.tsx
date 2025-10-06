import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { getAllTeams } from "@/lib/google-sheets"

async function getLeaderboards() {
  const allTeams = await getAllTeams()

  return {
    overall: allTeams.sort((a, b) => b.total_points - a.total_points),
    bgmi: allTeams.filter((t) => t.game === "BGMI").sort((a, b) => b.total_points - a.total_points),
    freefire: allTeams.filter((t) => t.game === "Free Fire").sort((a, b) => b.total_points - a.total_points),
    clashroyale: allTeams.filter((t) => t.game === "Clash Royale").sort((a, b) => b.total_points - a.total_points),
    colleges: [], // College leaderboard would need aggregation logic
  }
}

export default async function LeaderboardPage() {
  const leaderboards = await getLeaderboards()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 pb-20">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Leaderboards</h1>
          <p className="text-sm md:text-base text-muted-foreground">Live rankings across all games</p>
        </div>

        <Tabs defaultValue="bgmi" className="space-y-6">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="bgmi">BGMI</TabsTrigger>
              <TabsTrigger value="ff">FF</TabsTrigger>
              <TabsTrigger value="cr">CR</TabsTrigger>
              <TabsTrigger value="overall">Overall</TabsTrigger>
              <TabsTrigger value="colleges">Colleges</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="bgmi">
            <LeaderboardTable teams={leaderboards.bgmi} showGame={true} />
          </TabsContent>

          <TabsContent value="ff">
            <LeaderboardTable teams={leaderboards.freefire} showGame={true} />
          </TabsContent>

          <TabsContent value="cr">
            <LeaderboardTable teams={leaderboards.clashroyale} showGame={true} />
          </TabsContent>

          <TabsContent value="overall">
            <LeaderboardTable teams={leaderboards.overall} />
          </TabsContent>

          <TabsContent value="colleges">
            <CollegeLeaderboardTable colleges={leaderboards.colleges} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function LeaderboardTable({ teams, showGame = false }: { teams: any[]; showGame?: boolean }) {
  if (teams.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No teams registered yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Rank</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Team</th>
                {showGame && <th className="px-4 py-3 text-left text-sm font-semibold">Game</th>}
                <th className="px-4 py-3 text-center text-sm font-semibold">Matches</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Wins</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {teams.map((team, index) => (
                <tr key={team.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {index < 3 ? (
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${
                            index === 0
                              ? "bg-yellow-500/20 text-yellow-500"
                              : index === 1
                                ? "bg-gray-400/20 text-gray-400"
                                : "bg-orange-600/20 text-orange-600"
                          }`}
                        >
                          {index + 1}
                        </div>
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-semibold">
                          {index + 1}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Link href={`/teams/${team.id}`} className="hover:underline">
                      <div>
                        <p className="font-semibold">{team.team_name}</p>
                        <p className="text-sm text-muted-foreground">{team.college}</p>
                      </div>
                    </Link>
                  </td>
                  {showGame && (
                    <td className="px-4 py-4">
                      <Badge variant="outline">{team.game}</Badge>
                    </td>
                  )}
                  <td className="px-4 py-4 text-center font-semibold">{team.matches_played || 0}</td>
                  <td className="px-4 py-4 text-center font-semibold">{team.wins || 0}</td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-lg font-bold text-primary">{team.total_points || 0}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

function CollegeLeaderboardTable({ colleges }: { colleges: any[] }) {
  if (colleges.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No college data available yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Rank</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">College</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Teams</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Total Points</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Avg Points</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {colleges.map((college, index) => (
                <tr key={college.college_name} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {index < 3 ? (
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${
                            index === 0
                              ? "bg-yellow-500/20 text-yellow-500"
                              : index === 1
                                ? "bg-gray-400/20 text-gray-400"
                                : "bg-orange-600/20 text-orange-600"
                          }`}
                        >
                          {index + 1}
                        </div>
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-semibold">
                          {index + 1}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold">{college.college_name}</p>
                  </td>
                  <td className="px-4 py-4 text-center font-semibold">{college.team_count || 0}</td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-lg font-bold text-primary">{college.total_points || 0}</span>
                  </td>
                  <td className="px-4 py-4 text-center font-semibold">
                    {college.team_count > 0 ? Math.round(college.total_points / college.team_count) : 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
