import type { Metadata } from "next";
import "./globals.css";
import DemoBanner from "@/src/components/demo/DemoBanner";

export const metadata: Metadata = {
  title: "A.R.C.A.D.E. (Demo)",
  description: "Academic Resource & Career Assist Digital Environment - Interactive Static Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="font-sans antialiased bg-[#050505] text-white"
      >
        <DemoBanner />
        <div className="pt-9 min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
