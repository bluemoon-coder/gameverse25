"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Loader2, Save } from "lucide-react"
import { updateSettings } from "@/lib/actions/settings-actions"
import { useRouter } from "next/navigation"
import type { AppSettings } from "@/lib/google-sheets/settings"

interface SettingsFormProps {
  initialSettings: AppSettings
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const router = useRouter()
  const [settings, setSettings] = useState(initialSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSave = async () => {
    setIsSaving(true)
    setMessage(null)

    const result = await updateSettings(settings)

    if (result.success) {
      setMessage({ type: "success", text: "Settings saved successfully" })
      router.refresh()
    } else {
      setMessage({ type: "error", text: result.error || "Failed to save settings" })
    }

    setIsSaving(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Result Submission</CardTitle>
          <CardDescription>Control how teams can submit match results</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="screenshot-upload">Screenshot Upload</Label>
              <p className="text-sm text-muted-foreground">Allow teams to upload screenshots with their results</p>
            </div>
            <Switch
              id="screenshot-upload"
              checked={settings.screenshotUploadEnabled}
              onCheckedChange={(checked) => setSettings({ ...settings, screenshotUploadEnabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="manual-entry">Manual Entry</Label>
              <p className="text-sm text-muted-foreground">Allow teams to manually enter kills and placement</p>
            </div>
            <Switch
              id="manual-entry"
              checked={settings.manualEntryEnabled}
              onCheckedChange={(checked) => setSettings({ ...settings, manualEntryEnabled: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verification</CardTitle>
          <CardDescription>Configure result verification settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-verify">Auto-Verify Results</Label>
              <p className="text-sm text-muted-foreground">Automatically verify results without admin approval</p>
            </div>
            <Switch
              id="auto-verify"
              checked={settings.autoVerifyResults}
              onCheckedChange={(checked) => setSettings({ ...settings, autoVerifyResults: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {message && (
        <div
          className={`rounded-lg p-4 ${
            message.type === "success" ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"
          }`}
        >
          {message.text}
        </div>
      )}

      <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </>
        )}
      </Button>
    </div>
  )
}
