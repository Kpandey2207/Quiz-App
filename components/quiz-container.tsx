"use client"

import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import QuestionCard from "./question-card"
import ResultsCard from "./results-card"
import ProgressBar from "./progress-bar"
import LoadingSpinner from "./loading-spinner"
import Timer from "./timer"
import type { QuizQuestion } from "@/types/quiz-types"
import { fetchQuizQuestions } from "@/lib/api"
import { shouldFetchNewQuestions, setDailyQuestions, getDailyQuestions } from "@/actions/leaderboard-actions"

export default function QuizContainer() {
  const [quizData, setQuizData] = useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(30)
  const [isTimerActive, setIsTimerActive] = useState(true)
  const [questionStats, setQuestionStats] = useState<
    Array<{
      question: string
      userAnswer: string
      correctAnswer: string
      isCorrect: boolean
      timeTaken: number
    }>
  >([])

  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const timePerQuestion = 30 // seconds

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true)

        // Check if we need to fetch new questions for today
        const needNewQuestions = await shouldFetchNewQuestions()

        if (needNewQuestions) {
          // Fetch new questions from API
          const questions = await fetchQuizQuestions()

          if (!questions || questions.length === 0) {
            // If API fails, use local questions
            const { quizData } = await import("@/data/quiz-data")
            await setDailyQuestions(quizData)
            setQuizData(quizData)
          } else {
            // Store today's questions
            await setDailyQuestions(questions)
            setQuizData(questions)
          }
        } else {
          // Use today's cached questions
          const dailyQuestions = await getDailyQuestions()
          setQuizData(dailyQuestions)
        }

        setIsLoading(false)
      } catch (err) {
        console.error("Failed to load quiz questions:", err)
        setError("Failed to load quiz questions. Using local questions instead.")

        // Import the local quiz data as fallback
        try {
          const { quizData } = await import("@/data/quiz-data")
          await setDailyQuestions(quizData)
          setQuizData(quizData)
          setError(null) // Clear error if we successfully loaded local data
        } catch (localErr) {
          setError("Failed to load any quiz questions. Please refresh the page.")
        }

        setIsLoading(false)
      }
    }

    loadQuestions()
  }, [])

  useEffect(() => {
    if (!isLoading && containerRef.current) {
      // Initial animation for the container
      gsap.fromTo(
        containerRef.current,
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
  }, [isLoading])

  useEffect(() => {
    if (quizData.length > 0) {
      setTimeRemaining(timePerQuestion)
      setIsTimerActive(true)
    }
  }, [currentQuestionIndex, quizData])

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isTimerActive && timeRemaining > 0 && !isAnswered) {
      timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
    } else if (timeRemaining === 0 && !isAnswered && quizData.length > 0) {
      // Auto-submit when time runs out
      handleTimeUp()
    }

    return () => clearTimeout(timer)
  }, [timeRemaining, isTimerActive, isAnswered])

  // Button hover animation
  useEffect(() => {
    if (buttonRef.current) {
      const button = buttonRef.current

      const hoverIn = () => {
        gsap.to(button, {
          scale: 1.03,
          duration: 0.2,
          ease: "power1.out",
        })
      }

      const hoverOut = () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.2,
          ease: "power1.out",
        })
      }

      button.addEventListener("mouseenter", hoverIn)
      button.addEventListener("mouseleave", hoverOut)

      return () => {
        button.removeEventListener("mouseenter", hoverIn)
        button.removeEventListener("mouseleave", hoverOut)
      }
    }
  }, [selectedOption, isAnswered])

  const handleTimeUp = () => {
    if (quizData.length === 0) return

    setIsAnswered(true)
    setIsCorrect(false)

    const currentQuestion = quizData[currentQuestionIndex]

    // Record the answer as timeout
    setQuestionStats([
      ...questionStats,
      {
        question: currentQuestion.question,
        userAnswer: "Time's up!",
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect: false,
        timeTaken: timePerQuestion,
      },
    ])

    // Shake the container to indicate time's up
    if (containerRef.current) {
      gsap.fromTo(containerRef.current, { x: -10 }, { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" })
    }
  }

  const handleOptionSelect = (option: string) => {
    if (!isAnswered) {
      setSelectedOption(option)

      // Animate the selected option
      gsap.to(`#option-${option.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "")}`, {
        scale: 1.03,
        boxShadow: "0 4px 20px rgba(124, 58, 237, 0.2)",
        duration: 0.3,
        ease: "back.out(1.7)",
      })
    }
  }

  const handleNextQuestion = () => {
    if (!selectedOption && !isAnswered) return

    if (!isAnswered) {
      // Check if answer is correct
      const currentQuestion = quizData[currentQuestionIndex]
      const correct = selectedOption === currentQuestion.correctAnswer
      setIsCorrect(correct)
      setIsAnswered(true)
      setIsTimerActive(false)

      if (correct) {
        setScore(score + 1)

        // Celebration animation for correct answer
        gsap.to(containerRef.current, {
          keyframes: {
            "0%": { y: 0 },
            "25%": { y: -10 },
            "50%": { y: 0 },
            "75%": { y: -5 },
            "100%": { y: 0 },
          },
          duration: 0.5,
          ease: "power1.out",
        })
      } else {
        // Subtle shake for incorrect answer
        gsap.to(containerRef.current, {
          keyframes: {
            "0%": { x: 0 },
            "25%": { x: -5 },
            "50%": { x: 5 },
            "75%": { x: -5 },
            "100%": { x: 0 },
          },
          duration: 0.5,
          ease: "power1.out",
        })
      }

      // Record the answer with time taken
      setQuestionStats([
        ...questionStats,
        {
          question: currentQuestion.question,
          userAnswer: selectedOption || "No answer",
          correctAnswer: currentQuestion.correctAnswer,
          isCorrect: correct,
          timeTaken: timePerQuestion - timeRemaining,
        },
      ])

      // Animate feedback
      gsap.to(".feedback-container", {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "back.out",
      })

      return
    }

    // Animate out current question
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        x: -30,
        scale: 0.95,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          // Move to next question or complete quiz
          if (currentQuestionIndex < quizData.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
            setSelectedOption(null)
            setIsAnswered(false)

            // Animate in next question
            gsap.fromTo(
              containerRef.current,
              {
                opacity: 0,
                x: 30,
                scale: 0.95,
              },
              {
                opacity: 1,
                x: 0,
                scale: 1,
                duration: 0.5,
                ease: "power2.out",
              },
            )
          } else {
            setQuizCompleted(true)
          }
        },
      })
    }
  }

  const restartQuiz = () => {
    setCurrentQuestionIndex(0)
    setScore(0)
    setSelectedOption(null)
    setIsAnswered(false)
    setQuizCompleted(false)
    setQuestionStats([])
    setTimeRemaining(timePerQuestion)
    setIsTimerActive(true)

    // Animate restart
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, scale: 0.9, rotation: -3 },
      { opacity: 1, scale: 1, rotation: 0, duration: 0.7, ease: "back.out(1.7)" },
    )
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-xl p-8 text-center border border-red-100">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-all shadow-md"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (quizData.length === 0) {
    return <LoadingSpinner />
  }

  if (quizCompleted) {
    return (
      <ResultsCard
        score={score}
        totalQuestions={quizData.length}
        onRestart={restartQuiz}
        questionStats={questionStats}
      />
    )
  }

  const currentQuestion = quizData[currentQuestionIndex]

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all border border-purple-100"
    >
      <ProgressBar currentQuestion={currentQuestionIndex + 1} totalQuestions={quizData.length} />

      <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 flex justify-between items-center">
        <span className="font-medium text-purple-800">
          Question {currentQuestionIndex + 1} of {quizData.length}
        </span>
        <Timer timeRemaining={timeRemaining} totalTime={timePerQuestion} isActive={isTimerActive && !isAnswered} />
      </div>

      <QuestionCard
        question={currentQuestion.question}
        options={currentQuestion.options}
        selectedOption={selectedOption}
        onSelectOption={handleOptionSelect}
        isAnswered={isAnswered}
        isCorrect={isCorrect}
        correctAnswer={currentQuestion.correctAnswer}
        explanation={currentQuestion.explanation}
      />

      <div className="p-6 border-t border-gray-100 bg-gradient-to-b from-white to-purple-50">
        <button
          ref={buttonRef}
          onClick={handleNextQuestion}
          disabled={!selectedOption && !isAnswered}
          className={`w-full py-3 px-6 rounded-xl font-medium transition-all ${
            !selectedOption && !isAnswered
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : isAnswered
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg"
                : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
          }`}
        >
          {isAnswered
            ? currentQuestionIndex < quizData.length - 1
              ? "Next Question"
              : "See Results"
            : "Submit Answer"}
        </button>
      </div>
    </div>
  )
}
