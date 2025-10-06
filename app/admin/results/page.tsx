import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/session"
import { sheetsDB } from "@/lib/google-sheets"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ResultVerificationList } from "@/components/admin/result-verification-list"

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

async function getPendingResults() {
  const results = await sheetsDB.results.getAll()
  // Filter for unverified results
  return results.filter((r) => !r.verified)
}

export default async function AdminResultsPage() {
  await checkAdmin()
  const pendingResults = await getPendingResults()

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
          <h1 className="text-4xl font-bold tracking-tight mb-2">Verify Results</h1>
          <p className="text-muted-foreground">Review and verify submitted match results</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Verification ({pendingResults.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ResultVerificationList results={pendingResults} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
