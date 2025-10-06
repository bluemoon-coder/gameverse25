"use server"

import { getAppSettings, updateAppSettings, type AppSettings } from "@/lib/google-sheets/settings"
import { getSession } from "@/lib/auth/session"
import { revalidatePath } from "next/cache"

export async function getSettings() {
  try {
    const settings = await getAppSettings()
    return { success: true, data: settings }
  } catch (error) {
    console.error("[v0] Get settings exception:", error)
    return { success: false, error: "Failed to fetch settings" }
  }
}

export async function updateSettings(settings: AppSettings) {
  try {
    const session = await getSession()

    if (!session || session.role !== "admin") {
      return { success: false, error: "Unauthorized - Admin access required" }
    }

    const success = await updateAppSettings(settings)

    if (!success) {
      return { success: false, error: "Failed to update settings" }
    }

    revalidatePath("/admin")
    revalidatePath("/admin/settings")

    return { success: true }
  } catch (error) {
    console.error("[v0] Update settings exception:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
