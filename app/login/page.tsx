import { LoginForm } from "@/components/auth/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Gamepad2 } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">GameVerse '25</h1>
          </div>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary hover:underline font-medium">
            Register here
          </Link>
        </p>

        <div className="text-center text-xs text-muted-foreground space-y-1">
          <p>Demo Credentials:</p>
          <p>Admin: admin@gameverse.com / admin123</p>
          <p>Player: rahul@example.com / player123</p>
        </div>
      </div>
    </div>
  )
}
