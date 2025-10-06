import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Trophy } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { getAllMatches } from "@/lib/google-sheets"

async function getMatches() {
  return await getAllMatches()
}

export default async function MatchesPage() {
  const matches = await getMatches()

  const bgmiMatches = matches.filter((m) => m.game === "BGMI")
  const ffMatches = matches.filter((m) => m.game === "Free Fire")
  const crMatches = matches.filter((m) => m.game === "Clash Royale")

  const upcomingMatches = matches.filter((m) => m.status === "scheduled" || m.status === "in_progress")
  const completedMatches = matches.filter((m) => m.status === "completed")

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 pb-20">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Match Schedule</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {matches.length} matches scheduled across all games
          </p>
        </div>

        <div className="grid gap-4 grid-cols-2 mb-6">
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex flex-col items-center gap-2 text-sm md:text-base">
                <Clock className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                <span className="text-xs md:text-base">Upcoming</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-2xl md:text-3xl font-bold">{upcomingMatches.length}</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex flex-col items-center gap-2 text-sm md:text-base">
                <Trophy className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                <span className="text-xs md:text-base">Completed</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-2xl md:text-3xl font-bold">{completedMatches.length}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="bgmi" className="space-y-6">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="bgmi">BGMI ({bgmiMatches.length})</TabsTrigger>
              <TabsTrigger value="ff">FF ({ffMatches.length})</TabsTrigger>
              <TabsTrigger value="cr">CR ({crMatches.length})</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="bgmi" className="space-y-4">
            <MatchesList matches={bgmiMatches} />
          </TabsContent>

          <TabsContent value="ff" className="space-y-4">
            <MatchesList matches={ffMatches} />
          </TabsContent>

          <TabsContent value="cr" className="space-y-4">
            <MatchesList matches={crMatches} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function MatchesList({ matches }: { matches: any[] }) {
  if (matches.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No matches scheduled yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {matches.map((match) => (
        <Link key={match.id} href={`/matches/${match.id}`}>
          <Card className="border-primary/20 hover:border-primary/40 transition-colors cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg">
                  {match.game} - Match {match.match_number}
                </CardTitle>
                <StatusBadge status={match.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(match.match_date), "PPP")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{format(new Date(match.match_date), "p")}</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
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
