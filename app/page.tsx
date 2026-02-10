/* import MainLayout from "@/src/components/home/MainLayout";

export default function Home() {
  return (
    <main>
      <MainLayout />
    </main>
  );
}
import FacultyDashboard from "@/src/components/dashboard-faculty/FacultyDashboard";
import StudentDashboard from "@/src/components/dashboard-student/StudentDashboard";

export default function Page() {
  return <StudentDashboard />;
 return <FacultyDashboard/>;
} */


 import FacultyDashboard from "@/src/components/dashboard-faculty/FacultyDashboard";
import StudentDashboard from "@/src/components/dashboard-student/StudentDashboard";

export default function Page() {
  // Toggle the comment below to switch between dashboards during development
  return <StudentDashboard />;
  
  
}