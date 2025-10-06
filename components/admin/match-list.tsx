"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { format } from "date-fns"
import { deleteMatch, updateMatchStatus } from "@/lib/actions/match-actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function MatchList({ matches }: { matches: any[] }) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (matchId: string) => {
    setDeletingId(matchId)
    const result = await deleteMatch(matchId)

    if (result.success) {
      router.refresh()
    }

    setDeletingId(null)
  }

  const handleStatusChange = async (matchId: string, status: any) => {
    await updateMatchStatus(matchId, status)
    router.refresh()
  }

  if (matches.length === 0) {
    return <div className="py-8 text-center text-muted-foreground">No matches created yet</div>
  }

  return (
    <div className="space-y-3">
      {matches.map((match) => (
        <div key={match.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
          <div>
            <p className="font-semibold">
              {match.game} - Match {match.match_number}
            </p>
            <p className="text-sm text-muted-foreground">{format(new Date(match.match_date), "PPP p")}</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={match.status} onValueChange={(value) => handleStatusChange(match.id, value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon" disabled={deletingId === match.id}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Match?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete {match.game} Match {match.match_number} and all associated results.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(match.id)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  )
}
