import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen bg-background items-center justify-center p-8">
      <div className="w-full max-w-md space-y-6">
        {/* Back link */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">LD</span>
          </div>
          <span className="text-xl font-semibold text-foreground">LeadDrop</span>
        </div>

        <ForgotPasswordForm />
      </div>
    </div>
  )
}
