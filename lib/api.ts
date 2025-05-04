import type { QuizQuestion } from "@/types/quiz-types"

// Function to decode HTML entities
const decodeHTML = (html: string) => {
  const txt = document.createElement("textarea")
  txt.innerHTML = html
  return txt.value
}

export async function fetchQuizQuestions(amount = 10, category?: number, difficulty?: string): Promise<QuizQuestion[]> {
  try {
    // Build the API URL with optional parameters
    let url = `https://opentdb.com/api.php?amount=${amount}`

    if (category) {
      url += `&category=${category}`
    }

    if (difficulty) {
      url += `&difficulty=${difficulty}`
    }

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()

    if (data.response_code !== 0) {
      throw new Error("Failed to fetch questions from API")
    }

    // Transform the API response into our QuizQuestion format
    return data.results.map((item: any) => {
      // Combine correct and incorrect answers
      const options = [...item.incorrect_answers, item.correct_answer]

      // Decode HTML entities in all text fields
      const decodedQuestion = decodeHTML(item.question)
      const decodedOptions = options.map((opt) => decodeHTML(opt))
      const decodedCorrectAnswer = decodeHTML(item.correct_answer)

      // Shuffle the options
      const shuffledOptions = [...decodedOptions].sort(() => Math.random() - 0.5)

      return {
        question: decodedQuestion,
        options: shuffledOptions,
        correctAnswer: decodedCorrectAnswer,
        category: item.category,
        difficulty: item.difficulty,
      }
    })
  } catch (error) {
    console.error("Error fetching quiz questions:", error)
    // Return fallback questions if API fails
    return getFallbackQuestions()
  }
}

// Fallback questions in case the API fails
function getFallbackQuestions(): QuizQuestion[] {
  return [
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: "Paris",
      explanation: "Paris is the capital and most populous city of France.",
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Venus"],
      correctAnswer: "Mars",
      explanation: "Mars is called the Red Planet because of the reddish iron oxide on its surface.",
    },
    {
      question: "What is the largest mammal in the world?",
      options: ["Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
      correctAnswer: "Blue Whale",
      explanation:
        "The Blue Whale is the largest animal known to have ever existed, reaching lengths of up to 100 feet.",
    },
    {
      question: "Which of these elements has the chemical symbol 'O'?",
      options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
      correctAnswer: "Oxygen",
      explanation: "Oxygen has the chemical symbol 'O' and is essential for human respiration.",
    },
    {
      question: "Who painted the Mona Lisa?",
      options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
      correctAnswer: "Leonardo da Vinci",
      explanation: "The Mona Lisa was painted by Italian Renaissance artist Leonardo da Vinci between 1503 and 1519.",
    },
    {
      question: "What is the largest organ in the human body?",
      options: ["Heart", "Liver", "Brain", "Skin"],
      correctAnswer: "Skin",
      explanation:
        "The skin is the largest organ of the human body, covering an area of about 2 square meters in adults.",
    },
    {
      question: "Which country is home to the Great Barrier Reef?",
      options: ["Brazil", "Australia", "Thailand", "Mexico"],
      correctAnswer: "Australia",
      explanation:
        "The Great Barrier Reef is located off the coast of Queensland, Australia, and is the world's largest coral reef system.",
    },
    {
      question: "What is the main component of the Sun?",
      options: ["Helium", "Oxygen", "Hydrogen", "Carbon"],
      correctAnswer: "Hydrogen",
      explanation:
        "The Sun is composed primarily of hydrogen (about 73% of its mass), which it fuses into helium in its core.",
    },
    {
      question: "Which of these is NOT a programming language?",
      options: ["Java", "Python", "Cobra", "Photoshop"],
      correctAnswer: "Photoshop",
      explanation:
        "Photoshop is an image editing software, not a programming language. Java, Python, and Cobra are all programming languages.",
    },
    {
      question: "What year did the first iPhone release?",
      options: ["2005", "2007", "2009", "2010"],
      correctAnswer: "2007",
      explanation: "The first iPhone was announced by Steve Jobs on January 9, 2007, and released on June 29, 2007.",
    },
  ]
}
