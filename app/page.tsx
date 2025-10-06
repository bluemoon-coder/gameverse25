import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, Users, ArrowRight, Gamepad2, Zap, Award } from "lucide-react"
import Link from "next/link"
import { getAllTeams, getAllMatches, getUpcomingMatches } from "@/lib/google-sheets"
import { DesktopNav } from "@/components/desktop-nav"

async function getStats() {
  const [teams, matches] = await Promise.all([getAllTeams(), getAllMatches()])

  return {
    totalTeams: teams.length,
    totalMatches: matches.length,
  }
}

async function getUpcomingMatchesData() {
  return await getUpcomingMatches()
}

export default async function HomePage() {
  const stats = await getStats()
  const upcomingMatches = await getUpcomingMatchesData()

  return (
    <div className="min-h-screen pb-20">
      {/* Navigation */}
      <DesktopNav />

      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-50 bg-background/95 backdrop-blur border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Gamepad2 className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">GameVerse '25</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px] md:bg-[size:60px_60px]" />
        <div className="container mx-auto px-4 py-12 md:py-24 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6 md:space-y-8">
            <Badge variant="secondary" className="text-xs md:text-sm px-3 py-1.5 md:px-4 md:py-2">
              <Zap className="h-3 w-3 mr-1 inline" />
              Inter-College Gaming 2025
            </Badge>
            <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-balance leading-tight">
              Welcome to <span className="text-primary">GameVerse '25</span>
            </h1>
            <p className="text-base md:text-xl text-muted-foreground text-balance leading-relaxed px-4">
              The ultimate gaming competition featuring BGMI, Free Fire, and Clash Royale
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 px-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="gap-2 w-full sm:w-auto h-12 text-base">
                  Register Your Team
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/leaderboard" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="gap-2 bg-transparent w-full sm:w-auto h-12 text-base">
                  <Trophy className="h-4 w-4" />
                  View Leaderboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid gap-4 md:gap-6 grid-cols-3">
            <Card className="border-primary/20 text-center">
              <CardHeader className="pb-2 md:pb-6">
                <div className="mx-auto mb-1 md:mb-2 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-primary/20">
                  <Users className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl md:text-4xl font-bold">{stats.totalTeams}</CardTitle>
              </CardHeader>
              <CardContent className="pb-4 md:pb-6">
                <p className="text-xs md:text-base text-muted-foreground">Teams</p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 text-center">
              <CardHeader className="pb-2 md:pb-6">
                <div className="mx-auto mb-1 md:mb-2 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-primary/20">
                  <Trophy className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl md:text-4xl font-bold">{stats.totalMatches}</CardTitle>
              </CardHeader>
              <CardContent className="pb-4 md:pb-6">
                <p className="text-xs md:text-base text-muted-foreground">Matches</p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 text-center">
              <CardHeader className="pb-2 md:pb-6">
                <div className="mx-auto mb-1 md:mb-2 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-primary/20">
                  <Gamepad2 className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl md:text-4xl font-bold">3</CardTitle>
              </CardHeader>
              <CardContent className="pb-4 md:pb-6">
                <p className="text-xs md:text-base text-muted-foreground">Games</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">Featured Games</h2>
            <p className="text-sm md:text-lg text-muted-foreground px-4">
              Compete in three exciting battle royale and strategy games
            </p>
          </div>

          <div className="grid gap-4 md:gap-6 md:grid-cols-3">
            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <Target className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                  <Badge className="text-xs">Battle Royale</Badge>
                </div>
                <CardTitle className="text-xl md:text-2xl">BGMI</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4">
                  Battlegrounds Mobile India - 100 players drop into a map, last team standing wins
                </p>
                <ul className="space-y-2 text-xs md:text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    Squad-based gameplay
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    Points for kills and placement
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    Multiple matches per tournament
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <Zap className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                  <Badge className="text-xs">Battle Royale</Badge>
                </div>
                <CardTitle className="text-xl md:text-2xl">Free Fire</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4">
                  Fast-paced 10-minute battle royale with unique character abilities
                </p>
                <ul className="space-y-2 text-xs md:text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    Quick matches
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    Character-based abilities
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    Strategic team play
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <Award className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                  <Badge className="text-xs">Strategy</Badge>
                </div>
                <CardTitle className="text-xl md:text-2xl">Clash Royale</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4">
                  Real-time strategy card game with tower defense mechanics
                </p>
                <ul className="space-y-2 text-xs md:text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    1v1 competitive matches
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    Strategic deck building
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    Win-based scoring
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Upcoming Matches */}
      {upcomingMatches.length > 0 && (
        <section className="py-8 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <div>
                <h2 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">Upcoming Matches</h2>
                <p className="text-xs md:text-base text-muted-foreground">Don't miss these exciting matchups</p>
              </div>
              <Link href="/matches">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <span className="hidden sm:inline">View All</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid gap-3 md:gap-4 md:grid-cols-3">
              {upcomingMatches.map((match) => (
                <Link key={match.id} href={`/matches/${match.id}`}>
                  <Card className="border-primary/20 hover:border-primary/40 transition-colors cursor-pointer h-full active:scale-95 transition-transform">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={match.status === "in_progress" ? "default" : "secondary"} className="text-xs">
                          {match.status === "in_progress" ? "Live Now" : "Scheduled"}
                        </Badge>
                      </div>
                      <CardTitle className="text-base md:text-lg">
                        {match.game} - Match {match.match_number}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {new Date(match.match_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {new Date(match.match_date).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">How It Works</h2>
            <p className="text-sm md:text-lg text-muted-foreground px-4">Simple steps to join the competition</p>
          </div>

          <div className="grid gap-6 md:gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div className="text-center space-y-3 md:space-y-4">
              <div className="mx-auto flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-primary/20 text-xl md:text-2xl font-bold text-primary">
                1
              </div>
              <h3 className="text-lg md:text-xl font-semibold">Register Team</h3>
              <p className="text-sm md:text-base text-muted-foreground px-2">
                Create your team with 4-5 players from your college
              </p>
            </div>

            <div className="text-center space-y-3 md:space-y-4">
              <div className="mx-auto flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-primary/20 text-xl md:text-2xl font-bold text-primary">
                2
              </div>
              <h3 className="text-lg md:text-xl font-semibold">Join Matches</h3>
              <p className="text-sm md:text-base text-muted-foreground px-2">
                Participate in scheduled tournament matches
              </p>
            </div>

            <div className="text-center space-y-3 md:space-y-4">
              <div className="mx-auto flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-primary/20 text-xl md:text-2xl font-bold text-primary">
                3
              </div>
              <h3 className="text-lg md:text-xl font-semibold">Submit Results</h3>
              <p className="text-sm md:text-base text-muted-foreground px-2">
                Upload screenshots and submit your match results
              </p>
            </div>

            <div className="text-center space-y-3 md:space-y-4">
              <div className="mx-auto flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-primary/20 text-xl md:text-2xl font-bold text-primary">
                4
              </div>
              <h3 className="text-lg md:text-xl font-semibold">Climb Leaderboard</h3>
              <p className="text-sm md:text-base text-muted-foreground px-2">
                Earn points and compete for the top spot
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 md:py-16 bg-gradient-to-b from-background to-primary/10">
        <div className="container mx-auto px-4">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="py-8 md:py-12 text-center space-y-4 md:space-y-6">
              <Trophy className="h-12 w-12 md:h-16 md:w-16 mx-auto text-primary" />
              <h2 className="text-2xl md:text-4xl font-bold px-4">Ready to Compete?</h2>
              <p className="text-sm md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance px-6">
                Join hundreds of players in the ultimate inter-college gaming tournament
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 px-4">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="gap-2 w-full sm:w-auto h-12">
                    Register Your Team
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/leaderboard" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 bg-transparent">
                    View Leaderboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Gamepad2 className="h-5 w-5 text-primary" />
              <span className="font-semibold">GameVerse '25</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/leaderboard" className="hover:text-foreground transition-colors">
                Leaderboard
              </Link>
              <Link href="/matches" className="hover:text-foreground transition-colors">
                Matches
              </Link>
              <Link href="/register" className="hover:text-foreground transition-colors">
                Register
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 GameVerse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
