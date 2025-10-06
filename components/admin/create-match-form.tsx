"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createMatch } from "@/lib/actions/match-actions"
import { Loader2, Plus } from "lucide-react"

export function CreateMatchForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    game: "",
    matchNumber: "",
    matchDate: "",
    status: "scheduled" as "scheduled" | "in_progress" | "completed" | "cancelled",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await createMatch({
        game: formData.game as "BGMI" | "Free Fire" | "Clash Royale",
        matchNumber: Number.parseInt(formData.matchNumber),
        matchDate: formData.matchDate,
        status: formData.status,
      })

      if (!result.success) {
        setError(result.error || "Failed to create match")
        setIsLoading(false)
        return
      }

      setFormData({
        game: "",
        matchNumber: "",
        matchDate: "",
        status: "scheduled",
      })

      router.refresh()
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create New Match
        </CardTitle>
        <CardDescription>Schedule a new tournament match</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="game">Game</Label>
            <Select value={formData.game} onValueChange={(value) => setFormData({ ...formData, game: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select game" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BGMI">BGMI</SelectItem>
                <SelectItem value="Free Fire">Free Fire</SelectItem>
                <SelectItem value="Clash Royale">Clash Royale</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="matchNumber">Match Number</Label>
            <Input
              id="matchNumber"
              type="number"
              min="1"
              placeholder="e.g., 1"
              value={formData.matchNumber}
              onChange={(e) => setFormData({ ...formData, matchNumber: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="matchDate">Match Date & Time</Label>
            <Input
              id="matchDate"
              type="datetime-local"
              value={formData.matchDate}
              onChange={(e) => setFormData({ ...formData, matchDate: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          <Button type="submit" className="w-full" disabled={isLoading || !formData.game || !formData.matchNumber}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Match
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
