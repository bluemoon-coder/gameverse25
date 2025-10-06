"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Eye } from "lucide-react"
import { format } from "date-fns"
import { deleteTeam } from "@/lib/actions/admin-actions"
import Link from "next/link"
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

export function TeamManagementList({ teams }: { teams: any[] }) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (teamId: string) => {
    setDeletingId(teamId)
    await deleteTeam(teamId)
    router.refresh()
    setDeletingId(null)
  }

  if (teams.length === 0) {
    return <div className="py-8 text-center text-muted-foreground">No teams registered yet</div>
  }

  return (
    <div className="space-y-3">
      {teams.map((team) => (
        <div key={team.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold">{team.team_name}</p>
              <Badge variant="outline">{team.game}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{team.college_name}</p>
            <p className="text-xs text-muted-foreground">
              Captain: {team.captain_name} • Registered {format(new Date(team.created_at), "PPP")}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Points</p>
              <p className="text-lg font-bold text-primary">{team.total_points || 0}</p>
            </div>

            <div className="flex items-center gap-2">
              <Link href={`/teams/${team.id}`}>
                <Button variant="outline" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon" disabled={deletingId === team.id}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Team?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete {team.team_name} and all their match results. This action cannot be
                      undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(team.id)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
