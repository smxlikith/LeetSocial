"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProblemStatsGauge } from "@/components/problem-stats-gauge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ComparePage() {
  const [selectedFriend, setSelectedFriend] = useState("alexchen")

  const mockFriends = [
    { username: "alexchen", name: "Alex Chen" },
    { username: "sarahkim", name: "Sarah Kim" },
    { username: "mikejohnson", name: "Mike Johnson" },
    { username: "emmadavis", name: "Emma Davis" },
    { username: "jasonlee", name: "Jason Lee" },
  ]

  const mockUserStats = {
    totalProblems: 3521,
    solved: 301,
    easy: { solved: 99, total: 873 },
    medium: { solved: 184, total: 1826 },
    hard: { solved: 18, total: 822 },
    attempting: 6,
    contests: 12,
    ranking: 54321,
    streak: 15,
  }

  const mockFriendStats = {
    totalProblems: 3521,
    solved: 412,
    easy: { solved: 180, total: 873 },
    medium: { solved: 172, total: 1826 },
    hard: { solved: 60, total: 822 },
    attempting: 3,
    contests: 24,
    ranking: 12345,
    streak: 45,
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Compare with Friends</h1>
        <div className="flex items-center gap-2">
          <Select value={selectedFriend} onValueChange={setSelectedFriend}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a friend" />
            </SelectTrigger>
            <SelectContent>
              {mockFriends.map((friend) => (
                <SelectItem key={friend.username} value={friend.username}>
                  {friend.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button>Compare</Button>
        </div>
      </div>

      {/* Problem Stats Gauges */}
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="overflow-hidden bg-zinc-900 text-white">
          <CardHeader className="bg-zinc-800">
            <CardTitle className="text-center">Your Progress</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <ProblemStatsGauge
              solved={mockUserStats.solved}
              total={mockUserStats.totalProblems}
              easy={mockUserStats.easy}
              medium={mockUserStats.medium}
              hard={mockUserStats.hard}
              attempting={mockUserStats.attempting}
            />
            <div className="mt-6 grid w-full grid-cols-3 gap-2">
              <div className="rounded bg-zinc-800 p-2 text-center">
                <div className="text-xs text-[#00B8A3]">Easy</div>
                <div className="text-sm font-medium">
                  {mockUserStats.easy.solved}/{mockUserStats.easy.total}
                </div>
              </div>
              <div className="rounded bg-zinc-800 p-2 text-center">
                <div className="text-xs text-[#FFC01E]">Med</div>
                <div className="text-sm font-medium">
                  {mockUserStats.medium.solved}/{mockUserStats.medium.total}
                </div>
              </div>
              <div className="rounded bg-zinc-800 p-2 text-center">
                <div className="text-xs text-[#FF375F]">Hard</div>
                <div className="text-sm font-medium">
                  {mockUserStats.hard.solved}/{mockUserStats.hard.total}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden bg-zinc-900 text-white">
          <CardHeader className="bg-zinc-800">
            <CardTitle className="text-center">Alex Chen's Progress</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <ProblemStatsGauge
              solved={mockFriendStats.solved}
              total={mockFriendStats.totalProblems}
              easy={mockFriendStats.easy}
              medium={mockFriendStats.medium}
              hard={mockFriendStats.hard}
              attempting={mockFriendStats.attempting}
            />
            <div className="mt-6 grid w-full grid-cols-3 gap-2">
              <div className="rounded bg-zinc-800 p-2 text-center">
                <div className="text-xs text-[#00B8A3]">Easy</div>
                <div className="text-sm font-medium">
                  {mockFriendStats.easy.solved}/{mockFriendStats.easy.total}
                </div>
              </div>
              <div className="rounded bg-zinc-800 p-2 text-center">
                <div className="text-xs text-[#FFC01E]">Med</div>
                <div className="text-sm font-medium">
                  {mockFriendStats.medium.solved}/{mockFriendStats.medium.total}
                </div>
              </div>
              <div className="rounded bg-zinc-800 p-2 text-center">
                <div className="text-xs text-[#FF375F]">Hard</div>
                <div className="text-sm font-medium">
                  {mockFriendStats.hard.solved}/{mockFriendStats.hard.total}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Problems</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{mockUserStats.solved}</div>
                <p className="text-xs text-muted-foreground">You</p>
              </div>
              <div className="text-2xl font-bold text-muted-foreground">vs</div>
              <div className="text-right">
                <div className="text-2xl font-bold">{mockFriendStats.solved}</div>
                <p className="text-xs text-muted-foreground">Alex Chen</p>
              </div>
            </div>
            <div className="mt-4 h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary"
                style={{
                  width: `${(mockUserStats.solved / (mockUserStats.solved + mockFriendStats.solved)) * 100}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Contest Ranking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{mockUserStats.ranking.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">You</p>
              </div>
              <div className="text-2xl font-bold text-muted-foreground">vs</div>
              <div className="text-right">
                <div className="text-2xl font-bold">{mockFriendStats.ranking.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Alex Chen</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div
                className={`text-xs ${mockUserStats.ranking < mockFriendStats.ranking ? "text-green-500" : "text-red-500"}`}
              >
                {mockUserStats.ranking < mockFriendStats.ranking ? "Higher" : "Lower"} rank
              </div>
              <div className="text-xs text-muted-foreground">
                by {Math.abs(mockUserStats.ranking - mockFriendStats.ranking).toLocaleString()} positions
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{mockUserStats.streak} days</div>
                <p className="text-xs text-muted-foreground">You</p>
              </div>
              <div className="text-2xl font-bold text-muted-foreground">vs</div>
              <div className="text-right">
                <div className="text-2xl font-bold">{mockFriendStats.streak} days</div>
                <p className="text-xs text-muted-foreground">Alex Chen</p>
              </div>
            </div>
            <div className="mt-4 h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${(mockUserStats.streak / (mockUserStats.streak + mockFriendStats.streak)) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="problems">
        <TabsList>
          <TabsTrigger value="problems">Problem Breakdown</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="problems" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Problem Difficulty Comparison</CardTitle>
              <CardDescription>Compare problem-solving by difficulty level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-center text-lg font-medium">You</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium text-[#00B8A3]">Easy</span>
                        <span>
                          {mockUserStats.easy.solved} problems (
                          {Math.round((mockUserStats.easy.solved / mockUserStats.easy.total) * 100)}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-[#00B8A3]"
                          style={{ width: `${(mockUserStats.easy.solved / mockUserStats.easy.total) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium text-[#FFC01E]">Medium</span>
                        <span>
                          {mockUserStats.medium.solved} problems (
                          {Math.round((mockUserStats.medium.solved / mockUserStats.medium.total) * 100)}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-[#FFC01E]"
                          style={{ width: `${(mockUserStats.medium.solved / mockUserStats.medium.total) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium text-[#FF375F]">Hard</span>
                        <span>
                          {mockUserStats.hard.solved} problems (
                          {Math.round((mockUserStats.hard.solved / mockUserStats.hard.total) * 100)}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-[#FF375F]"
                          style={{ width: `${(mockUserStats.hard.solved / mockUserStats.hard.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="mb-4 text-center text-lg font-medium">Alex Chen</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium text-[#00B8A3]">Easy</span>
                        <span>
                          {mockFriendStats.easy.solved} problems (
                          {Math.round((mockFriendStats.easy.solved / mockFriendStats.easy.total) * 100)}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-[#00B8A3]"
                          style={{ width: `${(mockFriendStats.easy.solved / mockFriendStats.easy.total) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium text-[#FFC01E]">Medium</span>
                        <span>
                          {mockFriendStats.medium.solved} problems (
                          {Math.round((mockFriendStats.medium.solved / mockFriendStats.medium.total) * 100)}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-[#FFC01E]"
                          style={{ width: `${(mockFriendStats.medium.solved / mockFriendStats.medium.total) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium text-[#FF375F]">Hard</span>
                        <span>
                          {mockFriendStats.hard.solved} problems (
                          {Math.round((mockFriendStats.hard.solved / mockFriendStats.hard.total) * 100)}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-[#FF375F]"
                          style={{ width: `${(mockFriendStats.hard.solved / mockFriendStats.hard.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="topics" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Topic Strengths</CardTitle>
              <CardDescription>Compare performance across different problem topics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-center text-lg font-medium">Your Top Topics</h3>
                  {[
                    { topic: "Arrays", count: 45, percentage: 75 },
                    { topic: "Dynamic Programming", count: 32, percentage: 65 },
                    { topic: "Trees", count: 28, percentage: 60 },
                    { topic: "Hash Tables", count: 25, percentage: 55 },
                    { topic: "Graphs", count: 18, percentage: 40 },
                  ].map((item) => (
                    <div key={item.topic}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium">{item.topic}</span>
                        <span>{item.count} problems</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${item.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <h3 className="text-center text-lg font-medium">Alex's Top Topics</h3>
                  {[
                    { topic: "Dynamic Programming", count: 65, percentage: 85 },
                    { topic: "Arrays", count: 60, percentage: 80 },
                    { topic: "Graphs", count: 45, percentage: 70 },
                    { topic: "Trees", count: 40, percentage: 65 },
                    { topic: "Binary Search", count: 35, percentage: 60 },
                  ].map((item) => (
                    <div key={item.topic}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium">{item.topic}</span>
                        <span>{item.count} problems</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${item.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Comparison</CardTitle>
              <CardDescription>Compare your activity patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-center text-lg font-medium">Your Activity</h3>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 35 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-8 rounded-sm ${
                          Math.random() > 0.6 ? "bg-primary" : Math.random() > 0.3 ? "bg-primary/50" : "bg-muted"
                        }`}
                        title={`${Math.floor(Math.random() * 5)} problems`}
                      />
                    ))}
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>5 weeks ago</span>
                    <span>Today</span>
                  </div>
                </div>
                <div>
                  <h3 className="mb-4 text-center text-lg font-medium">Alex's Activity</h3>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 35 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-8 rounded-sm ${
                          Math.random() > 0.4 ? "bg-primary" : Math.random() > 0.2 ? "bg-primary/50" : "bg-muted"
                        }`}
                        title={`${Math.floor(Math.random() * 8)} problems`}
                      />
                    ))}
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>5 weeks ago</span>
                    <span>Today</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
