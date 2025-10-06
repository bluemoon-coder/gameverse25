"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown } from "lucide-react"
import { cn } from "@/lib/utils"

interface BracketMatch {
  id: string
  round: number
  position: number
  team1?: {
    id: string
    name: string
    score?: number
  }
  team2?: {
    id: string
    name: string
    score?: number
  }
  winner?: string
  status: "pending" | "in_progress" | "completed"
}

interface TournamentBracketProps {
  matches: BracketMatch[]
  game: string
}

export function TournamentBracket({ matches, game }: TournamentBracketProps) {
  const rounds = Math.max(...matches.map((m) => m.round))
  const roundNames = ["Round of 16", "Quarter Finals", "Semi Finals", "Finals", "Winner"]

  const getMatchesByRound = (round: number) => {
    return matches.filter((m) => m.round === round).sort((a, b) => a.position - b.position)
  }

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="min-w-max flex gap-4 md:gap-8 p-4">
        {Array.from({ length: rounds }, (_, i) => i + 1).map((round) => (
          <div key={round} className="flex flex-col gap-4 min-w-[200px] md:min-w-[250px]">
            {/* Round Header */}
            <div className="text-center mb-2">
              <h3 className="font-bold text-sm md:text-base">{roundNames[round - 1] || `Round ${round}`}</h3>
            </div>

            {/* Matches in this round */}
            <div className="flex flex-col gap-8 justify-around flex-1">
              {getMatchesByRound(round).map((match) => (
                <BracketMatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function BracketMatchCard({ match }: { match: BracketMatch }) {
  const isCompleted = match.status === "completed"
  const isInProgress = match.status === "in_progress"

  return (
    <Card
      className={cn(
        "relative transition-all",
        isInProgress && "border-primary shadow-lg shadow-primary/20",
        isCompleted && "border-muted",
      )}
    >
      <CardContent className="p-3 space-y-2">
        {/* Team 1 */}
        {match.team1 ? (
          <div
            className={cn(
              "flex items-center justify-between p-2 rounded-md transition-colors",
              match.winner === match.team1.id ? "bg-primary/20 border border-primary/40" : "bg-muted/50",
            )}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {match.winner === match.team1.id && <Crown className="h-4 w-4 text-primary flex-shrink-0" />}
              <span className="font-medium text-sm truncate">{match.team1.name}</span>
            </div>
            {match.team1.score !== undefined && <span className="font-bold text-sm ml-2">{match.team1.score}</span>}
          </div>
        ) : (
          <div className="flex items-center justify-center p-2 rounded-md bg-muted/30 text-muted-foreground text-sm">
            TBD
          </div>
        )}

        {/* VS Divider */}
        <div className="flex items-center justify-center">
          <span className="text-xs text-muted-foreground font-medium">VS</span>
        </div>

        {/* Team 2 */}
        {match.team2 ? (
          <div
            className={cn(
              "flex items-center justify-between p-2 rounded-md transition-colors",
              match.winner === match.team2.id ? "bg-primary/20 border border-primary/40" : "bg-muted/50",
            )}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {match.winner === match.team2.id && <Crown className="h-4 w-4 text-primary flex-shrink-0" />}
              <span className="font-medium text-sm truncate">{match.team2.name}</span>
            </div>
            {match.team2.score !== undefined && <span className="font-bold text-sm ml-2">{match.team2.score}</span>}
          </div>
        ) : (
          <div className="flex items-center justify-center p-2 rounded-md bg-muted/30 text-muted-foreground text-sm">
            TBD
          </div>
        )}

        {/* Status Badge */}
        {isInProgress && (
          <div className="absolute -top-2 -right-2">
            <Badge variant="default" className="text-xs">
              Live
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
