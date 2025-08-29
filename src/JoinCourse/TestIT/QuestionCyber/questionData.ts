import type { Question } from './types';

export const cyberQuestions: Question[] = [
  {
    id: 1,
    question: "What does CIA stand for in cybersecurity?",
    options: [
      "Central Intelligence Agency",
      "Confidentiality, Integrity, Availability",
      "Computer Information Access",
      "Cyber Intelligence Analysis"
    ],
    correctAnswer: 1,
    explanation: "CIA in cybersecurity refers to the three fundamental principles: Confidentiality, Integrity, and Availability."
  },
  {
    id: 2,
    question: "Which type of attack involves overwhelming a system with traffic to make it unavailable?",
    options: [
      "SQL Injection",
      "Cross-Site Scripting (XSS)",
      "Distributed Denial of Service (DDoS)",
      "Man-in-the-Middle"
    ],
    correctAnswer: 2,
    explanation: "A DDoS attack floods a system with traffic from multiple sources to overwhelm it and make it unavailable to legitimate users."
  },
  {
    id: 3,
    question: "What is the primary purpose of a firewall?",
    options: [
      "To encrypt data",
      "To scan for viruses",
      "To control network traffic based on security rules",
      "To backup data"
    ],
    correctAnswer: 2,
    explanation: "A firewall monitors and controls incoming and outgoing network traffic based on predetermined security rules."
  },
  {
    id: 4,
    question: "Which of the following is considered a strong password practice?",
    options: [
      "Using the same password for all accounts",
      "Using personal information like birthdate",
      "Using a combination of uppercase, lowercase, numbers, and symbols",
      "Using dictionary words"
    ],
    correctAnswer: 2,
    explanation: "Strong passwords should include a mix of uppercase letters, lowercase letters, numbers, and special symbols."
  },
  {
    id: 5,
    question: "What is phishing?",
    options: [
      "A type of malware",
      "A social engineering attack to steal sensitive information",
      "A network scanning technique",
      "A data encryption method"
    ],
    correctAnswer: 1,
    explanation: "Phishing is a social engineering attack where attackers impersonate legitimate entities to steal sensitive information like passwords or credit card numbers."
  },
  {
    id: 6,
    question: "What does HTTPS provide that HTTP does not?",
    options: [
      "Faster loading times",
      "Better SEO ranking",
      "Encryption of data in transit",
      "Automatic backups"
    ],
    correctAnswer: 2,
    explanation: "HTTPS provides encryption of data transmitted between the client and server, ensuring confidentiality and integrity."
  },
  {
    id: 7,
    question: "Which authentication method provides the highest level of security?",
    options: [
      "Single-factor authentication (password only)",
      "Two-factor authentication (2FA)",
      "Multi-factor authentication (MFA)",
      "Biometric authentication only"
    ],
    correctAnswer: 2,
    explanation: "Multi-factor authentication (MFA) provides the highest security by requiring multiple forms of verification."
  },
  {
    id: 8,
    question: "What is malware?",
    options: [
      "A type of hardware failure",
      "Malicious software designed to harm or exploit systems",
      "A network protocol",
      "A data backup method"
    ],
    correctAnswer: 1,
    explanation: "Malware is malicious software designed to damage, disrupt, or gain unauthorized access to computer systems."
  },
  {
    id: 9,
    question: "What is the purpose of encryption?",
    options: [
      "To compress data",
      "To convert data into a coded format to prevent unauthorized access",
      "To delete data permanently",
      "To speed up data transmission"
    ],
    correctAnswer: 1,
    explanation: "Encryption converts data into a coded format that can only be read by authorized parties with the decryption key."
  },
  {
    id: 10,
    question: "Which of the following is NOT a common type of social engineering attack?",
    options: [
      "Pretexting",
      "Baiting",
      "SQL Injection",
      "Tailgating"
    ],
    correctAnswer: 2,
    explanation: "SQL Injection is a technical attack on databases, not a social engineering attack. The others are all social engineering techniques."
  },
  {
    id: 11,
    question: "What is a VPN primarily used for?",
    options: [
      "Increasing internet speed",
      "Creating a secure, encrypted connection over a public network",
      "Blocking advertisements",
      "Compressing data"
    ],
    correctAnswer: 1,
    explanation: "A VPN (Virtual Private Network) creates a secure, encrypted tunnel for data transmission over public networks."
  },
  {
    id: 12,
    question: "What does the principle of 'least privilege' mean?",
    options: [
      "Users should have the minimum access rights needed to perform their job",
      "All users should have administrator privileges",
      "Passwords should be as short as possible",
      "Security measures should be minimal"
    ],
    correctAnswer: 0,
    explanation: "The principle of least privilege means users should only have the minimum access rights necessary to perform their job functions."
  },
  {
    id: 13,
    question: "What is a zero-day vulnerability?",
    options: [
      "A vulnerability that takes zero days to exploit",
      "A security flaw that is unknown to security vendors and has no available patch",
      "A vulnerability that affects zero users",
      "A security measure that prevents all attacks"
    ],
    correctAnswer: 1,
    explanation: "A zero-day vulnerability is a security flaw that is unknown to security vendors and for which no patch or fix is available."
  },
  {
    id: 14,
    question: "What is the main difference between a virus and a worm?",
    options: [
      "Viruses are harmless, worms are dangerous",
      "Viruses need a host file to spread, worms can spread independently",
      "Viruses affect hardware, worms affect software",
      "There is no difference"
    ],
    correctAnswer: 1,
    explanation: "Viruses require a host file to attach to and spread, while worms can replicate and spread independently across networks."
  },
  {
    id: 15,
    question: "What is penetration testing?",
    options: [
      "Testing network speed",
      "Authorized testing of systems to find security vulnerabilities",
      "Testing user passwords",
      "Testing hardware durability"
    ],
    correctAnswer: 1,
    explanation: "Penetration testing is authorized testing performed to evaluate the security of systems by attempting to exploit vulnerabilities."
  }
];
