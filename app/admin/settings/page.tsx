import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/session"
import { getSettings } from "@/lib/actions/settings-actions"
import { SettingsForm } from "@/components/admin/settings-form"

export default async function AdminSettingsPage() {
  const session = await getSession()

  if (!session || session.role !== "admin") {
    redirect("/login")
  }

  const settingsResult = await getSettings()
  const settings = settingsResult.success ? settingsResult.data : null

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">App Settings</h1>
        <p className="text-muted-foreground">Configure application features and behavior</p>
      </div>

      {settings && <SettingsForm initialSettings={settings} />}
    </div>
  )
}
