"use client"

import type React from "react"

import { useState } from "react"
import { Copy, Plus, Share2, Trophy, Users, X, LinkIcon, Shuffle, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

type ProblemType = "link" | "random" | "criteria"

interface Problem {
  type: ProblemType
  link?: string
  difficulty?: "easy" | "medium" | "hard" | "any"
  tags?: string[]
}

export default function ContestsPage() {
  const [roomId, setRoomId] = useState("")
  const [showCreateSuccess, setShowCreateSuccess] = useState(false)
  const [totalProblems, setTotalProblems] = useState(3)
  const [problems, setProblems] = useState<Problem[]>([
    { type: "criteria", difficulty: "medium", tags: [] },
    { type: "criteria", difficulty: "hard", tags: [] },
    { type: "random" },
  ])
  const [availableTags, setAvailableTags] = useState([
    "Array",
    "String",
    "Hash Table",
    "Dynamic Programming",
    "Math",
    "Sorting",
    "Greedy",
    "Depth-First Search",
    "Binary Search",
    "Tree",
    "Matrix",
    "Two Pointers",
    "Bit Manipulation",
    "Stack",
    "Graph",
  ])
  const [newTag, setNewTag] = useState("")
  const [startTimeOption, setStartTimeOption] = useState("now")
  const [customDate, setCustomDate] = useState<Date | undefined>(new Date())
  const [customTime, setCustomTime] = useState("12:00")

  const mockActiveContests = [
    {
      id: "wknd-123",
      name: "Weekend Challenge",
      participants: 5,
      problems: 3,
      timeLeft: "1 day 12 hours",
      created: "You",
    },
    {
      id: "algo-456",
      name: "Algorithm Showdown",
      participants: 8,
      problems: 5,
      timeLeft: "2 days 4 hours",
      created: "Alex Chen",
    },
  ]

  const mockPastContests = [
    {
      id: "dp-789",
      name: "DP Marathon",
      participants: 6,
      problems: 4,
      date: "April 10, 2023",
      winner: "Sarah Kim",
    },
    {
      id: "tree-101",
      name: "Tree Traversal Challenge",
      participants: 4,
      problems: 3,
      date: "March 25, 2023",
      winner: "You",
    },
    {
      id: "graph-202",
      name: "Graph Theory Contest",
      participants: 7,
      problems: 5,
      date: "March 12, 2023",
      winner: "Mike Johnson",
    },
  ]

  const handleCreateContest = (e: React.FormEvent) => {
    e.preventDefault()
    // Generate a random room ID
    const newRoomId = "contest-" + Math.random().toString(36).substring(2, 8)
    setRoomId(newRoomId)
    setShowCreateSuccess(true)
  }

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId)
    alert("Room ID copied to clipboard!")
  }

  const handleAddProblem = () => {
    if (problems.length < 10) {
      setProblems([...problems, { type: "random" }])
    }
  }

  const handleRemoveProblem = (index: number) => {
    const newProblems = [...problems]
    newProblems.splice(index, 1)
    setProblems(newProblems)
  }

  const handleProblemTypeChange = (index: number, type: ProblemType) => {
    const newProblems = [...problems]
    newProblems[index] = {
      ...newProblems[index],
      type,
      // Reset other fields when changing type
      ...(type === "link" ? { difficulty: undefined, tags: undefined } : {}),
      ...(type === "random" ? { link: undefined, difficulty: undefined, tags: undefined } : {}),
      ...(type === "criteria" ? { link: undefined, difficulty: "medium", tags: [] } : {}),
    }
    setProblems(newProblems)
  }

  const handleProblemLinkChange = (index: number, link: string) => {
    const newProblems = [...problems]
    newProblems[index] = { ...newProblems[index], link }
    setProblems(newProblems)
  }

  const handleProblemDifficultyChange = (index: number, difficulty: "easy" | "medium" | "hard" | "any") => {
    const newProblems = [...problems]
    newProblems[index] = { ...newProblems[index], difficulty }
    setProblems(newProblems)
  }

  const handleAddTag = (index: number, tag: string) => {
    const newProblems = [...problems]
    const currentTags = newProblems[index].tags || []
    if (!currentTags.includes(tag)) {
      newProblems[index] = { ...newProblems[index], tags: [...currentTags, tag] }
      setProblems(newProblems)
    }
  }

  const handleRemoveTag = (index: number, tag: string) => {
    const newProblems = [...problems]
    const currentTags = newProblems[index].tags || []
    newProblems[index] = { ...newProblems[index], tags: currentTags.filter((t) => t !== tag) }
    setProblems(newProblems)
  }

  const handleAddCustomTag = (index: number) => {
    if (newTag.trim() && !availableTags.includes(newTag.trim())) {
      setAvailableTags([...availableTags, newTag.trim()])
      handleAddTag(index, newTag.trim())
      setNewTag("")
    } else if (newTag.trim()) {
      handleAddTag(index, newTag.trim())
      setNewTag("")
    }
  }

  const updateTotalProblems = (value: string) => {
    const num = Number.parseInt(value, 10)
    if (!isNaN(num) && num > 0 && num <= 10) {
      setTotalProblems(num)

      // Adjust problems array length
      if (num > problems.length) {
        // Add more problems
        const newProblems = [...problems]
        for (let i = problems.length; i < num; i++) {
          newProblems.push({ type: "random" })
        }
        setProblems(newProblems)
      } else if (num < problems.length) {
        // Remove excess problems
        setProblems(problems.slice(0, num))
      }
    }
  }

  const formatCustomStartTime = () => {
    if (!customDate) return "Invalid date"

    try {
      const [hours, minutes] = customTime.split(":").map(Number)
      const dateWithTime = new Date(customDate)
      dateWithTime.setHours(hours, minutes)

      return format(dateWithTime, "PPP 'at' p")
    } catch (error) {
      return "Invalid date/time"
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Contests</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Contest
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            {!showCreateSuccess ? (
              <>
                <DialogHeader>
                  <DialogTitle>Create a New Contest</DialogTitle>
                  <DialogDescription>Set up a virtual coding contest for you and your friends</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateContest}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="contest-name">Contest Name</Label>
                      <Input id="contest-name" placeholder="Weekend Challenge" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="contest-description">Description</Label>
                      <Textarea id="contest-description" placeholder="A weekend challenge to solve 3 problems..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="problem-count">Number of Problems</Label>
                        <Select value={totalProblems.toString()} onValueChange={updateTotalProblems}>
                          <SelectTrigger id="problem-count">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} Problem{num !== 1 ? "s" : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="duration">Duration</Label>
                        <Select defaultValue="2d">
                          <SelectTrigger id="duration">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1h">1 Hour</SelectItem>
                            <SelectItem value="2h">2 Hours</SelectItem>
                            <SelectItem value="4h">4 Hours</SelectItem>
                            <SelectItem value="1d">1 Day</SelectItem>
                            <SelectItem value="2d">2 Days</SelectItem>
                            <SelectItem value="7d">1 Week</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label>Problem Selection</Label>
                        <div className="text-xs text-muted-foreground">
                          {problems.length} of {totalProblems} problems configured
                        </div>
                      </div>

                      <div className="space-y-4">
                        {problems.map((problem, index) => (
                          <Card key={index}>
                            <CardHeader className="py-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium">Problem {index + 1}</CardTitle>
                                <div className="flex items-center gap-2">
                                  <Select
                                    value={problem.type}
                                    onValueChange={(value) => handleProblemTypeChange(index, value as ProblemType)}
                                  >
                                    <SelectTrigger className="h-8 w-[140px]">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="link">Specific Problem</SelectItem>
                                      <SelectItem value="criteria">By Criteria</SelectItem>
                                      <SelectItem value="random">Random</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  {problems.length > 1 && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleRemoveProblem(index)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              {problem.type === "link" && (
                                <div className="flex items-center gap-2">
                                  <LinkIcon className="h-4 w-4 text-muted-foreground" />
                                  <Input
                                    placeholder="https://leetcode.com/problems/two-sum/"
                                    value={problem.link || ""}
                                    onChange={(e) => handleProblemLinkChange(index, e.target.value)}
                                  />
                                </div>
                              )}

                              {problem.type === "criteria" && (
                                <div className="space-y-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor={`difficulty-${index}`}>Difficulty</Label>
                                    <Select
                                      value={problem.difficulty || "medium"}
                                      onValueChange={(value) =>
                                        handleProblemDifficultyChange(
                                          index,
                                          value as "easy" | "medium" | "hard" | "any",
                                        )
                                      }
                                    >
                                      <SelectTrigger id={`difficulty-${index}`}>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="any">Any Difficulty</SelectItem>
                                        <SelectItem value="easy">Easy</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="hard">Hard</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="grid gap-2">
                                    <Label>Tags (Optional)</Label>
                                    <div className="flex flex-wrap gap-1 mb-2">
                                      {problem.tags?.map((tag) => (
                                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                          {tag}
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-4 w-4 p-0 ml-1"
                                            onClick={() => handleRemoveTag(index, tag)}
                                          >
                                            <X className="h-3 w-3" />
                                          </Button>
                                        </Badge>
                                      ))}
                                    </div>
                                    <div className="flex gap-2">
                                      <Input
                                        placeholder="Add a tag"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                            e.preventDefault()
                                            handleAddCustomTag(index)
                                          }
                                        }}
                                      />
                                      <Button type="button" variant="outline" onClick={() => handleAddCustomTag(index)}>
                                        Add
                                      </Button>
                                    </div>
                                    <div className="mt-2">
                                      <Label className="text-xs text-muted-foreground mb-2 block">Common Tags</Label>
                                      <div className="flex flex-wrap gap-1">
                                        {availableTags.slice(0, 10).map((tag) => (
                                          <Badge
                                            key={tag}
                                            variant="outline"
                                            className="cursor-pointer hover:bg-secondary"
                                            onClick={() => handleAddTag(index, tag)}
                                          >
                                            {tag}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {problem.type === "random" && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Shuffle className="h-4 w-4" />
                                  <span>System will randomly select a problem</span>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}

                        {problems.length < totalProblems && (
                          <Button type="button" variant="outline" className="w-full" onClick={handleAddProblem}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Problem
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="visibility">Visibility</Label>
                        <Select defaultValue="friends">
                          <SelectTrigger id="visibility">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="private">Private (Invite Only)</SelectItem>
                            <SelectItem value="friends">Friends Only</SelectItem>
                            <SelectItem value="public">Public</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="start-time">Start Time</Label>
                        <Select value={startTimeOption} onValueChange={setStartTimeOption}>
                          <SelectTrigger id="start-time">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="now">Start Immediately</SelectItem>
                            <SelectItem value="1h">In 1 Hour</SelectItem>
                            <SelectItem value="3h">In 3 Hours</SelectItem>
                            <SelectItem value="6h">In 6 Hours</SelectItem>
                            <SelectItem value="12h">In 12 Hours</SelectItem>
                            <SelectItem value="1d">Tomorrow</SelectItem>
                            <SelectItem value="custom">Custom Date & Time</SelectItem>
                          </SelectContent>
                        </Select>

                        {startTimeOption === "custom" && (
                          <div className="grid gap-4 mt-2">
                            <div className="grid gap-2">
                              <Label>Date</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !customDate && "text-muted-foreground",
                                    )}
                                  >
                                    <Calendar className="mr-2 h-4 w-4" />
                                    {customDate ? format(customDate, "PPP") : <span>Pick a date</span>}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <CalendarComponent
                                    mode="single"
                                    selected={customDate}
                                    onSelect={setCustomDate}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="time">Time</Label>
                              <Input
                                id="time"
                                type="time"
                                value={customTime}
                                onChange={(e) => setCustomTime(e.target.value)}
                              />
                            </div>

                            <div className="text-sm text-muted-foreground">
                              Contest will start on: {formatCustomStartTime()}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="auto-invite" />
                      <Label htmlFor="auto-invite">Automatically invite all friends</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Create Contest</Button>
                  </DialogFooter>
                </form>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Contest Created!</DialogTitle>
                  <DialogDescription>
                    Your contest has been created. Share this room ID with your friends to invite them.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-2 py-4">
                  <Input value={roomId} readOnly />
                  <Button variant="outline" size="icon" onClick={handleCopyRoomId}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => {
                      setShowCreateSuccess(false)
                      // In a real app, this would navigate to the contest page
                    }}
                  >
                    Go to Contest
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Join a Contest</CardTitle>
          <CardDescription>Enter a room ID to join an existing contest</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex w-full max-w-sm items-center space-x-2">
            <Input type="text" placeholder="Enter room ID" />
            <Button type="submit">Join</Button>
          </form>
        </CardContent>
      </Card>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Contests</TabsTrigger>
          <TabsTrigger value="past">Past Contests</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {mockActiveContests.map((contest) => (
              <Card key={contest.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{contest.name}</CardTitle>
                    <div className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      {contest.timeLeft} left
                    </div>
                  </div>
                  <CardDescription>Created by {contest.created}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{contest.participants} participants</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{contest.problems} problems</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Invite
                  </Button>
                  <Button size="sm">Enter Contest</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="past" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Past Contests</CardTitle>
              <CardDescription>Your contest history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPastContests.map((contest) => (
                  <div key={contest.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <h3 className="font-medium">{contest.name}</h3>
                      <p className="text-sm text-muted-foreground">{contest.date}</p>
                      <div className="mt-1 flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span>{contest.participants}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Trophy className="h-3 w-3 text-muted-foreground" />
                          <span>{contest.problems} problems</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">Winner</div>
                      <div className={`text-sm ${contest.winner === "You" ? "font-bold text-primary" : ""}`}>
                        {contest.winner}
                      </div>
                      <Button variant="ghost" size="sm" className="mt-2">
                        View Results
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
