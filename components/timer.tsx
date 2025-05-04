"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Clock } from "lucide-react"

interface TimerProps {
  timeRemaining: number
  totalTime: number
  isActive: boolean
}

export default function Timer({ timeRemaining, totalTime, isActive }: TimerProps) {
  const progressRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  const percentage = (timeRemaining / totalTime) * 100

  useEffect(() => {
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: `${percentage}%`,
        duration: 0.5,
        ease: "power1.out",
      })
    }

    // Flash animation when time is running low
    if (timeRemaining <= 5 && isActive && timerRef.current) {
      gsap.to(timerRef.current, {
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        duration: 0.3,
        repeat: 1,
        yoyo: true,
      })

      // Pulse animation for text when time is low
      if (textRef.current) {
        gsap.to(textRef.current, {
          scale: 1.1,
          color: "#ef4444",
          fontWeight: "bold",
          duration: 0.3,
          repeat: 1,
          yoyo: true,
        })
      }
    }
  }, [timeRemaining, percentage, isActive])

  // Determine color based on time remaining
  let bgColor = "bg-emerald-500"
  if (timeRemaining <= 5) {
    bgColor = "bg-red-500"
  } else if (timeRemaining <= 15) {
    bgColor = "bg-yellow-500"
  }

  return (
    <div
      ref={timerRef}
      className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border border-gray-100"
    >
      <Clock className={`h-4 w-4 ${timeRemaining <= 5 ? "text-red-500" : "text-gray-600"}`} />
      <div ref={textRef} className="text-sm font-medium">
        {timeRemaining}s
      </div>
      <div className="w-20 h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div ref={progressRef} className={`h-full ${bgColor} rounded-full`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  )
}
