import FacultyDashboard from "@/src/components/dashboard-faculty/FacultyDashboard";
import StudentDashboard from "@/src/components/dashboard-student/StudentDashboard";
import { Main } from "next/document";

// export default function Page() {
export default function Home() {
  return <MainLayout/>;
  return <StudentDashboard />;
//  return <FacultyDashboard/>;
}
