import Link from "next/link"
import { BarChart3, Trophy, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, User!</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Refresh Stats
          </Button>
          <Button size="sm">Update Profile</Button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Problems Solved</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">+12 from last week</p>
            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span>Progress</span>
                <span className="font-medium">245/2500</span>
              </div>
              <Progress value={10} className="h-2" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Friends</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+2 new this month</p>
            <div className="mt-4 flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-primary text-xs font-medium text-primary-foreground">
                +3
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="ghost" className="w-full" asChild>
              <Link href="/dashboard/friends">Manage Friends</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Contests</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">1 active contest</p>
            <div className="mt-4">
              <div className="rounded-md bg-muted px-3 py-2">
                <h4 className="font-medium">Weekend Challenge</h4>
                <p className="text-xs text-muted-foreground">Ends in 2 days</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="ghost" className="w-full" asChild>
              <Link href="/dashboard/contests">View All Contests</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent LeetCode activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { problem: "Two Sum", difficulty: "Easy", time: "2 hours ago" },
                { problem: "Add Two Numbers", difficulty: "Medium", time: "Yesterday" },
                { problem: "Longest Substring Without Repeating Characters", difficulty: "Medium", time: "2 days ago" },
                { problem: "Median of Two Sorted Arrays", difficulty: "Hard", time: "3 days ago" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium leading-none">{item.problem}</p>
                    <p className="text-sm text-muted-foreground">{item.time}</p>
                  </div>
                  <div
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      item.difficulty === "Easy"
                        ? "bg-green-100 text-green-700"
                        : item.difficulty === "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.difficulty}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Friend Leaderboard</CardTitle>
            <CardDescription>How you rank among your friends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Alex Chen", problems: 412, rank: 1 },
                { name: "Sarah Kim", problems: 389, rank: 2 },
                { name: "You", problems: 245, rank: 3, isUser: true },
                { name: "Mike Johnson", problems: 201, rank: 4 },
                { name: "Emma Davis", problems: 187, rank: 5 },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between rounded-md p-2 ${item.isUser ? "bg-muted" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                        item.rank === 1
                          ? "bg-yellow-100 text-yellow-700"
                          : item.rank === 2
                            ? "bg-gray-100 text-gray-700"
                            : item.rank === 3
                              ? "bg-orange-100 text-orange-700"
                              : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {item.rank}
                    </div>
                    <p className={`font-medium ${item.isUser ? "font-bold" : ""}`}>{item.name}</p>
                  </div>
                  <div className="text-sm font-medium">{item.problems}</div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="ghost" className="w-full" asChild>
              <Link href="/dashboard/compare">View Full Comparison</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
