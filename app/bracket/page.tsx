import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TournamentBracket } from "@/components/tournament/bracket"
import { Trophy } from "lucide-react"

// Mock bracket data for Clash Royale
const clashRoyaleBracket = [
  // Round 1 (Round of 8)
  {
    id: "cr-r1-m1",
    round: 1,
    position: 1,
    team1: { id: "4", name: "Royal Clash", score: 2 },
    team2: { id: "7", name: "Victory Squad", score: 1 },
    winner: "4",
    status: "completed" as const,
  },
  {
    id: "cr-r1-m2",
    round: 1,
    position: 2,
    team1: { id: "t8", name: "Crown Warriors", score: 0 },
    team2: { id: "t9", name: "Arena Masters", score: 2 },
    winner: "t9",
    status: "completed" as const,
  },
  {
    id: "cr-r1-m3",
    round: 1,
    position: 3,
    team1: { id: "t10", name: "Deck Legends", score: 2 },
    team2: { id: "t11", name: "Tower Titans", score: 1 },
    winner: "t10",
    status: "completed" as const,
  },
  {
    id: "cr-r1-m4",
    round: 1,
    position: 4,
    team1: { id: "t12", name: "Elixir Elite", score: 1 },
    team2: { id: "t13", name: "Spell Casters", score: 2 },
    winner: "t13",
    status: "completed" as const,
  },
  // Round 2 (Semi Finals)
  {
    id: "cr-r2-m1",
    round: 2,
    position: 1,
    team1: { id: "4", name: "Royal Clash", score: 2 },
    team2: { id: "t9", name: "Arena Masters", score: 0 },
    winner: "4",
    status: "completed" as const,
  },
  {
    id: "cr-r2-m2",
    round: 2,
    position: 2,
    team1: { id: "t10", name: "Deck Legends", score: 1 },
    team2: { id: "t13", name: "Spell Casters", score: 2 },
    winner: "t13",
    status: "completed" as const,
  },
  // Round 3 (Finals)
  {
    id: "cr-r3-m1",
    round: 3,
    position: 1,
    team1: { id: "4", name: "Royal Clash" },
    team2: { id: "t13", name: "Spell Casters" },
    status: "in_progress" as const,
  },
]

// Mock bracket data for BGMI (simplified)
const bgmiBracket = [
  {
    id: "bgmi-r1-m1",
    round: 1,
    position: 1,
    team1: { id: "1", name: "Phoenix Legends", score: 85 },
    team2: { id: "2", name: "Thunder Squad", score: 72 },
    winner: "1",
    status: "completed" as const,
  },
  {
    id: "bgmi-r1-m2",
    round: 1,
    position: 2,
    team1: { id: "5", name: "Elite Warriors", score: 68 },
    team2: { id: "t14", name: "Battle Kings", score: 91 },
    winner: "t14",
    status: "completed" as const,
  },
  {
    id: "bgmi-r2-m1",
    round: 2,
    position: 1,
    team1: { id: "1", name: "Phoenix Legends" },
    team2: { id: "t14", name: "Battle Kings" },
    status: "pending" as const,
  },
]

// Mock bracket data for Free Fire
const freeFireBracket = [
  {
    id: "ff-r1-m1",
    round: 1,
    position: 1,
    team1: { id: "3", name: "Fire Dragons", score: 45 },
    team2: { id: "6", name: "Storm Riders", score: 38 },
    winner: "3",
    status: "completed" as const,
  },
  {
    id: "ff-r1-m2",
    round: 1,
    position: 2,
    team1: { id: "t15", name: "Blaze Squad", score: 52 },
    team2: { id: "t16", name: "Inferno Team", score: 41 },
    winner: "t15",
    status: "completed" as const,
  },
  {
    id: "ff-r2-m1",
    round: 2,
    position: 1,
    team1: { id: "3", name: "Fire Dragons" },
    team2: { id: "t15", name: "Blaze Squad" },
    status: "pending" as const,
  },
]

export default function BracketPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-6 pb-24 md:pb-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-6 w-6 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold">Tournament Brackets</h1>
          </div>
          <p className="text-muted-foreground">
            Follow the tournament progression and see who advances to the next round
          </p>
        </div>

        <Tabs defaultValue="clash-royale" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="clash-royale">Clash Royale</TabsTrigger>
            <TabsTrigger value="bgmi">BGMI</TabsTrigger>
            <TabsTrigger value="free-fire">Free Fire</TabsTrigger>
          </TabsList>

          <TabsContent value="clash-royale">
            <Card>
              <CardHeader>
                <CardTitle>Clash Royale Tournament Bracket</CardTitle>
                <CardDescription>Single elimination bracket - Best of 3 matches</CardDescription>
              </CardHeader>
              <CardContent>
                <TournamentBracket matches={clashRoyaleBracket} game="Clash Royale" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bgmi">
            <Card>
              <CardHeader>
                <CardTitle>BGMI Tournament Bracket</CardTitle>
                <CardDescription>Knockout rounds based on total points</CardDescription>
              </CardHeader>
              <CardContent>
                <TournamentBracket matches={bgmiBracket} game="BGMI" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="free-fire">
            <Card>
              <CardHeader>
                <CardTitle>Free Fire Tournament Bracket</CardTitle>
                <CardDescription>Knockout rounds based on total points</CardDescription>
              </CardHeader>
              <CardContent>
                <TournamentBracket matches={freeFireBracket} game="Free Fire" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
