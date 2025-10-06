"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, X, Eye } from "lucide-react"
import { format } from "date-fns"
import { verifyMatchResult } from "@/lib/actions/result-actions"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function ResultVerificationList({ results }: { results: any[] }) {
  const router = useRouter()
  const [processingId, setProcessingId] = useState<string | null>(null)

  const handleVerify = async (resultId: string, verified: boolean) => {
    setProcessingId(resultId)
    await verifyMatchResult(resultId, verified)
    router.refresh()
    setProcessingId(null)
  }

  if (results.length === 0) {
    return <div className="py-8 text-center text-muted-foreground">No pending results to verify</div>
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <div key={result.id} className="p-4 rounded-lg border border-border space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <p className="font-semibold">{result.teams?.team_name}</p>
                <Badge variant="outline">{result.teams?.game}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{result.teams?.college_name}</p>
              <p className="text-sm text-muted-foreground">
                {result.matches?.game} - Match {result.matches?.match_number}
              </p>
              <p className="text-xs text-muted-foreground">Submitted {format(new Date(result.created_at), "PPP p")}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Kills</p>
                <p className="text-xl font-bold">{result.kills}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Place</p>
                <p className="text-xl font-bold">#{result.placement}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Points</p>
                <p className="text-xl font-bold text-primary">{result.total_points}</p>
              </div>
            </div>
          </div>

          {result.screenshot_url && (
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    View Screenshot
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Match Screenshot</DialogTitle>
                    <DialogDescription>
                      {result.teams?.team_name} - {result.matches?.game} Match {result.matches?.match_number}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="relative aspect-video">
                    <Image
                      src={result.screenshot_url || "/placeholder.svg"}
                      alt="Match screenshot"
                      fill
                      className="object-contain"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <Button
              size="sm"
              onClick={() => handleVerify(result.id, true)}
              disabled={processingId === result.id}
              className="flex-1"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleVerify(result.id, false)}
              disabled={processingId === result.id}
              className="flex-1"
            >
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
