"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, ImageIcon, Loader2 } from "lucide-react"
import Image from "next/image"

interface ScreenshotUploadProps {
  onUpload: (url: string) => void
  currentUrl?: string
}

export function ScreenshotUpload({ onUpload, currentUrl }: ScreenshotUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB")
      return
    }

    setError(null)
    setIsUploading(true)

    try {
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // In a real implementation, you would upload to Vercel Blob or Supabase Storage
      // For now, we'll use a placeholder URL
      const mockUrl = `/placeholder.svg?height=400&width=600&query=game screenshot ${file.name}`

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onUpload(mockUrl)
    } catch (err) {
      setError("Failed to upload screenshot")
      console.error("[v0] Upload error:", err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onUpload("")
  }

  return (
    <div className="space-y-4">
      {preview ? (
        <Card className="relative overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-video">
              <Image src={preview || "/placeholder.svg"} alt="Screenshot preview" fill className="object-cover" />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={handleRemove}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed border-2 border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
          <CardContent className="p-8">
            <label htmlFor="screenshot-upload" className="cursor-pointer">
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <div className="rounded-full bg-muted p-4">
                  {isUploading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="font-semibold mb-1">{isUploading ? "Uploading..." : "Upload Screenshot"}</p>
                  <p className="text-sm text-muted-foreground">Click to browse or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                </div>
                <Button type="button" variant="secondary" disabled={isUploading}>
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
              </div>
              <input
                id="screenshot-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </label>
          </CardContent>
        </Card>
      )}

      {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
        <p className="font-semibold mb-2">Screenshot Guidelines:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Capture the full results screen showing kills and placement</li>
          <li>Ensure text is clear and readable</li>
          <li>Include your team name if visible</li>
          <li>Screenshots will be verified by admins before points are awarded</li>
        </ul>
      </div>
    </div>
  )
}
