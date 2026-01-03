import { LoginForm } from "@/components/auth/login-form"
import { Database, TrendingUp, Users, Zap } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Hero imagery with stats */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background gradient image */}
        <div className="absolute inset-0">
          <img src="/modern-office-workspace-with-professionals-collabo.jpg" alt="LeadDrop Platform" className="w-full h-full object-cover" />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/90 to-primary/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
          {/* Logo and tagline */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center border border-primary-foreground/30">
                <Database className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold">LeadDrop</h1>
            </div>
            <p className="text-lg text-primary-foreground/90 max-w-md leading-relaxed">
              Export niche-based B2B leads with precision. Turn data into revenue.
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="text-4xl font-bold">10M+</div>
              </div>
              <p className="text-sm text-primary-foreground/80 leading-relaxed">
                Quality B2B leads across 500+ targeted niches
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-4xl font-bold">98%</div>
              </div>
              <p className="text-sm text-primary-foreground/80 leading-relaxed">
                Data accuracy with real-time verification
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="text-4xl font-bold">Instant</div>
              </div>
              <p className="text-sm text-primary-foreground/80 leading-relaxed">CSV exports ready in seconds</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div className="text-4xl font-bold">500+</div>
              </div>
              <p className="text-sm text-primary-foreground/80 leading-relaxed">
                Targeted niche categories to choose from
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
