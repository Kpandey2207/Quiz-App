"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { Trophy, RotateCcw, CheckCircle, XCircle, Clock, ArrowLeft } from "lucide-react"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js"
import { Pie, Bar } from "react-chartjs-2"
import Leaderboard from "./leaderboard"
import SubmitScore from "./submit-score"

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

interface ResultsCardProps {
  score: number
  totalQuestions: number
  onRestart: () => void
  questionStats: Array<{
    question: string
    userAnswer: string
    correctAnswer: string
    isCorrect: boolean
    timeTaken: number
  }>
}

export default function ResultsCard({ score, totalQuestions, onRestart, questionStats }: ResultsCardProps) {
  const percentage = Math.round((score / totalQuestions) * 100)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [scoreSubmitted, setScoreSubmitted] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const chartsRef = useRef<HTMLDivElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const leaderboardButtonRef = useRef<HTMLButtonElement>(null)

  let message = ""
  let messageColor = ""

  if (percentage === 100) {
    message = "Perfect! You're a quiz master! 🏆"
    messageColor = "text-purple-600"
  } else if (percentage >= 80) {
    message = "Excellent! You did great! 🎉"
    messageColor = "text-green-600"
  } else if (percentage >= 60) {
    message = "Good job! You passed the quiz. 👍"
    messageColor = "text-blue-600"
  } else if (percentage >= 40) {
    message = "Not bad, but you can do better! 💪"
    messageColor = "text-yellow-600"
  } else {
    message = "Keep practicing to improve your score! 📚"
    messageColor = "text-red-600"
  }

  // Calculate average time taken
  const totalTimeTaken = questionStats.reduce((acc, stat) => acc + stat.timeTaken, 0)
  const averageTimeTaken = totalTimeTaken / totalQuestions

  // Prepare data for pie chart
  const pieData = {
    labels: ["Correct", "Incorrect"],
    datasets: [
      {
        data: [score, totalQuestions - score],
        backgroundColor: ["rgba(132, 90, 223, 0.8)", "rgba(255, 99, 132, 0.8)"],
        borderColor: ["rgba(132, 90, 223, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  }

  // Prepare data for time taken bar chart
  const barData = {
    labels: questionStats.map((_, index) => `Q${index + 1}`),
    datasets: [
      {
        label: "Time Taken (seconds)",
        data: questionStats.map((stat) => stat.timeTaken),
        backgroundColor: questionStats.map((stat) =>
          stat.isCorrect ? "rgba(132, 90, 223, 0.6)" : "rgba(255, 99, 132, 0.6)",
        ),
        borderColor: questionStats.map((stat) => (stat.isCorrect ? "rgba(132, 90, 223, 1)" : "rgba(255, 99, 132, 1)")),
        borderWidth: 1,
      },
    ],
  }

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Time Taken Per Question",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Seconds",
        },
      },
    },
  }

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        {
          opacity: 0,
          y: 30,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
        },
      )
    }

    if (chartsRef.current) {
      gsap.fromTo(
        chartsRef.current,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.4,
          ease: "power2.out",
        },
      )
    }

    if (summaryRef.current) {
      gsap.fromTo(
        summaryRef.current.children,
        {
          opacity: 0,
          y: 10,
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.5,
          delay: 0.6,
          ease: "power2.out",
        },
      )
    }

    if (buttonRef.current) {
      gsap.fromTo(
        buttonRef.current,
        {
          opacity: 0,
          y: 20,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          delay: 1,
          ease: "back.out(1.7)",
        },
      )

      // Button hover animation
      const button = buttonRef.current

      const hoverIn = () => {
        gsap.to(button, {
          scale: 1.05,
          duration: 0.3,
          ease: "back.out(1.7)",
        })
      }

      const hoverOut = () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        })
      }

      button.addEventListener("mouseenter", hoverIn)
      button.addEventListener("mouseleave", hoverOut)

      return () => {
        button.removeEventListener("mouseenter", hoverIn)
        button.removeEventListener("mouseleave", hoverOut)
      }
    }

    if (leaderboardButtonRef.current) {
      const button = leaderboardButtonRef.current

      const hoverIn = () => {
        gsap.to(button, {
          scale: 1.05,
          duration: 0.3,
          ease: "back.out(1.7)",
        })
      }

      const hoverOut = () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        })
      }

      button.addEventListener("mouseenter", hoverIn)
      button.addEventListener("mouseleave", hoverOut)

      return () => {
        button.removeEventListener("mouseenter", hoverIn)
        button.removeEventListener("mouseleave", hoverOut)
      }
    }
  }, [])

  const handleToggleLeaderboard = () => {
    if (cardRef.current) {
      // Animate out
      gsap.to(cardRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setShowLeaderboard(!showLeaderboard)
          // Animate in
          gsap.to(cardRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.7)",
          })
        },
      })
    } else {
      setShowLeaderboard(!showLeaderboard)
    }
  }

  const handleScoreSubmitted = () => {
    setScoreSubmitted(true)
    setShowLeaderboard(true)
  }

  if (showLeaderboard) {
    return (
      <div ref={cardRef} className="w-full max-w-2xl">
        <div className="mb-4 flex items-center">
          <button
            onClick={handleToggleLeaderboard}
            className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Results
          </button>
        </div>
        <Leaderboard />
        <div className="mt-6">
          <button
            ref={buttonRef}
            onClick={onRestart}
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <RotateCcw className="h-5 w-5" />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!scoreSubmitted) {
    return (
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
        <div
          ref={cardRef}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-purple-100 md:col-span-1"
        >
          <div className="p-8 text-center border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-6 shadow-inner">
              <Trophy className="h-12 w-12 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Quiz Completed!</h2>
            <p className={`text-xl font-semibold ${messageColor} mb-4`}>{message}</p>
            <div className="mt-4 text-4xl font-bold">
              <span className="text-purple-600">{score}</span>
              <span className="text-gray-400">/{totalQuestions}</span>
              <span className="ml-2 text-lg text-gray-600">({percentage}%)</span>
            </div>
            <div className="mt-3 flex items-center justify-center text-gray-600">
              <Clock className="h-5 w-5 mr-2 text-purple-500" />
              <span>
                Average time: <span className="font-medium text-purple-700">{averageTimeTaken.toFixed(1)}</span> seconds
                per question
              </span>
            </div>
          </div>

          <div className="p-6 flex flex-col gap-4">
            <button
              ref={leaderboardButtonRef}
              onClick={handleToggleLeaderboard}
              className="w-full py-3 px-6 bg-white border border-purple-200 text-purple-700 rounded-xl font-medium flex items-center justify-center gap-2 transition-all hover:bg-purple-50"
            >
              <Trophy className="h-5 w-5" />
              View Leaderboard
            </button>

            <button
              ref={buttonRef}
              onClick={onRestart}
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <RotateCcw className="h-5 w-5" />
              Try Again
            </button>
          </div>
        </div>

        <div className="md:col-span-1">
          <SubmitScore
            score={score}
            totalQuestions={totalQuestions}
            averageTime={averageTimeTaken}
            onSubmitted={handleScoreSubmitted}
          />
        </div>
      </div>
    )
  }

  return (
    <div ref={cardRef} className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-purple-100">
      <div className="p-8 text-center border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-6 shadow-inner">
          <Trophy className="h-12 w-12 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Quiz Completed!</h2>
        <p className={`text-xl font-semibold ${messageColor} mb-4`}>{message}</p>
        <div className="mt-4 text-4xl font-bold">
          <span className="text-purple-600">{score}</span>
          <span className="text-gray-400">/{totalQuestions}</span>
          <span className="ml-2 text-lg text-gray-600">({percentage}%)</span>
        </div>
        <div className="mt-3 flex items-center justify-center text-gray-600">
          <Clock className="h-5 w-5 mr-2 text-purple-500" />
          <span>
            Average time: <span className="font-medium text-purple-700">{averageTimeTaken.toFixed(1)}</span> seconds per
            question
          </span>
        </div>
      </div>

      <div ref={chartsRef} className="p-6 grid md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Performance Summary</h3>
          <div className="w-full max-w-[200px] mx-auto">
            <Pie data={pieData} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Time Analysis</h3>
          <Bar options={barOptions} data={barData} />
        </div>
      </div>

      <div className="p-6 max-h-80 overflow-y-auto border-t border-gray-100 bg-gradient-to-b from-white to-purple-50">
        <h3 className="font-semibold text-gray-700 mb-4 text-lg">Question Summary</h3>
        <div ref={summaryRef} className="space-y-4">
          {questionStats.map((stat, index) => (
            <div key={index} className="border rounded-xl p-4 hover:shadow-md transition-shadow bg-white">
              <div className="flex items-start gap-3">
                {stat.isCorrect ? (
                  <CheckCircle className="h-6 w-6 text-emerald-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p
                    className="font-medium text-gray-800 text-lg"
                    dangerouslySetInnerHTML={{ __html: stat.question }}
                  />
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-sm">
                    <p className="px-3 py-1 rounded-full bg-gray-100">
                      <span className="text-gray-600">Your answer: </span>
                      <span className={stat.isCorrect ? "text-emerald-600 font-medium" : "text-red-600 font-medium"}>
                        {stat.userAnswer}
                      </span>
                    </p>
                    {!stat.isCorrect && (
                      <p className="px-3 py-1 rounded-full bg-emerald-50">
                        <span className="text-gray-600">Correct answer: </span>
                        <span className="text-emerald-600 font-medium">{stat.correctAnswer}</span>
                      </p>
                    )}
                    <p className="px-3 py-1 rounded-full bg-purple-50">
                      <span className="text-gray-600">Time: </span>
                      <span className="text-purple-600 font-medium">{stat.timeTaken} seconds</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-gray-100 bg-gradient-to-b from-purple-50 to-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            ref={leaderboardButtonRef}
            onClick={handleToggleLeaderboard}
            className="py-4 px-6 bg-white border border-purple-200 text-purple-700 rounded-xl font-medium flex items-center justify-center gap-2 transition-all hover:bg-purple-50 shadow-md"
          >
            <Trophy className="h-5 w-5" />
            View Leaderboard
          </button>

          <button
            ref={buttonRef}
            onClick={onRestart}
            className="py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <RotateCcw className="h-5 w-5" />
            Try Again
          </button>
        </div>
      </div>
    </div>
  )
}
