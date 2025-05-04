export interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: string
  explanation?: string
}

export const quizData: QuizQuestion[] = [
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
    explanation: "The Blue Whale is the largest animal known to have ever existed, reaching lengths of up to 100 feet.",
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
