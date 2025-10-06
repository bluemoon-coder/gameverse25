import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Mail, Phone } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getAllTeams } from "@/lib/google-sheets"

async function getTeams() {
  return await getAllTeams()
}

export default async function TeamsPage() {
  const teams = await getTeams()

  const bgmiTeams = teams.filter((t) => t.game === "BGMI")
  const ffTeams = teams.filter((t) => t.game === "Free Fire")
  const crTeams = teams.filter((t) => t.game === "Clash Royale")

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 pb-20">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6 space-y-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Registered Teams</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              {teams.length} teams registered across all games
            </p>
          </div>
          <Link href="/register" className="block sm:inline-block">
            <Button className="w-full sm:w-auto">Register Your Team</Button>
          </Link>
        </div>

        <Tabs defaultValue="bgmi" className="space-y-6">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="bgmi">BGMI ({bgmiTeams.length})</TabsTrigger>
              <TabsTrigger value="ff">FF ({ffTeams.length})</TabsTrigger>
              <TabsTrigger value="cr">CR ({crTeams.length})</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="bgmi" className="space-y-4">
            <TeamsList teams={bgmiTeams} />
          </TabsContent>

          <TabsContent value="ff" className="space-y-4">
            <TeamsList teams={ffTeams} />
          </TabsContent>

          <TabsContent value="cr" className="space-y-4">
            <TeamsList teams={crTeams} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function TeamsList({ teams }: { teams: any[] }) {
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {teams.map((team) => (
        <Card key={team.id} className="border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-lg">{team.team_name}</CardTitle>
              <Badge variant="secondary">{team.game}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{team.college}</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Captain</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-3 w-3 text-muted-foreground" />
                  <span>{team.captain_name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span className="truncate">{team.captain_email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span>{team.captain_phone}</span>
                </div>
              </div>
            </div>

            {team.player_names && team.player_names.length > 1 && (
              <div className="space-y-2 pt-2 border-t">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Team Members</p>
                <div className="space-y-1">
                  {team.player_names.slice(1).map((name: string, idx: number) => (
                    <p key={idx} className="text-sm">
                      {name}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
