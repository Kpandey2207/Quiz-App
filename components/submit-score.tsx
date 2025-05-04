"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { gsap } from "gsap"
import { addLeaderboardEntry } from "@/actions/leaderboard-actions"

interface SubmitScoreProps {
  score: number
  totalQuestions: number
  averageTime: number
  onSubmitted: () => void
}

export default function SubmitScore({ score, totalQuestions, averageTime, onSubmitted }: SubmitScoreProps) {
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(formRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" })
    }

    // Focus the input field
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setError("Please enter your name")
      return
    }

    if (name.length > 20) {
      setError("Name must be 20 characters or less")
      return
    }

    try {
      setIsSubmitting(true)
      setError("")

      await addLeaderboardEntry({
        name: name.trim(),
        score,
        totalQuestions,
        percentage: Math.round((score / totalQuestions) * 100),
        averageTime,
      })

      // Animate form out
      if (formRef.current) {
        gsap.to(formRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.4,
          ease: "power2.in",
          onComplete: onSubmitted,
        })
      } else {
        onSubmitted()
      }
    } catch (error) {
      console.error("Failed to submit score:", error)
      setError("Failed to submit score. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Submit Your Score</h3>

      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Your Name
        </label>
        <input
          ref={inputRef}
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          maxLength={20}
          disabled={isSubmitting}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600">
          Score:{" "}
          <span className="font-medium text-purple-700">
            {score}/{totalQuestions}
          </span>
        </div>
        <div className="text-sm text-gray-600">
          Avg Time: <span className="font-medium text-purple-700">{averageTime.toFixed(1)}s</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-70"
      >
        {isSubmitting ? "Submitting..." : "Submit Score"}
      </button>
    </form>
  )
}
