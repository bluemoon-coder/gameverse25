import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/session"
import { sheetsDB } from "@/lib/google-sheets"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CreateMatchForm } from "@/components/admin/create-match-form"
import { MatchList } from "@/components/admin/match-list"

async function checkAdmin() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  if (session.role !== "admin") {
    redirect("/")
  }

  return session
}

async function getMatches() {
  const matches = await sheetsDB.matches.getAll()
  return matches
}

export default async function AdminMatchesPage() {
  await checkAdmin()
  const matches = await getMatches()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <Link href="/admin">
          <Button variant="ghost" size="sm" className="gap-2 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Manage Matches</h1>
          <p className="text-muted-foreground">Create and manage tournament matches</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <CreateMatchForm />
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>All Matches ({matches.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <MatchList matches={matches} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
