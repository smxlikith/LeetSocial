"use client"

import type React from "react"

import { useState } from "react"
import { BarChart3, Check, Plus, Search, Trash, UserPlus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FriendsPage() {
  const [friendUsername, setFriendUsername] = useState("")

  const mockFriends = [
    { username: "alexchen", name: "Alex Chen", problems: 412, rank: 1 },
    { username: "sarahkim", name: "Sarah Kim", problems: 389, rank: 2 },
    { username: "mikejohnson", name: "Mike Johnson", problems: 201, rank: 4 },
    { username: "emmadavis", name: "Emma Davis", problems: 187, rank: 5 },
    { username: "jasonlee", name: "Jason Lee", problems: 156, rank: 6 },
    { username: "sophiawang", name: "Sophia Wang", problems: 134, rank: 7 },
    { username: "davidsmith", name: "David Smith", problems: 98, rank: 8 },
  ]

  const mockRequests = [
    { username: "robertjones", name: "Robert Jones" },
    { username: "oliviabrown", name: "Olivia Brown" },
  ]

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send a friend request
    alert(`Friend request sent to ${friendUsername}`)
    setFriendUsername("")
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Friends</h1>
        <Button size="sm">
          <UserPlus className="mr-2 h-4 w-4" />
          Import from LeetCode
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add a Friend</CardTitle>
          <CardDescription>Enter your friend's LeetCode username to send them a friend request</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddFriend} className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="LeetCode username"
              value={friendUsername}
              onChange={(e) => setFriendUsername(e.target.value)}
            />
            <Button type="submit">
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      <Tabs defaultValue="friends">
        <TabsList>
          <TabsTrigger value="friends">My Friends ({mockFriends.length})</TabsTrigger>
          <TabsTrigger value="requests">Friend Requests ({mockRequests.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="friends" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Friends List</CardTitle>
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search friends..."
                    className="w-full bg-background pl-8 md:w-[300px]"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {mockFriends.map((friend) => (
                  <div key={friend.username} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        {friend.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{friend.name}</p>
                        <p className="text-sm text-muted-foreground">@{friend.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <span className="font-medium">{friend.problems}</span> problems
                      </div>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Compare
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="requests" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Friend Requests</CardTitle>
              <CardDescription>Accept or decline friend requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRequests.map((request) => (
                  <div key={request.username} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        {request.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{request.name}</p>
                        <p className="text-sm text-muted-foreground">@{request.username}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <X className="mr-2 h-4 w-4" />
                        Decline
                      </Button>
                      <Button size="sm">
                        <Check className="mr-2 h-4 w-4" />
                        Accept
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
