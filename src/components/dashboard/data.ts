import { 
  ShieldCheck, FileText, Map, Cpu, Compass, FileBadge, Link 
} from "lucide-react";
import { ModuleData } from "./types";

export const modules: ModuleData[] = [
  {
    id: 1,
    title: "Auth & Profile",
    description: "The foundational entry point handling secure access and user identity management for all stakeholders.",
    outputs: ["RBAC Login", "Student Stats", "Faculty Area"],
    icon: ShieldCheck, // Represents Security/Auth
    time: "Module A"
  },
  {
    id: 2,
    title: "Notes Portal",
    description: "The platform backbone allowing subject-wise note sharing with a strict faculty approval workflow.",
    outputs: ["Upload Queue", "Approval Flow", "Subject Filters"],
    icon: FileText, // Represents Notes/Documents
    time: "Module B"
  },
  {
    id: 3,
    title: "Roadmap",
    description: "Visual, goal-oriented pathways guiding students through exam prep, placements, and skill acquisition.",
    outputs: ["Exam Flow", "Skill Trees", "Progress Tracker"],
    icon: Map, // Represents the Visual Map
    time: "Module C"
  },
  {
    id: 4,
    title: "Skill Logic",
    description: "A rule-based logic engine that compares a student's current tech stack against their target role requirements.",
    outputs: ["Tech Selector", "Role Matching", "Gap Analysis"],
    icon: Cpu, // Represents Logic/Processing
    time: "Module D"
  },
  {
    id: 5,
    title: "Guidance",
    description: "Automated recommendations to bridge skill gaps, offering a suggested learning order and resource links.",
    outputs: ["Learning Path", "Gap Filling", "Safe Logic"],
    icon: Compass, // Represents Direction/Guidance
    time: "Module E"
  },
  {
    id: 6,
    title: "Resume Vault",
    description: "A privacy-safe repository of verified sample resumes categorized by domain, managed solely by admins.",
    outputs: ["25+ Samples", "Role Categories", "Read-Only View"],
    icon: FileBadge, // Represents Verified Documents
    time: "Module F"
  },
  {
    id: 7,
    title: "Resource Hub",
    description: "A curated collection of external links for competitive programming, practice sites, and extra materials.",
    outputs: ["CP Platforms", "Practice Links", "Domain Filter"],
    icon: Link, // Represents External Resources
    time: "Module G"
  },
];

export const faqs = [
  {
    question: "How does the Notes Approval work?",
    answer: "Student uploads go to a pending queue. Faculty (or HODs) must approve them before they are published to the main feed."
  },
  {
    question: "Is there AI involved in the Guidance module?",
    answer: "No. It uses safe, rule-based logic to compare your selected skills against defined role requirements to avoid 'hallucinations'."
  },
  {
    question: "Can I upload my own resume to the Vault?",
    answer: "No. The Resume Repository contains only verified examples uploaded by admins to ensure privacy and quality."
  },
  {
    question: "What tech stack is used?",
    answer: "Next.js (React) is used for the frontend, making it the perfect choice for this interactive, component-based UI."
  }
];