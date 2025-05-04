# 🧠 Interactive Quiz Application

![Next.js](https://img.shields.io/badge/Next.js-13.0+-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-3.0+-88CE02?style=for-the-badge&logo=greensock&logoColor=white)

A modern, interactive quiz application built with Next.js, TypeScript, and Tailwind CSS. Features daily quizzes, leaderboards, and beautiful animations.

## ✨ Features

- **Daily Quiz Challenge**: New questions every day for all users
- **Leaderboard System**: Compete with others and see your ranking
- **Beautiful UI**: Smooth animations and responsive design
- **Interactive Experience**: Real-time feedback and explanations
- **Progress Tracking**: Track your performance with detailed statistics
- **Timer**: Test your knowledge under time pressure
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🛠️ Technologies Used

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: GSAP (GreenSock Animation Platform)
- **Data Visualization**: Chart.js
- **API Integration**: Open Trivia Database API

## 📋 Prerequisites

- Node.js 16.x or higher
- npm or yarn

## 🚀 Getting Started

### Installation

1. Clone the repository:
   bash
   git clone https://github.com/Kpandey2207/Quiz-App.git
2. Install dependencies:
   \`\`\`bash
   npm install
3. Run the development server:
   bash
   npm run dev
4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📖 Usage

### Taking a Quiz

1. Visit the homepage to start the daily quiz
2. Answer each question within the time limit
3. Get immediate feedback on your answers
4. View your final score and statistics at the end
5. Submit your score to the leaderboard

### Viewing the Leaderboard

- Access the leaderboard from the results page
- See how you rank against other users
- Check daily top performers

## 🏗️ Project Structure

\`\`\`
interactive-quiz-app/
├── app/                  # Next.js app directory
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Homepage
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── quiz-container.tsx    # Main quiz container
│   ├── question-card.tsx     # Question display
│   ├── results-card.tsx      # Results display
│   ├── leaderboard.tsx       # Leaderboard component
│   └── ...               # Other components
├── actions/              # Server actions
│   └── leaderboard-actions.ts # Leaderboard functionality
├── lib/                  # Utility functions
│   └── api.ts            # API integration
├── types/                # TypeScript type definitions
│   └── quiz-types.ts     # Quiz-related types
├── data/                 # Static data
│   └── quiz-data.ts      # Fallback quiz questions
└── public/               # Static assets
\`\`\`

## 🎯 Key Features Explained

### Daily Quiz System

The application fetches new questions each day from the Open Trivia Database API. All users get the same questions on a given day, but in a randomized order to prevent cheating. If the API fails, the system falls back to a set of local questions.

### Leaderboard

The leaderboard tracks and displays the top performers for the current day. Scores are ranked by percentage correct and average time per question. Users can submit their scores after completing the quiz, and their entries are highlighted on the leaderboard.

### Animations

The application uses GSAP for smooth, professional animations throughout the user experience:

- Question transitions
- Option selection feedback
- Timer animations
- Results and statistics reveal
- Leaderboard entry animations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [Open Trivia Database](https://opentdb.com/) for providing the quiz questions API
- [GSAP](https://greensock.com/gsap/) for the animation library
- [Chart.js](https://www.chartjs.org/) for the data visualization
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [Next.js](https://nextjs.org/) for the React framework

---

Made with ❤️ by Kpande2207
