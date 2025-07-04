"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createClientSupabaseClient } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export default function AdminSetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [setupComplete, setSetupComplete] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Predefined admin credentials
  const adminEmail = "admin@khatriprabhakar.com.np"
  const adminPassword = "9824566591"

  useEffect(() => {
    async function checkExistingAdmin() {
      try {
        const supabase = createClientSupabaseClient()

        // Check if the user exists by trying to sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password: adminPassword,
        })

        if (data.user) {
          // User exists, sign out and mark setup as complete
          await supabase.auth.signOut()
          setSetupComplete(true)
        }
      } catch (error) {
        console.log("Admin user doesn't exist yet or credentials are incorrect")
      } finally {
        setIsChecking(false)
      }
    }

    checkExistingAdmin()
  }, [])

  async function handleSetup() {
    setIsLoading(true)

    try {
      const supabase = createClientSupabaseClient()

      // Create the admin user
      const { data, error } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/admin/login`,
        },
      })

      if (error) throw error

      // For development purposes, we'll auto-confirm the email
      // In production, the user would need to confirm their email
      try {
        // This is a workaround for development - in production, email confirmation would be required
        await fetch("/api/confirm-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: adminEmail }),
        })
      } catch (confirmError) {
        console.error("Error confirming user:", confirmError)
        // Continue even if this fails - user can still confirm via email
      }

      toast({
        title: "Admin account created",
        description:
          "Your admin account has been set up successfully. You may need to confirm your email before logging in.",
      })

      setSetupComplete(true)

      // Sign out after setup
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Setup error:", error)
      toast({
        title: "Setup failed",
        description: "There was an error setting up the admin account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-muted/30">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile-FYwmgktVCXq3rLF2zP2S6eaTFYtKPX.png"
                alt="Profile"
                width={64}
                height={64}
                className="rounded-full"
                priority
              />
            </div>
            <CardTitle className="text-2xl text-center">Admin Setup</CardTitle>
            <CardDescription className="text-center">Checking admin account status...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile-FYwmgktVCXq3rLF2zP2S6eaTFYtKPX.png"
              alt="Profile"
              width={64}
              height={64}
              className="rounded-full"
              priority
            />
          </div>
          <CardTitle className="text-2xl text-center">Admin Setup</CardTitle>
          <CardDescription className="text-center">
            {setupComplete
              ? "Your admin account is already set up"
              : "Create your admin account to manage your portfolio"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {setupComplete ? (
            <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle>Setup Complete</AlertTitle>
              <AlertDescription>
                Your admin account has been created successfully. You can now log in with:
                <div className="mt-2 p-2 bg-background rounded border">
                  <p>
                    <strong>Email:</strong> {adminEmail}
                  </p>
                  <p>
                    <strong>Password:</strong> {adminPassword}
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-background rounded border">
                <p className="font-medium">Admin credentials will be set to:</p>
                <p className="mt-2">
                  <strong>Email:</strong> {adminEmail}
                </p>
                <p>
                  <strong>Password:</strong> {adminPassword}
                </p>
              </div>

              <p className="text-sm text-muted-foreground">
                Click the button below to create your admin account with these credentials. You'll be able to use them
                to log in to the admin dashboard.
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter>
          {setupComplete ? (
            <Button className="w-full" onClick={() => router.push("/admin/login")}>
              Go to Login
            </Button>
          ) : (
            <Button type="button" className="w-full" disabled={isLoading} onClick={handleSetup}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                "Create Admin Account"
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

