import type { Question } from './types';

export const itQuestions: Question[] = [
  {
    id: 1,
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Home Tool Markup Language",
      "Hyperlink and Text Markup Language"
    ],
    correctAnswer: 0,
    category: "Web Development",
    difficulty: "Easy"
  },
  {
    id: 2,
    question: "Which of the following is NOT a programming language?",
    options: ["Python", "JavaScript", "HTML", "Java"],
    correctAnswer: 2,
    category: "Programming",
    difficulty: "Easy"
  },
  {
    id: 3,
    question: "What does SQL stand for?",
    options: [
      "Structured Query Language",
      "Simple Query Language",
      "Standard Query Language",
      "Sequential Query Language"
    ],
    correctAnswer: 0,
    category: "Database",
    difficulty: "Easy"
  },
  {
    id: 4,
    question: "Which HTTP status code indicates 'Not Found'?",
    options: ["200", "301", "404", "500"],
    correctAnswer: 2,
    category: "Web Development",
    difficulty: "Medium"
  },
  {
    id: 5,
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correctAnswer: 1,
    category: "Algorithms",
    difficulty: "Medium"
  },
  {
    id: 6,
    question: "Which of these is a NoSQL database?",
    options: ["MySQL", "PostgreSQL", "MongoDB", "SQLite"],
    correctAnswer: 2,
    category: "Database",
    difficulty: "Medium"
  },
  {
    id: 7,
    question: "What does API stand for?",
    options: [
      "Application Programming Interface",
      "Advanced Programming Interface",
      "Application Process Interface",
      "Automated Programming Interface"
    ],
    correctAnswer: 0,
    category: "Software Development",
    difficulty: "Easy"
  },
  {
    id: 8,
    question: "Which port is commonly used for HTTPS?",
    options: ["80", "443", "21", "25"],
    correctAnswer: 1,
    category: "Networking",
    difficulty: "Medium"
  },
  {
    id: 9,
    question: "What is the main purpose of Git?",
    options: [
      "Database management",
      "Version control",
      "Web hosting",
      "Code compilation"
    ],
    correctAnswer: 1,
    category: "Development Tools",
    difficulty: "Easy"
  },
  {
    id: 10,
    question: "Which of these is NOT a valid CSS property?",
    options: ["margin", "padding", "border", "content-align"],
    correctAnswer: 3,
    category: "Web Development",
    difficulty: "Medium"
  },
  {
    id: 11,
    question: "What does RAM stand for?",
    options: [
      "Random Access Memory",
      "Read Access Memory",
      "Rapid Access Memory",
      "Remote Access Memory"
    ],
    correctAnswer: 0,
    category: "Hardware",
    difficulty: "Easy"
  },
  {
    id: 12,
    question: "Which sorting algorithm has the best average-case time complexity?",
    options: ["Bubble Sort", "Selection Sort", "Quick Sort", "Insertion Sort"],
    correctAnswer: 2,
    category: "Algorithms",
    difficulty: "Hard"
  },
  {
    id: 13,
    question: "What is the purpose of a firewall?",
    options: [
      "Speed up internet connection",
      "Store data permanently",
      "Control network traffic",
      "Compile source code"
    ],
    correctAnswer: 2,
    category: "Security",
    difficulty: "Medium"
  },
  {
    id: 14,
    question: "Which of these is a JavaScript framework?",
    options: ["Django", "Laravel", "React", "Spring"],
    correctAnswer: 2,
    category: "Web Development",
    difficulty: "Easy"
  },
  {
    id: 15,
    question: "What does CRUD stand for in database operations?",
    options: [
      "Create, Read, Update, Delete",
      "Copy, Read, Update, Delete",
      "Create, Remove, Update, Delete",
      "Create, Read, Upload, Delete"
    ],
    correctAnswer: 0,
    category: "Database",
    difficulty: "Medium"
  },
  {
    id: 16,
    question: "Which protocol is used for secure email transmission?",
    options: ["HTTP", "FTP", "SMTP", "HTTPS"],
    correctAnswer: 3,
    category: "Networking",
    difficulty: "Hard"
  }
];
