"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Code } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()

  const handleLeetCodeLogin = () => {
    // In a real app, this would redirect to LeetCode OAuth
    // For demo purposes, we'll just redirect to the dashboard
    router.push("/dashboard")
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <span className="text-lg font-bold text-primary-foreground">LC</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome to LeetSocial</h1>
          <p className="text-sm text-muted-foreground">Sign in with your LeetCode account to continue</p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Login</CardTitle>
            <CardDescription>
              Connect with your LeetCode account to track progress and compete with friends
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Button onClick={handleLeetCodeLogin} className="w-full">
                <Code className="mr-2 h-4 w-4" />
                Sign in with LeetCode
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Why LeetCode sign in?</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              LeetSocial requires access to your LeetCode account to verify your username and fetch your problem-solving
              statistics. We only access your public profile data.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-primary underline underline-offset-4 hover:text-primary/90"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
