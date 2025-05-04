import QuizContainer from "@/components/quiz-container"
import { CalendarDays } from "lucide-react"

export default function Home() {
  // Get today's date in a readable format
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-[40%] right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-2xl z-10">
        <h1 className="text-5xl font-bold text-center mb-4 text-gray-800 drop-shadow-sm">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Daily Quiz Challenge
          </span>
        </h1>

        <div className="flex items-center justify-center mb-8 text-purple-700">
          <CalendarDays className="h-5 w-5 mr-2" />
          <span className="font-medium">{today}</span>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-8 text-center shadow-sm">
          <p className="text-gray-700">
            Take today's quiz challenge and see how you rank on the leaderboard! Everyone gets the same questions, but
            in a different order.
          </p>
        </div>

        <QuizContainer />
      </div>
    </main>
  )
}
