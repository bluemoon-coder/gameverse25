"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { submitMatchResult } from "@/lib/actions/result-actions"
import { ScreenshotUpload } from "./screenshot-upload"
import { Loader2, CheckCircle2 } from "lucide-react"

interface ResultSubmissionFormProps {
  matchId: string
  teams: Array<{ id: string; team_name: string; college_name: string }>
  game: string
}

export function ResultSubmissionForm({ matchId, teams, game }: ResultSubmissionFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    teamId: "",
    kills: "",
    placement: "",
    screenshotUrl: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await submitMatchResult({
        matchId,
        teamId: formData.teamId,
        kills: Number.parseInt(formData.kills),
        placement: Number.parseInt(formData.placement),
        screenshotUrl: formData.screenshotUrl || undefined,
      })

      if (!result.success) {
        setError(result.error || "Failed to submit result")
        setIsLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.refresh()
      }, 2000)
    } catch (err) {
      setError("An unexpected error occurred")
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="border-green-500/50">
        <CardContent className="py-12 text-center">
          <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
          <h3 className="text-xl font-bold mb-2">Result Submitted!</h3>
          <p className="text-muted-foreground">Your result has been submitted and is pending admin verification</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Match Result</CardTitle>
        <CardDescription>Upload your match results for verification</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="team">Select Your Team *</Label>
            <Select value={formData.teamId} onValueChange={(value) => setFormData({ ...formData, teamId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.team_name} - {team.college_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="kills">Kills *</Label>
              <Input
                id="kills"
                type="number"
                min="0"
                placeholder="Enter kills"
                value={formData.kills}
                onChange={(e) => setFormData({ ...formData, kills: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="placement">Placement *</Label>
              <Input
                id="placement"
                type="number"
                min="1"
                placeholder="Enter placement"
                value={formData.placement}
                onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Screenshot (Optional but Recommended)</Label>
            <ScreenshotUpload
              onUpload={(url) => setFormData({ ...formData, screenshotUrl: url })}
              currentUrl={formData.screenshotUrl}
            />
          </div>

          {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !formData.teamId || !formData.kills || !formData.placement}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Result"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
