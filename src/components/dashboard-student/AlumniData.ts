export type PersonType = "Alumni" | "Industry Expert";

export interface Person {
  id: number;
  name: string;
  role: string;
  type: PersonType;
  email: string;
  linkedin: string;
  tags: string[];
}

export const ALUMNI_EXPERTS: Person[] = [
  {
    id: 1,
    name: "Arjun Mehta",
    role: "Senior SDE @ Microsoft",
    type: "Alumni",
    email: "arjun.mehta@example.com",
    linkedin: "https://linkedin.com",
    tags: ["System Design", "Cloud Architecture"]
  },
  {
    id: 2,
    name: "Dr. Sarah Chen",
    role: "AI Research Lead @ Google",
    type: "Industry Expert",
    email: "sarah.chen@example.com",
    linkedin: "https://linkedin.com",
    tags: ["Machine Learning", "Python"]
  }
];