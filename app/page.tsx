import Image from "next/image";
// Location: app/page.tsx
import ArcadeDashboard from "@/src/components/ArcadeDashboard";

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <ArcadeDashboard />
    </main>
  );
}