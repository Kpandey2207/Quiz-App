"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { Trophy, Clock, Medal, User } from "lucide-react"
import { type LeaderboardEntry, getDailyLeaderboard, getUserId } from "@/actions/leaderboard-actions"

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userId, setUserId] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(true)
  const leaderboardRef = useRef<HTMLDivElement>(null)
  const entriesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true)
        const entries = await getDailyLeaderboard()
        const userIdValue = await getUserId()

        setLeaderboard(entries)
        setUserId(userIdValue)
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error)
        setIsLoading(false)
      }
    }

    fetchLeaderboard()

    // Refresh leaderboard every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!isLoading && leaderboardRef.current) {
      gsap.fromTo(
        leaderboardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" },
      )
    }

    if (!isLoading && entriesRef.current && entriesRef.current.children.length > 0) {
      gsap.fromTo(
        entriesRef.current.children,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.4,
          ease: "power2.out",
          delay: 0.3,
        },
      )
    }
  }, [isLoading, leaderboard])

  // Get medal for top 3 positions
  const getMedal = (position: number) => {
    switch (position) {
      case 0:
        return <Medal className="h-5 w-5 text-yellow-500" />
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 2:
        return <Medal className="h-5 w-5 text-amber-700" />
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 animate-pulse">
        <div className="flex items-center justify-center mb-6">
          <div className="h-8 w-40 bg-gray-200 rounded"></div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="h-6 w-24 bg-gray-200 rounded"></div>
            <div className="h-6 w-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div ref={leaderboardRef} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-purple-100">
      <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
        <Trophy className="h-5 w-5 text-purple-700 mr-2" />
        <h2 className="text-xl font-bold text-purple-800">Daily Leaderboard</h2>
      </div>

      {leaderboard.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-500">No entries yet. Be the first to complete the quiz!</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-gray-50 text-sm font-medium text-gray-500">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Name</div>
            <div className="col-span-2 text-center">Score</div>
            <div className="col-span-2 text-center">%</div>
            <div className="col-span-2 text-center">Time</div>
          </div>

          <div ref={entriesRef} className="max-h-80 overflow-y-auto">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.id}
                className={`grid grid-cols-12 gap-2 px-4 py-3 items-center ${
                  entry.id === userId
                    ? "bg-purple-50 border-l-4 border-purple-500"
                    : index % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50"
                }`}
              >
                <div className="col-span-1 flex items-center">
                  {getMedal(index) || <span className="text-gray-500">{index + 1}</span>}
                </div>
                <div className="col-span-5 font-medium text-gray-800 flex items-center">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  {entry.name}
                  {entry.id === userId && (
                    <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">You</span>
                  )}
                </div>
                <div className="col-span-2 text-center font-medium">
                  {entry.score}/{entry.totalQuestions}
                </div>
                <div className="col-span-2 text-center">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      entry.percentage >= 80
                        ? "bg-green-100 text-green-800"
                        : entry.percentage >= 60
                          ? "bg-blue-100 text-blue-800"
                          : entry.percentage >= 40
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                    }`}
                  >
                    {entry.percentage}%
                  </span>
                </div>
                <div className="col-span-2 text-center flex items-center justify-center text-gray-600">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{entry.averageTime.toFixed(1)}s</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
