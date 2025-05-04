"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export default function LoadingSpinner() {
  const spinnerRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (spinnerRef.current) {
      gsap.to(spinnerRef.current, {
        rotation: 360,
        duration: 1.5,
        ease: "none",
        repeat: -1,
      })
    }

    if (containerRef.current) {
      gsap.fromTo(containerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })
    }

    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0.5 },
        {
          opacity: 1,
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        },
      )
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center p-10 bg-white rounded-2xl shadow-xl border border-purple-100"
    >
      <div className="relative w-20 h-20 mb-6">
        <div ref={spinnerRef} className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-white rounded-full"></div>
        </div>
      </div>
      <p ref={textRef} className="text-gray-600 text-lg font-medium">
        Loading quiz questions...
      </p>
    </div>
  )
}
