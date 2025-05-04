"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { CheckCircle, XCircle } from "lucide-react"

interface QuestionCardProps {
  question: string
  options: string[]
  selectedOption: string | null
  onSelectOption: (option: string) => void
  isAnswered: boolean
  isCorrect: boolean
  correctAnswer: string
  explanation?: string
}

export default function QuestionCard({
  question,
  options,
  selectedOption,
  onSelectOption,
  isAnswered,
  isCorrect,
  correctAnswer,
  explanation,
}: QuestionCardProps) {
  const questionRef = useRef<HTMLDivElement>(null)
  const optionsRef = useRef<HTMLDivElement>(null)
  const feedbackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Animate question entrance
    if (questionRef.current) {
      gsap.fromTo(
        questionRef.current,
        {
          opacity: 0,
          y: -20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
      )
    }

    // Animate options entrance with stagger
    if (optionsRef.current) {
      gsap.fromTo(
        optionsRef.current.children,
        {
          opacity: 0,
          x: -20,
          scale: 0.95,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.2)",
        },
      )
    }
  }, [question])

  useEffect(() => {
    if (isAnswered && feedbackRef.current) {
      gsap.fromTo(
        feedbackRef.current,
        {
          opacity: 0,
          y: 20,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
        },
      )
    }
  }, [isAnswered])

  // Sanitize option text for use in IDs
  const sanitizeForId = (text: string) => text.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "")

  return (
    <div className="p-6 bg-white">
      <h2
        ref={questionRef}
        className="text-2xl font-semibold text-gray-800 mb-6 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: question }}
      />

      <div ref={optionsRef} className="space-y-3">
        {options.map((option, index) => {
          const isSelected = selectedOption === option
          const isCorrectOption = option === correctAnswer
          const sanitizedId = sanitizeForId(option)

          let optionClass = "border p-4 rounded-xl cursor-pointer transition-all"

          if (isAnswered) {
            if (isSelected) {
              optionClass += isCorrect
                ? " bg-gradient-to-r from-green-50 to-emerald-50 border-emerald-300 shadow-md"
                : " bg-gradient-to-r from-red-50 to-pink-50 border-red-300 shadow-md"
            } else if (isCorrectOption) {
              optionClass += " bg-gradient-to-r from-green-50 to-emerald-50 border-emerald-300 shadow-md"
            } else {
              optionClass += " border-gray-200 opacity-70"
            }
          } else if (isSelected) {
            optionClass += " border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50 shadow-md"
          } else {
            optionClass += " border-gray-200 hover:border-purple-200 hover:bg-purple-50"
          }

          return (
            <div
              key={option}
              id={`option-${sanitizedId}`}
              className={optionClass}
              onClick={() => onSelectOption(option)}
              style={{ transformOrigin: "center left" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-700 text-lg" dangerouslySetInnerHTML={{ __html: option }} />
                {isAnswered &&
                  isSelected &&
                  (isCorrect ? (
                    <CheckCircle className="h-6 w-6 text-emerald-500" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-500" />
                  ))}
                {isAnswered && !isSelected && isCorrectOption && <CheckCircle className="h-6 w-6 text-emerald-500" />}
              </div>
            </div>
          )
        })}
      </div>

      {isAnswered && (
        <div
          ref={feedbackRef}
          className={`feedback-container mt-6 p-5 rounded-xl ${
            isCorrect
              ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-emerald-100"
              : "bg-gradient-to-r from-red-50 to-pink-50 border border-red-100"
          } opacity-0 transform translate-y-4 shadow-md`}
        >
          <p className={`font-medium text-lg ${isCorrect ? "text-emerald-700" : "text-red-700"}`}>
            {isCorrect ? "Correct! 🎉" : `Incorrect. The correct answer is: ${correctAnswer}`}
          </p>
          {explanation && <p className="mt-2 text-gray-600">{explanation}</p>}
        </div>
      )}
    </div>
  )
}
