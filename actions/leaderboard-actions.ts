"use server"

import { cookies } from "next/headers"
import type { QuizQuestion } from "@/types/quiz-types"

// In a real app, this would be stored in a database
// For this demo, we'll use a server-side data structure
const dailyLeaderboard: LeaderboardEntry[] = []
let dailyQuestions: QuizQuestion[] = []
let lastQuestionsFetchDate = ""

export interface LeaderboardEntry {
  id: string
  name: string
  score: number
  totalQuestions: number
  percentage: number
  averageTime: number
  date: string
}

// Get today's date in YYYY-MM-DD format
function getTodayDate(): string {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

// Check if we need to fetch new questions
export async function shouldFetchNewQuestions(): Promise<boolean> {
  const today = getTodayDate()
  return today !== lastQuestionsFetchDate || dailyQuestions.length === 0
}

// Set today's questions
export async function setDailyQuestions(questions: QuizQuestion[]): Promise<void> {
  dailyQuestions = questions
  lastQuestionsFetchDate = getTodayDate()
}

// Get today's questions
export async function getDailyQuestions(): Promise<QuizQuestion[]> {
  return dailyQuestions
}

// Add a new entry to the leaderboard
export async function addLeaderboardEntry(entry: Omit<LeaderboardEntry, "id" | "date">): Promise<LeaderboardEntry> {
  const id = Math.random().toString(36).substring(2, 9)
  const date = getTodayDate()

  const newEntry: LeaderboardEntry = {
    ...entry,
    id,
    date,
  }

  dailyLeaderboard.push(newEntry)

  // Sort leaderboard by score (highest first)
  dailyLeaderboard.sort((a, b) => {
    // First by percentage
    if (b.percentage !== a.percentage) {
      return b.percentage - a.percentage
    }
    // Then by average time (faster is better)
    return a.averageTime - b.averageTime
  })

  // Store user's ID in a cookie so they can see their own score highlighted
  cookies().set("quizUserId", id, {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  })

  return newEntry
}

// Get the leaderboard entries for today
export async function getDailyLeaderboard(): Promise<LeaderboardEntry[]> {
  const today = getTodayDate()
  return dailyLeaderboard.filter((entry) => entry.date === today)
}

// Get the user's ID from cookie
export async function getUserId(): Promise<string | undefined> {
  const cookieStore = cookies()
  return cookieStore.get("quizUserId")?.value
}
