export interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: string
  explanation?: string
  category?: string
  difficulty?: string
}
