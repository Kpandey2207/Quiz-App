"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

interface ProgressBarProps {
  currentQuestion: number
  totalQuestions: number
}

export default function ProgressBar({ currentQuestion, totalQuestions }: ProgressBarProps) {
  const progress = (currentQuestion / totalQuestions) * 100
  const progressBarRef = useRef<HTMLDivElement>(null)
  const progressTextRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        width: `${progress}%`,
        duration: 0.8,
        ease: "power2.out",
      })
    }

    if (progressTextRef.current) {
      gsap.fromTo(
        progressTextRef.current,
        { scale: 1.2, opacity: 0.7 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out" },
      )
    }
  }, [progress])

  return (
    <div className="bg-gradient-to-r from-gray-50 to-purple-50 p-4">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>
          Question {currentQuestion} of {totalQuestions}
        </span>
        <span ref={progressTextRef} className="font-medium text-purple-700">
          {Math.round(progress)}% Complete
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
        <div
          ref={progressBarRef}
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  )
}
