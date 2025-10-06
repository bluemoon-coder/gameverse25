"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { registerTeam, type TeamRegistrationData } from "@/lib/actions/team-actions"
import { Loader2, CheckCircle2, Users, Trophy, Gamepad2 } from "lucide-react"

const GAMES = ["BGMI", "Free Fire", "Clash Royale"] as const
const TEAM_SIZES = {
  BGMI: 4,
  "Free Fire": 4,
  "Clash Royale": 1,
}

export function RegistrationForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<TeamRegistrationData>>({
    game: "BGMI",
  })

  const updateFormData = (field: keyof TeamRegistrationData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError(null)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await registerTeam(formData as TeamRegistrationData)

      if (!result.success) {
        setError(result.error || "Registration failed")
        setIsLoading(false)
        return
      }

      // Success - show confirmation
      setStep(4)
    } catch (err) {
      setError("An unexpected error occurred")
      setIsLoading(false)
    }
  }

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return !!(formData.teamName && formData.collegeName && formData.game)
      case 2:
        return !!(formData.captainName && formData.captainEmail && formData.captainPhone)
      case 3:
        // For Clash Royale, no additional players needed
        if (formData.game === "Clash Royale") return true
        // For BGMI/Free Fire, at least one additional player
        return !!(formData.player2Name && formData.player2Email)
      default:
        return false
    }
  }

  const nextStep = () => {
    if (validateStep(step)) {
      if (step === 3) {
        handleSubmit()
      } else {
        setStep(step + 1)
      }
    } else {
      setError("Please fill in all required fields")
    }
  }

  const prevStep = () => {
    setStep(step - 1)
    setError(null)
  }

  const requiredPlayers = formData.game ? TEAM_SIZES[formData.game] : 4

  if (step === 4) {
    return (
      <Card className="border-green-500/50 bg-card">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Registration Successful!</CardTitle>
          <CardDescription>Your team has been registered for GameVerse '25</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">Team Name</p>
            <p className="text-lg font-bold">{formData.teamName}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs text-muted-foreground mb-1">Game</p>
              <p className="font-semibold">{formData.game}</p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs text-muted-foreground mb-1">College</p>
              <p className="font-semibold text-sm">{formData.collegeName}</p>
            </div>
          </div>
          <div className="space-y-2 pt-4">
            <Button onClick={() => router.push("/leaderboard")} className="w-full">
              View Leaderboard
            </Button>
            <Button onClick={() => router.push("/")} variant="outline" className="w-full">
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-2xl">Team Registration</CardTitle>
          <div className="text-sm text-muted-foreground">Step {step} of 3</div>
        </div>
        <CardDescription>
          {step === 1 && "Enter your team and game details"}
          {step === 2 && "Captain information"}
          {step === 3 && "Additional team members"}
        </CardDescription>
        <div className="flex gap-2 mt-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="teamName" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Team Name *
              </Label>
              <Input
                id="teamName"
                placeholder="Enter your team name"
                value={formData.teamName || ""}
                onChange={(e) => updateFormData("teamName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collegeName" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                College Name *
              </Label>
              <Input
                id="collegeName"
                placeholder="Enter your college name"
                value={formData.collegeName || ""}
                onChange={(e) => updateFormData("collegeName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="game" className="flex items-center gap-2">
                <Gamepad2 className="h-4 w-4" />
                Select Game *
              </Label>
              <Select
                value={formData.game}
                onValueChange={(value) => updateFormData("game", value as (typeof GAMES)[number])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a game" />
                </SelectTrigger>
                <SelectContent>
                  {GAMES.map((game) => (
                    <SelectItem key={game} value={game}>
                      {game}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Team size: {formData.game ? TEAM_SIZES[formData.game] : "4"} player(s)
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="captainName">Captain Name *</Label>
              <Input
                id="captainName"
                placeholder="Enter captain's full name"
                value={formData.captainName || ""}
                onChange={(e) => updateFormData("captainName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="captainEmail">Captain Email *</Label>
              <Input
                id="captainEmail"
                type="email"
                placeholder="captain@example.com"
                value={formData.captainEmail || ""}
                onChange={(e) => updateFormData("captainEmail", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="captainPhone">Captain Phone *</Label>
              <Input
                id="captainPhone"
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={formData.captainPhone || ""}
                onChange={(e) => updateFormData("captainPhone", e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            {formData.game === "Clash Royale" ? (
              <div className="rounded-lg bg-muted p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Clash Royale is a solo game. No additional players needed.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4 rounded-lg border border-primary/20 p-4">
                  <h3 className="font-semibold">Player 2 *</h3>
                  <div className="space-y-2">
                    <Label htmlFor="player2Name">Name</Label>
                    <Input
                      id="player2Name"
                      placeholder="Player 2 name"
                      value={formData.player2Name || ""}
                      onChange={(e) => updateFormData("player2Name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="player2Email">Email</Label>
                    <Input
                      id="player2Email"
                      type="email"
                      placeholder="player2@example.com"
                      value={formData.player2Email || ""}
                      onChange={(e) => updateFormData("player2Email", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4 rounded-lg border border-muted p-4">
                  <h3 className="font-semibold text-muted-foreground">Player 3 (Optional)</h3>
                  <div className="space-y-2">
                    <Label htmlFor="player3Name">Name</Label>
                    <Input
                      id="player3Name"
                      placeholder="Player 3 name"
                      value={formData.player3Name || ""}
                      onChange={(e) => updateFormData("player3Name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="player3Email">Email</Label>
                    <Input
                      id="player3Email"
                      type="email"
                      placeholder="player3@example.com"
                      value={formData.player3Email || ""}
                      onChange={(e) => updateFormData("player3Email", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4 rounded-lg border border-muted p-4">
                  <h3 className="font-semibold text-muted-foreground">Player 4 (Optional)</h3>
                  <div className="space-y-2">
                    <Label htmlFor="player4Name">Name</Label>
                    <Input
                      id="player4Name"
                      placeholder="Player 4 name"
                      value={formData.player4Name || ""}
                      onChange={(e) => updateFormData("player4Name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="player4Email">Email</Label>
                    <Input
                      id="player4Email"
                      type="email"
                      placeholder="player4@example.com"
                      value={formData.player4Email || ""}
                      onChange={(e) => updateFormData("player4Email", e.target.value)}
                    />
                  </div>
                </div>

                {requiredPlayers >= 5 && (
                  <div className="space-y-4 rounded-lg border border-muted p-4">
                    <h3 className="font-semibold text-muted-foreground">Player 5 (Optional)</h3>
                    <div className="space-y-2">
                      <Label htmlFor="player5Name">Name</Label>
                      <Input
                        id="player5Name"
                        placeholder="Player 5 name"
                        value={formData.player5Name || ""}
                        onChange={(e) => updateFormData("player5Name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="player5Email">Email</Label>
                      <Input
                        id="player5Email"
                        type="email"
                        placeholder="player5@example.com"
                        value={formData.player5Email || ""}
                        onChange={(e) => updateFormData("player5Email", e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

        <div className="flex gap-3 pt-4">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={isLoading}
              className="flex-1 bg-transparent"
            >
              Back
            </Button>
          )}
          <Button type="button" onClick={nextStep} disabled={isLoading || !validateStep(step)} className="flex-1">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : step === 3 ? (
              "Complete Registration"
            ) : (
              "Next"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
