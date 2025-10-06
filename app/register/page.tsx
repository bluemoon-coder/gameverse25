import { RegisterForm } from "@/components/auth/register-form"
import Link from "next/link"
import { ArrowLeft, Gamepad2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <Gamepad2 className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">
                GameVerse <span className="text-primary">'25</span>
              </h1>
            </div>
            <p className="text-muted-foreground">Join the ultimate gaming competition</p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
