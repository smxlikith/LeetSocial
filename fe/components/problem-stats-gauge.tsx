"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

interface ProblemStatsGaugeProps {
  solved: number
  total: number
  easy: { solved: number; total: number }
  medium: { solved: number; total: number }
  hard: { solved: number; total: number }
  attempting: number
  size?: number
  username?: string
}

export function ProblemStatsGauge({
  solved,
  total,
  easy,
  medium,
  hard,
  attempting,
  size = 200,
  username,
}: ProblemStatsGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set the actual size of the canvas
    canvas.width = size * 2
    canvas.height = size * 2

    // Scale for retina displays
    ctx.scale(2, 2)

    const centerX = size / 2
    const centerY = size / 2
    const radius = size * 0.4
    const lineWidth = size * 0.05

    // Calculate the angles for each segment
    const totalAngle = Math.PI * 1.8 // 90% of a full circle
    const startAngle = Math.PI * 1.1 // Start at 198 degrees
    const easyRatio = easy.total / total
    const mediumRatio = medium.total / total
    const hardRatio = hard.total / total

    const easyAngle = totalAngle * easyRatio
    const mediumAngle = totalAngle * mediumRatio
    const hardAngle = totalAngle * hardRatio

    // Calculate progress for each difficulty
    const easyProgress = easy.solved / easy.total
    const mediumProgress = medium.solved / medium.total
    const hardProgress = hard.solved / hard.total

    // Background color based on theme
    const bgColor = theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"

    // Draw background arcs
    ctx.lineWidth = lineWidth
    ctx.lineCap = "round"

    // Easy background
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + easyAngle)
    ctx.strokeStyle = bgColor
    ctx.stroke()

    // Medium background
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle + easyAngle, startAngle + easyAngle + mediumAngle)
    ctx.strokeStyle = bgColor
    ctx.stroke()

    // Hard background
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle + easyAngle + mediumAngle, startAngle + totalAngle)
    ctx.strokeStyle = bgColor
    ctx.stroke()

    // Draw progress arcs
    // Easy progress (green)
    if (easyProgress > 0) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + easyAngle * easyProgress)
      ctx.strokeStyle = "#00B8A3" // LeetCode easy color (teal)
      ctx.stroke()
    }

    // Medium progress (yellow)
    if (mediumProgress > 0) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, startAngle + easyAngle, startAngle + easyAngle + mediumAngle * mediumProgress)
      ctx.strokeStyle = "#FFC01E" // LeetCode medium color (yellow)
      ctx.stroke()
    }

    // Hard progress (red)
    if (hardProgress > 0) {
      ctx.beginPath()
      ctx.arc(
        centerX,
        centerY,
        radius,
        startAngle + easyAngle + mediumAngle,
        startAngle + easyAngle + mediumAngle + hardAngle * hardProgress,
      )
      ctx.strokeStyle = "#FF375F" // LeetCode hard color (red)
      ctx.stroke()
    }
  }, [size, solved, total, easy, medium, hard, theme])

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={size * 2}
          height={size * 2}
          className="h-[200px] w-[200px]"
          style={{ width: size, height: size }}
        />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-3xl font-bold">{solved}</div>
          <div className="text-sm text-muted-foreground">/{total}</div>
          <div className="text-sm">Solved</div>
          {attempting > 0 && <div className="mt-1 text-xs text-muted-foreground">{attempting} Attempting</div>}
        </div>
      </div>
      {username && <div className="mt-2 text-sm font-medium">{username}</div>}
    </div>
  )
}
