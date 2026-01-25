import { 
  Rocket, Search, Lightbulb, CheckCircle, PenTool, Layout, Code 
} from "lucide-react";
import { ModuleData } from "./types";

export const modules: ModuleData[] = [
  {
    id: 1,
    title: "Kick-off",
    description: "Initialize the ARCADE environment, setup the Next.js repo, and configure database connections.",
    outputs: ["Project roadmap", "Repo setup", "DB Schema"],
    icon: Rocket,
    time: "Week 1"
  },
  {
    id: 2,
    title: "Auth",
    description: "Secure user access control using JWT or NextAuth with role-based permissions.",
    outputs: ["Login UI", "OAuth", "Session Logic"],
    icon: CheckCircle,
    time: "Week 2"
  },
  {
    id: 3,
    title: "Dashboard",
    description: "The central hub for user activity, displaying real-time stats and overview metrics.",
    outputs: ["Charts", "Sidebar", "Activity Logs"],
    icon: Layout,
    time: "Week 3"
  },
  {
    id: 4,
    title: "Engine",
    description: "Core logic for the arcade functionality, handling state and user interactions.",
    outputs: ["State Mgmt", "Canvas", "Physics"],
    icon: Code,
    time: "Week 4-5"
  },
  {
    id: 5,
    title: "Ranking",
    description: "Global ranking system to track top players and high scores across games.",
    outputs: ["Sorting Algo", "Redis", "Real-time"],
    icon: Lightbulb,
    time: "Week 6"
  },
  {
    id: 6,
    title: "Market",
    description: "Virtual economy for trading in-game assets or unlocking new features.",
    outputs: ["Payments", "Inventory", "Assets"],
    icon: Search,
    time: "Week 7"
  },
  {
    id: 7,
    title: "Deploy",
    description: "Final quality assurance checks and deployment to Vercel/Edge network.",
    outputs: ["Unit Tests", "CI/CD", "Production"],
    icon: PenTool,
    time: "Week 8"
  },
];

export const faqs = [
  {
    question: "What is the tech stack?",
    answer: "We are using Next.js 14 (App Router), TypeScript, Tailwind CSS for styling, and Framer Motion for animations."
  },
  {
    question: "How do I contribute?",
    answer: "Fork the repository, create a feature branch, and submit a PR. Check the 'Contributing' guide in the repo."
  },
  {
    question: "Is the database set up?",
    answer: "Not yet. We are currently in the 'Kick-off' phase. The schema design is planned for Module 01."
  },
  {
    question: "Where are the assets?",
    answer: "All static assets (images, fonts) are stored in the `/public` folder. Components are in `/src/components`."
  },
  {
    question: "How to run tests?",
    answer: "Run `npm run test` to execute the Jest test suite. Ensure your environment variables are configured."
  }
];