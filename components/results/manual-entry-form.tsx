"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface ManualEntryFormProps {
  onSubmit: (kills: number, placement: number) => Promise<void>
  game: string
}

export function ManualEntryForm({ onSubmit, game }: ManualEntryFormProps) {
  const [kills, setKills] = useState("")
  const [placement, setPlacement] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const killsNum = Number.parseInt(kills)
    const placementNum = Number.parseInt(placement)

    // Validation
    if (isNaN(killsNum) || killsNum < 0) {
      setError("Please enter a valid number of kills")
      return
    }

    if (isNaN(placementNum) || placementNum < 1) {
      setError("Please enter a valid placement (1 or higher)")
      return
    }

    // Game-specific validation
    if (game === "BGMI" || game === "Free Fire") {
      if (placementNum > 100) {
        setError("Placement cannot be greater than 100")
        return
      }
    }

    setIsSubmitting(true)

    try {
      await onSubmit(killsNum, placementNum)
      // Reset form on success
      setKills("")
      setPlacement("")
    } catch (err) {
      setError("Failed to submit result")
      console.error("[v0] Manual entry error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual Entry</CardTitle>
        <CardDescription>Enter your match results manually</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="kills">Kills</Label>
            <Input
              id="kills"
              type="number"
              min="0"
              placeholder="Enter number of kills"
              value={kills}
              onChange={(e) => setKills(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="placement">Placement</Label>
            <Input
              id="placement"
              type="number"
              min="1"
              placeholder="Enter your placement"
              value={placement}
              onChange={(e) => setPlacement(e.target.value)}
              disabled={isSubmitting}
              required
            />
            <p className="text-xs text-muted-foreground">
              {game === "BGMI" || game === "Free Fire"
                ? "Enter your team's final placement (1-100)"
                : "Enter your final placement"}
            </p>
          </div>

          {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
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
